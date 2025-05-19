// script_index.js

// Busca produtos ao enviar o formulário de busca
function buscarProduto(event) {
  event.preventDefault();
  const termo = document.getElementById("campo-busca").value.trim();
  if (termo) {
    window.location.href = `categoria.html?busca=${encodeURIComponent(termo)}`;
  }
}

// Exibe o nome do usuário logado no topo
const info = document.getElementById("usuario-info");
const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

if (usuario) {
  info.innerHTML = `
    👤 Olá, ${usuario.nome}
    <button onclick="logout()" style="margin-top: 5px; padding: 6px 10px; background: #ccc; border: none; border-radius: 4px; cursor: pointer;">
      Sair
    </button>
  `;
} else {
  info.innerHTML = `<a href="login.html" style="text-decoration: none; color: #000;">👤 Entrar</a>`;
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload();
}

// Carregamento dos produtos e categorias + carrinho

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-produtos");
  const menu = document.querySelector(".menu-categorias");
  const carrinhoLateral = document.getElementById("carrinho-lateral");
  const carrinhoItens = document.getElementById("carrinho-itens");
  const alerta = document.getElementById("alerta-carrinho");
  const subtotalSpan = document.getElementById("subtotal");

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const categorias = JSON.parse(localStorage.getItem("categorias")) || [];

  // Mostrar categorias
  menu.innerHTML = "";
  categorias.forEach(cat => {
    const link = document.createElement("a");
    link.href = `categoria.html?categoria=${encodeURIComponent(cat)}`;
    link.textContent = cat;
    menu.appendChild(link);
  });

  // Mostrar produtos
  lista.innerHTML = "";
  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.className = "produto";
    const slug = produto.slug;

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img">
      <a href="produto.html?produto=${encodeURIComponent(slug)}">
        <h3>${produto.nome}</h3>
      </a>
      <p class="preco">R$ ${produto.valor.toFixed(2)}</p>
      <p class="parcela">3x de R$ ${(produto.valor / 3).toFixed(2)}</p>
      <button class="comprar">COMPRAR</button>
    `;

    card.querySelector(".comprar").addEventListener("click", () => {
      adicionarAoCarrinho(produto);
    });

    lista.appendChild(card);
  });

  // Adicionar ao carrinho
  function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const existente = carrinho.find(p => p.slug === produto.slug);
    if (existente) {
      existente.quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarCarrinho();
    mostrarAlerta();
  }

  // Mostrar carrinho lateral
  function mostrarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinhoItens.innerHTML = "";
    let subtotal = 0;

    carrinho.forEach((item, index) => {
      subtotal += item.valor * item.quantidade;

      const div = document.createElement("div");
      div.className = "carrinho-item";
      div.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" />
        <div class="item-info">
          <h4>${item.nome}</h4>
          <p>R$ ${(item.valor * item.quantidade).toFixed(2)}</p>
          <div class="qtd-controle">
            <button onclick="atualizarQtd(${index}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="atualizarQtd(${index}, 1)">+</button>
          </div>
        </div>
      `;
      carrinhoItens.appendChild(div);
    });

    subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
    carrinhoLateral.classList.add("aberto");
  }

  // Atualizar quantidade
  window.atualizarQtd = (index, delta) => {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
      carrinho.splice(index, 1);
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    mostrarCarrinho();
  };

  // Fechar carrinho
  window.fecharCarrinho = () => {
    carrinhoLateral.classList.remove("aberto");
  };

  // Finalizar compra no WhatsApp
  window.finalizarCompra = () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho.length === 0) return;
    let mensagem = "Olá! Gostaria de finalizar a compra:\n";
    carrinho.forEach(item => {
      mensagem += `• ${item.nome} - ${item.quantidade}x - R$ ${(item.valor * item.quantidade).toFixed(2)}\n`;
    });
    const total = carrinho.reduce((t, i) => t + i.valor * i.quantidade, 0);
    mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
    const url = `https://wa.me/5521987754974?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  // Mostrar alerta verde temporariamente
  function mostrarAlerta() {
    alerta.style.display = "block";
    setTimeout(() => {
      alerta.style.display = "none";
    }, 2500);
  }

  // Botão ✕ para fechar carrinho
  document.getElementById("fechar-carrinho").addEventListener("click", fecharCarrinho);
});
