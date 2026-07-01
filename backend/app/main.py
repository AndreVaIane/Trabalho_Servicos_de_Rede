from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
import time
from . import models, database, schemas, seed
from .logger import send_to_loki

app = FastAPI(title="API Sistema de Biblioteca")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    send_to_loki("info", f"[{request.method}] {request.url.path} - Status: {response.status_code}")
    return response

# Evento que roda assim que o servidor liga
@app.on_event("startup")
async def startup_event():
    # Loop para esperar o banco de dados estar pronto
    for i in range(10):
        try:
            print(f"Tentativa {i+1}: Conectando ao banco...")
            models.Base.metadata.create_all(bind=database.engine)
            seed.seed_db()
            print("Conectado e banco populado com sucesso!")
            break
        except Exception as e:
            print(f"Banco ainda não pronto, esperando... ({e})")
            time.sleep(3) # Espera 3 segundos antes de tentar de novo

# --- ROTAS ---
@app.get("/autores", response_model=List[schemas.Autor])
def listar_autores(db: Session = Depends(database.get_db)):
    return db.query(models.Autor).all()

@app.post("/autores", response_model=schemas.Autor)
def criar_autor(autor: schemas.AutorCreate, db: Session = Depends(database.get_db)):
    novo_autor = models.Autor(nome=autor.nome, nacionalidade=autor.nacionalidade)
    db.add(novo_autor)
    db.commit()
    db.refresh(novo_autor)
    return novo_autor

@app.get("/livros", response_model=List[schemas.Livro])
def listar_livros(db: Session = Depends(database.get_db)):
    return db.query(models.Livro).all()

@app.post("/livros", response_model=schemas.Livro)
def criar_livro(livro: schemas.LivroCreate, db: Session = Depends(database.get_db)):
    novo_livro = models.Livro(**livro.dict())
    db.add(novo_livro)
    db.commit()
    db.refresh(novo_livro)
    return novo_livro

@app.put("/livros/{livro_id}", response_model=schemas.Livro)
def atualizar_livro(livro_id: int, livro: schemas.LivroCreate, db: Session = Depends(database.get_db)):
    db_livro = db.query(models.Livro).filter(models.Livro.id == livro_id).first()
    if not db_livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    db_livro.titulo = livro.titulo
    db_livro.ano = livro.ano
    db_livro.autor_id = livro.autor_id
    db.commit()
    db.refresh(db_livro)
    return db_livro

@app.delete("/livros/{livro_id}")
def deletar_livro(livro_id: int, db: Session = Depends(database.get_db)):
    db_livro = db.query(models.Livro).filter(models.Livro.id == livro_id).first()
    if not db_livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    db.delete(db_livro)
    db.commit()
    return {"status": "removido"}