document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("itens-carrinho");
  let dados = JSON.parse(localStorage.getItem("carrinho")) || [];

  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(dados));
  }

  function renderCarrinho() {
    container.innerHTML = "";
    if (dados.length === 0) {
      container.innerHTML = "<p>Seu carrinho está vazio.</p>";
      return;
    }

    dados.forEach((item, carrinho) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <img src="${item.imagem}" alt="${item.nome}" style="width: 100px; height: auto; border-radius: 8px;" />
          <div>
            <p><strong>${item.nome}</strong></p>
            <p>R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            <button onclick="diminuir(${carrinho})">–</button>
            <button onclick="aumentar(${carrinho})">+</button>
          </div>
        </div>
        <hr/>
      `;
      container.appendChild(div);
    });
  }

  window.aumentar = function(carrinho) {
    dados[carrinho].quantidade += 1;
    salvarCarrinho();
    renderCarrinho();
  };

  window.diminuir = function(carrinho) {
    if (dados[carrinho].quantidade > 1) {
      dados[carrinho].quantidade -= 1;
    } else {
      dados.splice(carrinho, 1);
    }
    salvarCarrinho();
    renderCarrinho();
  };

  window.remover = function(carrinho) {
    dados.splice(carrinho, 1);
    salvarCarrinho();
    renderCarrinho();
  };

  // Função para calcular o valor total da compra com base nos itens no carrinho
  function calcularTotal() {
    return dados.reduce((total, item) => total + (item.preco * item.quantidade), 0).toFixed(2);
  }

  // Função para gerar o código Pix com o valor correto
  function gerarCodigoPix() {
    const totalCompra = calcularTotal(); // Obtém o valor total da compra
    const valorPix = (parseFloat(totalCompra) * 100).toFixed(0); // Converte para centavos

    // Código Pix com o valor e outros dados obrigatórios
    const codigoPix = `
      00020126580014BR.GOV.BCB.PIX013681b81685-e9ad-4c3b-b6f4-aff2e9c2451d5204000053039865802BR5925Murillo Menini de Almeida6009SAO PAULO62140510QN90ujRdrp63047AC5
      52040000${valorPix}63047AC5
    `;

    return codigoPix.trim();
  }

  // Função ao clicar no "Finalizar Compra"
  document.getElementById("finalizar").addEventListener("click", () => {
    const codigoPix = gerarCodigoPix(); // Gera o código Pix com valor dinâmico

    // Gera o QR Code com o código Pix completo
    new QRCode(document.getElementById("qrcode"), codigoPix);

    // Exibe o QR Code e o botão de copiar código Pix
    document.getElementById("qrcode").style.display = "block";
    document.getElementById("codigo-pix").textContent = `R$ ${calcularTotal()}`;  // Exibe o valor da compra
    document.getElementById("copiarPix").style.display = "block";

    alert("Compra finalizada com sucesso!");
    localStorage.removeItem("carrinho");
    dados = [];
    renderCarrinho();
  });

  document.getElementById("voltar").addEventListener("click", () => {
    window.location.href = "ingresso.html";
  });

  renderCarrinho();
});