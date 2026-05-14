from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Autor(Base):
    __tablename__ = "autores"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    nacionalidade = Column(String)
    
    # Relação: Um autor tem muitos livros
    livros = relationship("Livro", back_populates="dono_do_livro")

class Livro(Base):
    __tablename__ = "livros"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    ano = Column(Integer)
    autor_id = Column(Integer, ForeignKey("autores.id"))

    # Relação: O livro pertence a um autor
    dono_do_livro = relationship("Autor", back_populates="livros")