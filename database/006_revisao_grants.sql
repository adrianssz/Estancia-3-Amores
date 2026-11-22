-- Estância 3 Amores
-- Remove permissões administrativas desnecessárias dos papéis
-- utilizados pelo frontend público e pelo painel autenticado.
--
-- Pré-requisito: migrations 001 a 005 aplicadas.
-- Requer PostgreSQL 17 ou superior por utilizar MAINTAIN.
-- Executar como postgres ou papel autorizado a alterar estes grants.

begin;

-- =========================================================
-- TABELAS EXISTENTES
-- =========================================================
-- Mantém SELECT, INSERT, UPDATE e DELETE de authenticated.
-- Preserva as policies RLS e as permissões das sequências.

revoke truncate, references, trigger, maintain
on table
  public.clientes,
  public.produtos,
  public.plantios,
  public.pedidos,
  public.pedido_itens,
  public.entregas
from anon, authenticated;

-- =========================================================
-- PADRÃO PARA FUTURAS TABELAS E VIEWS
-- =========================================================
-- Aplica-se somente a objetos criados por postgres em public.
-- As próximas migrations devem conceder explicitamente
-- as permissões necessárias para cada novo objeto.

alter default privileges
for role postgres
in schema public
revoke truncate, references, trigger, maintain
on tables
from anon, authenticated;

commit;