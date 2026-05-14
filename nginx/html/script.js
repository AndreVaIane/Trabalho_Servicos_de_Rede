// 1. Carregar Autores no Dropdown (para a tela de cadastro de livro)
async function carregarAutoresNoSelect() {
    const select = document.getElementById('autor_id');
    if (!select) return;

    try {
        const res = await fetch('/api/autores');
        const autores = await res.json();
        select.innerHTML = '<option value="">Selecione um Autor</option>';
        autores.forEach(a => {
            select.innerHTML += `<option value="${a.id}">${a.nome}</option>`;
        });
    } catch (e) { console.error("Erro ao carregar autores", e); }
}

// 2. Listar Livros com Nome do Autor e BOTÕES
async function load() {
    const lista = document.getElementById('lista');
    if (!lista) return;

    try {
        const res = await fetch('/api/livros');
        const livros = await res.json();
        lista.innerHTML = '';

        if (livros.length === 0) {
            lista.innerHTML = '<li style="color: white; background: transparent; border: none;">Nenhum livro no acervo.</li>';
            return;
        }

        livros.forEach(l => {
            const nomeAutor = l.dono_do_livro ? l.dono_do_livro.nome : `ID: ${l.autor_id}`;
            
            lista.innerHTML += `
                <li>
                    <div style="text-align: left;">
                        <strong style="font-size: 1.1em;">${l.titulo}</strong> <span style="opacity: 0.7;">(${l.ano})</span><br>
                        <small style="color: #925FE2; font-weight: bold;">Autor: ${nomeAutor}</small>
                    </div>
                    <div style="display: flex;">
                        <button class="btn-acao" style="background-color: #2ecc71;" onclick="prepararEdicao(${l.id}, '${l.titulo}', ${l.ano}, ${l.autor_id})">Editar</button>
                        <button class="btn-acao" style="background-color: #e74c3c;" onclick="del(${l.id})">Excluir</button>
                    </div>
                </li>`;
        });
    } catch (e) { console.error(e); }
}

// 3. Funções de Cadastro
async function addAutor() {
    const nome = document.getElementById('nome').value;
    const nacionalidade = document.getElementById('nacionalidade').value;
    const res = await fetch('/api/autores', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome, nacionalidade})
    });
    if(res.ok) { alert('Autor cadastrado!'); window.location.href="index.html"; }
}

async function addLivro() {
    const titulo = document.getElementById('titulo').value;
    const ano = document.getElementById('ano').value;
    const autor_id = document.getElementById('autor_id').value;

    const res = await fetch('/api/livros', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({titulo, ano: parseInt(ano), autor_id: parseInt(autor_id)})
    });
    if(res.ok) { alert('Livro cadastrado!'); window.location.href="index.html"; }
}

// 4. Edição e Exclusão
async function del(id) {
    if(confirm("Deseja excluir este livro?")) {
        await fetch(`/api/livros/${id}`, { method: 'DELETE' });
        load();
    }
}

// Função para abrir o modal e preencher os dados atuais
function prepararEdicao(id, titulo, ano, autor_id) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_titulo').value = titulo;
    document.getElementById('edit_ano').value = ano;
    document.getElementById('edit_autor_id').value = autor_id;
    
    // Mostra o modal
    document.getElementById('modalEdicao').style.display = 'flex';
}

// Função para esconder o modal
function fecharModal() {
    document.getElementById('modalEdicao').style.display = 'none';
}

// Função que envia a atualização para o Backend (incluindo o Ano)
async function salvarEdicao() {
    const id = document.getElementById('edit_id').value;
    const titulo = document.getElementById('edit_titulo').value;
    const ano = document.getElementById('edit_ano').value;
    const autor_id = document.getElementById('edit_autor_id').value;

    try {
        const res = await fetch(`/api/livros/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                titulo: titulo,
                ano: parseInt(ano),
                autor_id: parseInt(autor_id)
            })
        });

        if (res.ok) {
            fecharModal();
            load(); // Recarrega a lista na tela
        } else {
            alert("Erro ao salvar alterações.");
        }
    } catch (e) {
        console.error("Erro na requisição PUT:", e);
    }
}

async function executarEdicao(id, titulo, ano, autor_id) {
    await fetch(`/api/livros/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({titulo, ano: parseInt(ano), autor_id})
    });
    load();
}

// Inicialização
load();
carregarAutoresNoSelect();