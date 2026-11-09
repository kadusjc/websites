/* ==========================================================
   La Casa Planejados · main.js
   Cada recurso só roda se a página tiver os elementos dele,
   então o mesmo arquivo serve para todas as páginas.
   ========================================================== */
(function () {
  "use strict";

  var WHATSAPP = "5512992055828";
  var EMAIL = "contato@lacasaplanejados.com.br";
  var ORIGEM = "https://lacasaplanejados.com.br/wp-content/uploads/";
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function guardar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function ler(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function abrirWhats(msg) { window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); }
  function slug(t) { return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  /* WebP responsivo (480/960/1600) com o original do site como reserva */
  function foto(local, remoto, rotulo, alt, tamanhos) {
    var base = local.replace(/\.(jpe?g|png)$/i, "");
    var i = document.createElement("img");
    i.srcset = base + "-480.webp 480w, " + base + "-960.webp 960w, " + base + "-1600.webp 1600w";
    i.sizes = tamanhos || "100vw";
    i.src = base + "-960.webp";
    i.setAttribute("data-remote", ORIGEM + remoto);
    i.setAttribute("data-label", rotulo);
    i.alt = alt == null ? rotulo : alt;
    i.loading = "lazy";
    i.decoding = "async";
    return i;
  }

  /* ---------------- Dados: portfólio real ---------------- */
  var condominio = [];
  for (var n = 1; n <= 11; n++) {
    var nn = (n < 10 ? "0" : "") + n;
    condominio.push({ l: "img/projetos/condominio-" + nn + ".jpg", r: "2018/08/LC_Condominio_" + nn + ".jpg" });
  }
  var PROJETOS = [
    { t: "Casa no Condomínio Borda da Mata", c: "Residências", fotos: condominio, capa: 6 },
    { t: "Cozinhas", c: "Cozinhas", fotos: [{ l: "img/projetos/cozinha.jpg", r: "2017/10/WhatsApp-Image-2017-10-19-at-17.15.30.jpeg" }] },
    { t: "Closets", c: "Closets", fotos: [{ l: "img/projetos/closet.jpg", r: "2017/05/Closet-1-1.jpg" }] },
    { t: "Dormitórios", c: "Dormitórios", fotos: [{ l: "img/projetos/dormitorio.jpg", r: "2017/05/Quarto-5.jpg" }] },
    { t: "Casa no Eco Park", c: "Residências", fotos: [{ l: "img/projetos/ecopark.jpg", r: "2018/08/LC_Ecopark_07.jpg" }] },
    { t: "Ateliê do Sabor", c: "Empresas", fotos: [{ l: "img/projetos/atelie-do-sabor.jpg", r: "2018/08/LC_Atelier_04.jpg" }] },
    { t: "Mr. Fit", c: "Empresas", fotos: [{ l: "img/projetos/mr-fit.jpg", r: "2018/08/LC_MR.Fit_01.jpg" }] },
    { t: "Salas de estar", c: "Salas", fotos: [{ l: "img/projetos/sala.jpg", r: "2017/05/Sala-1.jpg" }] },
    { t: "Home office", c: "Escritórios", fotos: [{ l: "img/projetos/home-office.jpg", r: "2017/05/1-5.jpg" }] },
    { t: "Banheiros", c: "Banheiros", fotos: [{ l: "img/projetos/banheiro.jpg", r: "2017/05/2-6.jpg" }] }
  ];
  var CATEGORIAS = ["Todos", "Banheiros", "Closets", "Cozinhas", "Dormitórios", "Empresas", "Escritórios", "Residências", "Salas"];

  /* ---------------- Rolagem (um único listener) ---------------- */
  var tarefas = [], pedido = false;
  window.addEventListener("scroll", function () {
    if (pedido) return; pedido = true;
    requestAnimationFrame(function () { pedido = false; tarefas.forEach(function (t) { t(); }); });
  }, { passive: true });

  /* ---------------- Cabeçalho e menu ---------------- */
  var topo = $("#topo");
  if (topo && !topo.classList.contains("pagina-topo")) {
    var solido = function () { topo.classList.toggle("solido", window.scrollY > 40); };
    tarefas.push(solido); solido();
  }
  var burger = $("#burger"), menu = $("#menu");
  if (burger && menu) {
    var fecharMenu = function () {
      menu.classList.remove("aberto"); burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Abrir menu"); document.body.style.overflow = "";
    };
    burger.addEventListener("click", function () {
      var abre = !menu.classList.contains("aberto");
      menu.classList.toggle("aberto", abre);
      burger.setAttribute("aria-expanded", String(abre));
      burger.setAttribute("aria-label", abre ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = abre ? "hidden" : "";
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", fecharMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMenu(); });
  }

  /* ---------------- Hero: slides ---------------- */
  var slides = $$("#slides figure");
  if (slides.length) {
    var dots = $("#dots"), legenda = $("#legenda"), atual = 0, timer;
    var carregarSlide = function (fig) {
      var img = fig && fig.querySelector("img[data-srcset]");
      if (!img) return;
      img.srcset = img.getAttribute("data-srcset"); img.sizes = "100vw";
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-srcset"); img.removeAttribute("data-src");
    };
    var irPara = function (i) {
      carregarSlide(slides[(i + slides.length) % slides.length]);
      slides[atual].classList.remove("ativo");
      atual = (i + slides.length) % slides.length;
      slides[atual].classList.add("ativo");
      if (legenda) legenda.textContent = slides[atual].getAttribute("data-legenda");
      $$("button", dots).forEach(function (b, k) {
        b.removeAttribute("aria-current");
        if (k === atual) { void b.offsetWidth; b.setAttribute("aria-current", "true"); }
      });
      clearTimeout(timer);
      if (!reduz) timer = setTimeout(function () { irPara(atual + 1); }, 6000);
      var prox = slides[(atual + 1) % slides.length];
      var depois = function () { setTimeout(function () { carregarSlide(prox); }, 1500); };
      if (document.readyState === "complete") depois(); else window.addEventListener("load", depois, { once: true });
    };
    slides.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Foto " + (i + 1) + ": " + s.getAttribute("data-legenda"));
      b.addEventListener("click", function () { irPara(i); });
      dots.appendChild(b);
    });
    irPara(0);
  }

  /* ---------------- Faixa de ambientes ---------------- */
  var faixa = $("#faixa");
  if (faixa) {
    var amb = ["Cozinhas", "Dormitórios", "Closets", "Home office", "Home theater", "Banheiros", "Camas", "Salas", "Lavanderias", "Ambientes comerciais"];
    faixa.innerHTML = amb.concat(amb).map(function (a) { return "<span>" + a + "</span>"; }).join("");
  }

  /* ---------------- Lightbox ---------------- */
  var lb = $("#lb"), abrirLb = function () {};
  if (lb) {
    var lbFoto = $("#lbFoto"), estado = { p: 0, k: 0 }, toqueX = null;
    var desenharLb = function () {
      var p = PROJETOS[estado.p], f = p.fotos[estado.k];
      lbFoto.innerHTML = "";
      var img = foto(f.l, f.r, p.t, p.t, "94vw"); img.loading = "eager";
      lbFoto.appendChild(img);
      $("#lbTitulo").textContent = p.t;
      $("#lbConta").textContent = p.fotos.length > 1 ? (estado.k + 1) + " de " + p.fotos.length : p.c;
    };
    var mover = function (d) {
      var p = PROJETOS[estado.p];
      if (p.fotos.length > 1) estado.k = (estado.k + d + p.fotos.length) % p.fotos.length;
      else { estado.p = (estado.p + d + PROJETOS.length) % PROJETOS.length; estado.k = 0; }
      desenharLb();
    };
    abrirLb = function (p, k) {
      estado = { p: p, k: k || 0 }; desenharLb();
      if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    };
    $("#lbAnt").addEventListener("click", function () { mover(-1); });
    $("#lbProx").addEventListener("click", function () { mover(1); });
    $("#lbFechar").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") mover(1); if (e.key === "ArrowLeft") mover(-1); });
    lbFoto.addEventListener("touchstart", function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
    lbFoto.addEventListener("touchend", function (e) {
      if (toqueX === null) return;
      var dx = e.changedTouches[0].clientX - toqueX;
      if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1);
      toqueX = null;
    });
  }

  /* ---------------- Casa em destaque: trilho ---------------- */
  var trilho = $("#trilho");
  if (trilho) {
    condominio.forEach(function (f, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ampliar foto " + (i + 1) + " da casa no Condomínio Borda da Mata");
      b.appendChild(foto(f.l, f.r, "Borda da Mata", "", "(min-width:1360px) 460px, (min-width:765px) 34vw, 260px"));
      b.addEventListener("click", function () { abrirLb(0, i); });
      trilho.appendChild(b);
    });
    var passo = function () { var c = trilho.querySelector("button"); return c ? c.getBoundingClientRect().width + 14 : 400; };
    $("#trilhoAnt").addEventListener("click", function () { trilho.scrollBy({ left: -passo(), behavior: reduz ? "auto" : "smooth" }); });
    $("#trilhoProx").addEventListener("click", function () { trilho.scrollBy({ left: passo(), behavior: reduz ? "auto" : "smooth" }); });
  }

  /* ---------------- Portfólio ----------------
     data-modo="capas"  (início): um card por projeto
     data-modo="todas"  (projetos.html): um card por foto, com link direto por ambiente (#cozinhas) */
  var galeria = $("#galeria"), filtros = $("#filtros");
  if (galeria && filtros) {
    var todas = galeria.getAttribute("data-modo") === "todas";
    var contador = $("#contador");
    var TAM_G = "(min-width:860px) 62vw, 100vw", TAM_P = "(min-width:860px) 31vw, (min-width:520px) 50vw, 100vw";
    var n = 0;
    PROJETOS.forEach(function (p, i) {
      var lista = todas ? p.fotos.map(function (f, k) { return k; }) : [p.capa || 0];
      lista.forEach(function (k) {
        var f = p.fotos[k];
        var b = document.createElement("button");
        b.type = "button"; b.className = "card"; b.setAttribute("data-c", p.c);
        var grande = todas ? (n % 7 === 0) : (i === 0 || i === 5);
        if (todas && grande) b.classList.add("card-g");
        b.appendChild(foto(f.l, f.r, p.t, p.t + (p.fotos.length > 1 ? ", foto " + (k + 1) : ""), grande ? TAM_G : TAM_P));
        var info = document.createElement("span"); info.className = "card-info";
        var detalhe = todas ? (p.fotos.length > 1 ? "Foto " + (k + 1) + " de " + p.fotos.length : "Toque para ampliar")
                            : (p.fotos.length > 1 ? p.fotos.length + " fotos" : "Toque para ampliar");
        info.innerHTML = "<span><b>" + p.t + "</b><small>" + detalhe + "</small></span><span class=\"card-tag\">" + p.c + "</span>";
        b.appendChild(info);
        b.addEventListener("click", function () { abrirLb(i, k); });
        galeria.appendChild(b); n++;
      });
    });
    var filtrar = function (cat, atualizarEndereco) {
      if (CATEGORIAS.indexOf(cat) < 0) cat = "Todos";
      $$(".chip", filtros).forEach(function (c) { c.setAttribute("aria-pressed", String(c.textContent === cat)); });
      var vis = 0;
      $$(".card", galeria).forEach(function (c) {
        var ok = cat === "Todos" || c.getAttribute("data-c") === cat;
        c.hidden = !ok; if (ok) vis++;
      });
      if (contador) contador.textContent = vis + (vis === 1 ? " foto" : " fotos") + (cat === "Todos" ? "" : " em " + cat.toLowerCase());
      if (todas && atualizarEndereco && history.replaceState) {
        history.replaceState(null, "", cat === "Todos" ? location.pathname : "#" + slug(cat));
      }
    };
    CATEGORIAS.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = c;
      b.setAttribute("aria-pressed", String(c === "Todos"));
      b.addEventListener("click", function () { filtrar(c, true); });
      filtros.appendChild(b);
    });
    $$("[data-filtro]").forEach(function (a) {
      a.addEventListener("click", function () { filtrar(a.getAttribute("data-filtro")); });
    });
    var porHash = function () {
      var h = location.hash.slice(1);
      var achou = CATEGORIAS.filter(function (c) { return slug(c) === h; })[0];
      filtrar(achou || "Todos");
    };
    if (todas) { porHash(); window.addEventListener("hashchange", porHash); } else filtrar("Todos");
  }

  /* ---------------- Mapa sob demanda ---------------- */
  var capaMapa = $("#carregarMapa");
  if (capaMapa) capaMapa.addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.title = "Mapa da loja La Casa Planejados";
    f.src = capaMapa.getAttribute("data-src");
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.setAttribute("allowfullscreen", "");
    capaMapa.replaceWith(f);
  });

  /* ---------------- Processo: linha do tempo ---------------- */
  var linha = $("#linhaTempo"), secProc = $("#processo");
  if (linha && secProc) {
    var progresso = function () {
      var r = secProc.getBoundingClientRect(), h = window.innerHeight;
      linha.style.setProperty("--prog", Math.min(1, Math.max(0, (h - r.top) / (r.height + h * 0.2))).toFixed(3));
    };
    tarefas.push(progresso); progresso();
  }

  /* ---------------- Configurador de orçamento (início) ---------------- */
  var cfg = $("#cfg");
  if (cfg) {
    var AMBIENTES = ["Cozinha", "Dormitório casal", "Dormitório infantil", "Closet", "Home office", "Home theater", "Banheiro", "Lavanderia", "Área gourmet", "Comercial"];
    var MOMENTOS = ["Comprei na planta", "Vou me mudar em breve", "Reforma", "Só pesquisando"];
    var CORES = [
      { n: "Branco", c: "#FFFFFF" },
      { n: "Preto", c: "#151515" },
      { n: "Madeira clara", c: "linear-gradient(135deg,#dcbc92,#b8915f)" },
      { n: "Madeira escura", c: "linear-gradient(135deg,#8a5a34,#5a3a20)" },
      { n: "Grafite", c: "#4A4D50" },
      { n: "Ainda não sei", c: "conic-gradient(#fff 0 25%,#F26522 0 50%,#151515 0 75%,#b8915f 0)" }
    ];
    var CHAVE = "lacasa-orcamento";
    var st = Object.assign({ amb: [], mom: "", cor: "", nome: "", cidade: "", obs: "" }, ler(CHAVE) || {});
    var criarOpcoes = function (alvo, lista, tipo, nome, rotulo, amostra) {
      lista.forEach(function (item, i) {
        var valor = rotulo(item), id = nome + "-" + i;
        var w = document.createElement("div"); w.className = "op";
        var inp = document.createElement("input"); inp.type = tipo; inp.name = nome; inp.id = id; inp.value = valor;
        var lab = document.createElement("label"); lab.htmlFor = id;
        var marca = document.createElement("span");
        if (amostra) { marca.className = "cor"; marca.style.background = amostra(item); } else marca.className = "ck";
        lab.appendChild(marca);
        lab.appendChild(document.createTextNode(valor));
        w.appendChild(inp); w.appendChild(lab); alvo.appendChild(w);
      });
    };
    criarOpcoes($("#opAmb"), AMBIENTES, "checkbox", "amb", function (x) { return x; });
    criarOpcoes($("#opMom"), MOMENTOS, "radio", "mom", function (x) { return x; });
    criarOpcoes($("#opCor"), CORES, "radio", "cor", function (x) { return x.n; }, function (x) { return x.c; });

    var fNome = $("#fNome"), fCidade = $("#fCidade"), fObs = $("#fObs");
    $$('input[name="amb"]', cfg).forEach(function (i) { i.checked = st.amb.indexOf(i.value) > -1; });
    $$('input[name="mom"]', cfg).forEach(function (i) { i.checked = i.value === st.mom; });
    $$('input[name="cor"]', cfg).forEach(function (i) { i.checked = i.value === st.cor; });
    fNome.value = st.nome; fCidade.value = st.cidade; fObs.value = st.obs;

    var campo = function (id, valor, vazio) { var el = $(id); el.textContent = valor || vazio; el.classList.toggle("vazio", !valor); };
    var desenharResumo = function () {
      campo("#rAmb", st.amb.join(", "), "Escolha ao lado");
      campo("#rMom", st.mom, "Escolha ao lado");
      campo("#rCor", st.cor, "Escolha ao lado");
      campo("#rNome", st.nome, "Opcional");
      var feitas = (st.amb.length ? 1 : 0) + (st.mom ? 1 : 0) + (st.cor ? 1 : 0) + (st.nome ? 1 : 0);
      $("#rBarra").style.width = (feitas / 4 * 100) + "%";
      $("#rProg").textContent = feitas === 4 ? "Tudo pronto para enviar" : feitas + " de 4 etapas";
    };
    cfg.addEventListener("input", function () {
      st.amb = $$('input[name="amb"]:checked', cfg).map(function (i) { return i.value; });
      var m = $('input[name="mom"]:checked', cfg); st.mom = m ? m.value : "";
      var c = $('input[name="cor"]:checked', cfg); st.cor = c ? c.value : "";
      st.nome = fNome.value.trim(); st.cidade = fCidade.value.trim(); st.obs = fObs.value.trim();
      $("#rErro").textContent = "";
      guardar(CHAVE, st); desenharResumo();
    });
    desenharResumo();
    $("#enviar").addEventListener("click", function () {
      if (!st.amb.length) {
        $("#rErro").textContent = "Escolha pelo menos um ambiente para montar a mensagem.";
        $("#opAmb").scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "center" });
        return;
      }
      var msg = "Olá, La Casa! " + (st.nome ? "Sou " + st.nome + " e " : "") + "vim pelo site.\n\n";
      msg += "*Quero planejar:* " + st.amb.join(", ");
      if (st.mom) msg += "\n*Momento:* " + st.mom;
      if (st.cor) msg += "\n*Acabamento que me atrai:* " + st.cor;
      if (st.cidade) msg += "\n*Cidade/bairro:* " + st.cidade;
      if (st.obs) msg += "\n*Detalhes:* " + st.obs;
      msg += "\n\nGostaria de agendar meu projeto 3D.";
      abrirWhats(msg);
    });
  }

  /* ---------------- Formulário de contato (contato.html) ---------------- */
  var fc = $("#formContato");
  if (fc) {
    var tel = $("#cTel");
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 11);
      var f = d;
      if (d.length > 2) f = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 7) f = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length === 11 ? 7 : 6) + "-" + d.slice(d.length === 11 ? 7 : 6);
      tel.value = f;
    });
    var validar = function () {
      var ok = true;
      $$("[data-obrig]", fc).forEach(function (el) {
        var v = el.value.trim(), erro = "";
        if (!v) erro = el.getAttribute("data-obrig");
        else if (el.id === "cTel" && v.replace(/\D/g, "").length < 10) erro = "Digite o telefone com DDD.";
        var msg = $("#" + el.id + "-erro");
        msg.textContent = erro;
        el.setAttribute("aria-invalid", erro ? "true" : "false");
        if (erro && ok) { el.focus(); ok = false; }
      });
      var em = $("#cEmail");
      if (ok && em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
        $("#cEmail-erro").textContent = "Confira o e-mail digitado."; em.setAttribute("aria-invalid", "true"); em.focus(); ok = false;
      } else if (ok) { $("#cEmail-erro").textContent = ""; em.setAttribute("aria-invalid", "false"); }
      return ok;
    };
    var montar = function (paraWhats) {
      var ambs = $$('input[name="cAmb"]:checked', fc).map(function (i) { return i.value; });
      var b = paraWhats ? "*" : "";
      var linhas = [
        "Olá, La Casa! Vim pelo site.", "",
        b + "Nome:" + b + " " + $("#cNome").value.trim(),
        b + "Telefone:" + b + " " + tel.value.trim()
      ];
      if ($("#cEmail").value.trim()) linhas.push(b + "E-mail:" + b + " " + $("#cEmail").value.trim());
      if ($("#cCidade").value.trim()) linhas.push(b + "Cidade:" + b + " " + $("#cCidade").value.trim());
      if (ambs.length) linhas.push(b + "Ambientes:" + b + " " + ambs.join(", "));
      if ($("#cPrefere").value) linhas.push(b + "Prefiro retorno por:" + b + " " + $("#cPrefere").value);
      linhas.push("", $("#cMsg").value.trim());
      return linhas.join("\n");
    };
    var ok = $("#cOk");
    fc.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validar()) return;
      abrirWhats(montar(true));
      ok.hidden = false;
    });
    $("#cEmailBtn").addEventListener("click", function () {
      if (!validar()) return;
      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Orçamento pelo site · " + $("#cNome").value.trim()) + "&body=" + encodeURIComponent(montar(false));
      ok.hidden = false;
    });
  }

  /* ---------------- Revelação ao rolar ---------------- */
  var revelaveis = $$(".revela");
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revelaveis.forEach(function (el) { io.observe(el); });
  } else revelaveis.forEach(function (el) { el.classList.add("visivel"); });

  /* ---------------- Menu ativo (só links de âncora da própria página) ---------------- */
  if (menu && "IntersectionObserver" in window) {
    var links = $$("a", menu).filter(function (a) { return (a.getAttribute("href") || "").charAt(0) === "#"; });
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + e.target.id)); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var s = document.getElementById(a.getAttribute("href").slice(1)); if (s) obs.observe(s); });
  }

  /* ---------------- Aviso LGPD ---------------- */
  var lgpd = $("#lgpd");
  if (lgpd && !ler("lacasa-lgpd")) {
    lgpd.classList.add("mostrar");
    $("#lgpdOk").addEventListener("click", function () { guardar("lacasa-lgpd", 1); lgpd.classList.remove("mostrar"); });
  }

  $$(".ano").forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
