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

// 2. Listar Livros com Nome do Autor e botões de ação
async function load() {
    const lista = document.getElementById('lista');
    if (!lista) return;

    try {
        const res = await fetch('/api/livros');
        const livros = await res.json();
        lista.innerHTML = '';

        livros.forEach(l => {
            // Pegamos o nome do autor que o Backend agora envia no "dono_do_livro"
            const nomeAutor = l.dono_do_livro ? l.dono_do_livro.nome : 'Desconhecido';
            
            lista.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; background: #25262B; margin-bottom: 10px; padding: 15px; border-radius: 8px;">
                    <div style="color: white;">
                        <strong>${l.titulo}</strong> (${l.ano})<br>
                        <small style="color: #925FE2;">Autor: ${nomeAutor}</small>
                    </div>
                    <div>
                        <button onclick="prepararEdicao(${l.id}, '${l.titulo}', ${l.ano}, ${l.autor_id})" style="width: auto; padding: 5px 10px; background: #f39c12; margin-right: 5px;">Editar</button>
                        <button onclick="del(${l.id})" style="width: auto; padding: 5px 10px; background: #e74c3c;">Excluir</button>
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

function prepararEdicao(id, titulo, ano, autor_id) {
    const novoTitulo = prompt("Novo Título:", titulo);
    const novoAno = prompt("Novo Ano:", ano);
    if(novoTitulo && novoAno) {
        executarEdicao(id, novoTitulo, novoAno, autor_id);
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
carregarAutoresNoSelect();// 1. Carregar Autores no Dropdown (para a tela de cadastro de livro)
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

// 2. Listar Livros com Nome do Autor e botões de ação
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
            // Puxa o nome do autor que vem do Backend
            const nomeAutor = l.dono_do_livro ? l.dono_do_livro.nome : 'Desconhecido';
            
            lista.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; background: #25262B; margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 4px solid #925FE2;">
                    <div style="color: #FCFDFF;">
                        <strong>${l.titulo}</strong> (${l.ano})<br>
                        <small style="color: #925FE2;">Autor: ${nomeAutor}</small>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-acao btn-editar" onclick="prepararEdicao(${l.id}, '${l.titulo}', ${l.ano}, ${l.autor_id})">Editar</button>
                        <button class="btn-acao btn-excluir" onclick="del(${l.id})">Excluir</button>
                    </div>
                </li>`;
        });
    } catch (e) { console.error(e); }
}async function load() {
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
            // Puxa o nome do autor que vem do Backend
            const nomeAutor = l.dono_do_livro ? l.dono_do_livro.nome : 'Desconhecido';
            
            lista.innerHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; background: #25262B; margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 4px solid #925FE2;">
                    <div style="color: #FCFDFF;">
                        <strong>${l.titulo}</strong> (${l.ano})<br>
                        <small style="color: #925FE2;">Autor: ${nomeAutor}</small>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn-acao btn-editar" onclick="prepararEdicao(${l.id}, '${l.titulo}', ${l.ano}, ${l.autor_id})">Editar</button>
                        <button class="btn-acao btn-excluir" onclick="del(${l.id})">Excluir</button>
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

function prepararEdicao(id, titulo, ano, autor_id) {
    const novoTitulo = prompt("Novo Título:", titulo);
    const novoAno = prompt("Novo Ano:", ano);
    if(novoTitulo && novoAno) {
        executarEdicao(id, novoTitulo, novoAno, autor_id);
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