'use strict';
// Gopher al Rescate · juego individual de las semanas 5 y 6 de POO (arrays, slices y maps en Go).
// Las salidas y los mensajes de error vienen de datos.js, generado compilando y ejecutando cada código con Go.

const J = window.JUEGO;
const CLAVE = 'gopher-rescate-poo-v1';
const TOTAL = J.niveles.reduce((s, n) => s + n.retos.length, 0);

let E = cargar();
let repaso = false;          // al rejugar una misión terminada no se cambia el puntaje

/* ---------------- estado ---------------- */
function cargar() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || { nombre: '', apellido: '', resp: {} }; }
  catch { return { nombre: '', apellido: '', resp: {} }; }
}
function guardar() { localStorage.setItem(CLAVE, JSON.stringify(E)); }
const clave = (n, r) => `${n}-${r}`;
const aciertos = () => Object.values(E.resp).filter(Boolean).length;
const respondidos = () => Object.keys(E.resp).length;
const nivelHecho = n => J.niveles[n].retos.every((_, r) => clave(n, r) in E.resp);
const nivelAbierto = n => n === 0 || nivelHecho(n - 1);
const todoHecho = () => J.niveles.every((_, n) => nivelHecho(n));
function aciertosNivel(n) { return J.niveles[n].retos.filter((_, r) => E.resp[clave(n, r)]).length; }
function estrellas(n) {
  const p = aciertosNivel(n) / J.niveles[n].retos.length;
  return p === 1 ? 3 : p >= .75 ? 2 : p >= .5 ? 1 : 0;
}

/* ---------------- utilidades ---------------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const KW = /^(var|for|range|if|else|func|return|map)$/;
const FN = /^(make|append|len|cap|delete)$/;
const TIPO = /^(string|int|bool|float64)$/;
function resaltar(src) {
  return src.replace(/("(?:[^"\\]|\\.)*")|([A-Za-z_]\w*)|(\d+)|([\s\S])/g, (m, s, w, num) => {
    if (s) return `<span class="s">${esc(s)}</span>`;
    if (w) return KW.test(w) ? `<span class="k">${w}</span>` : FN.test(w) ? `<span class="f">${w}</span>` : TIPO.test(w) ? `<span class="t">${w}</span>` : w;
    if (num) return `<span class="n">${num}</span>`;
    return esc(m);
  });
}
const estrellasHTML = k => `<span class="estrellas">${[0, 1, 2].map(i => `<span class="${i < k ? 'on' : ''}">${ICONO.estrella}</span>`).join('')}</span>`;
const PARTICULAS = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'e']);
function nombreBonito(s) {
  return s.trim().replace(/\s+/g, ' ').toLowerCase().split(' ')
    .map((p, i) => i > 0 && PARTICULAS.has(p) ? p : p.replace(/(^|['-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()))
    .join(' ');
}

function barra() {
  const quien = E.nombre ? `<div class="jugador"><b>${esc(E.nombre)} ${esc(E.apellido)}</b><br>${aciertos()} de ${TOTAL} aciertos</div>` : '';
  return `<header class="top"><div class="logo">${gopherSvg({ ojos: 'feliz' })}<span>Gopher al <b>Rescate</b></span></div>${quien}</header>`;
}
function pintar(html) {
  document.body.innerHTML = barra() + `<main id="app">${html}</main>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
const $ = s => document.querySelector(s);

/* ---------------- memoria: array, slice o map dibujado en casillas ---------------- */
// op: {nombre, valores, clic, base} · base = valores originales, para marcar lo que cambió.
function memoriaHTML(est, op = {}) {
  const nombre = op.nombre || est.nombre, vals = op.valores || est.valores;
  const mismo = nombre === est.nombre, base = mismo && op.valores ? est.valores : null;
  if (!Array.isArray(vals)) {
    const tipo = mismo ? est.go : 'map[string]' + (typeof Object.values(vals)[0] === 'number' ? 'int' : 'string');
    const claves = [...new Set([...Object.keys(base || {}), ...Object.keys(vals)])];
    const pares = claves.map(k => {
      const cl = !(k in vals) ? 'fuera' : base && !(k in base) ? 'nuevo' : base && base[k] !== vals[k] ? 'cambio' : '';
      return `<div class="par ${cl}"><span class="k">"${esc(k)}"</span><span class="fl">→</span><span class="v">${esc(k in vals ? vals[k] : base[k])}</span>${cl === 'fuera' ? '<small>borrada</small>' : ''}</div>`;
    }).join('');
    return `<div class="memoria"><div class="mem-cab"><code>${esc(nombre)}</code><span class="tipo">${tipo}</span><span>len ${Object.keys(vals).length} · sin orden</span></div>
      <div class="pares">${pares}</div>${mismo && est.unidad ? `<p class="leyenda">Cada valor: ${est.unidad}</p>` : ''}</div>`;
  }
  const tipo = mismo ? est.go : '[]' + (typeof vals[0] === 'number' ? 'int' : 'string');
  const etiq = mismo ? est.etiquetas : null;
  const caja = (v, i) => {
    const cl = base ? (i >= base.length ? 'nuevo' : base[i] !== v ? 'cambio' : '') : (mismo ? '' : 'nuevo');
    const dentro = `<span class="idx">[${i}]</span><span class="val">${esc(v)}</span>${etiq ? `<span class="et">${etiq[i]}</span>` : ''}`;
    return op.clic ? `<button class="casilla" data-i="${i}">${dentro}</button>` : `<div class="casilla ${cl}" style="--d:${i * 60}ms">${dentro}</div>`;
  };
  return `<div class="memoria"><div class="mem-cab"><code>${esc(nombre)}</code><span class="tipo">${tipo}</span><span>len ${vals.length}</span></div>
    <div class="casillas">${vals.map(caja).join('')}</div>${mismo && est.unidad ? `<p class="leyenda">Valor de cada casilla: ${est.unidad}</p>` : ''}</div>`;
}

function codigoHTML(nv, rt, src) {
  const base = rt.propia ? '' : `<span class="base">${resaltar(nv.base)}</span>\n`;
  return `<pre class="go">${base}${resaltar(src)}</pre>`;
}
const terminal = (salida, titulo = `Salida real · ${J.go}`) =>
  `<div class="terminal"><div class="term-cab">${ICONO.terminal} ${titulo}</div><pre>${esc(salida)}</pre></div>`;

/* ---------------- pantallas ---------------- */
function inicio() {
  const chips = ['[7]int', '[]string', 'append', 's[1:4]', 'map[K]V', 'coma ok'].map(c => `<span class="chip oscuro">${c}</span>`).join('');
  const registro = E.nombre
    ? `<h2>Hola de nuevo, ${esc(E.nombre)}</h2><p class="suave">Llevas ${respondidos()} de ${TOTAL} retos y ${aciertos()} aciertos.</p>
       <div class="fila-btn"><button class="btn grande" id="seguir">Continuar el rescate ${ICONO.sig}</button></div>
       <div class="fila-btn"><button class="btn sec" id="otro">Soy otra persona / empezar de nuevo</button></div>`
    : `<h2>Registro</h2><p class="suave">Escribe tu nombre y tu apellido: aparecerán en tu certificado.</p>
       <label for="nom">Nombre</label><input type="text" id="nom" autocomplete="given-name" maxlength="30">
       <label for="ape">Apellido</label><input type="text" id="ape" autocomplete="family-name" maxlength="30">
       <p class="aviso" id="aviso"></p>
       <button class="btn grande" id="empezar">Empezar el rescate ${ICONO.sig}</button>`;
  pintar(`<section class="portada">${gopherSvg({ ojos: 'arriba', casco: true })}
      <h1>Gopher al <b>Rescate</b></h1>
      <p>Arrays, slices y maps en Go · Semanas 5 y 6</p>
      <div class="chips-niveles">${chips}</div></section>
    <div class="card">${registro}</div>
    <div class="card"><h2>${ICONO.mapa} Cómo se juega</h2>
      <p>La ciudad tiene <b>6 emergencias</b> y el gopher necesita tu código para resolverlas: cortes de luz, aire contaminado, una sala de emergencias llena, un tramo cerrado del metro, el banco de sangre y un ataque a las contraseñas. Cada misión es más difícil que la anterior.</p>
      <p>En cada reto ves los datos en la memoria, tocas tu respuesta y después miras <b>qué hace Go de verdad</b>, con su salida real. Al terminar recibes tu <b>certificado</b>.</p></div>`);
  if (E.nombre) {
    $('#seguir').onclick = mapa;
    $('#otro').onclick = () => { if (confirm('Se borrará el progreso guardado en este dispositivo. ¿Continuar?')) { E = { nombre: '', apellido: '', resp: {} }; guardar(); inicio(); } };
    return;
  }
  const valido = s => /^[\p{L}][\p{L}' -]{1,29}$/u.test(s.trim());
  $('#empezar').onclick = () => {
    const n = $('#nom').value, a = $('#ape').value;
    if (!valido(n) || !valido(a)) { $('#aviso').textContent = 'Escribe tu nombre y tu apellido (solo letras).'; return; }
    E = { nombre: nombreBonito(n), apellido: nombreBonito(a), resp: {} };
    guardar();
    mapa();
  };
}

function mapa() {
  repaso = false;
  const pct = Math.round(respondidos() / TOTAL * 100);
  const nodos = J.niveles.map((nv, n) => {
    const hecho = nivelHecho(n), abierto = nivelAbierto(n);
    const clase = hecho ? 'hecho' : abierto ? 'actual' : '';
    const der = hecho ? estrellasHTML(estrellas(n)) : abierto ? `<span class="chip">${ICONO.play} Jugar</span>` : `<span class="suave">${ICONO.candado}</span>`;
    return `<button class="nodo ${clase}" data-n="${n}" ${abierto ? '' : 'disabled'}>
      <span class="medalla">${ICONO[nv.icono]}<span class="num">${n + 1}</span></span>
      <span><b>Misión ${n + 1} · ${nv.caso}</b><small>${nv.titulo} · ${nv.clave}</small></span>${der}</button>`;
  }).join('');
  pintar(`<h2>${ICONO.mapa} Mapa del rescate</h2>
    <div class="progreso"><i style="width:${pct}%"></i></div>
    <div class="mapa">${nodos}</div>
    ${todoHecho() ? `<div class="fila-btn"><button class="btn grande" id="cert">${ICONO.trofeo} Ver mi certificado</button></div>` : ''}`);
  document.querySelectorAll('.nodo:not(:disabled)').forEach(b => { b.onclick = () => intro(+b.dataset.n); });
  if (todoHecho()) $('#cert').onclick = certificado;
}

const casoHTML = nv => `<div class="caso">${ICONO[nv.icono]}<div><b>${nv.caso}</b>${esc(nv.contexto)}</div></div>`;

function intro(n) {
  const nv = J.niveles[n];
  repaso = nivelHecho(n);
  pintar(`<div class="cabeza-reto"><button class="btn sec" id="volver">${ICONO.mapa} Mapa</button>
      <span class="chip oscuro">Misión ${n + 1} · ${nv.titulo}</span></div>
    <div class="globo">${gopherSvg({ ojos: 'arriba', casco: true })}<div class="texto">${esc(nv.intro)}</div></div>
    <div class="card">
      ${casoHTML(nv)}
      ${memoriaHTML(nv.estructura)}
      <p class="suave" style="margin:12px 0 6px">Así se declara en Go:</p>
      <pre class="go">${resaltar(nv.base)}</pre>
      ${repaso ? '<p class="suave"><b>Modo repaso:</b> ya terminaste esta misión; tu puntaje no cambia.</p>' : ''}
      <div class="fila-btn"><button class="btn grande" id="comenzar">Comenzar los ${nv.retos.length} retos ${ICONO.sig}</button></div>
    </div>`);
  $('#volver').onclick = mapa;
  $('#comenzar').onclick = () => reto(n, 0);
}

function reto(n, r) {
  const nv = J.niveles[n], rt = nv.retos[r];
  const puntos = nv.retos.map((_, k) => {
    const c = clave(n, k);
    return `<i class="${k === r ? 'ahora' : c in E.resp && !repaso ? (E.resp[c] ? 'ok' : 'no') : ''}"></i>`;
  }).join('');
  const conMemoria = !rt.propia && rt.tipo !== 'casilla' && rt.tipo !== 'clasifica';
  const codigo = rt.tipo === 'opcion' && !rt.oculto ? codigoHTML(nv, rt, rt.codigo)
    : rt.tipo === 'casilla' ? codigoHTML(nv, rt, rt.codigo) : '';
  pintar(`<div class="cabeza-reto"><button class="btn sec" id="volver">${ICONO.mapa} Mapa</button>
      <span class="chip oscuro">Misión ${n + 1} · Reto ${r + 1} de ${nv.retos.length}</span><span class="puntos">${puntos}</span></div>
    <div class="card">
      ${casoHTML(nv)}
      <div class="${conMemoria ? 'reto-cuerpo' : ''}">
        ${conMemoria ? `<div>${memoriaHTML(nv.estructura)}</div>` : ''}
        <div><p class="pregunta">${esc(rt.pregunta)}</p>${codigo}<div id="zona"></div></div>
      </div>
      <div class="fila-btn oculto" id="nav"><button class="btn sec" id="reabrir">${ICONO.ojo} Ver retroalimentación</button>
        <button class="btn grande" id="siguiente2"></button></div>
    </div>
    <dialog id="dlg" aria-labelledby="dlg-titulo">
      <div class="dlg-cuerpo" id="retro"></div>
      <div class="dlg-pie"><button class="btn sec" id="cerrar">${ICONO.cerrar} Cerrar</button><button class="btn grande" id="siguiente"></button></div>
    </dialog>`);
  $('#volver').onclick = mapa;
  ({ casilla: zonaCasilla, opcion: zonaOpciones, error: zonaError, clasifica: zonaClasifica })[rt.tipo](n, r, rt);
}

/* ---------------- tipos de reto ---------------- */
function zonaCasilla(n, r, rt) {
  const est = J.niveles[n].estructura, multi = rt.correctas.length > 1, elegidas = new Set();
  $('#zona').innerHTML = `<p class="instruccion">${multi ? 'Toca las casillas y luego pulsa «Listo».' : 'Toca una casilla.'}</p>${memoriaHTML(est, { clic: true })}
    ${multi ? `<div class="fila-btn"><button class="btn azul" id="listo" disabled>${ICONO.bien} Listo</button></div>` : ''}`;
  const terminar = sel => {
    const ok = sel.length === rt.correctas.length && sel.every(i => rt.correctas.includes(i));
    document.querySelectorAll('#zona .casilla').forEach(b => {
      const i = +b.dataset.i;
      b.disabled = true; b.classList.remove('sel');
      if (rt.correctas.includes(i)) b.classList.add('ok');
      else if (sel.includes(i)) b.classList.add('no');
    });
    if (multi) $('#listo').disabled = true;
    const una = sel[0], quien = est.etiquetas ? `${est.etiquetas[una]}, ` : '';
    const porque = ok ? '' : multi ? rt.pista : `Tocaste la casilla [${una}] (${quien}${est.valores[una]}). ${rt.pista}`;
    responder(n, r, ok, porque);
  };
  document.querySelectorAll('#zona .casilla').forEach(b => {
    b.onclick = () => {
      const i = +b.dataset.i;
      if (!multi) { terminar([i]); return; }
      if (elegidas.has(i)) elegidas.delete(i); else elegidas.add(i);
      b.classList.toggle('sel', elegidas.has(i));
      $('#listo').disabled = !elegidas.size;
    };
  });
  if (multi) $('#listo').onclick = () => terminar([...elegidas]);
}

function barajar(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function zonaOpciones(n, r, rt) {
  const orden = barajar(rt.opciones.map((_, i) => i));
  $('#zona').innerHTML = `<div class="opciones">${orden.map(i =>
    `<button class="op cod" data-i="${i}">${esc(rt.opciones[i])}</button>`).join('')}</div>`;
  document.querySelectorAll('.op').forEach(b => {
    b.onclick = () => {
      const i = +b.dataset.i, ok = i === rt.correcta;
      document.querySelectorAll('.op').forEach(x => { x.disabled = true; });
      document.querySelector(`.op[data-i="${rt.correcta}"]`).classList.add('ok');
      if (!ok) b.classList.add('no');
      responder(n, r, ok, ok ? '' : rt.porque[i]);
    };
  });
}

function zonaError(n, r, rt) {
  const nv = J.niveles[n];
  const base = rt.propia ? '' : `<div class="linea base">${resaltar(nv.base)}</div>`;
  $('#zona').innerHTML = `<div class="lineas">${base}${rt.lineas.map((l, i) => `<button class="linea" data-i="${i}">${resaltar(l)}</button>`).join('')}</div>`;
  document.querySelectorAll('button.linea').forEach(b => {
    b.onclick = () => {
      const i = +b.dataset.i, ok = i === rt.mala;
      document.querySelectorAll('button.linea').forEach(x => { x.disabled = true; });
      document.querySelector(`.linea[data-i="${rt.mala}"]`).classList.add('ok');
      if (!ok) b.classList.add('no');
      responder(n, r, ok, ok ? '' : `Esa línea está bien. Go marca el error en: ${rt.lineas[rt.mala].trim()}`);
    };
  });
}

function zonaClasifica(n, r, rt) {
  const elegido = rt.items.map(() => null);
  $('#zona').innerHTML = `<div class="clasif">${rt.items.map(([txt], k) => `<div class="cond" data-k="${k}"><span>${esc(txt)}</span>
      <div class="dos">${rt.opciones.map(o => `<button data-v="${o}">${o}</button>`).join('')}</div><div class="porque oculto"></div></div>`).join('')}</div>
    <div class="fila-btn"><button class="btn azul" id="comprobar" disabled>Comprobar</button></div>`;
  document.querySelectorAll('.cond').forEach(c => {
    const k = +c.dataset.k;
    c.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        elegido[k] = b.dataset.v;
        c.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        $('#comprobar').disabled = elegido.includes(null);
      };
    });
  });
  $('#comprobar').onclick = () => {
    let bien = 0;
    document.querySelectorAll('.cond').forEach(c => {
      const k = +c.dataset.k, [, correcto, porque] = rt.items[k];
      c.querySelectorAll('button').forEach(b => {
        b.disabled = true; b.classList.remove('on');
        if (b.dataset.v === correcto) b.classList.add('ok');
        else if (b.dataset.v === elegido[k]) b.classList.add('no');
      });
      if (elegido[k] === correcto) bien++;
      const p = c.querySelector('.porque'); p.textContent = porque; p.classList.remove('oculto');
    });
    $('#comprobar').disabled = true;
    const ok = bien === rt.items.length;
    responder(n, r, ok, ok ? '' : `Acertaste ${bien} de ${rt.items.length}. Revisa el porqué debajo de cada dato.`);
  };
}

/* ---------------- respuesta, explicación y avance ---------------- */
function responder(n, r, ok, porque) {
  const nv = J.niveles[n], rt = nv.retos[r];
  if (!repaso) { E.resp[clave(n, r)] = ok; guardar(); }
  const arte = ok ? gopherSvg({ ojos: 'feliz', boca: 'abierta' }) : sticker(rt.sticker ?? [3, 7][(n + r) % 2]);
  $('#retro').innerHTML = `<div class="retro ${ok ? 'ok' : 'no'}">${arte}<div>
      <h3 id="dlg-titulo">${ok ? '¡Correcto!' : 'No es correcto'}</h3>
      ${porque ? `<p><b>Por qué no:</b> ${esc(porque)}</p>` : ''}
      <p>${esc(rt.explica)}</p></div></div>${solucion(nv, rt)}`;
  const dlg = $('#dlg'), ultimo = r === nv.retos.length - 1;
  const avanzar = () => { dlg.close(); if (ultimo) finNivel(n); else reto(n, r + 1); };
  ['#siguiente', '#siguiente2'].forEach(b => {
    $(b).innerHTML = ultimo ? `Terminar la misión ${ICONO.sig}` : `Siguiente reto ${ICONO.sig}`;
    $(b).onclick = avanzar;
  });
  $('#cerrar').onclick = () => dlg.close();
  $('#reabrir').onclick = () => dlg.showModal();
  // al cerrar (botón, Esc o toque fuera) queda la barra para reabrir; si ya se cambió de pantalla, no hace nada
  dlg.onclose = () => { if (dlg.isConnected) $('#nav').classList.remove('oculto'); };
  dlg.onclick = e => { if (e.target === dlg) dlg.close(); };
  const jug = document.querySelector('header .jugador');
  if (jug) jug.innerHTML = `<b>${esc(E.nombre)} ${esc(E.apellido)}</b><br>${aciertos()} de ${TOTAL} aciertos`;
  dlg.showModal();
  $('#retro').scrollTop = 0;
}

function solucion(nv, rt) {
  if (rt.tipo === 'clasifica') return '';
  let html = `<div class="paso-a-paso"><h2>${ICONO.codigo} Qué hace Go</h2>`;
  if (rt.tipo === 'error') {
    html += `<div class="msg"><b>Mensaje de Go al ${rt.fase === 'compilar' ? 'compilar' : 'ejecutar'}:</b>\n${esc(rt.mensaje)}</div>
      <h3 class="sub">Código corregido</h3>${codigoHTML(nv, rt, rt.corregida)}`;
  } else if (rt.oculto) {
    html += codigoHTML(nv, rt, rt.codigo);
  }
  html += terminal(rt.salida);
  if (rt.despues) {
    html += `<h3 class="sub">${ICONO.memoria} Así queda la memoria</h3>${memoriaHTML(nv.estructura, { nombre: rt.despues.variable, valores: rt.despues.valores })}`;
  }
  return html + '</div>';
}

function confeti() {
  const c = document.createElement('div'); c.className = 'confeti';
  const colores = ['#EAAA00', '#FFFFFF', '#910048', '#6AD7E5', '#1E9E5A'];
  c.innerHTML = Array.from({ length: 70 }, () => `<i style="left:${Math.random() * 100}%;background:${colores[Math.floor(Math.random() * colores.length)]};animation-duration:${2 + Math.random() * 2.5}s;animation-delay:${Math.random() * .8}s"></i>`).join('');
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 5000);
}

function finNivel(n) {
  const nv = J.niveles[n], est = estrellas(n), bien = aciertosNivel(n);
  const msj = repaso ? 'Repaso terminado. Tu puntaje no cambia.' :
    est === 3 ? '¡Misión perfecta!' : est === 2 ? '¡Muy bien! Casi perfecta.' : est === 1 ? 'Bien. Repasa los porqués antes de la siguiente misión.' : 'Revisa las explicaciones: la siguiente misión usa lo de esta.';
  const siguiente = n + 1 < J.niveles.length;
  pintar(`<div class="card fin">${gopherSvg(est >= 2 ? { ojos: 'feliz', boca: 'abierta', casco: true } : { ojos: 'normal', casco: true })}
      <h2 style="justify-content:center">Misión ${n + 1} · ${nv.caso}</h2>
      ${estrellasHTML(est)}
      <p><b>${bien} de ${nv.retos.length}</b> retos correctos · ${msj}</p>
      <div class="fila-btn">
        ${siguiente ? `<button class="btn grande" id="sig">Ir a la misión ${n + 2} ${ICONO.sig}</button>` : `<button class="btn grande" id="cert">${ICONO.trofeo} Ver mi certificado</button>`}
      </div>
      <div class="fila-btn"><button class="btn sec" id="mapa">${ICONO.mapa} Volver al mapa</button></div></div>`);
  if (est >= 2 && !repaso) confeti();
  $('#mapa').onclick = mapa;
  if (siguiente) $('#sig').onclick = () => intro(n + 1);
  else $('#cert').onclick = certificado;
}

/* ---------------- certificado ---------------- */
function rango(p) { return p >= 90 ? 'Gopher experto' : p >= 75 ? 'Gopher rescatista' : p >= 50 ? 'Gopher en entrenamiento' : 'Gopher aprendiz'; }
function codigo(texto) {
  let h = 0x811c9dc5;
  for (const ch of texto) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  const s = h.toString(36).toUpperCase().padStart(8, '0').slice(-8);
  return s.slice(0, 4) + '-' + s.slice(4);
}
const cargarImg = src => new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = src; });

async function dibujarCertificado() {
  try { await Promise.all([document.fonts.load('800 60px Poppins'), document.fonts.load('600 30px Poppins'), document.fonts.load('400 28px Poppins')]); } catch { /* sigue con la fuente del sistema */ }
  const W = 1600, H = 1131, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const AZUL = '#002C71', DORADO = '#EAAA00', MAG = '#910048', GRIS = '#4a5461';
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#fbf7ec'; x.fillRect(60, 60, W - 120, H - 120);
  x.strokeStyle = DORADO; x.lineWidth = 16; x.strokeRect(28, 28, W - 56, H - 56);
  x.strokeStyle = AZUL; x.lineWidth = 3; x.strokeRect(60, 60, W - 120, H - 120);
  x.fillStyle = DORADO;
  [[60, 60, 1, 1], [W - 60, 60, -1, 1], [60, H - 60, 1, -1], [W - 60, H - 60, -1, -1]].forEach(([a, b, sx, sy]) => {
    x.beginPath(); x.moveTo(a, b); x.lineTo(a + 84 * sx, b); x.lineTo(a, b + 84 * sy); x.closePath(); x.fill();
  });
  try { const logo = await cargarImg('logo-uide.png'); const h = 120, w = logo.width * h / logo.height; x.drawImage(logo, 110, 92, w, h); } catch { /* sin logo */ }
  try {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 136" width="240" height="272">${gopher({ ojos: 'feliz', boca: 'abierta', casco: true })}</svg>`;
    const im = await cargarImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
    x.drawImage(im, W - 290, 86, 176, 200);
  } catch { /* sin mascota */ }
  const centro = (txt, y, fuente, color) => { x.font = fuente; x.fillStyle = color; x.textAlign = 'center'; x.fillText(txt, W / 2, y); };
  centro('CERTIFICADO DE LOGRO', 330, '800 66px Poppins, sans-serif', AZUL);
  x.fillStyle = DORADO; x.fillRect(W / 2 - 160, 352, 320, 6);
  centro('Se otorga a', 425, '400 30px Poppins, sans-serif', GRIS);
  const nombre = `${E.nombre} ${E.apellido}`;
  let tam = 78; x.font = `800 ${tam}px Poppins, sans-serif`;
  while (x.measureText(nombre).width > W - 360 && tam > 40) { tam -= 4; x.font = `800 ${tam}px Poppins, sans-serif`; }
  centro(nombre, 515, `800 ${tam}px Poppins, sans-serif`, MAG);
  x.strokeStyle = DORADO; x.lineWidth = 3; x.beginPath(); x.moveTo(W / 2 - 420, 545); x.lineTo(W / 2 + 420, 545); x.stroke();
  centro('por completar las 6 misiones de Gopher al Rescate: arrays, slices y maps en Go', 610, '600 30px Poppins, sans-serif', AZUL);
  centro('[N]T · []T · append · s[ini:fin] · map[K]V · coma ok · delete', 658, '600 24px "JetBrains Mono", Consolas, monospace', GRIS);
  centro('IFT 365 · Programación Orientada a Objetos · Semanas 5 y 6 · Universidad Internacional del Ecuador', 704, '400 24px Poppins, sans-serif', GRIS);
  const a = aciertos(), p = Math.round(a / TOTAL * 100);
  const datos = [[`${a} de ${TOTAL}`, 'aciertos'], [`${p} %`, 'de logro'], [rango(p), 'nivel alcanzado']];
  datos.forEach(([v, et], i) => {
    const cx = W / 2 + (i - 1) * 420, y = 760;
    x.fillStyle = i === 2 ? '#fdf2f7' : '#eef3fb'; x.strokeStyle = i === 2 ? MAG : AZUL; x.lineWidth = 2;
    x.beginPath();
    if (x.roundRect) x.roundRect(cx - 190, y, 380, 110, 18); else x.rect(cx - 190, y, 380, 110);
    x.fill(); x.stroke();
    x.textAlign = 'center'; x.fillStyle = i === 2 ? MAG : AZUL;
    let t = 40; x.font = `800 ${t}px Poppins, sans-serif`;
    while (x.measureText(v).width > 350 && t > 22) { t -= 2; x.font = `800 ${t}px Poppins, sans-serif`; }
    x.fillText(v, cx, y + 58);
    x.font = '400 20px Poppins, sans-serif'; x.fillStyle = GRIS; x.fillText(et, cx, y + 92);
  });
  const fecha = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
  x.textAlign = 'left'; x.fillStyle = GRIS; x.font = '400 24px Poppins, sans-serif';
  x.fillText(fecha.charAt(0).toUpperCase() + fecha.slice(1), 130, 985);
  x.font = '400 18px Poppins, sans-serif'; x.fillText('Fecha', 130, 1012);
  x.strokeStyle = GRIS; x.lineWidth = 1.5; x.beginPath(); x.moveTo(1000, 970); x.lineTo(1420, 970); x.stroke();
  x.textAlign = 'center'; x.fillStyle = AZUL; x.font = '600 24px Poppins, sans-serif';
  x.fillText('Mgtr. María del Carmen Salazar Torres', 1210, 1004);
  x.fillStyle = GRIS; x.font = '400 18px Poppins, sans-serif'; x.fillText('Docente', 1210, 1030);
  centro(`Código de verificación: ${codigo(`${nombre}|${a}|${fecha}`)}`, 1040, '400 18px "JetBrains Mono", Consolas, monospace', '#8a95a1');
  return c;
}

async function certificado() {
  if (!todoHecho()) { mapa(); return; }
  pintar(`<div class="card centro"><h2 style="justify-content:center">${ICONO.trofeo} Tu certificado</h2>
      <p class="suave">Generando…</p><div id="certzona"></div></div>`);
  const c = await dibujarCertificado();
  const url = c.toDataURL('image/png');
  const archivo = `Certificado-${E.nombre}-${E.apellido}.png`.replace(/\s+/g, '-');
  $('#certzona').innerHTML = `<img class="cert" src="${url}" alt="Certificado de ${esc(E.nombre)} ${esc(E.apellido)}">
    <div class="fila-btn"><a class="btn grande" id="descargar" href="${url}" download="${esc(archivo)}">${ICONO.descargar} Descargar certificado</a></div>
    <p class="suave">En el celular también puedes mantener presionada la imagen para guardarla.</p>
    <div class="fila-btn"><button class="btn sec" id="mapa">${ICONO.mapa} Volver al mapa</button></div>`;
  document.querySelector('.card .suave').remove();
  $('#mapa').onclick = mapa;
  confeti();
}

/* ---------------- arranque ---------------- */
inicio();
