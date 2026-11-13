const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();


// Revela as seções conforme entram na tela, sem bloquear a renderização inicial.
const motionSafe = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionSafe && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  const revealTargets = document.querySelectorAll('.section-heading, .product-card, .event-copy, .karaoke-copy, .karaoke-photo, .occasion-card, .gallery-item, .faq-list details, .final-cta .cta-content');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.matches('.product-card, .occasion-card, .gallery-item')) element.style.transitionDelay = `${(index % 4) * 75}ms`;
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
}
