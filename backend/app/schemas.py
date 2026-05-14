from pydantic import BaseModel
from typing import List, Optional

class AutorBase(BaseModel):
    nome: str
    nacionalidade: Optional[str] = None

class AutorCreate(AutorBase):
    pass

class Autor(AutorBase):
    id: int
    class Config:
        from_attributes = True

class LivroBase(BaseModel):
    titulo: str
    ano: int
    autor_id: int

class LivroCreate(LivroBase):
    pass

class Livro(LivroBase):
    id: int
    dono_do_livro: Optional[Autor] = None 
    class Config:
        from_attributes = True