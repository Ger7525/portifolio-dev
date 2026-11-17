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

/* ---------- Banner: imagens dos projetos trocando sozinhas na área demarcada ---------- */
function montarBanner() {
  const header = document.querySelector("header");
  const itens = projetos.flatMap(p => (p.imagens || []).map(src => ({ src, p })));
  if (!itens.length) return;

  let imgBase = header.querySelector("img");
  if (!imgBase) {
    imgBase = document.createElement("img");
    imgBase.src = "img/logo-dev.png";
    imgBase.alt = "Germano Santos Dev";
    imgBase.className = "base-logo";
    header.appendChild(imgBase);
  } else {
    imgBase.classList.add("base-logo");
  }

  header.classList.add("carrossel");

  const area = criar("div", "banner");
  area.setAttribute("role", "region");
  area.setAttribute("aria-roledescription", "carrossel");
  area.setAttribute("aria-label", "Imagens dos projetos");

  const slides = itens.map(({ src, p }) => {
    const im = imagem(src, "Captura de tela do projeto " + p.titulo, "banner-slide");
    area.appendChild(im);
    return im;
  });

  const legenda = criar("div", "banner-legenda");
  const info = criar("div", "banner-info");
  const titulo = criar("p", "banner-titulo");
  const abrir = criar("button", "btn-detalhes", "Ver detalhes");
  abrir.type = "button";
  info.append(titulo, abrir);
  legenda.appendChild(info);

  let atual = 0, timer = null, pausado = false;
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pontos = [];

  function ir(i) {
    atual = (i + itens.length) % itens.length;
    slides.forEach((s, n) => {
      s.classList.toggle("ativo", n === atual);
      s.setAttribute("aria-hidden", n !== atual);
    });
    pontos.forEach((b, n) => b.setAttribute("aria-pressed", n === atual));
    titulo.textContent = itens[atual].p.titulo;
  }
  function parar() { clearInterval(timer); }
  function iniciar() {
    parar();
    if (!reduzir && !pausado && itens.length > 1) timer = setInterval(() => ir(atual + 1), 5000);
  }

  abrir.addEventListener("click", () => abrirModal(itens[atual].p));

  if (itens.length > 1) {
    const controles = criar("div", "banner-controles");
    const grupoPontos = criar("div", "ponto-grupo");
    
    itens.forEach((_, n) => {
      const b = criar("button", "ponto");
      b.type = "button";
      b.setAttribute("aria-label", "Ir para a imagem " + (n + 1));
      b.addEventListener("click", () => { ir(n); iniciar(); });
      pontos.push(b);
      grupoPontos.appendChild(b);
    });
    
    controles.appendChild(grupoPontos);
    const pausa = criar("button", "btn-pausa", reduzir ? "Reproduzir" : "Pausar");
    pausa.type = "button";
    pausado = reduzir;
    pausa.addEventListener("click", () => {
      pausado = !pausado;
      pausa.textContent = pausado ? "Reproduzir" : "Pausar";
      iniciar();
    });
    controles.appendChild(pausa);
    legenda.appendChild(controles);
    
    area.addEventListener("mouseenter", parar);
    area.addEventListener("mouseleave", iniciar);
    area.addEventListener("focusin", parar);
    area.addEventListener("focusout", iniciar);
  }

  area.appendChild(legenda);
  header.appendChild(area);
  ir(0);
  iniciar();
}
montarBanner();