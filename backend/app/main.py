from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import models, database, schemas

# Cria as tabelas no banco de dados automaticamente
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="API Sistema de Biblioteca")

# --- ROTAS DE AUTORES ---
@app.post("/autores", response_model=schemas.Autor)
def criar_autor(autor: schemas.AutorCreate, db: Session = Depends(database.get_db)):
    novo_autor = models.Autor(nome=autor.nome, nacionalidade=autor.nacionalidade)
    db.add(novo_autor)
    db.commit()
    db.refresh(novo_autor)
    return novo_autor

@app.get("/autores", response_model=List[schemas.Autor])
def listar_autores(db: Session = Depends(database.get_db)):
    return db.query(models.Autor).all()

# --- ROTAS DE LIVROS ---
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

@app.delete("/livros/{livro_id}")
def deletar_livro(livro_id: int, db: Session = Depends(database.get_db)):
    db_livro = db.query(models.Livro).filter(models.Livro.id == livro_id).first()
    if not db_livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    db.delete(db_livro)
    db.commit()
    return {"status": "removido"}

@app.put("/livros/{livro_id}", response_model=schemas.Livro)
def atualizar_livro(livro_id: int, livro_atualizado: schemas.LivroCreate, db: Session = Depends(database.get_db)):
    db_livro = db.query(models.Livro).filter(models.Livro.id == livro_id).first()
    if not db_livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    # Atualiza os dados
    db_livro.titulo = livro_atualizado.titulo
    db_livro.ano = livro_atualizado.ano
    db_livro.autor_id = livro_atualizado.autor_id
    
    db.commit()
    db.refresh(db_livro)
    return db_livro