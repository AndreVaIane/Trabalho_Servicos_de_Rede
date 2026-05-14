FROM python:3.9

# Define onde o código vai morar no container
WORKDIR /backend

# Copia e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto dos arquivos
COPY . .

# Comando para rodar: aponta para a pasta app e o arquivo main
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]