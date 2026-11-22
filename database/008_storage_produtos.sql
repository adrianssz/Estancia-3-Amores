-- Estância 3 Amores
-- Storage para imagens dos produtos.
-- Aceita JPG/JPEG e PNG, com limite de 5 MB por arquivo.
-- Executar no SQL Editor do projeto Supabase do sistema.

begin;

-- =========================================================
-- BUCKET DE IMAGENS
-- =========================================================
-- As fotos são públicas para exibição no site dos clientes.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'produtos',
  'produtos',
  true,
  5242880,
  array['image/jpeg', 'image/png']::text[]
);

-- =========================================================
-- CONSULTA PELO PAINEL AUTENTICADO
-- =========================================================
-- Também necessária para excluir arquivos pela Storage API.

create policy "authenticated_select_imagens_produtos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'produtos'
);

-- =========================================================
-- ENVIO PELO PAINEL AUTENTICADO
-- =========================================================

create policy "authenticated_insert_imagens_produtos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'produtos'
);

-- =========================================================
-- EXCLUSÃO PELO PAINEL AUTENTICADO
-- =========================================================
-- Os arquivos devem ser removidos pela Storage API.

create policy "authenticated_delete_imagens_produtos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'produtos'
);

commit;