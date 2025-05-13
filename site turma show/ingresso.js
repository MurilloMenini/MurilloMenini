document.getElementById("comprar-btn").addEventListener("click", function () {
  const novoItem = {
    nome: "Ingresso Turma Show",
    preco: 50.0,
    quantidade: 1,
    imagem: "imagens/ingresso.jpg" // ajuste o caminho conforme sua pasta
  };

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  const existente = carrinho.find(item => item.nome === novoItem.nome);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push(novoItem);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  window.location.href = "carrinho.html";
});
