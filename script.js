let carrinho = [];

function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const ul = document.getElementById('itens-carrinho');
    ul.innerHTML = '';
    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });

    const mensagem = encodeURIComponent(`Olá! Gostaria de comprar: \n${carrinho.join('\n')}`);
    document.getElementById('finalizar').href = `https://wa.me/5521987754974?text=${mensagem}`;
}