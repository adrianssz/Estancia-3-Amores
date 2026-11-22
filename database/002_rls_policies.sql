-- Estância 3 Amores
-- Policies RLS para acesso autenticado ao painel administrativo.

-- =========================================================
-- PRODUTOS
-- =========================================================

-- =========================================================
-- DATA API - PERMISSÕES
-- =========================================================

grant select, insert, update, delete
on table public.produtos
to authenticated;

grant usage, select
on sequence public.produtos_id_seq
to authenticated;

create policy "authenticated_select_produtos"
on public.produtos
for select
to authenticated
using (true);

create policy "authenticated_insert_produtos"
on public.produtos
for insert
to authenticated
with check (true);

create policy "authenticated_update_produtos"
on public.produtos
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_delete_produtos"
on public.produtos
for delete
to authenticated
using (true);