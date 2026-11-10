/* Forja: ferro fundido escorrendo em WebGL, com faíscas em canvas 2D.
   Pausa fora da tela e respeita "reduzir movimento". */
(function () {
  var gl, prog, uT, uR, uS, raf = 0, t0 = performance.now(), visivel = true, w = 0, h = 0;
  var cv = document.getElementById('forja');
  var fx = document.getElementById('faiscas');
  if (!cv) return;
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FS = [
    'precision mediump float;',
    'uniform vec2 R;uniform float T;uniform float S;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    ' return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);',
    ' for(int i=0;i<5;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}',
    'vec3 ramp(float x){x=clamp(x,0.,1.);',
    ' vec3 c=mix(vec3(.015,.008,.006),vec3(.28,.02,.01),smoothstep(.0,.25,x));',
    ' c=mix(c,vec3(.80,.06,.04),smoothstep(.2,.45,x));',
    ' c=mix(c,vec3(1.,.38,.06),smoothstep(.42,.68,x));',
    ' c=mix(c,vec3(1.,.74,.26),smoothstep(.64,.86,x));',
    ' c=mix(c,vec3(1.,.96,.82),smoothstep(.86,1.,x));return c;}',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/R;float a=R.x/R.y;vec2 p=vec2(uv.x*a,uv.y);',
    ' float t=T*.09;',
    /* superfície do banho: crosta que racha e brilha nas fissuras */
    ' vec2 b=p*vec2(2.4,5.6);',
    ' vec2 q=vec2(fbm(b+vec2(0.,t)),fbm(b+vec2(5.2,1.3)+vec2(t*.6,0.)));',
    ' float f=fbm(b+2.6*q+vec2(t*.7,-t*.4));',
    ' float veio=1.-abs(f-.5)*3.4;veio=pow(clamp(veio,0.,1.),6.);',
    ' float poca=smoothstep(.42,.0,uv.y);',
    ' float calor=veio*(.10+.85*poca)+poca*.55*smoothstep(.38,.78,f);',
    /* jorro: o metal caindo da panela */
    ' float cx=S+.006*sin(uv.y*7.+T*1.3)+.003*sin(uv.y*21.-T*2.7);',
    ' float larg=.026+.006*sin(uv.y*13.+T*4.);',
    ' float d=abs(uv.x-cx)*a/larg;',
    ' float fio=fbm(vec2((uv.x-cx)*a*30.,uv.y*5.+T*3.2));',
    ' float jorro=smoothstep(1.,.25,d)*(.62+.42*fio)*smoothstep(.02,.16,uv.y);',
    ' float aura=exp(-d*d*.05)*.22*smoothstep(1.,.2,uv.y);',
    ' float impacto=exp(-pow((uv.x-cx)*a*5.,2.)-pow(uv.y*9.,2.))*.55;',
    ' calor=max(calor,jorro)+aura+impacto;',
    ' vec3 c=ramp(calor);',
    ' c+=vec3(.9,.25,.05)*aura*.25;',
    ' gl_FragColor=vec4(c,1.);',
    '}'
  ].join('\n');

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s);
    return s;
  }

  try {
    gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) throw 'sem webgl';
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    uT = gl.getUniformLocation(prog, 'T'); uR = gl.getUniformLocation(prog, 'R'); uS = gl.getUniformLocation(prog, 'S');
  } catch (e) {
    cv.parentNode.classList.add('sem-gl');
    gl = null;
  }

  /* posição do jorro: à direita no desktop, mais para a borda no celular */
  function jorroX() { return innerWidth < 760 ? .86 : .74; }

  function medir() {
    var r = cv.getBoundingClientRect();
    /* resolução reduzida: o efeito é macio e assim roda leve no celular */
    var esc = Math.min(1, 900 / Math.max(r.width, 1)) * (innerWidth < 760 ? .6 : .75);
    w = Math.max(2, Math.round(r.width * esc)); h = Math.max(2, Math.round(r.height * esc));
    cv.width = w; cv.height = h;
    if (fx) { fx.width = r.width * Math.min(devicePixelRatio, 2); fx.height = r.height * Math.min(devicePixelRatio, 2); }
    if (gl) gl.viewport(0, 0, w, h);
    if (calmo) quadro(performance.now());
  }

  /* faíscas */
  var ctx = fx ? fx.getContext('2d') : null, pt = [];
  function nova() {
    var W = fx.width, H = fx.height, ang = -Math.PI / 2 + (Math.random() - .5) * 1.9, v = (2 + Math.random() * 7) * (H / 900);
    return { x: W * jorroX() + (Math.random() - .5) * 30, y: H - 6, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v * 1.4,
      vida: 1, dec: .006 + Math.random() * .014, r: .8 + Math.random() * 1.8 };
  }
  function faiscas() {
    if (!ctx) return;
    var W = fx.width, H = fx.height, max = innerWidth < 760 ? 34 : 70, g = .06 * (H / 900);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    while (pt.length < max) pt.push(nova());
    for (var i = 0; i < pt.length; i++) {
      var s = pt[i];
      var ox = s.x, oy = s.y;
      s.vy += g; s.x += s.vx; s.y += s.vy; s.vida -= s.dec;
      if (s.vida <= 0 || s.y > H + 10) { pt[i] = nova(); continue; }
      ctx.strokeStyle = 'rgba(255,' + (150 + s.vida * 90 | 0) + ',' + (60 * s.vida | 0) + ',' + s.vida + ')';
      ctx.lineWidth = s.r * Math.min(devicePixelRatio, 2);
      ctx.beginPath(); ctx.moveTo(ox - s.vx * 1.2, oy - s.vy * 1.2); ctx.lineTo(s.x, s.y); ctx.stroke();
    }
  }

  function quadro(now) {
    if (gl) {
      gl.uniform1f(uT, (now - t0) / 1000 + 40);
      gl.uniform2f(uR, w, h);
      gl.uniform1f(uS, jorroX());
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  function loop(now) {
    raf = 0;
    if (!visivel || document.hidden) return;
    quadro(now); faiscas();
    raf = requestAnimationFrame(loop);
  }
  function iniciar() { if (!calmo && !raf) raf = requestAnimationFrame(loop); }

  medir();
  addEventListener('resize', medir);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; if (visivel) iniciar(); }).observe(cv);
  }
  document.addEventListener('visibilitychange', iniciar);
  if (calmo) quadro(performance.now()); else iniciar();
})();
