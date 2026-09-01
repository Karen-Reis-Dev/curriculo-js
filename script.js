// ========================================
// DADOS PESSOAIS E LOCALSTORAGE
// ========================================
const dadosPadrao = {
  nome: "Karen Silva dos Reis",
  cargo: "Técnica em Desenvolvimento de Sistemas",
  cidade: "Juiz de Fora - MG",
  curso: "Técnico em Desenvolvimento de Sistemas",
  objetivo: "Primeira oportunidade em tecnologia",
  descricao:
    "Técnica em Desenvolvimento de Sistemas, com 19 anos, buscando minha primeira oportunidade na área de tecnologia. Tenho facilidade para aprender novas ferramentas, trabalho bem em equipe e sou apaixonada por resolver problemas através da programação.",
};
let dadosPessoais =
  JSON.parse(localStorage.getItem("dadosPessoais")) || dadosPadrao;

function salvarNoNavegador(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function atualizarDadosNaTela() {
  document.getElementById("nome-hero").textContent = dadosPessoais.nome;
  document.getElementById("nome-rodape").textContent = dadosPessoais.nome;
  document.getElementById("descricao-hero").textContent =
    dadosPessoais.descricao;
  document.getElementById("descricao-sobre").textContent =
    dadosPessoais.descricao;
  document.getElementById("info-cidade").textContent = dadosPessoais.cidade;
  document.getElementById("contato-cidade").textContent = dadosPessoais.cidade;
  document.getElementById("info-curso").textContent = dadosPessoais.curso;
  document.getElementById("info-objetivo").textContent = dadosPessoais.objetivo;
}

// ========================================
// MENU E ROLAGEM
// ========================================
const botaoMenu = document.getElementById("botao-menu"),
  menu = document.getElementById("menu");
botaoMenu.addEventListener("click", () => {
  menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", menu.classList.contains("aberto"));
});
document
  .querySelectorAll(".menu a")
  .forEach((link) =>
    link.addEventListener("click", () => menu.classList.remove("aberto"))
  );

const secoes = document.querySelectorAll("main section[id]");
window.addEventListener("scroll", () => {
  let id = "inicio";
  secoes.forEach((secao) => {
    if (scrollY >= secao.offsetTop - 160) id = secao.id;
  });
  document
    .querySelectorAll(".menu a")
    .forEach((link) =>
      link.classList.toggle("ativo", link.getAttribute("href") === "#" + id)
    );
});

// ========================================
// TEMA
// ========================================
const botaoTema = document.getElementById("botao-tema");
function aplicarTema(tema) {
  document.body.classList.toggle("escuro", tema === "escuro");
  botaoTema.textContent = tema === "escuro" ? "☀️" : "🌙";
  botaoTema.title = tema === "escuro" ? "Ativar tema claro" : "Ativar tema escuro";
  botaoTema.setAttribute("aria-label", botaoTema.title);
  localStorage.setItem("tema", tema);
}
botaoTema.addEventListener("click", () =>
  aplicarTema(document.body.classList.contains("escuro") ? "claro" : "escuro")
);
aplicarTema(localStorage.getItem("tema") || "claro");

// ========================================
// EFEITO DE DIGITAÇÃO
// ========================================
const cargos = [
  dadosPessoais.cargo,
  "Estudante de programação",
  "Desenvolvedora front-end iniciante",
  "Futura profissional de tecnologia",
];
let indiceCargo = 0,
  indiceLetra = 0,
  apagando = false;
function digitarCargo() {
  const atual = cargos[indiceCargo];
  document.getElementById("texto-digitacao").textContent = atual.slice(
    0,
    indiceLetra
  );
  if (!apagando) {
    indiceLetra++;
    if (indiceLetra > atual.length) {
      apagando = true;
      setTimeout(digitarCargo, 1300);
      return;
    }
  } else {
    indiceLetra--;
    if (indiceLetra < 0) {
      apagando = false;
      indiceCargo = (indiceCargo + 1) % cargos.length;
      indiceLetra = 0;
    }
  }
  setTimeout(digitarCargo, apagando ? 35 : 75);
}

// ========================================
// HABILIDADES (LISTA EM TÓPICOS)
// ========================================
const habilidades = [
  { nome: "HTML", icone: "🌐", categoria: "tecnologia" },
  { nome: "CSS", icone: "🎨", categoria: "tecnologia" },
  { nome: "JavaScript", icone: "⚡", categoria: "tecnologia" },
  { nome: "Git", icone: "📦", categoria: "tecnologia" },
  { nome: "GitHub", icone: "🐙", categoria: "tecnologia" },
  { nome: "Lógica de Programação", icone: "🧠", categoria: "tecnologia" },
  { nome: "Comunicação", icone: "💬", categoria: "pessoal" },
  { nome: "Trabalho em equipe", icone: "🤝", categoria: "pessoal" },
  { nome: "Proatividade", icone: "🚀", categoria: "pessoal" },
];

function carregarHabilidades(filtro = "todas") {
  const area = document.getElementById("lista-habilidades");
  area.innerHTML = "";
  habilidades
    .filter((item) => filtro === "todas" || item.categoria === filtro)
    .forEach((item) => {
      const div = document.createElement("div");
      div.className = "habilidade-item";
      div.innerHTML = `
        <span class="icone">${item.icone}</span>
        <span class="nome">${item.nome}</span>
        <span class="categoria-tag ${item.categoria}">${item.categoria}</span>
      `;
      area.appendChild(div);
    });
}

document.querySelectorAll("#filtros-habilidades button").forEach((botao) =>
  botao.addEventListener("click", () => {
    document
      .querySelectorAll("#filtros-habilidades button")
      .forEach((b) => b.classList.remove("ativo"));
    botao.classList.add("ativo");
    carregarHabilidades(botao.dataset.filtro);
  })
);

// ========================================
// PROJETOS (INTEGRAÇÃO COM GITHUB)
// ========================================

const GITHUB_USERNAME = "Karen-Reis-Dev";

async function carregarProjetosDoGitHub() {
  const area = document.getElementById("lista-projetos");
  area.innerHTML = `
    <div style="grid-column: 1/-1; text-align:center; padding:40px;">
      <i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--cor-terra);"></i>
      <p style="margin-top:12px; color:var(--cor-texto-claro);">Carregando projetos do GitHub...</p>
    </div>
  `;

  try {
    const resposta = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );

    if (!resposta.ok) {
      throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
    }

    const repositorios = await resposta.json();
    area.innerHTML = "";

    const meusRepos = repositorios.filter(repo => !repo.fork);

    if (meusRepos.length === 0) {
      area.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:40px; background:var(--cor-card); border-radius:16px; border:1px solid var(--borda);">
          <p style="font-size:1.2rem; color:var(--cor-texto);">📁 Nenhum repositório público encontrado</p>
          <p style="color:var(--cor-texto-claro); margin-top:8px;">Que tal criar seu primeiro projeto no GitHub?</p>
        </div>
      `;
      return;
    }

    const cores = [
      '#1B2A4A', '#2C3E6B', '#8B6B4D', '#A67B5B',
      '#3B5A8A', '#5C4A3A', '#1A1A1A', '#4A6A5A'
    ];

    meusRepos.forEach((repo, index) => {
      const card = document.createElement("article");
      card.className = "projeto-card";

      const cor = cores[index % cores.length];

      const linguagem = repo.language || "Não especificada";
      const estrelas = repo.stargazers_count;
      const forks = repo.forks_count;

      card.innerHTML = `
        <div class="projeto-icone" style="background: ${cor};">
          <i class="fab fa-github" style="font-size:2.5rem; opacity:0.15;"></i>
          <span style="position:absolute; font-size:1.8rem; font-weight:700; letter-spacing:-1px;">
            ${repo.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div class="projeto-corpo">
          <h3>
            <a href="${repo.html_url}" target="_blank" rel="noopener">
              ${repo.name.replace(/-/g, ' ')}
            </a>
          </h3>
          <p>${repo.description || 'Sem descrição disponível.'}</p>
          <div class="tags">
            <span class="tag"><i class="fas fa-code"></i> ${linguagem}</span>
            ${estrelas > 0 ? `<span class="tag"><i class="fas fa-star"></i> ${estrelas}</span>` : ''}
            ${forks > 0 ? `<span class="tag"><i class="fas fa-code-branch"></i> ${forks}</span>` : ''}
          </div>
          <div class="projeto-acoes">
            <a class="botao primario" href="${repo.html_url}" target="_blank" rel="noopener">
              <i class="fab fa-github"></i> Ver no GitHub
            </a>
            ${repo.homepage ? `<a class="botao secundario" href="${repo.homepage}" target="_blank" rel="noopener" style="background:transparent; border-color:var(--borda); color:var(--cor-texto);">
              <i class="fas fa-external-link-alt"></i> Site
            </a>` : ''}
          </div>
        </div>
      `;
      area.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar projetos do GitHub:", erro);
    area.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:40px; background:var(--cor-card); border-radius:16px; border:1px solid var(--borda);">
        <p style="font-size:1.5rem;">⚠️</p>
        <p style="font-weight:600; margin:8px 0; color:var(--cor-texto);">Não foi possível carregar os projetos</p>
        <p style="color:var(--cor-texto-claro); font-size:0.9rem;">${erro.message}</p>
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener" class="botao primario" style="margin-top:15px;">
          <i class="fab fa-github"></i> Ver perfil no GitHub
        </a>
      </div>
    `;
  }
}

// ========================================
// FORMULÁRIO, ANIMAÇÕES E INICIALIZAÇÃO
// ========================================
document.getElementById("form-contato").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const f = evento.currentTarget,
    mensagem = document.getElementById("mensagem-form");
  if (!f.checkValidity()) {
    mensagem.textContent = "Preencha todos os campos corretamente.";
    return;
  }
  mensagem.textContent =
    "Mensagem validada com sucesso! Obrigado pelo contato.";
  f.reset();
  setTimeout(() => (mensagem.textContent = ""), 5000);
});

const voltarTopo = document.getElementById("voltar-topo");
window.addEventListener("scroll", () =>
  voltarTopo.classList.toggle("visivel", scrollY > 500)
);
voltarTopo.addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" })
);

const observador = new IntersectionObserver(
  (entradas) =>
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) entrada.target.classList.add("visivel");
    }),
  { threshold: 0.12 }
);
document
  .querySelectorAll(".revelar")
  .forEach((item) => observador.observe(item));

document.getElementById("ano-atual").textContent = new Date().getFullYear();

// ========================================
// INICIALIZAÇÃO
// ========================================
atualizarDadosNaTela();
carregarHabilidades();
carregarProjetosDoGitHub();
digitarCargo();