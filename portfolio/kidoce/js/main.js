(function(){
  var header=document.querySelector('.site-header');
  var onScroll=function(){header.classList.toggle('is-solid',window.scrollY>30)};
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  var btn=document.querySelector('.menu-btn'),nav=document.getElementById('menu');
  function setMenu(open){
    nav.classList.toggle('open',open);header.classList.toggle('menu-open',open);
    btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    btn.querySelector('use').setAttribute('href',open?'#i-close':'#i-menu');
  }
  btn.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  var car=document.getElementById('carousel');
  document.querySelectorAll('.car-btn').forEach(function(b){
    b.addEventListener('click',function(){
      var card=car.querySelector('.pcard');var step=card?card.getBoundingClientRect().width+22:320;
      car.scrollBy({left:step*Number(b.dataset.dir),behavior:'smooth'});
    });
  });
})();
