// As tarefas são recuperadas do navegador ao abrir a página.
let tarefas = JSON.parse(localStorage.getItem("minhasTarefas")) || [];
let filtroAtual = "todas";
function salvarTarefas() {
  localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
}
function renderizar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  tarefas
    .filter(
      (t) =>
        filtroAtual === "todas" ||
        (filtroAtual === "pendentes" && !t.concluida) ||
        (filtroAtual === "concluidas" && t.concluida),
    )
    .forEach((tarefa) => {
      const item = document.createElement("li");
      item.className = "tarefa " + (tarefa.concluida ? "concluida" : "");
      item.innerHTML = `<input type="checkbox" ${tarefa.concluida ? "checked" : ""} aria-label="Concluir tarefa"><span>${tarefa.texto}</span><button class="excluir">Excluir</button>`;
      item.querySelector("input").addEventListener("change", () => {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefas();
        renderizar();
      });
      item.querySelector(".excluir").addEventListener("click", () => {
        tarefas = tarefas.filter((t) => t.id !== tarefa.id);
        salvarTarefas();
        renderizar();
      });
      lista.appendChild(item);
    });
  const restantes = tarefas.filter((t) => !t.concluida).length;
  document.getElementById("contador").textContent =
    `${restantes} tarefa(s) restante(s)`;
}
document.getElementById("form-tarefa").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const campo = document.getElementById("nova-tarefa");
  tarefas.push({ id: Date.now(), texto: campo.value.trim(), concluida: false });
  campo.value = "";
  salvarTarefas();
  renderizar();
});
document.querySelectorAll("#filtros button").forEach((botao) =>
  botao.addEventListener("click", () => {
    document
      .querySelectorAll("#filtros button")
      .forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    filtroAtual = botao.dataset.filtro;
    renderizar();
  }),
);
renderizar();
