from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, database

# Cria as tabelas no banco de dados automaticamente
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="API Sistema de Biblioteca")

# Rota de teste
@app.get("/api/status")
def ler_status():
    return {"status": "Backend FastAPI rodando!", "banco_conectado": "Sim, tabelas criadas!"}

# Exemplo rápido de uma rota para o frontend puxar os livros
@app.get("/api/livros")
def listar_livros(db: Session = Depends(database.get_db)):
    livros = db.query(models.Livro).all()
    return livros