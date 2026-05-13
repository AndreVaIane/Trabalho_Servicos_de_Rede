from fastapi import FastAPI

app = FastAPI(title="API Sistema de Biblioteca")

# Rota de teste para garantir que o NGINX está redirecionando certo
@app.get("/api/status")
def ler_status():
    return {"status": "Backend FastAPI rodando!", "banco_conectado": "Pendente"}