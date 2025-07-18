FROM python:3.12-slim

# Instala dependências do Chrome e ChromeDriver
RUN apt-get update && \
    apt-get install -y wget unzip curl && \
    wget -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y /tmp/chrome.deb && \
    rm /tmp/chrome.deb && \
    CHROME_VERSION=$(google-chrome --version | awk '{print $3}') && \
    wget -O /tmp/chromedriver.zip "https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${CHROME_VERSION}/linux64/chromedriver-linux64.zip" && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    mv /usr/local/bin/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver && \
    chmod +x /usr/local/bin/chromedriver && \
    rm -rf /tmp/chromedriver.zip /usr/local/bin/chromedriver-linux64

# Instala selenium
RUN pip install selenium

WORKDIR /app
COPY . .

CMD ["python", "test_e2e_frontend.py"] 