# Teste Automatizado E2E com Selenium

Este projeto possui um teste automatizado de ponta a ponta (E2E) utilizando **Selenium** para validar os principais fluxos do frontend.

## 📄 Arquivo do teste
- O teste está localizado em: `selenium-tests/test_e2e_frontend.py`

## 🚦 O que é testado?
O teste cobre os seguintes fluxos principais:

1. **Home/Login**
   - Acessa a página inicial (`/`), que já é a tela de login.
   - Verifica se o título da página é "Diário de ciclos Menstruais".
   - Verifica se o texto "Entre em sua conta do diário de ciclos menstruais" está presente.

2. **Fluxo de Login**
   - Usa a própria home para login.
   - Preenche os campos de login (`name="username"` e `name="password"`).
   - Tenta autenticar e verifica mensagem de erro ou redirecionamento.

3. **Fluxo de Cadastro**
   - Acessa `/register`.
   - Verifica se a página contém o texto "Criar conta".
   - Preenche os campos de cadastro:
     - `name="username"`
     - `name="email"`
     - `name="password"`
     - `name="password2"` (confirmação de senha)
   - Tenta registrar e verifica mensagem de sucesso, erro ou redirecionamento.

## 🛠️ Como rodar o teste Selenium

### 1. Pré-requisitos
- Python 3 instalado
- Google Chrome (ou Chromium) instalado
- ChromeDriver compatível com sua versão do Chrome
- Selenium instalado:
  ```bash
  pip install selenium
  ```

### 2. Rodando o teste
No terminal, execute:
```bash
python selenium-tests/test_e2e_frontend.py
```

O teste irá rodar em modo headless (sem abrir janela do navegador) e imprimir o resultado de cada etapa no terminal.

### 3. Dicas
- Se quiser ver o navegador abrindo, remova ou comente a linha:
  ```python
  chrome_options.add_argument('--headless')
  ```
- Para rodar em ambiente Docker, utilize o serviço `SELENIUM_TEST` já configurado no `docker-compose.yml`.

## 📋 Observações
- O teste foi ajustado para usar os atributos `name` nos inputs, tornando-o mais robusto.
- O teste é executável tanto localmente quanto em pipelines de CI/CD.
- O fluxo de cadastro valida o texto "Criar conta" na página.

---

Sinta-se à vontade para contribuir com novos cenários de teste! 