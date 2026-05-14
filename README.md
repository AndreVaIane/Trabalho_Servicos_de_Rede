# 📚 Acervo Digital - Sistema de Gestão de Biblioteca

Este projeto é um sistema de gestão de biblioteca desenvolvido como trabalho acadêmico para a disciplina de **Serviços de Redes para Internet**, do curso de **Sistemas de Informação** do **Instituto Federal do Espírito Santo (IFES)**. A aplicação utiliza uma arquitetura de microsserviços conteinerizada para demonstrar conceitos de redes, isolamento de serviços e orquestração.

## 🚀 Tecnologias Utilizadas

O sistema foi construído com as seguintes tecnologias:

* **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11) para a construção da API REST.
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) para persistência de dados.
* **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) para comunicação entre a aplicação e o banco.
* **Servidor Web / Proxy Reverso:** [Nginx](https://www.nginx.com/) para servir o frontend estático e rotear requisições para a API.
* **Orquestração:** [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/).
* **Frontend:** HTML5, CSS3 (Custom Dark Mode) e JavaScript Assíncrono (Fetch API).

## 🛠️ Estrutura do Projeto

* `backend/`: Código-fonte da API, modelos do banco de dados e lógica de população inicial.
* `nginx/`: Configurações do servidor Nginx e arquivos do frontend (`html/`).
* `docker-compose.yml`: Orquestração dos serviços e definição da rede interna.
* `.env`: Configuração de variáveis de ambiente (como a senha do banco).

## 📋 Pré-requisitos

Para rodar o projeto, é necessário ter instalado:
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

## ⚙️ Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/AndreVaIane/Trabalho_Servicos_de_Rede.git
    cd Trabalho_Servicos_de_Rede
    ```

2.  **Variáveis de Ambiente:**
    O projeto utiliza um arquivo `.env` para gerenciar a senha do banco de dados (`20241SI041`).

3.  **Inicie os containers:**
    ```bash
    docker compose up --build -d
    ```

## 🖥️ Utilização

### Acesso ao Sistema
* **Frontend:** [http://127.0.0.1/] (Acessível via porta 80 mapeada pelo Nginx).

### Funcionalidades Implementadas
* **Acervo (Início):** Visualização de livros cadastrados com carregamento automático de dados de exemplo (Seed).
* **Cadastro de Autores:** Registro de novos autores com nome e nacionalidade.
* **Cadastro de Livros:** Registro de títulos vinculados a autores cadastrados.
* **Edição de Títulos:** Janela personalizada para atualizar nome e ano do livro.
* **Exclusão:** Remoção de registros do banco de dados.

## 🌐 Configuração de Rede

Os serviços estão isolados em uma rede bridge dedicada chamada `netatividade01`. O banco de dados PostgreSQL não expõe portas para o hospedeiro, sendo acessível apenas pelo Backend dentro da rede interna, enquanto o Nginx atua como o único ponto de entrada para o usuário final.

---
**Instituto Federal do Espírito Santo (IFES)** *Bacharelado em Sistemas de Informação* *Disciplina: Serviços de Redes para Internet*