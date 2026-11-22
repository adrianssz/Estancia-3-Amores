-- Estância 3 Amores
-- Preserva o preço registrado dos produtos que permanecem
-- no pedido durante uma edição.
-- Pré-requisito: 004_pedidos_functions.sql aplicada.

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
  v_precos_anteriores jsonb;
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

  select jsonb_object_agg(
    produto_id::text,
    preco_unitario
  )
  into v_precos_anteriores
  from public.pedido_itens
  where pedido_id = p_pedido_id;

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
    coalesce(
      (
        v_precos_anteriores
        ->> produto.id::text
      )::numeric,
      produto.preco
    )
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