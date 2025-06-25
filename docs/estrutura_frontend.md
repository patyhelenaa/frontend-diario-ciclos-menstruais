# Estrutura do Frontend - Diário de Ciclos

Este documento explica a função de cada página do frontend do projeto e comenta sobre o padrão de organização das pastas.

## Função de cada página

- **Login.jsx**
  - Página de autenticação do usuário.
  - Permite o login com username e senha.
  - Integra com o backend para obter o token de autenticação.

- **Register.jsx**
  - Página de cadastro de novo usuário.
  - Coleta dados pessoais e de acesso.
  - Integra com o backend para criar o usuário e perfil.

- **Profile.jsx**
  - Página de perfil do usuário logado.
  - Exibe dados pessoais e estatísticas dos ciclos.
  - Permite editar dados do perfil e excluir a conta.

- **Ciclos.jsx**
  - Página para visualizar, adicionar, editar e excluir ciclos menstruais.
  - Mostra os ciclos em cards paginados.

- **Sintomas.jsx**
  - Página para visualizar, adicionar, editar e excluir sintomas (físicos, emocionais, libido, secreção).
  - Mostra os sintomas em cards paginados.

- **ErrorPage.jsx**
  - Página de erro genérica (404 ou outros erros).
  - Exibe mascote assustada e mensagem amigável.

- **App.jsx**
  - Componente principal de rotas do React Router.
  - Define as rotas para todas as páginas acima.

- **Header.jsx**
  - Componente de navegação presente no topo das páginas internas.
  - Mostra links para as principais páginas e botão de logout.

- **services/api.js**
  - Serviço central de requisições HTTP (Axios).
  - Configura o endereço da API e o interceptor de token.

- **assets/**
  - Imagens e ícones usados nas páginas (mascote, gotinha, calendário, etc).

- **index.css**
  - Arquivo global de estilos do projeto.

- **public/**
  - Arquivos estáticos acessados diretamente (ex: index.html, favicon, etc).

## Padrão de pastas

A estrutura de pastas do frontend segue um padrão comum em projetos React modernos:

- **src/pages/**: Cada página principal do app tem seu próprio arquivo/componente.
- **src/components/**: Componentes reutilizáveis (ex: Header).
- **src/services/**: Serviços de API e utilitários de comunicação com o backend.
- **src/assets/**: Imagens e arquivos estáticos importados no código.
- **src/styles/** (opcional): Para arquivos de estilos separados, se necessário.
- **public/**: Arquivos estáticos servidos diretamente pelo Vite (ou outro bundler).

Esse padrão facilita a organização, manutenção e escalabilidade do projeto, sendo amplamente adotado em aplicações React profissionais. 