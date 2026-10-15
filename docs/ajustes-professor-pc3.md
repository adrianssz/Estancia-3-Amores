# Ajustes solicitados pelo professor - PC3

## Responsável

Eduardo - PC3

## Objetivo do ajuste

Corrigir o bloqueio de alteração dos itens e das quantidades dos pedidos quando o pedido estiver com status `Em Rota` ou `Entregue`.

A correção foi aplicada na interface do Admin e no banco de dados por meio da migration `010_bloqueio_itens_pedidos.sql`.

---

## Causa identificada

Antes da correção, o bloqueio dos itens considerava apenas pedidos com status `Entregue`.

Por isso, pedidos com status `Em Rota` ainda permitiam:

- alterar quantidades;
- trocar produtos;
- adicionar produtos;
- remover produtos.

Também era possível retornar um pedido de `Em Rota` para `Pendente`, permitindo contornar o bloqueio e voltar a editar os itens.

No banco, a função responsável pela edição dos pedidos também verificava o bloqueio apenas para pedidos `Entregue`.

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

## Migration criada e aplicada

Foi criada e aplicada no Supabase:

```text
database/010_bloqueio_itens_pedidos.sql
```

Pré-requisito:

```text
009_estoque_automatico_pedidos.sql
```

A migration foi aplicada no Supabase pelo PC1 e retornou:

```text
Success. No rows returned
```

A migration `011` não foi aplicada durante esse processo.

A `010` não cria novas tabelas, campos ou relacionamentos.

Ela altera a função interna utilizada pelas RPCs dos pedidos para adicionar as novas regras de bloqueio.

---

## Regras aplicadas no banco

A migration:

- valida o status realmente persistido do pedido;
- bloqueia alteração dos itens de pedidos `Em Rota`;
- mantém o bloqueio de pedidos `Entregue`;
- impede `Em Rota -> Pendente`;
- impede retorno de `Entregue`;
- mantém o bloqueio de concorrência com `FOR UPDATE`;
- preserva a movimentação transacional do estoque;
- preserva os preços registrados dos itens;
- compara os itens por produto e quantidade;
- não considera simples mudança de ordem como alteração.

A função utiliza o pedido persistido no banco dentro da transação, evitando confiar apenas no estado carregado pela interface.

---

## Teste de aba desatualizada

Resultado: aprovado.

Foi utilizado um pedido aberto simultaneamente em duas abas.

Em uma das abas, o pedido foi alterado de:

```text
Pendente -> Em Rota
```

Na outra aba, sem atualizar a página, foi realizada uma tentativa de salvar o pedido como `Pendente`.

O banco recusou a operação com:

```text
Pedido em rota não pode retornar para Pendente.
```

Depois foi realizada outra tentativa com o status `Em Rota`, mas alterando a quantidade.

O banco recusou com:

```text
Pedido em rota não permite alterar produtos ou quantidades.
```

Após atualizar a página, a quantidade original continuou salva.

Isso confirmou que uma aba desatualizada não consegue contornar a proteção.

---

## Teste de alteração de quantidade

Resultado: aprovado.

Um pedido `Em Rota` teve uma tentativa de alteração da quantidade de `1` para `2`.

A RPC recusou a operação.

Após atualizar os dados, a quantidade permaneceu `1`.

---

## Teste de remoção de produto

Resultado: aprovado.

Foi criado um pedido com dois produtos.

Depois que o pedido passou para `Em Rota`, uma aba desatualizada tentou remover um dos produtos.

A operação foi recusada.

Após atualizar a página, os dois produtos continuaram no pedido.

---

## Teste de inclusão de produto

Resultado: aprovado.

Depois que um pedido passou para `Em Rota`, uma aba desatualizada tentou adicionar um novo produto.

A operação foi recusada com a mensagem de bloqueio dos produtos e quantidades.

Nenhum item novo foi adicionado ao pedido.

---

## Teste de troca de produto

Resultado: aprovado.

Depois que um pedido passou para `Em Rota`, uma aba desatualizada tentou trocar o produto existente por outro.

A operação foi recusada.

Após atualizar a página, o produto original continuou no pedido.

---

## Teste de pedido Entregue

Resultado: aprovado.

Foi realizada uma tentativa de alterar a quantidade de um pedido que já estava `Entregue`.

O banco recusou a operação.

Também foi realizada uma tentativa de retornar um pedido `Entregue` para `Em Rota`.

A RPC recusou com:

```text
Pedido entregue não permite retornar de status.
```

Os dados originais permaneceram intactos.

---

## Teste de reordenação dos itens

Resultado: aprovado.

Foi criado um pedido com:

```text
Mamão - 1
Cenoura - 1
```

Depois que o pedido passou para `Em Rota`, uma aba desatualizada enviou os mesmos itens apenas em ordem inversa:

```text
Cenoura - 1
Mamão - 1
```

A operação foi aceita.

Isso confirmou que a comparação considera produto e quantidade, sem interpretar apenas a mudança de ordem como alteração dos itens.

---

## Testes de estoque

Resultado: aprovado.

Antes de criar um pedido de teste, o estoque do Mamão estava em:

```text
12
```

Após criar validamente um pedido com uma unidade de Mamão, o estoque passou para:

```text
11
```

Depois foram realizadas tentativas proibidas de alteração dos itens.

O estoque permaneceu:

```text
11
```

Também foi realizada uma simples mudança de status do pedido.

O estoque permaneceu inalterado.

Isso confirmou que:

- uma operação válida desconta o estoque corretamente;
- uma operação recusada não altera o estoque;
- uma simples mudança de status não desconta estoque novamente.

---

## Teste de preservação do preço registrado

Resultado: aprovado.

Foi consultado no Supabase o item do Pedido 26 antes de uma alteração permitida.

Resultado inicial:

```text
Pedido: 26
Produto: Mamão
Quantidade: 1
Preço unitário registrado: 1400.00
Preço atual: 1400.00
```

Depois foi realizada apenas uma alteração permitida na data do pedido, sem alterar o produto ou a quantidade.

A mesma consulta foi realizada novamente.

Resultado:

```text
Pedido: 26
Produto: Mamão
Quantidade: 1
Preço unitário registrado: 1400.00
Preço atual: 1400.00
```

O preço registrado do item permaneceu inalterado durante a operação permitida.

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

## Resultado dos testes obrigatórios

Todos os testes obrigatórios previstos para esta correção foram concluídos.

- Pedido `Pendente` permite alterações válidas: aprovado.
- `Em Rota` bloqueia alteração de quantidade: aprovado.
- `Em Rota` bloqueia inclusão de produto: aprovado.
- `Em Rota` bloqueia remoção de produto: aprovado.
- `Em Rota` bloqueia troca de produto: aprovado.
- `Entregue` mantém os bloqueios: aprovado.
- Outros campos permitidos continuam funcionando: aprovado.
- Transições de status respeitam as regras definidas: aprovado.
- Aba desatualizada não contorna a regra: aprovado.
- RPC recusa operações proibidas: aprovado.
- Reordenação dos mesmos itens não gera bloqueio: aprovado.
- Operação recusada não altera itens: aprovado.
- Operação recusada não altera estoque: aprovado.
- Mudança simples de status não desconta estoque novamente: aprovado.
- Preço registrado foi preservado em operação válida: aprovado.
- Lint do Admin: aprovado.
- Build do Admin: aprovado.

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

Registro inicial da documentação:

```text
96d87c4 docs: registra ajuste de bloqueio dos pedidos
```

Branch utilizada:

```text
feature/pc3-bloqueio-itens-pedidos
```

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
- o banco também impede operações proibidas.

---

## Impacto nos casos de teste

Os testes de pedidos devem contemplar:

- edição de pedido `Pendente`;
- bloqueio de pedido `Em Rota`;
- bloqueio de pedido `Entregue`;
- transições válidas de status;
- transições inválidas de status;
- tentativa por aba desatualizada;
- tentativa direta pela RPC;
- inclusão, remoção, troca e alteração de quantidade;
- reordenação dos mesmos itens;
- preservação do estoque;
- preservação do preço registrado.

---

## Impacto nos diagramas

Esta correção não cria:

- novas tabelas;
- novos campos;
- novos relacionamentos;
- novas classes principais.

Por isso, o DER e o Diagrama de Classes não precisam de alteração estrutural por causa deste ajuste do PC3.

Os diagramas preparados pelo PC2 continuam coerentes estruturalmente com esta correção.

---

## Impacto na documentação geral

O PC1 deverá atualizar a documentação geral com as novas regras.

Os principais pontos a revisar são:

- regras de negócio dos pedidos;
- fluxo de status dos pedidos;
- User Stories;
- critérios de aceitação;
- casos de teste;
- descrição da movimentação de estoque.

---

## Relação com o trabalho do PC2

O PC2 trabalha separadamente em:

- padronização da unidade de medida dos produtos;
- apresentação das unidades;
- somatórias dos relatórios.

Nenhum arquivo reservado ao PC2 foi alterado pelo PC3.

A migration utilizada pelo PC3 foi:

```text
010_bloqueio_itens_pedidos.sql
```

A migration `011` não foi aplicada durante os testes do PC3.

O PC2 deverá atualizar sua feature com a `develop` após a integração desta correção, antes de integrar o trabalho dele.