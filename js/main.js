const lista = document.getElementById("lista-projetos");
const filtros = document.getElementById("filtros");
const modal = document.getElementById("modal-projeto");
const rotulos = { concluido: "Concluído", andamento: "Em andamento" };

function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto) el.textContent = texto;
  return el;
}

function imagem(src, alt, classe) {
  const img = criar("img", classe);
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  return img;
}

function link(texto, url) {
  const a = criar("a", "link-card", texto);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

function listaTags(tecnologias) {
  const ul = criar("ul", "tags tags-pequenas");
  tecnologias.forEach(t => ul.appendChild(criar("li", "", t)));
  return ul;
}

/* ---------- Card ---------- */
function cartao(p) {
  const card = criar("article", "card");
  const imgs = p.imagens || [];
  if (imgs.length) card.appendChild(imagem(imgs[0], "Captura de tela do projeto " + p.titulo, "card-img"));
  card.appendChild(criar("h3", "", p.titulo));
  card.appendChild(criar("p", "status status-" + p.status, rotulos[p.status] || p.status));
  card.appendChild(criar("p", "", p.descricao));
  card.appendChild(listaTags(p.tecnologias));
  const detalhes = criar("button", "btn-detalhes", "Ver detalhes");
  detalhes.type = "button";
  detalhes.addEventListener("click", () => abrirModal(p));
  card.appendChild(detalhes);
  return card;
}

/* ---------- Janela de detalhes com galeria ---------- */
function abrirModal(p) {
  const imgs = p.imagens || [];
  modal.replaceChildren();

  const fechar = criar("button", "modal-fechar", "Fechar");
  fechar.type = "button";
  fechar.addEventListener("click", () => modal.close());
  modal.appendChild(fechar);

  const titulo = criar("h3", "", p.titulo);
  titulo.id = "modal-titulo";
  modal.appendChild(titulo);
  modal.appendChild(criar("p", "status status-" + p.status, rotulos[p.status] || p.status));

  if (imgs.length) {
    const galeria = criar("div", "galeria");
    const principal = imagem(imgs[0], "Captura de tela 1 de " + p.titulo, "galeria-principal");
    galeria.appendChild(principal);
    if (imgs.length > 1) {
      const miniaturas = criar("div", "miniaturas");
      imgs.forEach((src, i) => {
        const b = criar("button", "miniatura");
        b.type = "button";
        b.setAttribute("aria-label", "Ver captura de tela " + (i + 1));
        b.setAttribute("aria-pressed", i === 0);
        b.appendChild(imagem(src, "", ""));
        b.addEventListener("click", () => {
          principal.src = src;
          principal.alt = "Captura de tela " + (i + 1) + " de " + p.titulo;
          miniaturas.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
        });
        miniaturas.appendChild(b);
      });
      galeria.appendChild(miniaturas);
    }
    modal.appendChild(galeria);
  }

  modal.appendChild(criar("p", "modal-texto", p.detalhes || p.descricao));
  modal.appendChild(listaTags(p.tecnologias));

  if (p.repo || p.demo) {
    const links = criar("div", "links");
    if (p.repo) links.appendChild(link("Código", p.repo));
    if (p.demo) links.appendChild(link("Ver online", p.demo));
    modal.appendChild(links);
  }
  modal.showModal();
}

modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

/* ---------- Lista e filtros ---------- */
function mostrar(filtro) {
  lista.replaceChildren();
  projetos
    .filter(p => filtro === "Todos" || p.tecnologias.includes(filtro))
    .forEach(p => lista.appendChild(cartao(p)));
}

function montarFiltros() {
  const todas = ["Todos", ...new Set(projetos.flatMap(p => p.tecnologias))];
  todas.forEach((nome, i) => {
    const b = criar("button", "filtro", nome);
    b.type = "button";
    b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", () => {
      filtros.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      mostrar(nome);
    });
    filtros.appendChild(b);
  });
}

montarFiltros();
mostrar("Todos");
document.getElementById("ano").textContent = new Date().getFullYear();

/* ---------- Vitrine: projetos em destaque, abaixo do menu ---------- */
function montarVitrine() {
  const alvo = document.getElementById("vitrine");
  if (!alvo) return;
  const itens = projetos.flatMap(p => (p.imagens || []).map(src => ({ src, p })));
  if (!itens.length) { alvo.hidden = true; return; }

  const janela = criar("div", "janela");
  janela.setAttribute("role", "region");
  janela.setAttribute("aria-roledescription", "carrossel");
  janela.setAttribute("aria-label", "Projetos em destaque");
  janela.tabIndex = -1;

  const barra = criar("div", "janela-barra");
  const prompt = criar("span", "janela-titulo");
  prompt.append(criar("span", "prompt", ">"), "projetos em destaque");
  const contador = criar("span", "janela-contador");
  contador.setAttribute("aria-hidden", "true");
  barra.append(prompt, contador);

  const palco = criar("div", "palco");
  const slides = itens.map(({ src, p }) => {
    const im = imagem(src, "Captura de tela do projeto " + p.titulo, "slide");
    palco.appendChild(im);
    return im;
  });
  const progresso = criar("span", "progresso");
  palco.appendChild(progresso);

  const legenda = criar("div", "janela-legenda");
  const info = criar("div", "janela-info");
  const titulo = criar("h3", "janela-nome");
  const status = criar("p", "status");
  const resumo = criar("p", "janela-resumo");
  info.append(titulo, status, resumo);

  const acoes = criar("div", "janela-acoes");
  const abrir = criar("button", "btn-detalhes", "Ver detalhes");
  abrir.type = "button";
  acoes.appendChild(abrir);

  let atual = 0, timer = null, pausado = false, hover = false, foco = false;
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  pausado = reduzir;
  const pontos = [];

  function ir(i) {
    atual = (i + itens.length) % itens.length;
    const { p } = itens[atual];
    slides.forEach((s, n) => {
      s.classList.toggle("ativo", n === atual);
      s.setAttribute("aria-hidden", n !== atual);
    });
    pontos.forEach((b, n) => b.setAttribute("aria-pressed", n === atual));
    contador.textContent = (atual + 1) + " / " + itens.length;
    titulo.textContent = p.titulo;
    status.className = "status status-" + p.status;
    status.textContent = rotulos[p.status] || p.status;
    resumo.textContent = p.descricao;
  }
  function iniciar() {
    clearInterval(timer);
    progresso.style.animation = "none";
    void progresso.offsetWidth;
    progresso.style.animation = "";
    const rodando = !pausado && !hover && !foco && itens.length > 1;
    janela.classList.toggle("parado", !rodando);
    if (rodando) timer = setInterval(() => { ir(atual + 1); iniciar(); }, 6000);
  }
  function mover(i) { ir(i); iniciar(); }

  abrir.addEventListener("click", () => abrirModal(itens[atual].p));

  if (itens.length > 1) {
    const anterior = criar("button", "seta seta-anterior", "\u2039");
    const proximo = criar("button", "seta seta-proximo", "\u203A");
    anterior.type = proximo.type = "button";
    anterior.setAttribute("aria-label", "Projeto anterior");
    proximo.setAttribute("aria-label", "Próximo projeto");
    anterior.addEventListener("click", () => mover(atual - 1));
    proximo.addEventListener("click", () => mover(atual + 1));
    palco.append(anterior, proximo);

    const grupo = criar("div", "ponto-grupo");
    itens.forEach((_, n) => {
      const b = criar("button", "ponto");
      b.type = "button";
      b.setAttribute("aria-label", "Ir para a imagem " + (n + 1));
      b.addEventListener("click", () => mover(n));
      pontos.push(b);
      grupo.appendChild(b);
    });
    const pausa = criar("button", "btn-pausa", pausado ? "Reproduzir" : "Pausar");
    pausa.type = "button";
    pausa.addEventListener("click", () => {
      pausado = !pausado;
      pausa.textContent = pausado ? "Reproduzir" : "Pausar";
      iniciar();
    });
    acoes.append(grupo, pausa);

    janela.addEventListener("mouseenter", () => { hover = true; iniciar(); });
    janela.addEventListener("mouseleave", () => { hover = false; iniciar(); });
    janela.addEventListener("focusin", () => { foco = true; iniciar(); });
    janela.addEventListener("focusout", e => {
      if (!janela.contains(e.relatedTarget)) { foco = false; iniciar(); }
    });
    janela.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") mover(atual - 1);
      if (e.key === "ArrowRight") mover(atual + 1);
    });
  }

  legenda.append(info, acoes);
  janela.append(barra, palco, legenda);
  alvo.appendChild(janela);
  ir(0);
  iniciar();
}
montarVitrine();
