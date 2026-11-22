-- Estância 3 Amores
-- Ranking automático de produtos mais vendidos.
-- Considera somente itens pertencentes a pedidos com status "Entregue".

create or replace view public.vw_produtos_mais_vendidos
with (security_invoker = false)
as
select
  produto.id,
  produto.nome,
  produto.unidade,
  produto.preco,
  produto.categoria,
  produto.status,
  produto.estoque,
  produto.imagem,

  coalesce(
    sum(item.quantidade)
      filter (
        where pedido.status = 'Entregue'
      ),
    0
  )::bigint as total_vendido

from public.produtos as produto

left join public.pedido_itens as item
  on item.produto_id = produto.id

left join public.pedidos as pedido
  on pedido.id = item.pedido_id

group by
  produto.id,
  produto.nome,
  produto.unidade,
  produto.preco,
  produto.categoria,
  produto.status,
  produto.estoque,
  produto.imagem;


-- A view contém somente informações públicas de produtos
-- e o total agregado vendido. Nenhum dado de cliente ou
-- telefone de pedido é exposto.

revoke all
on public.vw_produtos_mais_vendidos
from public;

revoke all
on public.vw_produtos_mais_vendidos
from anon;

revoke all
on public.vw_produtos_mais_vendidos
from authenticated;


-- O frontend público precisa consultar os destaques da Home.
grant select
on public.vw_produtos_mais_vendidos
to anon;

-- O painel autenticado também pode consultar o ranking.
grant select
on public.vw_produtos_mais_vendidos
to authenticated;