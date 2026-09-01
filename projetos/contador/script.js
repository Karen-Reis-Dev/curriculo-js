// Selecionamos os elementos que serão manipulados.
const valorNaTela = document.getElementById("valor");
let valor = 0;
function atualizarContador() {
  valorNaTela.textContent = valor;
  valorNaTela.className = valor > 0 ? "positivo" : valor < 0 ? "negativo" : "";
}
document.getElementById("aumentar").addEventListener("click", () => {
  valor++;
  atualizarContador();
});
document.getElementById("diminuir").addEventListener("click", () => {
  valor--;
  atualizarContador();
});
document.getElementById("zerar").addEventListener("click", () => {
  valor = 0;
  atualizarContador();
});
