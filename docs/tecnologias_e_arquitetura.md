# Tecnologias, Linguagens e Arquitetura do Projeto

## Visão Geral
Este projeto é um Diário de Ciclos Menstruais, composto por dois repositórios principais:
- **Backend:** API REST em Django (Python)
- **Frontend:** SPA em React (Vite, JavaScript)

Ambos são dockerizados e possuem testes automatizados (unitários, integração e E2E).

---

## Tecnologias e Linguagens Utilizadas

### Backend
- **Python 3.12**: Linguagem principal do backend, escolhida pela robustez, legibilidade e vasta comunidade.
- **Django**: Framework web completo, usado para estruturar a API, autenticação, models e regras de negócio.
- **Django REST Framework (DRF)**: Extensão do Django para criar APIs RESTful de forma rápida e segura.
- **PostgreSQL**: Banco de dados relacional, usado para persistência dos dados.
- **pytest**: Framework de testes automatizados para Python.
- **flake8**: Linter para garantir qualidade e padronização do código Python.
- **docker-compose**: Orquestração dos serviços backend, banco e testes.

### Frontend
- **JavaScript (ES6+)**: Linguagem principal do frontend.
- **React**: Biblioteca para construção de interfaces reativas e SPA.
- **Vite**: Ferramenta moderna de build e dev server para projetos React, escolhida pela performance e simplicidade.
- **ESLint**: Linter para garantir qualidade e padronização do código JS/React.
- **Vitest**: Framework de testes unitários e integração para React, compatível com Jest.
- **Selenium**: Ferramenta para testes E2E (end-to-end), simulando um usuário real no navegador.
- **Docker**: Todos os ambientes (dev, prod, testes) são dockerizados para garantir reprodutibilidade.

---

## Por que essas escolhas?
- **Django + DRF**: Permite criar APIs robustas, seguras e com autenticação pronta, além de facilitar a modelagem de regras de negócio complexas.
- **React + Vite**: Proporciona uma experiência de desenvolvimento rápida, hot reload eficiente e build otimizado para produção.
- **Vitest**: Testes rápidos e integração perfeita com Vite/React.
- **Selenium**: Garante que o sistema funciona de ponta a ponta, do ponto de vista do usuário.
- **Docker**: Facilita o setup, CI/CD, deploy e garante que todos rodem o mesmo ambiente.

---

## Como as tecnologias funcionam no projeto

- O **backend** expõe uma API RESTful em `/api/` (ex: `/api/ciclos/`, `/api/sintomas/`, `/api/usuarios/`).
- O **frontend** consome essa API via HTTP usando o serviço `api.js` (axios).
- O **docker-compose** permite rodar todos os serviços juntos, inclusive testes automatizados e E2E.
- Os testes do frontend (Vitest) e backend (pytest) rodam em containers separados.
- O Selenium roda em container próprio, acessando o frontend publicado via Nginx.

---

# Backend: Regras de Negócio, Models e Integração

## Principais Models (Django)

### 1. **Usuário**
- **Campos:** username, email, senha, data de nascimento, etc.
- **Função:** Gerencia autenticação, cadastro e perfil do usuário.
- **Integração:** O frontend consome endpoints de login, registro e perfil.

### 2. **Ciclo**
- **Campos:** data (início do ciclo), duracao_ciclo, duracao_menstruacao, fluxo_menstrual, dia_menstruada.
- **Função:** Representa um ciclo menstrual do usuário.
- **Regras:**
  - O ciclo é criado a partir da data de início informada.
  - O backend calcula estatísticas (duração média, fluxo, etc) para exibir no perfil.
- **Integração:** O frontend exibe, cria, edita e exclui ciclos via API.

### 3. **Sintoma**
- **Campos:** data, tipo (Físico, Humor, Libido, Secreção), intensidade, nome_sintoma, descrição, campos extras por tipo (ex: textura, humor, prática, etc).
- **Função:** Registra sintomas diários do usuário.
- **Regras:**
  - O backend atribui automaticamente o ciclo correto ao sintoma com base na data do sintoma.
  - Choices dinâmicos para intensidade, humor, textura, etc, são fornecidos por endpoint próprio.
- **Integração:** O frontend consome os endpoints para registrar, listar e exibir sintomas, além de buscar os choices dinâmicos para os selects.

---

## Fluxo e regras de negócio do backend

- **Autenticação:**
  - Usuário faz login/registro via API.
  - Token de autenticação é retornado e usado pelo frontend nas requisições protegidas.

- **Ciclos:**
  - Usuário pode criar, editar e excluir ciclos.
  - O backend calcula estatísticas (duração média, fluxo mais comum, etc) para exibir no perfil.
  - O frontend exibe cards de ciclos e estatísticas, consumindo esses endpoints.

- **Sintomas:**
  - Sintomas são registrados sem o campo ciclo; o backend associa automaticamente ao ciclo correto pela data.
  - O frontend busca os choices dinâmicos para os selects de intensidade, humor, textura, etc.
  - O backend permite listar, criar, editar e excluir sintomas.

- **Estatísticas:**
  - O backend expõe endpoints para estatísticas do perfil (média de duração, sintomas mais comuns, etc).
  - O frontend exibe essas estatísticas em cards no perfil do usuário.

- **Choices dinâmicos:**
  - O backend fornece os valores possíveis para selects (intensidade, humor, textura) via endpoint `/api/sintomas/choices/`.
  - O frontend consome esse endpoint para popular os selects dinamicamente.

---

## Integração Frontend x Backend

- O frontend faz requisições HTTP para a API do backend usando axios.
- O token de autenticação é salvo no localStorage e enviado nas requisições protegidas.
- O frontend exibe feedback visual (mensagens, cards, erros) conforme as respostas da API.
- Todos os fluxos (login, registro, ciclos, sintomas, estatísticas) são integrados e testados com Vitest e Selenium.

---

## Resumo
O projeto utiliza tecnologias modernas e robustas para garantir segurança, performance, testabilidade e facilidade de manutenção. O backend em Django/DRF implementa regras de negócio claras e expõe uma API RESTful consumida pelo frontend em React/Vite. Testes automatizados (unitários, integração e E2E) garantem a qualidade do sistema em todas as camadas. 

---

# Backlog do Projeto e Implementação

O backlog do projeto foi planejado para cobrir todas as funcionalidades essenciais de um diário de ciclos menstruais, priorizando experiência do usuário, robustez e integração entre frontend e backend.

## Funcionalidades do Backlog

| Item do Backlog                                   | Backend (Django/DRF)                | Frontend (React/Vite)                |
|--------------------------------------------------|-------------------------------------|--------------------------------------|
| Cadastro de usuário                              | /api/usuarios/register/             | Página Register.jsx                  |
| Login/autenticação                               | /api/usuarios/login/ (token)        | Página Login.jsx, AuthContext        |
| Perfil do usuário                               | /api/usuarios/profile/              | Página Profile.jsx                   |
| Edição de perfil                                | /api/usuarios/profile/ (PUT/PATCH)  | Página Profile.jsx                   |
| Cadastro de ciclo menstrual                      | /api/ciclos/ (POST)                 | Página Ciclos.jsx (form/modal)       |
| Listagem de ciclos                              | /api/ciclos/ (GET)                  | Página Ciclos.jsx (cards)            |
| Edição/Exclusão de ciclo                        | /api/ciclos/<id>/ (PUT/DELETE)      | Página Ciclos.jsx (actions)          |
| Cadastro de sintomas                            | /api/fisico/, /api/humor/, ...      | Página Sintomas.jsx (form/modal)     |
| Listagem de sintomas                            | /api/fisico/, /api/humor/, ...      | Página Sintomas.jsx (cards)          |
| Choices dinâmicos para selects                  | /api/sintomas/choices/              | Sintomas.jsx (selects dinâmicos)     |
| Estatísticas do perfil                          | /api/usuarios/estatisticas/         | Profile.jsx (cards de estatísticas)  |
| Feedback visual (erros, sucesso, loading)       | Mensagens de erro/sucesso nas views | Mensagens, loaders, toasts no front  |
| Testes automatizados                            | pytest, flake8, Selenium            | Vitest, ESLint, Selenium             |
| Dockerização                                    | Dockerfile, docker-compose.yml      | Dockerfile, docker-compose.yml       |
| Testes E2E (Selenium)                           | API disponível para E2E             | Scripts em selenium-tests/           |

## Observações
- Cada item do backlog foi implementado de forma integrada: o backend expõe endpoints RESTful e o frontend consome e exibe os dados de forma reativa.
- Os testes automatizados cobrem tanto lógica de negócio (backend) quanto interface e integração (frontend).
- O Selenium garante que os fluxos principais funcionam do ponto de vista do usuário real.
- O Docker garante que todos os ambientes (dev, prod, testes) sejam reprodutíveis e fáceis de rodar.

--- 