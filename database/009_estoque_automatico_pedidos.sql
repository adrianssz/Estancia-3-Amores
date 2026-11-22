-- Estância 3 Amores
-- Estoque disponível descontado ao registrar pedidos.
-- Pré-requisito: migrations 001 a 008 aplicadas.
-- Primeira aplicação exige pedidos e pedido_itens vazios.
-- Executar como postgres.
--
-- Criar: desconta as quantidades.
-- Editar: movimenta somente a diferença, preservando preços.
-- Excluir: devolve estoque somente se ainda não entregue.
-- Entregue: mantém o desconto e impede alterar os itens
-- ou retornar para um status anterior.
--
-- Escritas de pedidos e itens passam exclusivamente pelas RPCs.
-- A autorização mantém a regra atual: usuário autenticado.

begin;

lock table public.pedidos, public.pedido_itens
in share row exclusive mode;

do $$
begin
  if exists (select 1 from public.pedidos)
    or exists (select 1 from public.pedido_itens)
  then
    raise exception
      'Esta migration exige pedidos e pedido_itens vazios. Não apague dados reais.';
  end if;
end;
$$;

-- Função interna compartilhada pelas RPCs de criação e edição.
create or replace function public._salvar_pedido_com_estoque(
  p_pedido_id bigint,
  p_cliente_id bigint,
  p_telefone text,
  p_status text,
  p_data date,
  p_itens jsonb
)
returns public.pedidos
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_pedido public.pedidos;
  v_produto public.produtos;
  v_item jsonb;
  v_novas_quantidades jsonb;
  v_quantidades_anteriores jsonb := '{}'::jsonb;
  v_precos_anteriores jsonb := '{}'::jsonb;
  v_quantidade_anterior integer;
  v_quantidade_nova integer;
  v_diferenca integer;
  v_entregue boolean := false;
begin
  if auth.uid() is null
    or auth.role() is distinct from 'authenticated'
  then
    raise exception 'É necessário estar autenticado.';
  end if;

  if p_itens is null
    or jsonb_typeof(p_itens) is distinct from 'array'
  then
    raise exception 'Informe os itens do pedido em uma lista.';
  end if;

  if jsonb_array_length(p_itens) = 0 then
    raise exception 'O pedido deve possuir pelo menos um item.';
  end if;

  for v_item in
    select item
    from jsonb_array_elements(p_itens) as entrada(item)
  loop
    if jsonb_typeof(v_item) is distinct from 'object'
      or coalesce(v_item ->> 'produto_id', '')
        !~ '^[1-9][0-9]*$'
      or coalesce(v_item ->> 'quantidade', '')
        !~ '^[1-9][0-9]*$'
    then
      raise exception
        'Produto e quantidade devem ser números inteiros positivos.';
    end if;

    -- Também verifica os limites dos tipos utilizados nas tabelas.
    perform (v_item ->> 'produto_id')::bigint;
    perform (v_item ->> 'quantidade')::integer;
  end loop;

  if (
    select count(distinct (item ->> 'produto_id')::bigint)
    from jsonb_array_elements(p_itens) as entrada(item)
  ) <> jsonb_array_length(p_itens)
  then
    raise exception 'Não repita o mesmo produto no pedido.';
  end if;

  select jsonb_object_agg(
    ((item ->> 'produto_id')::bigint)::text,
    (item ->> 'quantidade')::integer
  )
  into v_novas_quantidades
  from jsonb_array_elements(p_itens) as entrada(item);

  if p_pedido_id is not null then
    select *
    into v_pedido
    from public.pedidos
    where id = p_pedido_id
    for update;

    if not found then
      raise exception 'Pedido não encontrado.';
    end if;

    v_entregue := v_pedido.status = 'Entregue';

    select
      coalesce(
        jsonb_object_agg(produto_id::text, quantidade),
        '{}'::jsonb
      ),
      coalesce(
        jsonb_object_agg(produto_id::text, preco_unitario),
        '{}'::jsonb
      )
    into v_quantidades_anteriores, v_precos_anteriores
    from public.pedido_itens
    where pedido_id = p_pedido_id;

    if v_entregue and (
      p_status is distinct from 'Entregue'
      or v_novas_quantidades <> v_quantidades_anteriores
    ) then
      raise exception
        'Pedido entregue não permite alterar os itens ou retornar de status.';
    end if;
  end if;

  -- Mesma ordem de bloqueio em todas as operações.
  perform produto.id
  from public.produtos as produto
  where produto.id in (
    select chave::bigint
    from jsonb_object_keys(v_novas_quantidades) as novas(chave)
    union
    select chave::bigint
    from jsonb_object_keys(v_quantidades_anteriores) as antigas(chave)
  )
  order by produto.id
  for update;

  if (
    select count(*)
    from public.produtos as produto
    where v_novas_quantidades ? produto.id::text
  ) <> jsonb_array_length(p_itens)
  then
    raise exception 'Um ou mais produtos informados não existem.';
  end if;

  if not v_entregue then
    for v_produto in
      select produto.*
      from public.produtos as produto
      where v_novas_quantidades ? produto.id::text
        or v_quantidades_anteriores ? produto.id::text
      order by produto.id
    loop
      v_quantidade_anterior := coalesce(
        (v_quantidades_anteriores ->> v_produto.id::text)::integer,
        0
      );

      v_quantidade_nova := coalesce(
        (v_novas_quantidades ->> v_produto.id::text)::integer,
        0
      );

      v_diferenca := v_quantidade_nova - v_quantidade_anterior;

      if v_diferenca > 0 then
        if v_produto.status <> 'pronta-entrega' then
          raise exception
            'O produto "%" não está disponível para novas quantidades.',
            v_produto.nome;
        end if;

        if v_produto.estoque < v_diferenca then
          raise exception
            'Estoque insuficiente para "%". Disponível: %.',
            v_produto.nome,
            v_produto.estoque;
        end if;
      end if;

      if v_diferenca <> 0 then
        update public.produtos
        set estoque = estoque - v_diferenca
        where id = v_produto.id;
      end if;
    end loop;
  end if;

  if p_pedido_id is null then
    insert into public.pedidos (
      cliente_id, telefone, status, data
    )
    values (
      p_cliente_id, p_telefone, p_status, p_data
    )
    returning * into v_pedido;
  else
    update public.pedidos
    set
      cliente_id = p_cliente_id,
      telefone = p_telefone,
      status = p_status,
      data = p_data
    where id = p_pedido_id
    returning * into v_pedido;
  end if;

  -- Em pedidos entregues, os itens permanecem intactos.
  if not v_entregue then
    delete from public.pedido_itens
    where pedido_id = v_pedido.id;

    insert into public.pedido_itens (
      pedido_id, produto_id, quantidade, preco_unitario
    )
    select
      v_pedido.id,
      produto.id,
      (item ->> 'quantidade')::integer,
      coalesce(
        (v_precos_anteriores ->> produto.id::text)::numeric,
        produto.preco
      )
    from jsonb_array_elements(p_itens) as entrada(item)
    join public.produtos as produto
      on produto.id = (item ->> 'produto_id')::bigint;
  end if;

  return v_pedido;
end;
$$;

create or replace function public.criar_pedido_com_itens(
  p_cliente_id bigint,
  p_telefone text,
  p_status text,
  p_data date,
  p_itens jsonb
)
returns public.pedidos
language plpgsql
security definer
set search_path = ''
as $$
begin
  return public._salvar_pedido_com_estoque(
    null,
    p_cliente_id,
    p_telefone,
    p_status,
    p_data,
    p_itens
  );
end;
$$;

create or replace function public.editar_pedido_com_itens(
  p_pedido_id bigint,
  p_cliente_id bigint,
  p_telefone text,
  p_status text,
  p_data date,
  p_itens jsonb
)
returns public.pedidos
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_pedido_id is null then
    raise exception 'Informe o pedido que será editado.';
  end if;

  return public._salvar_pedido_com_estoque(
    p_pedido_id,
    p_cliente_id,
    p_telefone,
    p_status,
    p_data,
    p_itens
  );
end;
$$;

create or replace function public.excluir_pedido_com_estoque(
  p_pedido_id bigint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_pedido public.pedidos;
begin
  if auth.uid() is null
    or auth.role() is distinct from 'authenticated'
  then
    raise exception 'É necessário estar autenticado.';
  end if;

  select *
  into v_pedido
  from public.pedidos
  where id = p_pedido_id
  for update;

  if not found then
    raise exception 'Pedido não encontrado.';
  end if;

  if v_pedido.status <> 'Entregue' then
    perform produto.id
    from public.produtos as produto
    where produto.id in (
      select produto_id
      from public.pedido_itens
      where pedido_id = p_pedido_id
    )
    order by produto.id
    for update;

    update public.produtos as produto
    set estoque = produto.estoque + itens.quantidade
    from (
      select produto_id, sum(quantidade)::integer as quantidade
      from public.pedido_itens
      where pedido_id = p_pedido_id
      group by produto_id
    ) as itens
    where produto.id = itens.produto_id;
  end if;

  delete from public.pedidos
  where id = p_pedido_id;

  return p_pedido_id;
end;
$$;

-- Impede operações diretas que ignorariam o controle de estoque.
-- SELECT e as policies existentes são preservados.
revoke insert, update, delete
on public.pedidos, public.pedido_itens
from public, anon, authenticated;

-- A função interna não pode ser chamada pelo navegador.
revoke all
on function public._salvar_pedido_com_estoque(
  bigint, bigint, text, text, date, jsonb
)
from public, anon, authenticated;

revoke all
on function public.criar_pedido_com_itens(
  bigint, text, text, date, jsonb
)
from public, anon, authenticated;

revoke all
on function public.editar_pedido_com_itens(
  bigint, bigint, text, text, date, jsonb
)
from public, anon, authenticated;

revoke all
on function public.excluir_pedido_com_estoque(bigint)
from public, anon, authenticated;

grant execute
on function public.criar_pedido_com_itens(
  bigint, text, text, date, jsonb
)
to authenticated;

grant execute
on function public.editar_pedido_com_itens(
  bigint, bigint, text, text, date, jsonb
)
to authenticated;

grant execute
on function public.excluir_pedido_com_estoque(bigint)
to authenticated;

commit;