# Frontend - Meu Diário de Ciclos

[Projeto original (fork)](https://github.com/patyhelenaa/Diario-de-ciclos-menstruais)

## 💡 Ideia do Projeto

Este frontend faz parte do sistema **Meu Diário de Ciclos**, desenvolvido para a disciplina de **Técnicas de Programação em Plataformas Emergentes (TPPE)**. O objetivo é fornecer uma interface SPA moderna, intuitiva e responsiva para acompanhamento de ciclos menstruais, sintomas físicos, emocionais e outros dados relevantes para a saúde da mulher.

Esta versão foi construída com **React** e **Vite**.

## 🚀 Tecnologias e Linguagens Utilizadas

- **Frontend:** React 19, Vite
- **Roteamento:** React Router DOM
- **Requisições HTTP:** Axios
- **Testes:** Vitest, Testing Library, Selenium (E2E)
- **Lint:** ESLint
- **Docker:** Multi-stage build para produção

## 🛠️ Como rodar o projeto (Frontend)

### 1. Pré-requisitos
- Node.js (>=18)
- npm ou yarn

### 2. Clonar o repositório
```bash
git clone https://github.com/patyhelenaa/Diario-de-ciclos-menstruais.git
```

### 3. Instalar dependências
```bash
cd frontend-diario-ciclos-menstruais
npm install
```

### 4. Rodar em modo desenvolvimento
```bash
npm run dev
```
- Acesse: http://localhost:5173/

### 5. Rodar testes
```bash
npm run test
```

### 6. Build para produção
```bash
npm run build
```

### 7. Rodar com Docker
```bash
docker build -t frontend-diario-ciclos-menstruais .
docker run -p 80:80 frontend-diario-ciclos-menstruais
```

## 🌐 Deploy

Este frontend está hospedado no Railway:

> https://frontend-diario-ciclos-menstruais-production.up.railway.app/  
> (deploy em produção em 2024-07-16)

## 📄 Documentações

- [Backlog, arquitetura e integrações](docs/tecnologias_e_arquitetura.md)
- [Estrutura do frontend](docs/estrutura_frontend.md)

---

Sinta-se à vontade para contribuir ou sugerir melhorias! 