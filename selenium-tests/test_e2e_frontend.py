from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time

# Configurações para rodar em Docker (headless)
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

# Altere a URL se for rodar em ambiente hospedado
BASE_URL = "http://localhost:5173"

def test_homepage(driver):
    driver.get(BASE_URL)
    time.sleep(1)  # Garante que a página carregou
    print("Título encontrado:", driver.title)
    assert "Diário de ciclos Menstruais" in driver.title, f"Título inesperado: {driver.title}"
    print("Título da página OK")

    # Verifica se o formulário de login está presente
    assert "Entre em sua conta do diário de ciclos menstruais" in driver.page_source, "Texto de login não encontrado na home."
    print("Página de login exibida na home OK")


def test_login_flow(driver):
    driver.get(BASE_URL)  # Home já é login
    assert "Entre em sua conta do diário de ciclos menstruais" in driver.page_source, "Página de login não encontrada."
    print("Página de login OK")

    # Preenche campos de login (ajuste os nomes dos inputs conforme seu form)
    username_input = driver.find_element(By.NAME, "username")
    password_input = driver.find_element(By.NAME, "password")
    username_input.send_keys("usuario_teste")
    password_input.send_keys("senha_teste")
    password_input.send_keys(Keys.RETURN)
    time.sleep(1)
    # Verifica mensagem de erro ou redirecionamento
    if "Usuário ou senha inválidos" in driver.page_source or "Erro ao fazer login" in driver.page_source:
        print("Login inválido detectado corretamente")
    else:
        print("Login pode ter sido bem-sucedido ou mensagem diferente")


def test_register_flow(driver):
    driver.get(BASE_URL + "/register")
    assert "Criar conta" in driver.page_source
    print("Página de cadastro OK")

    # Preenche campos de cadastro (ajuste os nomes dos inputs conforme seu form)
    username_input = driver.find_element(By.NAME, "username")
    email_input = driver.find_element(By.NAME, "email")
    password_input = driver.find_element(By.NAME, "password")
    password2_input = driver.find_element(By.NAME, "password2")
    username_input.send_keys("usuario_selenium")
    email_input.send_keys("selenium@example.com")
    password_input.send_keys("senha1234")
    password2_input.send_keys("senha1234")
    password2_input.send_keys(Keys.RETURN)
    time.sleep(1)
    # Verifica mensagem de sucesso ou erro
    if "Conta criada" in driver.page_source or "sucesso" in driver.page_source:
        print("Cadastro realizado com sucesso!")
    elif "já existe" in driver.page_source or "Erro" in driver.page_source:
        print("Cadastro falhou (usuário já existe ou erro detectado)")
    else:
        print("Resultado do cadastro não detectado")


def main():
    driver = webdriver.Chrome(options=chrome_options)
    try:
        test_homepage(driver)
        test_login_flow(driver)
        test_register_flow(driver)
        print("\nTodos os testes Selenium executados!")
    finally:
        driver.quit()

if __name__ == "__main__":
    main() 