# Estância 3 Amores

Trabalho de Conclusão de Curso de Sistemas para Internet da Faculdade Alfa Umuarama (UniALFA). O sistema reúne um painel para organizar a produção e as vendas da Estância e um site para divulgar os produtos e facilitar o atendimento.

## Equipe da entrega final

- Adrian Souza Santos
- Fernando Cardoso dos Santos

## Aplicações

| Diretório | Conteúdo |
| --- | --- |
| [admin/](admin/) | Painel com login, dashboard, cadastros de plantios, produtos, clientes, pedidos e entregas, e relatórios com impressão. |
| [frontend/](frontend/) | Site público com página inicial, Feira, Sobre, Contato e Cesta. A cesta prepara a mensagem para o WhatsApp. O operador registra o pedido no painel. |
| [database/](database/) | Migrações PostgreSQL, políticas de acesso, funções de pedidos e estoque, ranking público e configuração do armazenamento de fotos. |
| [docs/](docs/) | Histórico de desenvolvimento e documentação acadêmica do projeto. |

## Tecnologias

- React, JavaScript, React Router e CSS nas duas aplicações.
- Vite para desenvolvimento e compilação. Node.js e npm executam essas ferramentas localmente.
- Supabase como backend gerenciado: PostgreSQL para os dados e regras de negócio, Supabase Auth para o login e Supabase Storage para as fotos.
- WhatsApp para encaminhar a cesta do site ao atendimento da Estância.

## Executar localmente

Use Node.js 22.12+ na série 22 ou uma versão LTS mais recente compatível, npm e um projeto Supabase configurado. Para preparar um banco novo, siga as [instruções do banco](database/README.md).

Copie `.env.example` para `.env.local` dentro de cada aplicação. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nas duas. No painel, configure também `VITE_SUPABASE_ADMIN_EMAIL` com o e-mail da conta administrativa criada no Supabase Auth. Use somente a chave pública no navegador.

Em terminais separados, execute os comandos no diretório `admin/` e no diretório `frontend/`:

```bash
npm ci
npm run dev
```

O Vite informa o endereço de cada aplicação no terminal. Para verificar uma alteração, execute `npm run lint` e `npm run build` no diretório correspondente.

## Documentação do TCC

- [Documentação acadêmica versionada](docs/tcc/documentacao-tcc-estancia-3-amores.pdf)
- [Metodologias](https://docs.google.com/document/d/1-6WqNS4hUqL5-6Ctsz_9rhBrO_dMUhKxSv2nxRVAifM/edit?usp=sharing)
- [Resultados preliminares](https://docs.google.com/document/d/1SMs7qH7hjlmIzyZoq1plR00QBkzERfeJb6tjXzhxjyA/edit?usp=sharing)
- [Dificuldades encontradas](https://docs.google.com/document/d/1uuAkYxvUNCXbfhRp9fzeGlJ2ThKh2rx-OPuMG5MMggE/edit?usp=sharing)
