(()=>{
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)],WA='5511900000000';
/* menu + header */
const nav=$('#nav'),bt=$('#burger'),hd=$('header');
const menu=o=>{nav.classList.toggle('open',o);bt.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
bt.onclick=()=>menu(!nav.classList.contains('open'));$$('#nav a').forEach(a=>a.onclick=()=>menu(false));
const sc=()=>hd.classList.toggle('on',scrollY>30);addEventListener('scroll',sc,{passive:true});sc();
/* reveal */
const io=new IntersectionObserver(l=>l.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
$$('.rv').forEach(e=>io.observe(e));
/* aberto / fechado (horário de Brasília) */
(()=>{const d=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Sao_Paulo'})),w=d.getDay(),m=d.getHours()*60+d.getMinutes();
const h=w===0?null:w===6?[480,780]:[420,1200],o=!!h&&m>=h[0]&&m<h[1],s=$('.st');
s.classList.toggle('open',o);$('span',s).textContent=o?'Aberto agora · atendemos até '+(w===6?'13h':'20h'):'Fechado agora · respondemos no próximo horário'})();
/* triagem */
const T={coluna:['Fisioterapia esportiva','Dor na coluna','Avaliação postural e biomecânica, terapia manual e exercícios para fortalecer o que sustenta a sua coluna.'],
joelho:['Fisioterapia esportiva','Joelho e tornozelo','Reabilitação de entorses e lesões, com retorno gradual ao esporte e prevenção de recaídas.'],
ombro:['Fisioterapia','Ombro e pescoço','Tratamento da tensão do dia a dia ou de lesões, com ajustes de ergonomia na sua rotina.'],
mente:['Psicologia','Ansiedade e estresse','Um espaço seguro para entender gatilhos, aprender estratégias e cuidar da mente junto com o corpo.'],
voz:['Fonoaudiologia','Voz, fala e deglutição','Avaliação fonoaudiológica e terapia personalizada, para crianças, adultos e profissionais da voz.'],
pos:['Fisioterapia pós-operatória','Recuperação pós-cirurgia','Protocolo seguro com o seu cirurgião: mobilidade, força e autonomia de volta, no ritmo certo.']};
const show=k=>{const[t,h,p]=T[k];$('#rt').textContent=t;$('#rh').textContent=h;$('#rp').textContent=p;
$('#rl').href=`https://wa.me/${WA}?text=${encodeURIComponent('Olá! Quero agendar uma avaliação: '+h+'.')}`;
$$('.chips button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k))};
$$('.chips button').forEach(b=>b.onclick=()=>show(b.dataset.k));show('coluna');
/* mapa sob consentimento */
const loadMap=()=>{const b=$('#mapbox');if(b.dataset.l)return;b.dataset.l=1;b.innerHTML='<iframe title="Mapa de Perdizes, São Paulo" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Perdizes,+S%C3%A3o+Paulo&output=embed"></iframe>'};
$('#mapbtn').onclick=loadMap;
/* LGPD */
const K='vm-lgpd',bn=$('#cookie'),dg=$('#priv'),chk=$('#mapchk');let p=null;
try{p=JSON.parse(localStorage.getItem(K))}catch(e){}
const save=map=>{p={map,t:Date.now()};try{localStorage.setItem(K,JSON.stringify(p))}catch(e){}bn.hidden=true;if(dg.open)dg.close();apply()};
const apply=()=>{chk.checked=!!(p&&p.map);if(p&&p.map)loadMap()};
apply();if(!p)setTimeout(()=>bn.hidden=false,900);
$$('[data-open]').forEach(b=>b.onclick=e=>{e.preventDefault();chk.checked=!!(p&&p.map);dg.showModal()});
$$('[data-close]').forEach(b=>b.onclick=()=>dg.close());
dg.addEventListener('click',e=>{if(e.target===dg)dg.close()});
$$('[data-act]').forEach(b=>b.onclick=()=>save(b.dataset.act==='all'?true:b.dataset.act==='save'?chk.checked:false));
})();
