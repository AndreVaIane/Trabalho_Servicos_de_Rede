from .database import SessionLocal, engine
from . import models

def seed_db():
    # Cria as tabelas caso não existam
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()

    # Verifica se já existem dados para não duplicar
    if db.query(models.Autor).first():
        print("O banco de dados já possui dados. Pulando população.")
        db.close()
        return

    print("Populando o banco de dados...")

    # 1. Criar Autores
    autor1 = models.Autor(nome="Machado de Assis", nacionalidade="Brasileiro")
    autor2 = models.Autor(nome="J.K. Rowling", nacionalidade="Britânica")
    autor3 = models.Autor(nome="George R.R. Martin", nacionalidade="Americano")

    db.add_all([autor1, autor2, autor3])
    db.commit() # Commit aqui para gerar os IDs dos autores

    # 2. Criar Livros (Vinculados aos IDs dos autores criados)
    livros = [
        models.Livro(titulo="Dom Casmurro", ano=1899, autor_id=autor1.id),
        models.Livro(titulo="Memórias Póstumas de Brás Cubas", ano=1881, autor_id=autor1.id),
        models.Livro(titulo="Harry Potter e a Pedra Filosofal", ano=1997, autor_id=autor2.id),
        models.Livro(titulo="A Guerra dos Tronos", ano=1996, autor_id=autor3.id)
    ]

    db.add_all(livros)
    db.commit()
    db.close()
    print("Sucesso! Banco de dados populado com exemplos.")

if __name__ == "__main__":
    seed_db()