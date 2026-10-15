# Ajustes solicitados pelo professor - PC3

## Responsável

Eduardo - PC3

## Objetivo do ajuste

Corrigir o bloqueio de alteração dos itens e das quantidades dos pedidos quando o pedido estiver com status `Em Rota` ou `Entregue`.

A correção foi feita na interface do Admin e preparada também no banco de dados por meio de uma nova migration.

---

## Causa identificada

Antes da correção, o bloqueio dos itens considerava apenas pedidos com status `Entregue`.

Por isso, pedidos com status `Em Rota` ainda permitiam:

- alterar quantidades;
- trocar produtos;
- adicionar produtos;
- remover produtos.

Também era possível retornar um pedido de `Em Rota` para `Pendente`, permitindo contornar o bloqueio e voltar a editar os itens.

No banco, a função responsável pela edição dos pedidos também verificava o bloqueio somente para pedidos `Entregue`.

---

## Comportamento anterior

### Pendente

Permitida a edição dos produtos e quantidades.

### Em Rota

Ainda permitia alterar produtos e quantidades.

Também permitia retornar o status para `Pendente`.

### Entregue

Já bloqueava alterações dos itens e não permitia retornar para um status anterior.

---

## Novo comportamento

### Pendente

Permite:

- alterar produtos;
- alterar quantidades;
- adicionar produtos;
- remover produtos;
- permanecer como `Pendente`;
- avançar para `Em Rota`.

### Em Rota

Não permite:

- alterar quantidade;
- trocar produto;
- adicionar produto;
- remover produto;
- retornar para `Pendente`.

Permite:

- editar os demais campos permitidos;
- permanecer como `Em Rota`;
- avançar para `Entregue`.

### Entregue

Não permite:

- alterar quantidade;
- trocar produto;
- adicionar produto;
- remover produto;
- retornar para `Em Rota`;
- retornar para `Pendente`.

---

## Regra de transição de status

O fluxo definido ficou:

```text
Pendente -> Em Rota -> Entregue
```

Não é permitido retornar de `Em Rota` para `Pendente`.

Um pedido `Entregue` também não pode retornar para um status anterior.

Essa regra foi confirmada pelo responsável pelo projeto antes da implementação.

---

## Arquivos alterados

### Interface

```text
admin/src/pages/EditarPedido.jsx
```

### Banco de dados

```text
database/010_bloqueio_itens_pedidos.sql
```

### Registro técnico

```text
docs/ajustes-professor-pc3.md
```

Nenhum arquivo reservado ao PC2 foi alterado.

---

## Alterações na interface

A tela de edição passou a considerar o status salvo do pedido para decidir se os itens devem ficar bloqueados.

Quando o pedido está `Em Rota` ou `Entregue`:

- o campo de produto fica desabilitado;
- o campo de quantidade fica desabilitado;
- o botão para adicionar produto não aparece;
- o botão para remover produto não aparece;
- é exibida uma mensagem explicando o motivo do bloqueio.

As opções de status também passaram a respeitar o fluxo definido.

Para um pedido `Em Rota`, são apresentadas somente:

```text
Em Rota
Entregue
```

Para um pedido `Entregue`, o status permanece bloqueado.

---

## Migration criada

Foi criada:

```text
database/010_bloqueio_itens_pedidos.sql
```

Pré-requisito:

```text
009_estoque_automatico_pedidos.sql
```

A migration não cria novas tabelas, campos ou relacionamentos.

Ela altera a função interna utilizada pelas RPCs dos pedidos para adicionar as novas regras de bloqueio.

---

## Regras aplicadas no banco

A migration foi preparada para:

- validar o status realmente persistido do pedido;
- bloquear alteração dos itens de pedidos `Em Rota`;
- manter o bloqueio de pedidos `Entregue`;
- impedir `Em Rota -> Pendente`;
- impedir retorno de `Entregue`;
- manter o bloqueio de concorrência com `FOR UPDATE`;
- preservar a movimentação transacional do estoque;
- preservar preços históricos dos itens;
- comparar os itens por produto e quantidade;
- não considerar simples mudança de ordem como alteração.

A função utiliza o pedido persistido no banco dentro da transação, evitando confiar apenas no estado carregado pela interface.

---

## Concorrência e aba desatualizada

A função consulta o pedido utilizando:

```text
FOR UPDATE
```

O objetivo é garantir que o status utilizado para validar a alteração seja o status atualmente salvo no banco.

Exemplo esperado:

1. uma aba abre um pedido enquanto ele ainda está `Pendente`;
2. outra operação muda o pedido para `Em Rota`;
3. a primeira aba tenta alterar os itens;
4. o banco consulta novamente o status persistido;
5. a alteração dos itens deve ser recusada.

Esse cenário ainda precisa ser validado após a aplicação da migration `010` no Supabase.

---

## Comparação dos itens

Os itens são comparados por produto e quantidade.

Uma simples mudança na ordem dos mesmos produtos não deve ser considerada alteração.

Exemplo:

```text
Produto A - 2
Produto B - 1
```

é equivalente a:

```text
Produto B - 1
Produto A - 2
```

desde que produtos e quantidades permaneçam iguais.

---

## Estoque

A lógica existente de estoque foi preservada.

Enquanto o pedido está `Pendente`, alterações válidas dos itens movimentam somente a diferença necessária no estoque.

Depois que o pedido estiver `Em Rota` ou `Entregue`, os itens ficam bloqueados e não devem causar novas movimentações.

Uma simples alteração de status também não deve descontar estoque novamente.

---

## Preços históricos

A lógica existente de preservação do `preco_unitario` foi mantida.

Os produtos que permanecem em um pedido continuam utilizando o preço histórico registrado para aquele item.

---

## Testes realizados na interface

### Pedido Pendente

Resultado: aprovado.

Foi validado que:

- produto continua editável;
- quantidade continua editável;
- botão para adicionar produto permanece disponível;
- alteração de quantidade foi salva corretamente;
- foi possível avançar de `Pendente` para `Em Rota`.

### Pedido Em Rota

Resultado: aprovado.

Foi validado que:

- produto fica bloqueado;
- quantidade fica bloqueada;
- botão para adicionar produto não aparece;
- botão para remover produto não aparece;
- `Pendente` não aparece entre as opções de status;
- aparecem somente `Em Rota` e `Entregue`;
- mensagem explicando o bloqueio é exibida;
- outros campos permitidos continuam editáveis;
- alteração da data foi salva corretamente;
- foi possível avançar para `Entregue`.

### Pedido Entregue

Resultado: aprovado.

Foi validado que:

- produto permanece bloqueado;
- quantidade permanece bloqueada;
- não é possível adicionar produto;
- não é possível remover produto;
- status permanece bloqueado;
- mensagem de bloqueio é exibida corretamente.

---

## Validações técnicas

### Lint

Comando:

```bash
npm run lint
```

Resultado:

```text
Aprovado, sem erros.
```

### Build

Comando:

```bash
npm run build
```

Resultado:

```text
Aprovado.
```

O Vite apresentou somente o aviso já conhecido sobre um chunk superior a 500 kB.

Esse aviso não está relacionado à correção dos pedidos.

---

## Testes de banco pendentes

A migration `010_bloqueio_itens_pedidos.sql` ainda não foi aplicada no Supabase.

Por isso, ainda precisam ser executados:

- RPC tentando alterar quantidade de pedido `Em Rota`;
- RPC tentando trocar produto de pedido `Em Rota`;
- RPC tentando adicionar ou remover produto de pedido `Em Rota`;
- tentativa de alterar itens de pedido `Entregue`;
- tentativa de retornar `Em Rota` para `Pendente`;
- tentativa de retornar `Entregue` para status anterior;
- teste de aba desatualizada;
- confirmação de que uma operação recusada não altera o pedido;
- confirmação de que uma operação recusada não altera os itens;
- confirmação de que uma operação recusada não altera o estoque;
- confirmação de que reordenar os mesmos itens não causa bloqueio indevido;
- confirmação de que mudança válida de status não desconta estoque novamente;
- confirmação da preservação dos preços históricos.

A correção do banco somente poderá ser considerada completamente validada depois desses testes.

---

## Procedimento para aplicação da migration

Deve ser aplicada somente:

```text
database/010_bloqueio_itens_pedidos.sql
```

Não é necessário apagar dados.

Não é necessário executar novamente todas as migrations anteriores.

A `010` depende da lógica existente na migration `009`.

Após a aplicação, devem ser executados os testes de banco descritos neste documento.

---

## Commits realizados

Alteração da interface:

```text
da5f007 fix: bloqueia itens de pedidos em rota e entregues
```

Alteração do banco:

```text
4984816 fix: protege itens de pedidos em rota no banco
```

Branch utilizada:

```text
feature/pc3-bloqueio-itens-pedidos
```

A branch já foi publicada no GitHub.

A integração na `develop` deve ocorrer somente após a validação final da migration no Supabase.

---

## Impacto nas User Stories e critérios de aceitação

A documentação geral deverá registrar que pedidos `Em Rota` e `Entregue` não permitem alterações em seus itens.

Os critérios de aceitação relacionados à edição de pedidos devem considerar:

- `Pendente` permite alteração de itens;
- `Em Rota` bloqueia alteração de itens;
- `Entregue` mantém o bloqueio;
- `Em Rota` não pode retornar para `Pendente`;
- `Entregue` não pode retornar para status anterior;
- os demais campos permitidos continuam editáveis;
- o banco também deve impedir operações proibidas.

---

## Impacto nos casos de teste

Os testes de pedidos devem incluir cenários positivos e negativos para:

- edição de pedido `Pendente`;
- bloqueio de pedido `Em Rota`;
- bloqueio de pedido `Entregue`;
- transições válidas de status;
- transições inválidas de status;
- tentativa por aba desatualizada;
- tentativa direta pela RPC;
- preservação do estoque;
- preservação do preço histórico.

---

## Impacto nos diagramas

Esta correção não cria:

- novas tabelas;
- novos campos;
- novos relacionamentos;
- novas classes principais.

Por isso, o DER e o Diagrama de Classes não precisam de alteração estrutural por causa deste ajuste do PC3.

Os diagramas preparados pelo PC2 devem apenas ser revisados junto com a documentação final para verificar a coerência com o estado definitivo do projeto.

---

## Impacto na documentação geral

O PC1 deverá atualizar a documentação geral após a integração da correção.

Os principais pontos a revisar são:

- regras de negócio dos pedidos;
- fluxo de status dos pedidos;
- User Stories;
- critérios de aceitação;
- casos de teste;
- descrição da movimentação de estoque.

---

## Relação com o trabalho do PC2

O PC2 está trabalhando separadamente em:

- padronização da unidade de medida dos produtos;
- apresentação das unidades;
- somatórias dos relatórios.

Nenhum arquivo reservado ao PC2 foi alterado pelo PC3.

A migration reservada ao PC3 é:

```text
010_bloqueio_itens_pedidos.sql
```

Caso o PC2 precise criar uma migration para a unidade de medida, o próximo número reservado é:

```text
011
```

As alterações do PC2 e PC3 devem permanecer independentes.