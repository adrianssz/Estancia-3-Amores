# Banco de Dados — Estância 3 Amores

O projeto utiliza Supabase com PostgreSQL, autenticação por Supabase Auth
e armazenamento de fotos por Supabase Storage.

Esta pasta contém os scripts SQL versionados da estrutura, permissões,
funções de pedidos, ranking de produtos e controle de estoque.

## Preparação de um novo ambiente

Os scripts foram preparados para um projeto Supabase.
Não são scripts independentes para um PostgreSQL sem os schemas,
papéis e serviços fornecidos pelo Supabase.

Requisitos:

- PostgreSQL 17 ou superior, devido ao privilégio MAINTAIN utilizado na migration 006.
- Executar as migrations como postgres no SQL Editor.
- Confirmar que o projeto aberto corresponde ao VITE_SUPABASE_URL da aplicação.
- Aplicar os arquivos na ordem numérica, antes de cadastrar dados.

| Ordem | Arquivo | Finalidade |
| --- | --- | --- |
| 001 | 001_initial_schema.sql | Tabelas, relacionamentos, índices, validações e ativação de RLS. |
| 002 | 002_rls_policies.sql | Permissões e policies de produtos para usuários autenticados. |
| 003 | 003_rls_admin_tables.sql | Permissões e policies das demais tabelas administrativas. |
| 004 | 004_pedidos_functions.sql | Funções transacionais de criação e edição de pedidos com itens. |
| 005 | 005_produtos_mais_vendidos.sql | View pública com produtos e quantidade vendida em pedidos entregues. |
| 006 | 006_revisao_grants.sql | Remoção de privilégios administrativos desnecessários. |
| 007 | 007_preservar_precos_pedidos.sql | Preservação dos preços dos produtos mantidos na edição. |
| 008 | 008_storage_produtos.sql | Bucket de fotos e policies de acesso ao Storage. |
| 009 | 009_estoque_automatico_pedidos.sql | Controle transacional de estoque e escrita de pedidos exclusivamente por RPC. |

Os arquivos são executados manualmente no SQL Editor.
Esta pasta não utiliza automaticamente o mecanismo de migrations da CLI.

Não reaplicar todas as migrations em um banco já configurado.
Alguns scripts criam objetos sem IF NOT EXISTS.

A migration 009 exige pedidos e pedido_itens vazios.
Essa condição foi atendida no ambiente de desenvolvimento pela remoção
dos pedidos de teste antes da aplicação.

Em um ambiente com pedidos reais, planejar a conciliação do estoque
antes de adaptar a migration. Não apagar pedidos reais para atender
ao pré-requisito.

Depois de aplicar a migration 009, utilizar a versão da aplicação
compatível com a RPC de exclusão.

## Tabelas e relacionamentos

| Tabela | Conteúdo |
| --- | --- |
| clientes | Nome, telefone e endereço do cliente. |
| produtos | Dados do produto, preço, status, estoque disponível e referência da imagem. |
| plantios | Nome, tipo, área e quantidade do plantio. |
| pedidos | Cliente, telefone registrado, status e data do pedido. |
| pedido_itens | Produtos, quantidades e preços unitários registrados no pedido. |
| entregas | Cliente, endereço, data e status da entrega. |

Relacionamentos:

- pedidos.cliente_id referencia clientes.id.
- entregas.cliente_id referencia clientes.id.
- pedido_itens.pedido_id referencia pedidos.id.
- pedido_itens.produto_id referencia produtos.id.

Excluir um pedido exclui seus itens por ON DELETE CASCADE.
Clientes e produtos referenciados possuem restrição de exclusão.

Entregas são registros independentes dos pedidos: não existe
relacionamento direto entre entregas e pedidos no schema atual.

## Permissões e autenticação

RLS está habilitado nas seis tabelas de negócio.

Após a migration 009, o papel authenticated possui:

| Objeto | Operações utilizadas pela aplicação |
| --- | --- |
| clientes, produtos, plantios e entregas | SELECT, INSERT, UPDATE e DELETE. |
| pedidos e pedido_itens | SELECT direto; alterações por RPC. |
| vw_produtos_mais_vendidos | SELECT. |
| Bucket produtos | Consulta, upload e remoção conforme as policies de Storage. |

As policies administrativas atuais permitem acesso a usuários
autenticados. Elas não distinguem administradores por cargo
nem separam os dados por proprietário.

A autorização das RPCs de pedidos também exige usuário autenticado.
A gestão de quem pode possuir uma conta administrativa deve ser
coordenada com a configuração do Supabase Auth.

O papel anon pode consultar a view pública do ranking.
As tabelas administrativas não possuem policies que liberem
acesso direto para anon.

TRUNCATE, REFERENCES, TRIGGER e MAINTAIN foram revogados de
anon e authenticated nas tabelas de negócio.
A migration 006 também ajusta esses privilégios padrão para
objetos futuros criados por postgres no schema public.

## Funções de pedidos

| RPC | Comportamento |
| --- | --- |
| criar_pedido_com_itens | Cria o pedido e seus itens, registra os preços e desconta o estoque. |
| editar_pedido_com_itens | Edita o pedido, preserva preços dos produtos mantidos e movimenta a diferença de quantidade. |
| excluir_pedido_com_estoque | Exclui o pedido e devolve estoque apenas quando ele ainda não foi entregue. |

A função _salvar_pedido_com_estoque é interna.
Seu EXECUTE não é concedido ao frontend.

As RPCs públicas utilizam SECURITY DEFINER com search_path vazio
e nomes de objetos qualificados. A função interna verifica a sessão.

INSERT, UPDATE e DELETE diretos em pedidos e pedido_itens foram
revogados dos papéis public, anon e authenticated para impedir
alterações que ignorem o controle de estoque.

As operações da RPC são realizadas na mesma transação.
Uma falha desfaz as alterações do pedido, dos itens e do estoque.

Produtos envolvidos são bloqueados em ordem de ID durante a operação.
A disponibilidade é conferida no banco, além da validação da interface.

## Regras de estoque e preços

produtos.estoque representa a quantidade disponível para novos pedidos.

- Criar um pedido desconta todas as quantidades, inclusive se ele for criado como Entregue.
- Aumentar uma quantidade desconta somente o aumento.
- Reduzir uma quantidade devolve somente a redução.
- Remover ou trocar um produto devolve a quantidade do produto removido e desconta a do novo.
- Alterar apenas cliente, telefone, data ou status não gera novo desconto.
- Marcar como Entregue mantém o desconto realizado anteriormente.
- Excluir um pedido Pendente ou Em Rota devolve suas quantidades.
- Excluir um pedido Entregue não devolve estoque.
- Pedidos já entregues não permitem alterar itens nem retornar de status.
- Novos produtos e aumentos exigem status pronta-entrega e estoque suficiente.
- Quantidades devem ser inteiras e positivas; um produto não pode aparecer repetido no pedido.

Na edição, o limite de um produto em pronta entrega corresponde à
quantidade já reservada no pedido somada ao estoque disponível.
Para produtos em crescimento, a quantidade existente pode ser
mantida ou reduzida, sem aumento.

O preço é obtido do cadastro ao incluir um produto.
Produtos mantidos na edição conservam o preço registrado no pedido.
Se um produto for removido e incluído novamente em uma edição posterior,
será utilizado o preço vigente na nova inclusão.

A reposição permanece manual no cadastro do produto.
O campo Estoque recebe o total disponível desejado.
Exemplo: estoque atual 7 e entrada de 5 unidades correspondem
a um novo total disponível de 12.

O registro de plantios não repõe automaticamente o estoque.
Também não existe controle financeiro ou de devoluções físicas.

## Ranking público

A view vw_produtos_mais_vendidos apresenta os dados dos produtos
e total_vendido, calculado apenas com itens de pedidos Entregues.

Produtos sem vendas também aparecem, com total_vendido igual a zero.
A consulta do frontend define a ordenação e os filtros.

A view utiliza SECURITY INVOKER = false para permitir a leitura
do agregado público sem liberar as tabelas administrativas.
Não apresenta nomes de clientes, telefones ou endereços.

Excluir um pedido entregue também remove suas vendas do ranking,
pois seus itens deixam de existir.

## Fotos dos produtos

O bucket público produtos aceita:

- JPG/JPEG: image/jpeg.
- PNG: image/png.
- Arquivos de até 5 MiB, equivalentes a 5.242.880 bytes.

O painel utiliza nomes únicos em uploads/ e grava a URL pública
em produtos.imagem.

A foto é opcional na interface.
Produtos sem foto utilizam uma referência vazia; o frontend
é responsável pela apresentação do fallback.

Na edição sem novo arquivo, a foto atual é preservada.
Ao substituir uma foto ou excluir um produto, o serviço tenta
remover o arquivo antigo gerenciado pela aplicação, desde que
nenhum outro produto utilize a mesma URL.

A limpeza é uma operação separada do salvamento do produto.
Uma falha na remoção pode deixar um arquivo sem uso no Storage
e deve ser conferida posteriormente.

Não é necessário versionar a pasta local de fotos no Git.
Depois do upload, as aplicações utilizam a URL armazenada no banco.

## Backup e recuperação

O Git preserva os scripts e o código, mas não copia os dados
cadastrados nem os arquivos enviados ao Storage.

Para uma cópia completa, preservar separadamente:

1. Backup do banco, incluindo estrutura, dados e permissões.
2. Arquivos do bucket produtos, mantendo os caminhos dos objetos.
3. Configurações necessárias de Auth e do ambiente, em local seguro.

A disponibilidade de backups pelo Dashboard depende do plano
e da configuração do projeto. Para backup lógico, seguir o
procedimento oficial com Supabase CLI ou ferramentas PostgreSQL.

Um backup do banco não inclui o conteúdo dos arquivos do Storage.
A pasta original de fotos também não substitui uma cópia dos objetos
publicados com seus caminhos e referências.

Para recuperar:

- Restaurar primeiro em um ambiente separado.
- Seguir o procedimento correspondente ao formato do backup.
- Restaurar os arquivos do Storage e conferir os caminhos.
- Em um novo projeto, revisar as URLs das imagens, pois o domínio muda.
- Configurar Auth e as variáveis de ambiente para o projeto de destino.
- Validar acesso, pedidos, estoque e imagens antes de usar o ambiente.

Recriar um banco vazio pelas migrations e restaurar um dump completo
são procedimentos diferentes. Não executar ambos indiscriminadamente
sobre os mesmos objetos.

Uma recuperação completa de backup ainda precisa ser testada.

## Validação

Testes funcionais realizados durante a implementação:

- Criação, edição e exclusão de pedidos com dados persistidos.
- Preservação dos preços registrados na edição.
- Desconto de estoque na criação.
- Ajuste de estoque ao aumentar ou reduzir quantidades.
- Alteração de status sem desconto duplicado.
- Devolução ao excluir pedido ainda não entregue.
- Exclusão de pedido entregue sem devolução.
- Bloqueio de itens e status após a entrega.
- Persistência após recarregar a página.
- Upload JPG e PNG, substituição e limpeza de imagens.
- Lint e build do admin.

Validações adicionais realizadas em 30/09/2026:

- Interface desatualizada: duas abas prepararam pedidos de 4 unidades
  para um produto com estoque 5. Após salvar o primeiro, o segundo
  foi recusado. Permaneceu apenas um pedido e estoque 1.
- Exclusão desse pedido: o estoque retornou para 5.
- Rollback: um pedido com 2 unidades de cada produto foi recusado
  após o estoque do segundo produto ser reduzido em outra aba.
  Nenhum pedido foi criado e os estoques permaneceram A = 5 e B = 1.
- Permissões efetivas de pedidos e pedido_itens: authenticated
  possui SELECT, sem INSERT, UPDATE ou DELETE diretos.
  anon não possui nenhuma dessas quatro permissões.
- Permissões efetivas das funções: authenticated pode executar
  as três RPCs públicas, mas não a função interna.
  anon não pode executar nenhuma das quatro funções.

O teste com duas abas validou uma interface desatualizada.
Execuções simultâneas das transações ainda precisam ser testadas.

Validações finais pendentes:

- Disputa de estoque entre pedidos com transações simultâneas.
- Recuperação de backup do banco e dos arquivos.
- Integração final das aplicações no ambiente de deploy.

## Referências

- [Funções de banco no Supabase](https://supabase.com/docs/guides/database/functions)
- [Bloqueios e concorrência no PostgreSQL](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Controle de acesso ao Storage](https://supabase.com/docs/guides/storage/security/access-control)
- [Backup e recuperação com Supabase CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)