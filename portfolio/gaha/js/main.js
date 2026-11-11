/* =========================================================
   GaHa Wellness Club — scripts
   ---------------------------------------------------------
   CONFIGURE AQUI: número do WhatsApp com DDI + DDD, só números.
   Ex.: "5512999999999". Enquanto estiver vazio, os botões
   abrem o Direct do Instagram.
   ========================================================= */
const GAHA = {
  whatsapp: "",
  instagram: "https://www.instagram.com/gahawellness/",
  endereco: "São José dos Campos – SP"
};

const ICON = {
  star: '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>'
};

function waLink(msg) {
  const text = encodeURIComponent(msg || "Olá, GaHa! Vim pelo site e quero saber mais sobre o clube.");
  return GAHA.whatsapp
    ? `https://wa.me/${GAHA.whatsapp}?text=${text}`
    : "https://ig.me/m/gahawellness";
}
const mapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("GaHa Wellness Club São José dos Campos");

/* ---------- cabeçalho e rodapé compartilhados ---------- */
function header(page) {
  const cur = (p) => (page === p ? ' aria-current="page"' : "");
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="header" id="topo">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="GaHa Wellness Club, página inicial">
      <img class="l-brown" src="img/logo-brown.png" alt="GaHa Wellness Club" width="674" height="213">
      <img class="l-cream" src="img/logo-cream.png" alt="" width="674" height="213">
    </a>
    <nav class="nav" aria-label="Principal">
      <a href="index.html#clube"${cur("clube")}>O clube</a>
      <a href="aulas.html"${cur("aulas")}>Aulas</a>
      <a href="aulas.html#match">Qual aula é a sua?</a>
      <a href="index.html#planos">Planos</a>
      <a href="contato.html"${cur("contato")}>Contato</a>
    </nav>
    <a class="btn btn-dark nav-cta" data-wa="Olá, GaHa! Quero agendar uma aula experimental.">Agendar aula experimental</a>
    <button class="menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
  </div>
</header>
<nav class="drawer" id="drawer" aria-label="Menu">
  <a href="index.html">Início</a>
  <a href="index.html#clube">O clube</a>
  <a href="aulas.html">Aulas</a>
  <a href="aulas.html#match">Qual aula é a sua?</a>
  <a href="index.html#planos">Planos e apps</a>
  <a href="contato.html">Contato</a>
  <a class="btn btn-sand" data-wa="Olá, GaHa! Quero agendar uma aula experimental.">${ICON.wa} Agendar aula experimental</a>
</nav>`;
}

function footer() {
  const y = new Date().getFullYear();
  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="brand-col">
        <img src="img/logo-cream.png" alt="GaHa Wellness Club" width="674" height="213" loading="lazy">
        <p>Hot Pilates, Reformer, Sculpt e Pilates Acrobático num só clube, em São José dos Campos.</p>
        <div class="socials">
          <a href="${GAHA.instagram}" target="_blank" rel="noopener" aria-label="Instagram da GaHa">${ICON.ig}</a>
          <a data-wa aria-label="WhatsApp da GaHa">${ICON.wa}</a>
        </div>
      </div>
      <div>
        <h4>Navegue</h4>
        <ul>
          <li><a href="index.html">Início</a></li>
          <li><a href="index.html#clube">O clube</a></li>
          <li><a href="aulas.html">Aulas</a></li>
          <li><a href="index.html#planos">Planos e apps</a></li>
          <li><a href="contato.html">Contato</a></li>
        </ul>
      </div>
      <div>
        <h4>Aulas</h4>
        <ul>
          <li><a href="aulas.html#hot-pilates">Hot Pilates</a></li>
          <li><a href="aulas.html#reformer">Reformer</a></li>
          <li><a href="aulas.html#sculpt">Sculpt</a></li>
          <li><a href="aulas.html#acrobatico">Pilates Acrobático</a></li>
        </ul>
      </div>
      <div>
        <h4>Visite</h4>
        <ul>
          <li>${GAHA.endereco}</li>
          <li><a href="${mapsLink}" target="_blank" rel="noopener">Como chegar</a></li>
          <li><a data-wa>Falar no WhatsApp</a></li>
          <li><a href="${GAHA.instagram}" target="_blank" rel="noopener">@gahawellness</a></li>
        </ul>
      </div>
    </div>
    <div class="copy">
      <span>© ${y} GaHa Wellness Club. Todos os direitos reservados.</span>
      <a href="politica-de-privacidade.html">LGPD: Política de Privacidade</a>
    </div>
  </div>
</footer>
<a class="wa-float" data-wa aria-label="Falar com a GaHa no WhatsApp">${ICON.wa}</a>
<div class="mbar">
  <a class="btn btn-dark" data-wa="Olá, GaHa! Quero agendar uma aula experimental.">${ICON.wa} Agendar aula</a>
  <a class="btn btn-line" href="${mapsLink}" target="_blank" rel="noopener">${ICON.pin} Como chegar</a>
</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const page = body.dataset.page || "";
  body.insertAdjacentHTML("afterbegin", header(page));
  body.insertAdjacentHTML("beforeend", footer());

  /* ícones ✦ */
  document.querySelectorAll("[data-star]").forEach((el) => el.insertAdjacentHTML("afterbegin", ICON.star));

  /* links de WhatsApp */
  const setWa = () => document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
  setWa();
  document.querySelectorAll("[data-maps]").forEach((a) => { a.href = mapsLink; a.target = "_blank"; a.rel = "noopener"; });

  /* cabeçalho: transparente no topo, sólido ao rolar */
  const head = document.querySelector(".header");
  if (body.dataset.header === "dark") head.classList.add("on-dark");
  const onScroll = () => head.classList.toggle("solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* menu mobile */
  const btn = document.querySelector(".menu-btn");
  const toggle = (open) => {
    body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    body.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", () => toggle(!body.classList.contains("menu-open")));
  document.querySelectorAll(".drawer a").forEach((a) => a.addEventListener("click", () => toggle(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggle(false); });

  /* revelação ao rolar */
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add("in"));

  /* ---------- quiz "Qual aula é a sua?" ---------- */
  const quiz = document.getElementById("quiz-form");
  if (quiz) {
    const AULAS = {
      hot: { nome: "Hot Pilates", img: "img/sculpt.jpg", txt: "Você quer suar de verdade e sair renovada. A sala aquecida solta o corpo, acelera o coração e deixa cada série mais intensa, sem perder o controle do método." },
      reformer: { nome: "Reformer", img: "img/reformer.jpg", txt: "Seu caminho é o aparelho. As molas dão resistência e apoio na medida certa para ganhar força, postura e alinhamento com segurança, mesmo começando do zero." },
      sculpt: { nome: "Sculpt", img: "img/bola.jpg", txt: "Você quer tonificar e definir. Pesos leves, caneleiras e bola em sequências que trabalham cada músculo num ritmo que faz o tempo passar rápido." },
      acro: { nome: "Pilates Acrobático", img: "img/acrobatico.jpg", txt: "Você está pronta para sair do chão. No tecido suspenso, a coluna descomprime, o equilíbrio é desafiado e a aula vira o momento mais divertido da semana." }
    };
    const PESOS = {
      objetivo: { forca: { sculpt: 3, reformer: 1 }, postura: { reformer: 3, acro: 1 }, suar: { hot: 3, sculpt: 1 }, novo: { acro: 3, hot: 1 } },
      ritmo: { intenso: { hot: 2, sculpt: 1 }, moderado: { sculpt: 1, reformer: 1, acro: 1 }, calmo: { reformer: 2 } },
      nivel: { zero: { reformer: 2, hot: 1 }, pratico: { acro: 2, sculpt: 1 } }
    };
    const res = document.getElementById("quiz-result");
    const out = {
      img: res.querySelector("img"), kicker: res.querySelector(".kicker span"),
      h: res.querySelector("h3"), p: res.querySelector("p"), btn: res.querySelector(".btn")
    };
    quiz.addEventListener("change", () => {
      const data = new FormData(quiz);
      const score = { hot: 0, reformer: 0, sculpt: 0, acro: 0 };
      let answered = 0;
      for (const q of Object.keys(PESOS)) {
        const v = data.get(q);
        if (!v) continue;
        answered++;
        for (const [k, n] of Object.entries(PESOS[q][v])) score[k] += n;
      }
      const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
      const a = AULAS[best];
      res.classList.toggle("empty", false);
      out.img.src = a.img;
      out.img.alt = "Aula de " + a.nome;
      out.kicker.textContent = answered < 3 ? `Até agora, a sua cara é` : "Sua aula ideal é";
      out.h.textContent = a.nome;
      out.p.textContent = a.txt;
      out.btn.dataset.wa = `Olá, GaHa! Fiz o teste no site e deu ${a.nome}. Quero agendar uma aula experimental.`;
      out.btn.lastChild.textContent = ` Agendar aula de ${a.nome}`;
      out.btn.href = waLink(out.btn.dataset.wa);
    });
  }

  /* ---------- formulário de contato -> WhatsApp ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const msg = `Olá, GaHa! Meu nome é ${d.get("nome")}.\nInteresse: ${d.get("interesse")}\nMelhor período: ${d.get("periodo")}\n${d.get("mensagem") || ""}`.trim();
      window.open(waLink(msg), "_blank", "noopener");
    });
  }
});
