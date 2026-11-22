-- Estância 3 Amores
-- Bloqueia alterações de itens em pedidos Em Rota ou Entregue.
-- Também impede retorno de status:
-- Em Rota -> Pendente
-- Entregue -> qualquer status anterior.
--
-- Pré-requisito: 009_estoque_automatico_pedidos.sql aplicada.
--
-- A validação utiliza o status persistido do pedido dentro
-- da mesma transação e mantém o bloqueio FOR UPDATE.
--
-- Regras:
-- Pendente -> pode permanecer Pendente ou avançar para Em Rota.
-- Em Rota -> pode permanecer Em Rota ou avançar para Entregue.
-- Entregue -> permanece Entregue.
--
-- Pedidos Em Rota e Entregues não permitem:
-- - alterar quantidade;
-- - trocar produto;
-- - adicionar produto;
-- - remover produto.
--
-- A comparação dos itens é feita por produto e quantidade,
-- portanto apenas reordenar os mesmos itens não é considerado
-- uma alteração.

begin;

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
  v_status_anterior text;
  v_itens_bloqueados boolean := false;
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

    v_status_anterior := v_pedido.status;

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

    if v_status_anterior = 'Pendente' then
      if p_status not in ('Pendente', 'Em Rota') then
        raise exception
          'Pedido pendente deve permanecer Pendente ou avançar para Em Rota.';
      end if;

    elsif v_status_anterior = 'Em Rota' then
      if p_status not in ('Em Rota', 'Entregue') then
        raise exception
          'Pedido em rota não pode retornar para Pendente.';
      end if;

    elsif v_status_anterior = 'Entregue' then
      if p_status is distinct from 'Entregue' then
        raise exception
          'Pedido entregue não permite retornar de status.';
      end if;
    end if;

    v_itens_bloqueados :=
      v_status_anterior in ('Em Rota', 'Entregue');

    if
      v_itens_bloqueados
      and v_novas_quantidades <> v_quantidades_anteriores
    then
      if v_status_anterior = 'Em Rota' then
        raise exception
          'Pedido em rota não permite alterar produtos ou quantidades.';
      end if;

      raise exception
        'Pedido entregue não permite alterar produtos ou quantidades.';
    end if;
  end if;

  -- Mantém a mesma ordem de bloqueio de produtos utilizada
  -- pela migration 009 para evitar problemas de concorrência.
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

  -- Estoque só pode ser movimentado enquanto o pedido
  -- ainda permite alteração de itens.
  if not v_itens_bloqueados then
    for v_produto in
      select produto.*
      from public.produtos as produto
      where v_novas_quantidades ? produto.id::text
        or v_quantidades_anteriores ? produto.id::text
      order by produto.id
    loop
      v_quantidade_anterior := coalesce(
        (
          v_quantidades_anteriores
          ->> v_produto.id::text
        )::integer,
        0
      );

      v_quantidade_nova := coalesce(
        (
          v_novas_quantidades
          ->> v_produto.id::text
        )::integer,
        0
      );

      v_diferenca :=
        v_quantidade_nova - v_quantidade_anterior;

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
      cliente_id,
      telefone,
      status,
      data
    )
    values (
      p_cliente_id,
      p_telefone,
      p_status,
      p_data
    )
    returning *
    into v_pedido;

  else
    update public.pedidos
    set
      cliente_id = p_cliente_id,
      telefone = p_telefone,
      status = p_status,
      data = p_data
    where id = p_pedido_id
    returning *
    into v_pedido;
  end if;

  -- Em Rota e Entregue mantêm os itens existentes intactos.
  -- Para Pendente, a lógica transacional da migration 009
  -- continua preservada.
  if not v_itens_bloqueados then
    delete from public.pedido_itens
    where pedido_id = v_pedido.id;

    insert into public.pedido_itens (
      pedido_id,
      produto_id,
      quantidade,
      preco_unitario
    )
    select
      v_pedido.id,
      produto.id,
      (item ->> 'quantidade')::integer,
      coalesce(
        (
          v_precos_anteriores
          ->> produto.id::text
        )::numeric,
        produto.preco
      )
    from jsonb_array_elements(p_itens) as entrada(item)
    join public.produtos as produto
      on produto.id =
        (item ->> 'produto_id')::bigint;
  end if;

  return v_pedido;
end;
$$;

-- Mantém a função interna indisponível para chamadas
-- diretas pelo navegador.
revoke all
on function public._salvar_pedido_com_estoque(
  bigint,
  bigint,
  text,
  text,
  date,
  jsonb
)
from public, anon, authenticated;

commit;