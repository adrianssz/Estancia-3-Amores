-- Estância 3 Amores
-- Funções transacionais para Pedidos e Pedido Itens.

-- =========================================================
-- CRIAR PEDIDO COM ITENS
-- =========================================================

create or replace function public.criar_pedido_com_itens(
  p_cliente_id bigint,
  p_telefone text,
  p_status text,
  p_data date,
  p_itens jsonb
)
returns public.pedidos
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_pedido public.pedidos;
  v_quantidade_itens integer;
begin
  if p_itens is null
    or jsonb_typeof(p_itens) <> 'array'
    or jsonb_array_length(p_itens) = 0
  then
    raise exception 'O pedido deve possuir pelo menos um item.';
  end if;

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
    produto.preco
  from jsonb_array_elements(p_itens) as item
  join public.produtos as produto
    on produto.id =
      (item ->> 'produto_id')::bigint;

  get diagnostics v_quantidade_itens = row_count;

  if v_quantidade_itens <> jsonb_array_length(p_itens)
  then
    raise exception 'Um ou mais produtos informados não existem.';
  end if;

  return v_pedido;
end;
$$;


-- =========================================================
-- EDITAR PEDIDO E SUBSTITUIR ITENS
-- =========================================================

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
security invoker
set search_path = public
as $$
declare
  v_pedido public.pedidos;
  v_quantidade_itens integer;
begin
  if p_itens is null
    or jsonb_typeof(p_itens) <> 'array'
    or jsonb_array_length(p_itens) = 0
  then
    raise exception 'O pedido deve possuir pelo menos um item.';
  end if;

  update public.pedidos
  set
    cliente_id = p_cliente_id,
    telefone = p_telefone,
    status = p_status,
    data = p_data
  where id = p_pedido_id
  returning *
  into v_pedido;

  if v_pedido.id is null
  then
    raise exception 'Pedido não encontrado.';
  end if;

  delete from public.pedido_itens
  where pedido_id = p_pedido_id;

  insert into public.pedido_itens (
    pedido_id,
    produto_id,
    quantidade,
    preco_unitario
  )
  select
    p_pedido_id,
    produto.id,
    (item ->> 'quantidade')::integer,
    produto.preco
  from jsonb_array_elements(p_itens) as item
  join public.produtos as produto
    on produto.id =
      (item ->> 'produto_id')::bigint;

  get diagnostics v_quantidade_itens = row_count;

  if v_quantidade_itens <> jsonb_array_length(p_itens)
  then
    raise exception 'Um ou mais produtos informados não existem.';
  end if;

  return v_pedido;
end;
$$;


-- =========================================================
-- PERMISSÕES DAS FUNÇÕES
-- =========================================================

revoke execute
on function public.criar_pedido_com_itens(
  bigint,
  text,
  text,
  date,
  jsonb
)
from public, anon;

grant execute
on function public.criar_pedido_com_itens(
  bigint,
  text,
  text,
  date,
  jsonb
)
to authenticated;


revoke execute
on function public.editar_pedido_com_itens(
  bigint,
  bigint,
  text,
  text,
  date,
  jsonb
)
from public, anon;

grant execute
on function public.editar_pedido_com_itens(
  bigint,
  bigint,
  text,
  text,
  date,
  jsonb
)
to authenticated;