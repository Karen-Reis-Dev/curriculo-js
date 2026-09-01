// A expressão guarda os números e operadores digitados.
let expressao = "";
const tela = document.getElementById("tela");

function mostrar(texto) {
  tela.textContent = texto || "0";
}

document.querySelectorAll("button").forEach((botao) => {
  botao.addEventListener("click", () => {
    const valor = botao.dataset.valor;
    const acao = botao.dataset.acao;

    if (valor) {
      const ultimoCaractere = expressao.slice(-1);
      const operadores = "+-*/%";

      if (operadores.includes(valor) && operadores.includes(ultimoCaractere)) {
        expressao = expressao.slice(0, -1);
      }

      expressao += valor;
      mostrar(expressao.replaceAll("*", "×").replaceAll("/", "÷"));
    }

    if (acao === "limpar") {
      expressao = "";
      mostrar("0");
    }

    if (acao === "apagar") {
      expressao = expressao.slice(0, -1);
      mostrar(expressao);
    }

    if (acao === "resultado") {
      try {
        if (/\/0(?!\.)/.test(expressao)) {
          throw new Error("Não é possível dividir por zero.");
        }

        const expressaoCalculavel = expressao.replace(
          /(\d+(?:\.\d+)?)%/g,
          "($1/100)",
        );

        // A expressão contém apenas números e operadores dos botões.
        const resultado = Function(
          '"use strict"; return (' + expressaoCalculavel + ")",
        )();

        if (!Number.isFinite(resultado)) {
          throw new Error("Resultado inválido.");
        }

        expressao = String(Math.round(resultado * 100000000) / 100000000);
        mostrar(expressao);
      } catch (erro) {
        mostrar("Erro");
        expressao = "";
      }
    }
  });
});
