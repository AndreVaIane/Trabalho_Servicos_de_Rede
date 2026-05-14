async function load() {
    const res = await fetch('/api/livros');
    const livros = await res.json();
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    livros.forEach(l => {
        lista.innerHTML += `<li><strong>${l.titulo}</strong> (Ano: ${l.ano}) - Autor ID: ${l.autor_id} 
        <button class="btn-del" onclick="del(${l.id})">Deletar</button></li>`;
    });
}

async function addAutor() {
    const nome = document.getElementById('nomeAutor').value;
    const nacionalidade = document.getElementById('nacio').value;
    await fetch('/api/autores', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome, nacionalidade})
    });
    alert('Autor criado! Anote o ID para o livro.');
}

async function addLivro() {
    const titulo = document.getElementById('titulo').value;
    const ano = document.getElementById('ano').value;
    const autor_id = document.getElementById('idAutor').value;
    await fetch('/api/livros', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({titulo, ano, autor_id})
    });
    load();
}

async function del(id) {
    await fetch(`/api/livros/${id}`, { method: 'DELETE' });
    load();
}

load();