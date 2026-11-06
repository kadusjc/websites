/* Clínica Lumina — interactions */

document.addEventListener('DOMContentLoaded', () => {
  // Header scroll
  const header = document.querySelector('.header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth reveal on scroll
  const reveals = document.querySelectorAll('.card-esp, .card-pro, .card-dep, .pillar, .hero-visual, .sobre-visual');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
    io.observe(el);
  });

  // Form → WhatsApp
  const form = document.getElementById('contato-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const telefone = form.telefone.value.trim();
      const especialidade = form.especialidade.value;
      const msg = form.mensagem.value.trim();

      if (!nome || !telefone) {
        alert('Por favor, preencha nome e WhatsApp.');
        return;
      }

      let text = `Olá, Clínica Lumina! Meu nome é *${nome}*.\n`;
      text += `WhatsApp: ${telefone}\n`;
      if (especialidade) text += `Interesse em: *${especialidade}*\n`;
      if (msg) text += `\nMensagem: ${msg}`;

      const url = `https://wa.me/5511999990000?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }

  // LGPD Cookie
  const LGPD_KEY = 'lumina-lgpd';
  const overlay = document.getElementById('lgpd-overlay');
  const privacyFull = document.getElementById('privacy-full');

  function showLgpd() {
    if (!localStorage.getItem(LGPD_KEY)) {
      setTimeout(() => overlay?.classList.add('show'), 800);
    }
  }

  function acceptLgpd() {
    localStorage.setItem(LGPD_KEY, 'accepted');
    overlay?.classList.remove('show');
  }

  document.getElementById('lgpd-accept')?.addEventListener('click', acceptLgpd);
  document.getElementById('lgpd-essential')?.addEventListener('click', acceptLgpd);

  document.querySelectorAll('[data-open-privacy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      privacyFull?.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  document.getElementById('privacy-close')?.addEventListener('click', () => {
    privacyFull?.classList.remove('show');
    document.body.style.overflow = '';
  });

  showLgpd();

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
});
