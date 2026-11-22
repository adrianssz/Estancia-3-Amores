-- Estância 3 Amores
-- Policies RLS para acesso autenticado às tabelas administrativas restantes.

-- =========================================================
-- DATA API - PERMISSÃO DE SCHEMA
-- =========================================================

grant usage
on schema public
to authenticated;

-- =========================================================
-- CLIENTES
-- =========================================================

grant select, insert, update, delete
on table public.clientes
to authenticated;

grant usage, select
on sequence public.clientes_id_seq
to authenticated;

create policy "authenticated_select_clientes"
on public.clientes
for select
to authenticated
using (true);

create policy "authenticated_insert_clientes"
on public.clientes
for insert
to authenticated
with check (true);

create policy "authenticated_update_clientes"
on public.clientes
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_clientes"
on public.clientes
for delete
to authenticated
using (true);

-- =========================================================
-- PLANTIOS
-- =========================================================

grant select, insert, update, delete
on table public.plantios
to authenticated;

grant usage, select
on sequence public.plantios_id_seq
to authenticated;

create policy "authenticated_select_plantios"
on public.plantios
for select
to authenticated
using (true);

create policy "authenticated_insert_plantios"
on public.plantios
for insert
to authenticated
with check (true);

create policy "authenticated_update_plantios"
on public.plantios
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_plantios"
on public.plantios
for delete
to authenticated
using (true);

-- =========================================================
-- PEDIDOS
-- =========================================================

grant select, insert, update, delete
on table public.pedidos
to authenticated;

grant usage, select
on sequence public.pedidos_id_seq
to authenticated;

create policy "authenticated_select_pedidos"
on public.pedidos
for select
to authenticated
using (true);

create policy "authenticated_insert_pedidos"
on public.pedidos
for insert
to authenticated
with check (true);

create policy "authenticated_update_pedidos"
on public.pedidos
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_pedidos"
on public.pedidos
for delete
to authenticated
using (true);

-- =========================================================
-- PEDIDO_ITENS
-- =========================================================

grant select, insert, update, delete
on table public.pedido_itens
to authenticated;

grant usage, select
on sequence public.pedido_itens_id_seq
to authenticated;

create policy "authenticated_select_pedido_itens"
on public.pedido_itens
for select
to authenticated
using (true);

create policy "authenticated_insert_pedido_itens"
on public.pedido_itens
for insert
to authenticated
with check (true);

create policy "authenticated_update_pedido_itens"
on public.pedido_itens
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_pedido_itens"
on public.pedido_itens
for delete
to authenticated
using (true);

-- =========================================================
-- ENTREGAS
-- =========================================================

grant select, insert, update, delete
on table public.entregas
to authenticated;

grant usage, select
on sequence public.entregas_id_seq
to authenticated;

create policy "authenticated_select_entregas"
on public.entregas
for select
to authenticated
using (true);

create policy "authenticated_insert_entregas"
on public.entregas
for insert
to authenticated
with check (true);

create policy "authenticated_update_entregas"
on public.entregas
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_entregas"
on public.entregas
for delete
to authenticated
using (true);