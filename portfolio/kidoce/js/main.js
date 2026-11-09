(function () {
  // Menu mobile
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (btn && nav) {
    var use = btn.querySelector('use');
    function setOpen(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('open', open);
      if (use) use.setAttribute('href', open ? '#i-close' : '#i-menu');
    }
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Carrossel de produtos
  var car = document.getElementById('carousel');
  if (car) {
    document.querySelectorAll('.car-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = car.querySelector('.pcard');
        var step = card ? card.getBoundingClientRect().width + 24 : 300;
        car.scrollBy({ left: step * Number(b.dataset.dir || 1), behavior: 'smooth' });
      });
    });
  }
})();
