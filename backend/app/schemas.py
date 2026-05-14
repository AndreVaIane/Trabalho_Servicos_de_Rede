from pydantic import BaseModel
from typing import List, Optional

class LivroBase(BaseModel):
    titulo: str
    ano: int
    autor_id: int

class LivroCreate(LivroBase):
    pass

class Livro(LivroBase):
    id: int
    class Config:
        orm_mode = True

class AutorBase(BaseModel):
    nome: str
    nacionalidade: Optional[str] = None

class AutorCreate(AutorBase):
    pass

class Autor(AutorBase):
    id: int
    livros: List[Livro] = []
    class Config:
        orm_mode = True