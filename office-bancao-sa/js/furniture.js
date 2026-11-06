/* ===========================================================
   furniture.js — mobiliário do Bancão SA - Office
   Estética do projeto real: MDF cor Itapuã, branco, preto fosco,
   cadeiras de tela branca, sofá verde-petróleo, poltronas azuis,
   grama sintética e madeira.

   Convenção de altura (px acima do piso):
     0 .. 25   estrutura da mesa
     28        tampo  (tudo que fica "em cima da mesa" nasce aqui)
     28 .. 64  monitor
   =========================================================== */
const FURN = (() => {

  const items = [];
  const workSlots = [];
  const restSlots = [];
  const meetSlots = [];

  const TOP = 28;
  const S   = ISO.toScreen;
  const add = (o) => { items.push(o); return o; };

  /* paleta de materiais */
  const M = {
    mad: '#c9a074', madE: '#8b5e3c', nogueira: '#6e4a31',
    branco: '#f3f2ee', gelo: '#e4e3df', grafite: '#2b2e34', preto: '#1d1f24',
    alu: '#c4c8cf', teal: '#2e6d72', azul: '#2b4bff', azulE: '#1b2a8f',
    laranja: '#f25a1d', vermelho: '#d6402e', ouro: '#e8a317', pix: '#32bcad'
  };

  function block(x, y, w, d) {
    for (let i = Math.floor(x); i < Math.ceil(x + w); i++)
      for (let j = Math.floor(y); j < Math.ceil(y + d); j++)
        WORLD.setBlocked(i, j, 1);
  }
  const addB = (o) => { add(o); block(o.x, o.y, o.w || 1, o.d || 1); return o; };

  /** cadeira em duas camadas, para o boneco sentar DENTRO dela */
  function cadeira(seat, tipo) {
    const L = 1.05 * AVATAR.SCALE;
    const comum = { x: seat.x - L / 2, y: seat.y - L / 2, w: L, d: L, face: seat.facing };
    add(Object.assign({ t: tipo, camada: 'tras',   dk: seat.x + seat.y - 0.25 }, comum));
    return add(Object.assign({ t: tipo, camada: 'frente', dk: seat.x + seat.y + 0.75 }, comum));
  }

  /** bancada de estações: fileira de cima de frente para nós, a de baixo de costas */
  function bancada(prefixo, labels, x0, yMid, cols, sala, extra = {}, soNorte = false) {
    let n = 0;
    const lado = (face, i) => {
      const x = x0 + i * 3;
      const id = prefixo + String(++n).padStart(2, '0');
      const deskY = face === 's' ? yMid - 1.3 : yMid;
      const seat = face === 's' ? { x: x + 1.5, y: yMid - 2.0, facing: 's' }
                                : { x: x + 1.5, y: yMid + 2.0, facing: 'n' };
      const mesa = add(Object.assign({ t: 'deskOffice', id, x, y: deskY, w: 3, d: 1.3,
                                       face, busy: false, sabor: n }, extra));
      block(x, deskY, 3, 1.3);
      cadeira(seat, 'chairOffice');
      workSlots.push({ id, room: sala, label: labels(n), x: seat.x, y: seat.y,
                       facing: seat.facing, obj: mesa });
    };
    if (!soNorte) for (let i = 0; i < cols; i++) lado('s', i);
    for (let i = 0; i < cols; i++) lado('n', i);
  }

  const rest = (o) => { restSlots.push(Object.assign({ sit: true }, o)); };

  /* ===========================================================
     LAYOUT
     =========================================================== */

  /* ---------- OPERAÇÃO · OPEN SPACE: 12 estações (2 bancadas de 6) ---------- */
  bancada('E', n => 'Estação E' + String(n).padStart(2, '0'), 16, 22.5, 3, 'servico');
  {
    // a segunda bancada continua a numeração: E07..E12
    const antes = workSlots.length;
    bancada('X', n => '', 16, 28.6, 3, 'servico');
    for (let i = antes; i < workSlots.length; i++) {
      const id = 'E' + String(i - antes + 7).padStart(2, '0');
      workSlots[i].id = id; workSlots[i].label = 'Estação ' + id; workSlots[i].obj.id = id;
    }
  }
  addB({ t: 'muxarabi', x: 26.1, y: 19.4, w: .26, d: 6.2 });
  addB({ t: 'armarioImpressora', x: 27.2, y: 18.15, w: 2.5, d: .8, parede: true });
  const altaOp = addB({ t: 'mesaAlta', x: 27.6, y: 22.4, w: 1.3, d: 1.3 });
  rest({ id: 'OPA0', room: 'servico', label: 'mesa alta', x: 27.2, y: 25.1, facing: 'n', sit: false,
         act: 'café em pé com o time', obj: altaOp });
  addB({ t: 'quadroMovel', x: 27.0, y: 27.0, w: 2.2, d: .3 });
  addB({ t: 'bebedouro', x: 28.7, y: 29.5 });
  addB({ t: 'plant', x: 28.6, y: 30.5, k: 0 });

  /* ---------- TECNOLOGIA: sala dos desenvolvedores ---------- */
  bancada('T', n => 'Dev ' + n, 32, 22.8, 2, 'tecnologia', { dev: true });
  {
    const antes = workSlots.length;
    bancada('Y', n => '', 32, 27.4, 2, 'tecnologia', { dev: true }, true);
    for (let i = antes; i < workSlots.length; i++) {
      const id = 'T' + String(i - antes + 5).padStart(2, '0');
      workSlots[i].id = id; workSlots[i].label = 'Dev ' + (i - antes + 5); workSlots[i].obj.id = id;
    }
  }
  addB({ t: 'kanban', x: 31.4, y: 18.1, w: 4.4, d: .3, parede: true });
  addB({ t: 'rack', x: 38.4, y: 18.2, w: 1.2, d: 1 });
  addB({ t: 'plant', x: 38.6, y: 30.6, k: 1 });
  addB({ t: 'plant', x: 31.2, y: 30.6, k: 0 });

  /* ---------- DIRETORIA (CEO) ---------- */
  const seatCEO = { x: 5.1, y: 2.9, facing: 's' };
  const mesaCEO = add({ t: 'deskBoss', id: 'DIR-1', x: 3, y: 3.6, w: 4.2, d: 1.6, face: 's', busy: false });
  block(3, 3.6, 4.2, 1.6);
  cadeira(seatCEO, 'chairBoss');
  workSlots.push({ id: 'DIR-1', room: 'diretoria', label: 'Mesa do CEO',
                   x: seatCEO.x, y: seatCEO.y, facing: 's', obj: mesaCEO, vip: true });
  addB({ t: 'estante', x: 9.0, y: 1.1, w: 3.2, d: .6, parede: true });
  addB({ t: 'sofa', x: 3.4, y: 7.4, w: 4.2, d: 1.3, dir: 'n', c: M.teal });
  addB({ t: 'mesinha', x: 4.7, y: 9.2, w: 1.5, d: 1.0 });
  addB({ t: 'poltrona', x: 8.4, y: 8.6, w: 1.2, d: 1.2, dir: 'e', c: M.azul });
  addB({ t: 'plant', x: 11.2, y: 11.2, k: 1 });
  addB({ t: 'plant', x: 1.3,  y: 11.3, k: 0 });
  addB({ t: 'aparador', x: 9.2, y: 4.2, w: .7, d: 2.4 });

  /* ---------- SALA DE REUNIÃO ---------- */
  add({ t: 'tvWall', x: 16.8, y: 1.0, w: 4.6, d: .22, meeting: true, parede: true });
  const mtable = addB({ t: 'meetTable', x: 16, y: 5, w: 6, d: 2.6 });
  [17, 19, 21].forEach((x, i) => {
    const s = { id: 'MT' + i, room: 'reuniao', x, y: 4.25, facing: 's', sit: true, obj: mtable };
    meetSlots.push(s); cadeira(s, 'chairMeet');
  });
  [17, 19, 21].forEach((x, i) => {
    const s = { id: 'MB' + i, room: 'reuniao', x, y: 8.35, facing: 'n', sit: true, obj: mtable };
    meetSlots.push(s); cadeira(s, 'chairMeet');
  });
  [{ id: 'ML', x: 15.2, y: 6.3, facing: 'e' }, { id: 'MR', x: 22.8, y: 6.3, facing: 'w' }].forEach(p => {
    const s = Object.assign({ sit: true, room: 'reuniao', obj: mtable }, p);
    meetSlots.push(s); cadeira(s, 'chairMeet');
  });
  addB({ t: 'plant', x: 23.6, y: 1.2, k: 1 });
  addB({ t: 'plant', x: 14.2, y: 11.2, k: 0 });

  /* ---------- DEPARTAMENTO COMERCIAL & FINANCEIRO ---------- */
  bancada('F', n => ['Comercial 1', 'Comercial 2', 'Financeiro 1', 'Financeiro 2'][n - 1],
          27, 6.5, 2, 'comercial');
  addB({ t: 'mesaApoio', x: 33.4, y: 8.6, w: 2, d: 2 });
  [{ x: 34.4, y: 8.0, f: 's' }, { x: 35.95, y: 9.6, f: 'w' }, { x: 34.4, y: 11.3, f: 'n' }]
    .forEach(p => cadeira({ x: p.x, y: p.y, facing: p.f }, 'chairMeet'));
  addB({ t: 'arquivo', x: 35.2, y: 1.15, w: 1.5, d: .8, parede: true });
  addB({ t: 'plant', x: 26.2, y: 11.2, k: 0 });

  /* ---------- ESTÚDIO DE PODCAST ---------- */
  const pod = addB({ t: 'mesaPodcast', x: 40.1, y: 5.2, w: 2.4, d: 2.4 });
  [{ id: 'POD0', x: 39.25, y: 6.4, facing: 'e' }, { id: 'POD1', x: 43.35, y: 6.4, facing: 'w' },
   { id: 'POD2', x: 41.3, y: 8.45, facing: 'n' }].forEach(p => {
    cadeira(p, 'chairStudio');
    rest({ id: p.id, room: 'podcast', label: 'podcast', x: p.x, y: p.y, facing: p.facing,
           act: 'gravando o Bancão Cast', obj: pod });
  });
  addB({ t: 'tripe', x: 41.0, y: 10.6, w: .8, d: .8 });
  addB({ t: 'ringLight', x: 38.4, y: 10.4, w: .8, d: .8 });
  addB({ t: 'ringLight', x: 44.2, y: 10.4, w: .8, d: .8 });

  /* ---------- CRIATIVOS · PUBLICIDADE ---------- */
  add({ t: 'fundoInfinito', x: 52.4, y: 1.05, w: 5.6, d: .4, parede: true });
  addB({ t: 'softbox', x: 51.3, y: 4.8, w: .8, d: .8 });
  addB({ t: 'softbox', x: 57.7, y: 4.8, w: .8, d: .8 });
  addB({ t: 'tripe', x: 54.7, y: 6.3, w: .8, d: .8 });
  addB({ t: 'produto', x: 54.7, y: 2.9, w: .9, d: .9 });
  bancada('G', n => 'Criação ' + n, 48, 10.2, 2, 'criativos', { criativo: true });
  addB({ t: 'estanteCriativa', x: 56.9, y: 7.4, w: .9, d: 3.4 });
  addB({ t: 'plant', x: 57.5, y: 11.3, k: 1 });

  /* ---------- RECEPÇÃO ---------- */
  const balcao = add({ t: 'balcao', x: 6, y: 21, w: 3.8, d: 1.3, face: 's', busy: false, img: true });
  block(6, 21, 3.8, 1.3);
  const seatRec = { x: 7.9, y: 20.1, facing: 's' };
  cadeira(seatRec, 'chairOffice');
  workSlots.push({ id: 'R01', room: 'recepcao', label: 'Recepção', x: seatRec.x, y: seatRec.y,
                   facing: 's', obj: balcao });
  [{ id: 'RCP0', y: 26.9 }, { id: 'RCP1', y: 29.7 }].forEach(p => {
    const o = addB({ t: 'poltrona', x: 4.6, y: p.y, w: 1.2, d: 1.2, dir: 'e', c: M.azul });
    rest({ id: p.id, room: 'recepcao', label: 'poltrona', x: 5.2, y: p.y + .6, facing: 'w',
           act: 'vendo o video wall', obj: o });
  });
  addB({ t: 'mesinhaRedonda', x: 4.75, y: 28.35, w: .9, d: .9 });
  addB({ t: 'plant', x: 12.4, y: 18.3, k: 1 });
  addB({ t: 'plant', x: 12.4, y: 30.6, k: 0 });
  addB({ t: 'aparador', x: 12.9, y: 26.2, w: .7, d: 2.6 });

  /* ---------- AUDITÓRIO ---------- */
  addB({ t: 'palco', x: 41.2, y: 18.3, w: 17.4, d: 3.4 });
  add({ t: 'telao', x: 44.4, y: 18.05, w: 10.4, d: .35, parede: true });
  addB({ t: 'pulpito', x: 56.0, y: 19.6, w: .8, d: .7 });
  const TIER = [21, 36, 51];
  TIER.forEach((h, i) => {
    const y = 24.0 + i * 2.0;
    const o = addB({ t: 'degrau', x: 43.0, y, w: 14.4, d: 2.0, h, nivel: i });
    for (let k = 0; k < 7; k++) {
      rest({ id: 'AUD' + i + k, room: 'auditorio', label: 'arquibancada', x: 44.2 + k * 2.0,
             y: y + .9, facing: 'n', z: h - AVATAR.SEAT * AVATAR.SCALE,
             act: 'assistindo no auditório', obj: o });
    }
  });
  [[45.05, 22.05, 200], [49.05, 22.05, 30], [53.05, 22.05, 180]].forEach((b, i) => {
    const o = addB({ t: 'beanbag', x: b[0], y: b[1], hue: b[2], w: .9, d: .9 });
    rest({ id: 'AUDP' + i, room: 'auditorio', label: 'puff', x: b[0] + .45, y: b[1] + .45,
           facing: 'n', act: 'na primeira fila', obj: o });
  });
  // plantas de um tile só: os corredores laterais da arquibancada ficam livres
  addB({ t: 'plant', x: 41.0, y: 30.0, k: 1 });
  addB({ t: 'plant', x: 58.0, y: 30.0, k: 1 });

  /* ---------- SALA DE JOGOS ---------- */
  const pool = addB({ t: 'poolTable', x: 4.5, y: 38.2, w: 4.4, d: 2.4 });
  rest({ id: 'POOL0', room: 'lounge', label: 'sinuca', x: 3.6, y: 39.4, facing: 'e', sit: false, act: 'na sinuca', obj: pool });
  rest({ id: 'POOL1', room: 'lounge', label: 'sinuca', x: 9.8, y: 39.4, facing: 'w', sit: false, act: 'na sinuca', obj: pool });
  rest({ id: 'POOL2', room: 'lounge', label: 'sinuca', x: 6.7, y: 41.6, facing: 'n', sit: false, act: 'na sinuca', obj: pool });
  const peb = addB({ t: 'foosball', x: 12.0, y: 38.0, w: 3.2, d: 1.6 });
  rest({ id: 'PEB0', room: 'lounge', label: 'pebolim', x: 11.2, y: 38.8, facing: 'e', sit: false, act: 'no pebolim', obj: peb });
  rest({ id: 'PEB1', room: 'lounge', label: 'pebolim', x: 15.9, y: 38.8, facing: 'w', sit: false, act: 'no pebolim', obj: peb });
  const ping = addB({ t: 'pingPong', x: 11.4, y: 41.6, w: 3.4, d: 1.9 });
  rest({ id: 'PING0', room: 'lounge', label: 'pingue-pongue', x: 10.6, y: 42.55, facing: 'e', sit: false, act: 'no pingue-pongue', obj: ping });
  rest({ id: 'PING1', room: 'lounge', label: 'pingue-pongue', x: 15.6, y: 42.55, facing: 'w', sit: false, act: 'no pingue-pongue', obj: ping });
  add({ t: 'tvRack', x: 1.05, y: 40.9, w: .6, d: 2.8 });
  block(1, 40.9, 1, 2.8);
  [[3.05, 41.05, 175], [3.05, 43.05, 25]].forEach((b, i) => {
    const o = addB({ t: 'beanbag', x: b[0], y: b[1], hue: b[2], w: .9, d: .9 });
    rest({ id: 'GAME' + i, room: 'lounge', label: 'puff', x: b[0] + .45, y: b[1] + .45, facing: 'w',
           act: 'jogando videogame', obj: o });
  });

  /* ---------- CAFÉ PIX & COPA ---------- */
  add({ t: 'pixWall', x: 18.2, y: 37.05, w: 5.4, d: .3, parede: true, img: true });
  const cafe = addB({ t: 'balcaoCafe', x: 18.7, y: 37.4, w: 3.4, d: .9 });
  rest({ id: 'CAF0', room: 'cafe', label: 'café', x: 19.6, y: 38.95, facing: 'n', sit: false, act: 'tomando um café', obj: cafe });
  rest({ id: 'CAF1', room: 'cafe', label: 'café', x: 21.3, y: 38.95, facing: 'n', sit: false, act: 'tomando um café', obj: cafe });
  addB({ t: 'bancadaCopa', x: 22.3, y: 37.1, w: 1.0, d: .8, so: 'micro' });
  addB({ t: 'geladeira', x: 23.4, y: 37.1, w: 1.1, d: .9 });
  addB({ t: 'wc', x: 27.5, y: 37.0, w: 2.15, d: 2.6, n: 1 });
  addB({ t: 'wc', x: 29.75, y: 37.0, w: 2.15, d: 2.6, n: 2 });
  [[19.8, 41.6], [24.2, 41.6]].forEach(([x, y], i) => {
    const o = addB({ t: 'mesaAlta', x, y, w: 1.3, d: 1.3 });
    add({ t: 'banqueta', x: x - .75, y: y + .35, w: .6, d: .6 });
    add({ t: 'banqueta', x: x + 1.45, y: y + .35, w: .6, d: .6 });
    rest({ id: 'MAL' + i + 'a', room: 'cafe', label: 'mesa alta', x: x - .45, y: y + .65, facing: 'e', sit: false, act: 'lanchando', obj: o });
    rest({ id: 'MAL' + i + 'b', room: 'cafe', label: 'mesa alta', x: x + 1.75, y: y + .65, facing: 'w', sit: false, act: 'lanchando', obj: o });
  });
  addB({ t: 'plant', x: 30.6, y: 43.4, k: 1 });

  /* ---------- CABINES ---------- */
  [[33.1, M.laranja, 'ÁREA TÉCNICA'], [35.7, M.azulE, '2 PESSOAS'], [38.3, M.vermelho, 'FOCO']]
    .forEach(([x, cor, nome], i) => {
      const o = addB({ t: 'cabine', x, y: 37.05, w: 2.5, d: 2.8, cor, nome });
      rest({ id: 'CAB' + i, room: 'cabines', label: 'cabine', x: x + 1.25, y: 37.85, facing: 's',
             act: 'em call na cabine', obj: o });
    });
  addB({ t: 'plant', x: 33.3, y: 43.4, k: 0 });

  /* ---------- LOUNGE VERDE ---------- */
  const bancoN = addB({ t: 'bancoMadeira', x: 48.6, y: 37.1, w: 8.0, d: 1.3, dir: 'n' });
  [50.0, 51.8, 53.6, 55.4].forEach((x, i) =>
    rest({ id: 'BAN' + i, room: 'jardim', label: 'banco', x, y: 37.85, facing: 's', act: 'conversando no lounge', obj: bancoN }));
  const bancoL = addB({ t: 'bancoMadeira', x: 57.3, y: 38.6, w: 1.4, d: 5.6, dir: 'e' });
  [39.6, 41.4, 43.1].forEach((y, i) =>
    rest({ id: 'BAL' + i, room: 'jardim', label: 'banco', x: 57.95, y, facing: 'w', act: 'relaxando no banco', obj: bancoL }));
  const sofaV = addB({ t: 'sofa', x: 43.1, y: 39.2, w: 1.4, d: 3.6, dir: 'w', c: M.teal });
  [40.1, 41.8].forEach((y, i) =>
    rest({ id: 'SOFV' + i, room: 'jardim', label: 'sofá', x: 43.95, y, facing: 'e', act: 'descansando no sofá', obj: sofaV }));
  addB({ t: 'mesinha', x: 45.0, y: 40.4, w: 1.1, d: 1.1, lateral: true });
  [[48.05, 40.05, 30], [50.05, 42.05, 200]].forEach((b, i) => {
    const o = addB({ t: 'beanbag', x: b[0], y: b[1], hue: b[2], w: .9, d: .9, neutro: true });
    rest({ id: 'PUF' + i, room: 'jardim', label: 'puff', x: b[0] + .45, y: b[1] + .45, facing: 's',
           act: 'lendo no puff', obj: o });
  });
  addB({ t: 'oliveira', x: 42.2, y: 37.2, w: 1.2, d: 1.2 });
  addB({ t: 'oliveira', x: 55.6, y: 43.3, w: 1.2, d: 1.2 });

  /* ---------- CORREDORES ---------- */
  [[12.2, 14.1], [24.4, 14.1], [36.2, 14.1], [45.2, 14.1], [57.9, 14.1],
   [13.3, 33.1], [29.2, 33.1], [44.2, 33.1], [57.9, 33.1]].forEach(([x, y], i) =>
    addB({ t: 'plant', x, y, k: i % 2 }));

  /* ===========================================================
     DESENHO
     =========================================================== */
  function emOrdem(pecas) { pecas.sort((a, b) => a[0] - b[0]).forEach(p => p[1]()); }

  /* peças paradas são pintadas uma vez num canvas e só copiadas depois */
  const ALTURA_CACHE = {
    chairOffice: 80, chairBoss: 86, chairMeet: 64, chairStudio: 64,
    poolTable: 56, foosball: 56, pingPong: 50, sofa: 60, poltrona: 60,
    mesinha: 40, mesinhaRedonda: 40, beanbag: 40, bancoMadeira: 50, degrau: 80,
    estante: 110, aparador: 46, arquivo: 70, mesaAlta: 70, banqueta: 50,
    muxarabi: 116, armarioImpressora: 90, geladeira: 110, bancadaCopa: 80,
    wc: 120, palco: 30, estanteCriativa: 110, quadroMovel: 100, mesaApoio: 40,
    meetTable: 40, tripe: 90, softbox: 110, produto: 50, oliveira: 130, cabine: 120
  };
  const ESC_CACHE = 2;
  const cacheMovel = new Map();

  function montaCacheMovel(o, f) {
    const w = o.w || 1, d = o.d || 1;
    const alto = ALTURA_CACHE[o.t] || 120;
    const x0 = ISO.toScreen(o.x, o.y + d).x - 30;
    const x1 = ISO.toScreen(o.x + w, o.y).x + 30;
    const y0 = ISO.toScreen(o.x, o.y).y - alto;
    const y1 = ISO.toScreen(o.x + w, o.y + d).y + 26;
    const W = Math.ceil((x1 - x0) * ESC_CACHE), H = Math.ceil((y1 - y0) * ESC_CACHE);
    if (W <= 0 || H <= 0 || W * H > 2.4e6) return null;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    c.scale(ESC_CACHE, ESC_CACHE);
    c.translate(-x0, -y0);
    f(c, o, 0);
    return { cv, x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  function drawItem(ctx, o, t) {
    const f = DRAW[o.t];
    if (!f) return;
    if (!(o.t in ALTURA_CACHE)) { f(ctx, o, t); return; }
    // enquanto o logo não carregou, desenha ao vivo para o cache não nascer sem ele
    if (!WORLD.pronta(WORLD.IMG.b)) { f(ctx, o, t); return; }
    let c = cacheMovel.get(o);
    if (c === undefined) { c = montaCacheMovel(o, f); cacheMovel.set(o, c); }
    if (!c) { f(ctx, o, t); return; }
    ctx.drawImage(c.cv, c.x, c.y, c.w, c.h);
  }

  /** peça encostada na parede é pintada depois da parede inteira atrás dela */
  function depth(o) {
    if (o.dk !== undefined) return o.dk;
    if (o.parede) return o.x + (o.w || 1) + o.y + (o.d || 1) + 0.5;
    return (o.x + (o.w || 1) / 2) + (o.y + (o.d || 1) / 2);
  }

  /** superfície virada para +y (a que a câmera enxerga), em px */
  function faceY(ctx, x, yPlane, lenTiles, topZ, fn) {
    const T = ISO.TW;
    const o = ISO.toScreen(x, yPlane, topZ);
    ctx.save();
    ctx.transform(ISO.HW / T, ISO.HH / T, 0, 1, o.x, o.y);
    fn(ctx, lenTiles * T);
    ctx.restore();
  }
  /** superfície virada para +x, lida da esquerda para a direita */
  function faceX(ctx, xPlane, y, lenTiles, topZ, fn) {
    WORLD.wallFace(ctx, 'w', xPlane - 1, y, lenTiles, topZ, fn);
  }

  const CANECAS = ['#ffffff', '#2b4bff', '#32bcad', '#f25a1d', '#e8a317'];
  function caneca(ctx, cx, cy, z, cor, s = 1) {
    const c = CANECAS[((cor | 0) % CANECAS.length + CANECAS.length) % CANECAS.length];
    const r = 0.1 * s;
    ISO.cyl(ctx, cx, cy, r, 12 * s, z, c);
    ISO.cyl(ctx, cx, cy, r * .82, 1.5, z + 12 * s - 1.5, '#4a2c1a');
    const p = ISO.toScreen(cx + r * 1.2, cy, z + 6 * s);
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 1.5 * s;
    ctx.beginPath(); ctx.arc(p.x + 1.5 * s, p.y, 2.4 * s, -1.3, 1.3); ctx.stroke(); ctx.restore();
  }

  /** vaso de planta pequeno em cima de móvel */
  function vasinho(ctx, cx, cy, z, s = 1) {
    ISO.cyl(ctx, cx, cy, .12 * s, 9 * s, z, '#f1efe9');
    const b = S(cx, cy, z + 9 * s);
    ctx.fillStyle = '#3f8f3a';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.ellipse(b.x + (i - 2) * 2.4 * s, b.y - 4 * s - (i % 2) * 3 * s, 3 * s, 5 * s, (i - 2) * .4, 0, 7); ctx.fill();
    }
  }

  function livros(ctx, x, y, w, z, seed) {
    const cores = ['#2b4bff', '#f25a1d', '#e8a317', '#32bcad', '#f3f2ee', '#1d1f24', '#8b5e3c'];
    let px = x;
    for (let i = 0; px < x + w - .1; i++) {
      const lw = .1 + ((seed * 7 + i * 3) % 4) * .03;
      const lh = 12 + ((seed + i * 5) % 5) * 2;
      ISO.box(ctx, px, y, lw, .32, lh, z, cores[(seed + i) % cores.length]);
      px += lw + .015;
    }
  }

  const DRAW = {

    /* ================= ESTAÇÃO DE TRABALHO =================
       Tampo em MDF Itapuã, pés brancos em "A", iMac prata.          */
    deskOffice(ctx, o, t) {
      const { x, y, w, d } = o;
      const telaVisivel = (o.face === 'n');
      ISO.shadow(ctx, x + w / 2, y + d / 2, w * .5, .16);
      ISO.box(ctx, x + .08,     y + .1, .1, d - .2, 26, 0, M.branco);
      ISO.box(ctx, x + w - .18, y + .1, .1, d - .2, 26, 0, M.branco);
      ISO.box(ctx, x + .18, y + (o.face === 'n' ? .1 : d - .2), w - .36, .08, 10, 14, M.gelo);   // painel de privacidade baixo
      ISO.box(ctx, x - .03, y - .03, w + .06, d + .06, 2.5, 25.5, M.mad, { top: '#d6af84' });
      // divisória de feltro entre as duas fileiras da bancada
      if (o.face === 's') ISO.box(ctx, x + .05, y + d - .05, w - .1, .06, 26, TOP, '#9aa3ad', { top: '#b5bcc5' });

      const monY = o.face === 'n' ? y + .18 : y + .7;
      const tecY = o.face === 'n' ? y + .82 : y + .14;
      const pecas = [
        [tecY, () => teclado(ctx, x + w / 2 - .75, tecY)],
        [y + d / 2, () => caneca(ctx, x + .35, y + d / 2, TOP, o.sabor, .85)]
      ];
      if (o.dev) {
        pecas.push([monY, () => { monitor(ctx, x + .25, monY, 1.25, telaVisivel, o.busy, t, 'dev', o.sabor);
                                  monitor(ctx, x + 1.55, monY, 1.25, telaVisivel, o.busy, t, 'dev', o.sabor + 3); }]);
      } else {
        const mw = o.criativo ? 1.9 : 1.6;
        pecas.push([monY, () => monitor(ctx, x + w / 2 - mw / 2 + .1, monY, mw, telaVisivel, o.busy, t,
                                        o.criativo ? 'criativo' : 'office', o.sabor)]);
        if (o.criativo) pecas.push([y + .5, () => ISO.box(ctx, x + w - .62, y + .35, .45, .6, 1.5, TOP, '#2a2d33')]);
        else            pecas.push([y + .3, () => vasinho(ctx, x + w - .3, y + .35, TOP, .8)]);
      }
      emOrdem(pecas);
    },

    /* ================= MESA DO CEO ================= */
    deskBoss(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 2.2, .18);
      ISO.box(ctx, x + .05, y + .1, .14, d - .2, 26, 0, M.preto);
      ISO.box(ctx, x + w - .19, y + .1, .14, d - .2, 26, 0, M.preto);
      ISO.box(ctx, x + .25, y + d - .5, w - .5, .4, 24, 2, M.nogueira);   // gaveteiro frontal
      ISO.box(ctx, x - .06, y - .06, w + .12, d + .12, 3, 25, M.nogueira, { top: '#7d5639' });
      emOrdem([
        [y + .75, () => monitor(ctx, x + w / 2 - 1.0, y + .75, 2.0, false, o.busy, t, 'office', 1)],
        [y + .1,  () => teclado(ctx, x + w / 2 - .75, y + .12)],
        [y + .4,  () => ISO.box(ctx, x + .3, y + .3, .9, .6, 1.5, TOP, '#c9ccd2', { top: '#d8dbe0' })],   // notebook
        [y + d - .3, () => caneca(ctx, x + w - .35, y + d - .35, TOP, 1, .9)],
        [y + .3, () => vasinho(ctx, x + w - .35, y + .3, TOP, .9)]
      ]);
    },

    /* ================= CADEIRAS ================= */
    chairOffice(ctx, o) { cadeiraBase(ctx, o, { cor: '#eef0f2', costas: '#e2e5e9', base: '#2a2d33', alt: 32, bracos: true }); },
    chairBoss(ctx, o)   { cadeiraBase(ctx, o, { cor: '#2a2b2f', costas: '#1d1e22', base: '#1b1c20', alt: 38, bracos: true }); },
    chairMeet(ctx, o)   { cadeiraBase(ctx, o, { cor: '#f4f4f2', costas: '#e8e7e3', base: '#b9bdc4', alt: 24, bracos: false }); },
    chairStudio(ctx, o) { cadeiraBase(ctx, o, { cor: '#34363c', costas: '#26282d', base: '#1b1c20', alt: 26, bracos: true }); },

    /* ================= MESA DE REUNIÃO ================= */
    meetTable(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 3, .16);
      ISO.box(ctx, x + .5, y + d / 2 - .1, .16, .2, 24, 0, M.branco);
      ISO.box(ctx, x + w - .66, y + d / 2 - .1, .16, .2, 24, 0, M.branco);
      ISO.box(ctx, x + .5, y + d / 2 - .06, w - 1, .12, 3, 18, M.branco);
      ISO.box(ctx, x, y, w, d, 3.5, 24.5, M.mad, { top: '#d8b186' });
      // caixa de tomadas no centro
      ISO.box(ctx, x + w / 2 - .4, y + d / 2 - .15, .8, .3, 1, TOP, '#2a2d33');
      caneca(ctx, x + 1.1, y + d / 2 - .3, TOP, 1, .8);
      caneca(ctx, x + w - 1.2, y + d / 2 + .2, TOP, 0, .8);
      ISO.box(ctx, x + 2.2, y + .5, .7, .5, 1, TOP, '#c9ccd2');   // notebook fechado
    },

    mesaApoio(ctx, o) {
      const { x, y, w, d } = o;
      const cx = x + w / 2, cy = y + d / 2;
      ISO.shadow(ctx, cx, cy, .9, .16);
      ISO.cyl(ctx, cx, cy, .35, 2, 0, M.preto);
      ISO.cyl(ctx, cx, cy, .06, 22, 2, M.preto);
      ISO.cyl(ctx, cx, cy, .82, 3, 24, M.mad);
      caneca(ctx, cx - .2, cy, TOP - 1, 2, .8);
      ISO.box(ctx, cx + .05, cy - .3, .45, .32, .8, TOP - 1, '#ffffff');   // papéis
    },

    /* ================= TV NA PAREDE ================= */
    tvWall(ctx, o, t) {
      const { x, y, w } = o;
      const h = 56, z = 40;
      ISO.box(ctx, x, y, w, .14, h, z, '#15171b');
      faceY(ctx, x + .05, y + .14, w - .1, z + h - 3, (c, len) => {
        const g = c.createLinearGradient(0, 0, len, h);
        g.addColorStop(0, '#f6f8ff'); g.addColorStop(1, '#e6ebff');
        c.fillStyle = g; c.fillRect(0, 0, len, h - 6);
        c.fillStyle = M.azul; c.fillRect(0, 0, 5, h - 6);
        c.textAlign = 'left'; c.textBaseline = 'middle';
        c.font = "800 10px 'Nunito', sans-serif"; c.fillStyle = M.azulE;
        c.fillText('SALA DE REUNIÃO', 14, 12);
        c.font = "600 8.5px 'Barlow Semi Condensed', sans-serif"; c.fillStyle = '#5a6380';
        c.fillText(new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }).toUpperCase(), 14, 26);
        for (let i = 0; i < 3; i++) {
          c.fillStyle = ISO.rgba(i === 1 ? M.pix : M.azul, .25 + .1 * i);
          c.fillRect(14, 35 + i * 4.5, (len - 70) * (.4 + .3 * ((Math.sin(t * .5 + i) + 1) / 2)), 2.5);
        }
        if (WORLD.pronta(WORLD.IMG.b)) c.drawImage(WORLD.IMG.b, len - 44, 12, 28, 28);
      });
    },

    /* ================= ESCRITÓRIO DO CEO ================= */
    estante(ctx, o) {
      const { x, y, w, d } = o;
      const h = 96;
      ISO.box(ctx, x, y, w, d, h, 0, M.nogueira, { top: '#7d5639' });
      faceY(ctx, x, y + d, w, h, (c, len) => {
        c.fillStyle = '#5a3c27'; c.fillRect(5, 5, len - 10, h - 10);
        for (let i = 1; i < 4; i++) { c.fillStyle = M.nogueira; c.fillRect(5, 5 + i * (h - 10) / 4 - 2, len - 10, 4); }
        c.fillRect(len / 2 - 2, 5, 4, h - 10);
        const cores = ['#2b4bff', '#f25a1d', '#e8a317', '#32bcad', '#f3f2ee', '#1d1f24'];
        for (let r = 0; r < 4; r++) for (let i = 0; i < 18; i++) {
          if ((r * 7 + i * 3) % 5 === 0) continue;
          const lx = 8 + i * ((len - 16) / 18), lh = 10 + ((r + i) % 4) * 2;
          if (Math.abs(lx - len / 2) < 5) continue;
          c.fillStyle = cores[(r * 3 + i) % cores.length];
          c.fillRect(lx, 5 + (r + 1) * (h - 10) / 4 - 2 - lh, (len - 16) / 18 - 1.5, lh);
        }
        if (WORLD.pronta(WORLD.IMG.b)) c.drawImage(WORLD.IMG.b, len * .72, 5 + (h - 10) / 4 - 22, 16, 16);
      });
    },

    aparador(ctx, o) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 30, 0, M.mad, { top: '#d8b186' });
      vasinho(ctx, x + w / 2, y + .5, 30, 1.1);
      livros(ctx, x + .15, y + 1.2, .5, 30, 2);
    },

    sofa(ctx, o) {
      const { x, y, w, d } = o;
      const c = o.c || M.teal, cl = ISO.shade(c, .14), cd = ISO.shade(c, -.18);
      ISO.shadow(ctx, x + w / 2, y + d / 2, Math.max(w, d) * .5, .2);
      ISO.box(ctx, x + .05, y + .05, w - .1, d - .1, 4, 0, '#2a2d33');
      ISO.box(ctx, x, y, w, d, 12, 4, cd);
      const enc = 34, arm = 22;
      if (o.dir === 'n' || o.dir === 's') {
        const by = o.dir === 'n' ? y : y + d - .38;
        if (o.dir === 'n') ISO.box(ctx, x, by, w, .38, enc - 4, 4, c, { top: cl });
        const n = Math.max(1, Math.round((w - .6) / 1.3));
        for (let i = 0; i < n; i++) {
          const sw = (w - .6) / n;
          ISO.box(ctx, x + .3 + i * sw + .02, y + (o.dir === 'n' ? .38 : 0), sw - .04, d - .38, 6, 16, c, { top: cl });
        }
        ISO.box(ctx, x, y, .3, d, arm, 4, cd, { top: c });
        ISO.box(ctx, x + w - .3, y, .3, d, arm, 4, cd, { top: c });
        if (o.dir === 's') ISO.box(ctx, x, by, w, .38, enc - 4, 4, c, { top: cl });
      } else {
        const bx = o.dir === 'w' ? x : x + w - .38;
        if (o.dir === 'w') ISO.box(ctx, bx, y, .38, d, enc - 4, 4, c, { top: cl });
        const n = Math.max(1, Math.round((d - .6) / 1.3));
        for (let i = 0; i < n; i++) {
          const sd = (d - .6) / n;
          ISO.box(ctx, x + (o.dir === 'w' ? .38 : 0), y + .3 + i * sd + .02, w - .38, sd - .04, 6, 16, c, { top: cl });
        }
        ISO.box(ctx, x, y, w, .3, arm, 4, cd, { top: c });
        ISO.box(ctx, x, y + d - .3, w, .3, arm, 4, cd, { top: c });
        if (o.dir === 'e') ISO.box(ctx, bx, y, .38, d, enc - 4, 4, c, { top: cl });
      }
    },

    poltrona(ctx, o) {
      const { x, y, w, d } = o;
      const c = o.c || M.azul, cl = ISO.shade(c, .18), cd = ISO.shade(c, -.2);
      ISO.shadow(ctx, x + w / 2, y + d / 2, .7, .2);
      [[.1, .1], [w - .2, .1], [.1, d - .2], [w - .2, d - .2]].forEach(p => ISO.box(ctx, x + p[0], y + p[1], .08, .08, 8, 0, '#c9ccd2'));
      ISO.box(ctx, x + .05, y + .05, w - .1, d - .1, 10, 8, cd, { top: cl });
      if (o.dir === 'e') ISO.box(ctx, x + w - .3, y + .05, .26, d - .1, 30, 8, c, { top: cl });
      else               ISO.box(ctx, x + .04, y + .05, .26, d - .1, 30, 8, c, { top: cl });
      ISO.box(ctx, x + .05, y + .05, w - .1, .22, 22, 8, c, { top: cl });
      ISO.box(ctx, x + .05, y + d - .27, w - .1, .22, 22, 8, c, { top: cl });
    },

    mesinha(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, .7, .14);
      if (o.lateral) {
        ISO.box(ctx, x + .1, y + .1, .06, .06, 22, 0, M.preto);
        ISO.box(ctx, x + w - .16, y + d - .16, .06, .06, 22, 0, M.preto);
        ISO.box(ctx, x, y, w, d, 3, 22, M.mad, { top: '#d8b186' });
        caneca(ctx, x + w / 2, y + d / 2, 25, 4, .8);
        return;
      }
      ISO.box(ctx, x, y, w, d, 14, 0, M.branco, { top: '#fafaf8' });
      livros(ctx, x + .2, y + .3, .5, 14, 1);
      vasinho(ctx, x + w - .35, y + d / 2, 14, .9);
    },

    mesinhaRedonda(ctx, o) {
      const cx = o.x + o.w / 2, cy = o.y + o.d / 2;
      ISO.shadow(ctx, cx, cy, .5, .16);
      ISO.cyl(ctx, cx, cy, .06, 18, 0, '#c9ccd2');
      ISO.cyl(ctx, cx, cy, .42, 2.5, 18, M.branco);
      caneca(ctx, cx, cy, 20.5, 0, .8);
    },

    plant(ctx, o, t) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .5, y + .5, .45, .18);
      ISO.cyl(ctx, x + .5, y + .5, .3, 24, 0, o.k ? '#e9e6df' : '#5b5d63');
      ISO.cyl(ctx, x + .5, y + .5, .26, 1, 23.5, '#4a3424');
      const base = S(x + .5, y + .5, 24);
      const nn = o.k ? 11 : 8;
      for (let i = 0; i < nn; i++) {
        const a = (i / nn) * Math.PI * 2 + Math.sin(t * .4 + i) * .04;
        const len = (o.k ? 26 : 18) + (i % 3) * 8;
        ctx.fillStyle = i % 2 ? '#2f7a3e' : '#3f9a4c';
        ctx.save();
        ctx.translate(base.x + Math.cos(a) * len * .45, base.y - len * .62);
        ctx.rotate(Math.cos(a) * .7);
        ctx.beginPath(); ctx.ellipse(0, 0, o.k ? 6 : 3.4, len * .42, 0, 0, 7); ctx.fill();
        ctx.restore();
      }
    },

    oliveira(ctx, o) {
      const cx = o.x + o.w / 2, cy = o.y + o.d / 2;
      ISO.shadow(ctx, cx, cy, .6, .2);
      ISO.box(ctx, cx - .4, cy - .4, .8, .8, 28, 0, '#e9e6df', { top: '#5a3f2a' });
      const b = S(cx, cy, 28);
      ctx.strokeStyle = '#6b5440'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.quadraticCurveTo(b.x - 6, b.y - 30, b.x + 2, b.y - 52); ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(b.x - 2, b.y - 28); ctx.lineTo(b.x + 12, b.y - 46); ctx.stroke();
      const folhas = [[-14, -66, 18], [6, -74, 20], [18, -58, 15], [-4, -54, 16], [-20, -50, 12], [12, -86, 13]];
      for (const [dx, dy, r] of folhas) {
        ctx.fillStyle = '#6d8f4e';
        ctx.beginPath(); ctx.arc(b.x + dx, b.y + dy, r, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(160,190,120,.45)';
        ctx.beginPath(); ctx.arc(b.x + dx - r * .3, b.y + dy - r * .3, r * .55, 0, 7); ctx.fill();
      }
    },

    /* ================= OPERAÇÃO ================= */
    muxarabi(ctx, o) {
      const { x, y, w, d } = o;
      const h = 100;
      ISO.box(ctx, x, y, w, d, h, 0, M.mad, { top: '#d8b186' });
      faceX(ctx, x + w, y, d, h, (c, len) => {
        c.fillStyle = M.mad; c.fillRect(0, 0, len, h);
        c.fillStyle = 'rgba(40,30,20,.55)';
        for (let i = 0; i * 13 < len - 6; i++) for (let j = 0; j * 13 < h - 8; j++)
          c.fillRect(5 + i * 13, 5 + j * 13, 8, 8);
      });
    },

    armarioImpressora(ctx, o) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 46, 0, M.mad, { top: '#d8b186' });
      faceY(ctx, x, y + d, w, 46, (c, len) => {
        c.strokeStyle = 'rgba(80,50,25,.35)'; c.lineWidth = 1;
        c.strokeRect(3, 3, len / 2 - 4, 40); c.strokeRect(len / 2 + 1, 3, len / 2 - 4, 40);
      });
      ISO.box(ctx, x + .5, y + .1, 1.0, .6, 14, 46, '#e9eaec', { top: '#f4f5f6' });   // impressora
      ISO.box(ctx, x + .62, y + .58, .76, .12, 2, 52, '#ffffff');
      ISO.box(ctx, x + 1.8, y + .1, .5, .6, 8, 46, '#ffffff');                         // resmas
      ISO.box(ctx, x, y - .02, w, .3, 40, 62, M.mad, { top: '#d8b186' });              // armário superior
    },

    mesaAlta(ctx, o) {
      const { x, y, w, d } = o;
      const cx = x + w / 2, cy = y + d / 2;
      ISO.shadow(ctx, cx, cy, .6, .16);
      ISO.cyl(ctx, cx, cy, .3, 2, 0, M.preto);
      ISO.cyl(ctx, cx, cy, .05, 44, 2, M.preto);
      ISO.box(ctx, x, y, w, d, 3, 46, M.mad, { top: '#d8b186' });
      caneca(ctx, cx - .2, cy, 49, 3, .8);
    },

    banqueta(ctx, o) {
      const cx = o.x + o.w / 2, cy = o.y + o.d / 2;
      ISO.cyl(ctx, cx, cy, .2, 1.5, 0, M.preto);
      ISO.cyl(ctx, cx, cy, .04, 30, 1, M.preto);
      ISO.cyl(ctx, cx, cy, .24, 4, 31, M.mad);
    },

    quadroMovel(ctx, o) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x + .1, y, .06, d, 96, 0, '#9aa0aa');
      ISO.box(ctx, x + w - .16, y, .06, d, 96, 0, '#9aa0aa');
      ISO.box(ctx, x, y + .1, w, .06, 56, 38, '#ffffff');
      faceY(ctx, x, y + .16, w, 94, (c, len) => {
        c.fillStyle = '#f9fafb'; c.fillRect(2, 2, len - 4, 52);
        c.strokeStyle = M.azul; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(10, 40); c.lineTo(40, 22); c.lineTo(70, 30); c.lineTo(110, 12); c.stroke();
        c.font = "700 8px 'Barlow Semi Condensed', sans-serif"; c.fillStyle = M.laranja;
        c.fillText('META Q4', 10, 12);
      });
    },

    bebedouro(ctx, o) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .5, y + .5, .4, .16);
      ISO.box(ctx, x + .15, y + .15, .7, .7, 40, 0, '#e9eaec', { top: '#f4f5f6' });
      ISO.cyl(ctx, x + .5, y + .5, .26, 26, 40, 'rgba(140,200,240,.6)');
    },

    /* ================= TECNOLOGIA ================= */
    kanban(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 92, 0, '#2a2d33', { top: '#3a3d44' });
      faceY(ctx, x, y + d, w, 88, (c, len) => {
        c.fillStyle = '#f7f8fa'; c.fillRect(3, 3, len - 6, 78);
        const cols = ['A FAZER', 'FAZENDO', 'REVISÃO', 'FEITO'];
        const cw = (len - 6) / cols.length;
        cols.forEach((nm, i) => {
          c.font = "700 7px 'Barlow Semi Condensed', sans-serif"; c.fillStyle = '#5a6380';
          c.textAlign = 'left'; c.fillText(nm, 7 + i * cw, 12);
          if (i) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(3 + i * cw, 5, 1, 74); }
          const n = [4, 2, 2, 3][i];
          for (let k = 0; k < n; k++) {
            c.fillStyle = ['#ffe680', '#b6d0ff', '#ffc6a8', '#b6f0d8'][(i + k) % 4];
            c.fillRect(7 + i * cw + (k % 2) * (cw / 2 - 2), 18 + Math.floor(k / 2) * 18, cw / 2 - 6, 14);
          }
        });
        c.font = "800 9px 'Nunito', sans-serif"; c.fillStyle = '#7c5cff'; c.textAlign = 'right';
        c.fillText('</> SPRINT', len - 8, 76);
      });
    },

    rack(ctx, o, t) {
      const { x, y } = o;
      ISO.shadow(ctx, x + .6, y + .5, .7, .2);
      ISO.box(ctx, x, y, 1.2, 1, 96, 0, '#1d1f24', { top: '#2a2d33' });
      faceY(ctx, x + .05, y + 1, 1.1, 92, (c, len) => {
        for (let i = 0; i < 10; i++) {
          c.fillStyle = '#2b2e34'; c.fillRect(4, 4 + i * 8.6, len - 8, 7);
          const on = Math.sin(t * 5 + i * 1.7) > -.3;
          c.fillStyle = on ? '#3ce08c' : '#1c4a33'; c.fillRect(len - 12, 6 + i * 8.6, 3, 2);
          c.fillStyle = (Math.sin(t * 9 + i) > .5) ? '#7cc4ff' : '#26394d'; c.fillRect(len - 18, 6 + i * 8.6, 3, 2);
        }
      });
    },

    /* ================= PODCAST ================= */
    mesaPodcast(ctx, o) {
      const { x, y, w, d } = o;
      const cx = x + w / 2, cy = y + d / 2;
      ISO.shadow(ctx, cx, cy, 1, .2);
      ISO.cyl(ctx, cx, cy, .3, 24, 0, M.preto);
      ISO.cyl(ctx, cx, cy, 1.05, 3, 24, '#3a2a20');
      const mic = (mx, my) => {
        ISO.cyl(ctx, mx, my, .1, 2, TOP - 1, '#1b1c20');
        ISO.cyl(ctx, mx, my, .025, 16, TOP + 1, '#8e97ab');
        ISO.cyl(ctx, mx, my, .09, 12, TOP + 16, '#1b1c20');
        const p = S(mx, my, TOP + 28);
        ctx.fillStyle = '#5a5e68'; ctx.beginPath(); ctx.arc(p.x, p.y, 3.2, 0, 7); ctx.fill();
      };
      mic(cx - .55, cy); mic(cx + .55, cy); mic(cx, cy + .55);
      // fones
      const f = S(cx, cy - .35, TOP);
      ctx.strokeStyle = '#1b1c20'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(f.x, f.y - 2, 5, Math.PI, 0); ctx.stroke();
    },

    tripe(ctx, o) {
      const cx = o.x + .4, cy = o.y + .4;
      const b = S(cx, cy, 0);
      ctx.strokeStyle = '#1d1f24'; ctx.lineWidth = 1.6;
      [[-9, 4], [9, 4], [0, -6]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(b.x + dx, b.y + dy); ctx.lineTo(b.x, b.y - 52); ctx.stroke();
      });
      ISO.box(ctx, cx - .22, cy - .14, .44, .28, 12, 54, '#1d1f24', { top: '#33363d' });
      ISO.cyl(ctx, cx, cy - .2, .09, 2, 58, '#4a4e57');
      ctx.fillStyle = '#ff3b5c';
      const r = S(cx + .18, cy, 64); ctx.beginPath(); ctx.arc(r.x, r.y, 1.4, 0, 7); ctx.fill();
    },

    ringLight(ctx, o) {
      const cx = o.x + .4, cy = o.y + .4;
      ISO.cyl(ctx, cx, cy, .25, 2, 0, M.preto);
      ISO.cyl(ctx, cx, cy, .025, 66, 2, M.preto);
      const p = S(cx, cy, 80);
      ctx.save();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(255,255,255,.9)'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, 10, 12, 0, 0, 7); ctx.stroke();
      ctx.restore();
    },

    /* ================= CRIATIVOS ================= */
    fundoInfinito(ctx, o) {
      const { x, y, w } = o;
      ISO.cyl(ctx, x + .1, y + .1, .1, 104, 0, M.preto);
      ISO.cyl(ctx, x + w - .1, y + .1, .1, 104, 0, M.preto);
      ISO.box(ctx, x, y + .05, w, .1, 5, 100, '#3a3d44');
      faceY(ctx, x + .2, y + .2, w - .4, 98, (c, len) => {
        const g = c.createLinearGradient(0, 0, 0, 98);
        g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#efeeea');
        c.fillStyle = g; c.fillRect(0, 0, len, 98);
      });
    },

    softbox(ctx, o) {
      const cx = o.x + .4, cy = o.y + .4;
      ISO.cyl(ctx, cx, cy, .25, 2, 0, M.preto);
      ISO.cyl(ctx, cx, cy, .025, 64, 2, M.preto);
      ISO.box(ctx, cx - .35, cy - .1, .7, .2, 34, 62, '#1d1f24');
      faceY(ctx, cx - .32, cy + .1, .64, 94, (c, len) => {
        c.fillStyle = '#fbfbf8'; c.fillRect(2, 2, len - 4, 28);
      });
    },

    produto(ctx, o) {
      const { x, y } = o;
      ISO.box(ctx, x, y, .9, .9, 22, 0, '#ffffff', { top: '#f7f7f5' });
      ISO.box(ctx, x + .2, y + .25, .5, .32, 1.5, 22, M.azul);           // cartão Bancão
      ISO.box(ctx, x + .55, y + .3, .12, .1, 1, 23.6, M.ouro);
    },

    estanteCriativa(ctx, o) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 92, 0, '#ffffff', { top: '#f4f4f1' });
      faceX(ctx, x + w, y, d, 92, (c, len) => {
        c.fillStyle = '#f0efea'; c.fillRect(3, 3, len - 6, 86);
        for (let r = 0; r < 4; r++) {
          c.fillStyle = '#ffffff'; c.fillRect(3, 3 + (r + 1) * 21.5 - 2, len - 6, 3);
          for (let i = 0; i < 6; i++) {
            const cor = ['#2b4bff', '#f25a1d', '#e8a317', '#32bcad', '#1d1f24', '#ffb3c7'][(r + i * 2) % 6];
            c.fillStyle = cor;
            if ((r + i) % 3 === 0) { c.beginPath(); c.arc(14 + i * 34, 3 + (r + 1) * 21.5 - 9, 6, 0, 7); c.fill(); }
            else c.fillRect(8 + i * 34, 3 + (r + 1) * 21.5 - 16, 12 + (i % 2) * 6, 14);
          }
        }
      });
    },

    /* ================= RECEPÇÃO ================= */
    balcao(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 1.8, .18);
      ISO.box(ctx, x, y, w, d, 40, 0, M.branco, { top: '#fafaf8' });
      ISO.box(ctx, x - .05, y + d - .25, w + .1, .3, 4, 40, M.mad, { top: '#d8b186' });     // tampo de madeira
      ISO.box(ctx, x + .1, y + .05, w - .2, .55, 2, 26, M.mad, { top: '#d8b186' });       // tampo de trabalho
      faceY(ctx, x, y + d + .05, w, 38, (c, len) => {
        c.fillStyle = M.azul; c.fillRect(0, 30, len, 3);
        const im = WORLD.IMG.logo;
        if (WORLD.pronta(im)) {
          const lw = len * .55, lh = lw * im.naturalHeight / im.naturalWidth;
          c.drawImage(im, (len - lw) / 2, 4, lw, lh);
        }
      });
      monitor(ctx, x + w / 2 - .2, y + .1, 1.4, false, o.busy, t, 'office', 1);
      vasinho(ctx, x + .35, y + d - .15, 44, 1);
    },

    /* ================= AUDITÓRIO ================= */
    palco(ctx, o) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 8, 0, '#8a5a36', { top: '#9a6a43' });
      faceY(ctx, x, y + d, w, 8, (c, len) => {
        c.fillStyle = 'rgba(255,236,200,.55)'; c.fillRect(0, 6, len, 1.5);   // fita de LED do degrau
      });
    },

    telao(ctx, o, t) {
      const { x, y, w, d } = o;
      const h = 70, z = 26;
      // moldura de muxarabi em volta do telão
      ISO.box(ctx, x - .6, y, w + 1.2, d, 112, 0, M.mad, { top: '#d8b186' });
      faceY(ctx, x - .6, y + d, w + 1.2, 112, (c, len) => {
        c.fillStyle = M.mad; c.fillRect(0, 0, len, 112);
        c.fillStyle = 'rgba(40,30,20,.45)';
        for (let i = 0; i * 12 < len; i++) for (let j = 0; j * 12 < 112; j++) c.fillRect(3 + i * 12, 3 + j * 12, 7, 7);
      });
      faceY(ctx, x, y + d + .01, w, z + h, (c, len) => {
        c.fillStyle = '#111317'; c.fillRect(-3, -3, len + 6, h + 6);
        const g = c.createLinearGradient(0, 0, len, h);
        g.addColorStop(0, '#2b4bff'); g.addColorStop(1, '#0f1a4a');
        c.fillStyle = g; c.fillRect(0, 0, len, h);
        const slide = Math.floor(t / 7) % 2;
        if (slide === 0) {
          const im = WORLD.IMG.branco;
          if (WORLD.pronta(im)) {
            const lw = len * .42, lh = lw * im.naturalHeight / im.naturalWidth;
            c.drawImage(im, len * .08, (h - lh) / 2 - 4, lw, lh);
          }
          c.font = "800 13px 'Nunito', sans-serif"; c.fillStyle = '#ffffff'; c.textAlign = 'left';
          c.fillText('ALL HANDS', len * .6, h / 2 - 6);
          c.font = "600 9px 'Barlow Semi Condensed', sans-serif"; c.fillStyle = 'rgba(255,255,255,.75)';
          c.fillText('resultados · produto · próximos passos', len * .6, h / 2 + 10);
        } else {
          c.fillStyle = 'rgba(255,255,255,.95)'; c.fillRect(len * .06, 10, len * .38, h - 20);
          WORLD.pix(c, len * .1, 22, 26, '#32bcad');
          WORLD.openFinance(c, len * .5, 18, 22);
          for (let i = 0; i < 4; i++) {
            c.fillStyle = ISO.rgba('#ffffff', .25 + .15 * i);
            c.fillRect(len * .5, 46 + i * 5, len * (.18 + .08 * i), 2.6);
          }
        }
      });
      // luz do projetor
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const gc = S(x + w / 2, y + d + .4, z + h / 2);
      ISO.glow(ctx, gc.x, gc.y, 140, '#5b74ff', .1);
      ctx.restore();
    },

    pulpito(ctx, o) {
      const { x, y } = o;
      ISO.box(ctx, x, y, .8, .7, 44, 8, M.mad, { top: '#d8b186' });
      ISO.cyl(ctx, x + .4, y + .2, .02, 10, 52, '#1d1f24');
      faceY(ctx, x, y + .7, .8, 50, (c, len) => {
        if (WORLD.pronta(WORLD.IMG.b)) c.drawImage(WORLD.IMG.b, len / 2 - 9, 8, 18, 18);
      });
    },

    degrau(ctx, o) {
      const { x, y, w, d, h } = o;
      // estrutura em MDF Itapuã com espelho de madeira
      ISO.box(ctx, x, y, w, d, h, 0, M.mad, { top: '#d8b186' });
      faceY(ctx, x, y + d, w, h, (c, len) => {
        c.fillStyle = 'rgba(90,55,25,.18)';
        for (let i = 6; i < h; i += 7) c.fillRect(0, i, len, 1);
        c.fillStyle = 'rgba(255,236,200,.6)'; c.fillRect(0, h - 3, len, 1.5);   // LED no espelho
      });
      // almofadas, alternando cinza e verde-petróleo
      const n = 7;
      for (let k = 0; k < n; k++) {
        const cor = ['#9aa0a8', M.teal, '#c9ccd2'][(k + o.nivel) % 3];
        ISO.box(ctx, x + .5 + k * 2.0, y + .35, 1.55, d - .6, 4, h, cor, { top: ISO.shade(cor, .15) });
      }
      // sombra do degrau de cima e quina iluminada, para ler os níveis
      ISO.plane(ctx, x, y, w, .18, h + .1, 'rgba(60,40,20,.22)');
      ISO.quad(ctx, [S(x, y + d, h), S(x + w, y + d, h), S(x + w, y + d, h - 1.5), S(x, y + d, h - 1.5)], 'rgba(255,240,215,.8)');
    },

    arParede(ctx, o) {
      const { x, y, d } = o;
      faceX(ctx, x + 1, y, d, 104, (c, len) => {
        c.fillStyle = '#ffffff'; ISO.rrect(c, 4, 0, len - 8, 18, 4); c.fill();
        c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(8, 13, len - 16, 2);
      });
    },

    /* ================= SALA DE JOGOS ================= */
    poolTable(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 2.2, .2);
      [[.25, .25], [w - .6, .25], [.25, d - .6], [w - .6, d - .6]]
        .forEach(p => ISO.box(ctx, x + p[0], y + p[1], .35, .35, 26, 0, M.nogueira));
      ISO.box(ctx, x, y, w, d, 12, 26, M.nogueira, { top: '#7d5639' });
      ISO.plane(ctx, x + .26, y + .26, w - .52, d - .52, 38.4, '#2e6d9e');
      [['#f2f2f2', .6, .6], ['#e8a317', 2.6, 1.0], ['#2b4bff', 3.0, 1.3], ['#d6402e', 3.3, .9],
       ['#1d1f24', 2.85, 1.65], ['#32bcad', 3.5, 1.5]].forEach(([c, bx, by]) => {
        const p = S(x + bx, y + by, 38.4);
        ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(p.x, p.y + 2, 5, 3, 0, 0, 7); ctx.fill();
        const g = ctx.createRadialGradient(p.x - 2, p.y - 4, 1, p.x, p.y - 2, 6);
        g.addColorStop(0, ISO.shade(c, .5)); g.addColorStop(1, ISO.shade(c, -.25));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y - 2, 4.6, 0, 7); ctx.fill();
      });
    },

    foosball(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 1.6, .2);
      [[.15, .15], [w - .45, .15], [.15, d - .45], [w - .45, d - .45]]
        .forEach(p => ISO.box(ctx, x + p[0], y + p[1], .3, .3, 26, 0, M.preto));
      ISO.box(ctx, x, y, w, d, 10, 26, M.mad, { top: '#d8b186' });
      ISO.plane(ctx, x + .18, y + .18, w - .36, d - .36, 36.4, '#3f8f3a');
      ISO.plane(ctx, x + w / 2 - .02, y + .18, .04, d - .36, 36.5, 'rgba(255,255,255,.6)');
      for (let i = 0; i < 5; i++) {
        const bx = x + .5 + i * ((w - 1) / 4);
        ISO.box(ctx, bx, y - .2, .05, d + .4, 3, 44, '#c4c8cf');
        for (let j = 0; j < 3; j++)
          ISO.box(ctx, bx - .06, y + .4 + j * ((d - .8) / 2) - .08, .18, .18, 10, 36.5, i % 2 ? M.azul : M.laranja);
      }
    },

    pingPong(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 1.7, .18);
      [[.3, .3], [w - .45, .3], [.3, d - .45], [w - .45, d - .45]]
        .forEach(p => ISO.box(ctx, x + p[0], y + p[1], .12, .12, 26, 0, '#9aa0aa'));
      ISO.box(ctx, x, y, w, d, 2, 26, '#1f4f8f', { top: '#2a5fa6' });
      ISO.plane(ctx, x + .04, y + d / 2 - .015, w - .08, .03, 28.1, '#ffffff');
      ISO.plane(ctx, x + w / 2 - .015, y + .04, .03, d - .08, 28.1, '#ffffff');
      ISO.box(ctx, x + w / 2 - .02, y - .05, .04, d + .1, 6, 28, 'rgba(240,240,240,.85)');
      ISO.cyl(ctx, x + w * .7, y + d * .3, .04, 3, 34, '#ffffff');
    },

    tvRack(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 20, 0, M.mad, { top: '#d8b186' });
      ISO.box(ctx, x + .25, y + d / 2 - .3, .3, .6, 4, 20, '#1d1f24');     // console
      ISO.box(ctx, x + .05, y - .1, .08, d + .2, 50, 34, '#15171b');
      faceX(ctx, x + .13, y - .05, d + .1, 82, (c, len) => {
        const g = c.createLinearGradient(0, 0, len, 46);
        g.addColorStop(0, '#24133f'); g.addColorStop(1, '#0f2a4a');
        c.fillStyle = g; c.fillRect(0, 0, len, 46);
        // jogo de corrida na tela
        c.fillStyle = '#3f8f3a'; c.fillRect(0, 30, len, 16);
        c.fillStyle = '#5a5e68';
        c.beginPath(); c.moveTo(len * .35, 30); c.lineTo(len * .65, 30); c.lineTo(len, 46); c.lineTo(0, 46); c.fill();
        c.fillStyle = M.laranja; c.fillRect(len / 2 - 6 + Math.sin(t * 2) * 10, 36, 12, 6);
        c.fillStyle = '#ffd34d'; c.font = "800 7px 'Nunito', sans-serif"; c.fillText('LAP 2/3', 6, 10);
      });
    },

    beanbag(ctx, o) {
      const { x, y } = o;
      const c = o.neutro ? (o.hue > 100 ? '#c9c4bb' : '#9aa0a8') : ISO.hsl(o.hue, 30, 52);
      const cx = x + (o.w || 1.2) / 2, cy = y + (o.d || 1.2) / 2;
      ISO.shadow(ctx, cx, cy, .7, .2);
      const p = S(cx, cy, 0);
      const g = ctx.createRadialGradient(p.x - 6, p.y - 20, 3, p.x, p.y - 10, 28);
      g.addColorStop(0, ISO.shade(c, .25)); g.addColorStop(1, ISO.shade(c, -.25));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(p.x, p.y - 10, 26, 17, 0, 0, 7); ctx.fill();
      ctx.fillStyle = ISO.shade(c, .1);
      ctx.beginPath(); ctx.ellipse(p.x, p.y - 18, 18, 9, 0, 0, 7); ctx.fill();
    },

    /* ================= CAFÉ PIX & COPA ================= */
    pixWall(ctx, o) {
      const { x, y, w, d } = o;
      const h = 108;
      ISO.box(ctx, x, y, w, d, h, 0, '#ffffff', { top: '#e4e3df' });
      faceY(ctx, x, y + d, w, h, (c, len) => {
        c.fillStyle = '#ffffff'; c.fillRect(0, 0, len, h);
        // faixa diagonal laranja com padrão, como no render
        const corte = len * .58;
        c.save();
        c.beginPath(); c.moveTo(corte + 30, 0); c.lineTo(len, 0); c.lineTo(len, h); c.lineTo(corte - 20, h); c.closePath();
        c.fillStyle = M.laranja; c.fill(); c.clip();
        c.fillStyle = 'rgba(255,255,255,.9)';
        for (let i = 0; i < 10; i++) for (let j = 0; j < 7; j++) {
          const px = corte - 20 + i * 18 + (j & 1) * 9, py = 6 + j * 16;
          c.beginPath(); c.ellipse(px, py, 6.5, 5, 0, 0, 7); c.fill();
          c.fillStyle = M.laranja; c.fillRect(px - 6.5, py - .8, 13, 1.6); c.fillRect(px - .8, py - 5, 1.6, 10);
          c.fillStyle = 'rgba(255,255,255,.9)';
        }
        c.restore();
        // faixa preta no canto esquerdo
        c.fillStyle = M.preto;
        c.beginPath(); c.moveTo(0, h * .55); c.lineTo(len * .14, h); c.lineTo(0, h); c.fill();
        // logos em acrílico iluminado
        c.save(); c.shadowColor = 'rgba(255,240,200,.9)'; c.shadowBlur = 6;
        WORLD.pix(c, 34, 14, 26, '#32bcad');
        WORLD.openFinance(c, 22, 46, 22);
        c.restore();
      });
    },

    balcaoCafe(ctx, o, t) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 40, 0, M.mad, { top: '#d8b186' });
      faceY(ctx, x, y + d, w, 40, (c, len) => {
        c.strokeStyle = 'rgba(80,50,25,.35)'; c.lineWidth = 1;
        c.strokeRect(3, 3, len / 2 - 4, 34); c.strokeRect(len / 2 + 1, 3, len / 2 - 4, 34);
      });
      // máquina de espresso
      ISO.box(ctx, x + .4, y + .2, .6, .5, 18, 40, '#c4c8cf', { top: '#e2e5ea' });
      ISO.box(ctx, x + .45, y + .25, .5, .4, 4, 58, M.preto);
      ISO.cyl(ctx, x + .7, y + .7, .05, 6, 46, '#1d1f24');
      // xícaras
      for (let i = 0; i < 4; i++) ISO.cyl(ctx, x + 1.4 + (i % 2) * .3, y + .35 + Math.floor(i / 2) * .3, .08, 5, 40, '#f4f4f2');
      ISO.cyl(ctx, x + 2.5, y + .45, .2, 2, 40, '#f4f4f2');
      ISO.cyl(ctx, x + 2.95, y + .45, .14, 10, 40, '#5a3f2a');   // pote de grãos
      // vapor
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.2;
      const v = S(x + .7, y + .7, 60);
      ctx.beginPath(); ctx.moveTo(v.x, v.y);
      ctx.bezierCurveTo(v.x - 4, v.y - 6 - Math.sin(t * 2) * 2, v.x + 4, v.y - 10, v.x, v.y - 16); ctx.stroke();
      ctx.restore();
    },

    geladeira(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, .6, .18);
      ISO.box(ctx, x, y, w, d, 92, 0, '#d7dade', { top: '#e7e9ec' });
      faceY(ctx, x, y + d, w, 92, (c, len) => {
        c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(2, 30, len - 4, 1.2);
        c.fillStyle = '#9aa0aa'; c.fillRect(len - 9, 8, 2.4, 16); c.fillRect(len - 9, 36, 2.4, 26);
      });
    },

    bancadaCopa(ctx, o) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 40, 0, M.branco, { top: '#2f3238' });
      ISO.box(ctx, x + .08, y + .1, .84, .6, 14, 40, '#2a2d33', { top: '#3a3d44' });   // micro-ondas
      faceY(ctx, x + .08, y + .7, .84, 54, (c, len) => {
        c.fillStyle = '#111317'; c.fillRect(3, 3, len - 14, 8);
        c.fillStyle = '#3ce08c'; c.fillRect(len - 9, 4, 4, 2);
      });
      if (o.so === 'micro') return;
      ISO.box(ctx, x + 1.35, y + .15, .55, .5, 18, 40, '#e9eaec');                   // bebedouro de bancada
      ISO.cyl(ctx, x + 1.62, y + .4, .2, 18, 58, 'rgba(140,200,240,.55)');
    },

    wc(ctx, o) {
      const { x, y, w, d } = o;
      ISO.box(ctx, x, y, w, d, 108, 0, '#f1f0ec', { top: '#d4d2cc' });
      faceY(ctx, x, y + d, w, 108, (c, len) => {
        // porta adesivada em preto, como no projeto
        c.fillStyle = M.preto; c.fillRect(len / 2 - 22, 22, 44, 86);
        c.fillStyle = '#c4c8cf'; c.fillRect(len / 2 + 14, 66, 2, 9);
        c.fillStyle = '#ffffff'; c.font = "800 9px 'Nunito', sans-serif"; c.textAlign = 'center';
        c.fillText('WC ' + o.n, len / 2, 36);
        c.strokeStyle = '#ffffff'; c.lineWidth = 1.4;
        c.beginPath(); c.arc(len / 2, 46, 2.5, 0, 7); c.stroke();
        c.beginPath(); c.moveTo(len / 2, 49); c.lineTo(len / 2, 58); c.moveTo(len / 2 - 4, 52); c.lineTo(len / 2 + 4, 52); c.stroke();
      });
    },

    /* ================= CABINES ================= */
    cabine(ctx, o) {
      const { x, y, w, d, cor } = o;
      const h = 104;
      ISO.shadow(ctx, x + w / 2, y + d / 2, 1.3, .18);
      ISO.box(ctx, x, y, w, d, 3, 0, '#8d9096');                              // base
      ISO.box(ctx, x, y, w, .12, h, 0, cor, { top: ISO.shade(cor, .2) });     // fundo colorido
      ISO.box(ctx, x, y + .12, .1, d - .12, h, 0, ISO.shade(cor, -.1));       // lateral
      ISO.box(ctx, x, y + d - .06, w, .06, 3, h, '#2a2d33');                 // perfil superior
      ISO.box(ctx, x + w - .06, y, .06, d, 3, h, '#2a2d33');
      faceY(ctx, x + .1, y + .12, w - .1, h - 6, (c, len) => {
        c.font = "800 8px 'Nunito', sans-serif"; c.fillStyle = 'rgba(255,255,255,.9)'; c.textAlign = 'center';
        c.fillText('CABINE · ' + o.nome, len / 2, 10);
        if (cor === M.azulE) { c.fillStyle = '#15171b'; c.fillRect(len / 2 - 20, 22, 40, 22); }   // TV da cabine
      });
      // banco estofado no fundo e mesinha na frente
      ISO.box(ctx, x + .3, y + .18, w - .6, .6, 16, 3, ISO.shade(cor, -.3), { top: ISO.shade(cor, -.15) });
      ISO.box(ctx, x + .3, y + .18, w - .6, .18, 34, 3, ISO.shade(cor, -.3));
      ISO.box(ctx, x + .7, y + 1.5, w - 1.4, .6, 3, 26, M.mad, { top: '#d8b186' });
      ISO.box(ctx, x + w / 2 - .05, y + 1.75, .1, .1, 26, 0, M.preto);
      // vidro lateral direito
      ISO.quad(ctx, [S(x + w, y + .12, h), S(x + w, y + d, h), S(x + w, y + d, 3), S(x + w, y + .12, 3)],
               'rgba(190,220,235,.16)', 'rgba(60,64,72,.6)');
    },

    /* ================= LOUNGE VERDE ================= */
    bancoMadeira(ctx, o) {
      const { x, y, w, d } = o;
      ISO.shadow(ctx, x + w / 2, y + d / 2, Math.max(w, d) * .45, .16);
      ISO.box(ctx, x, y, w, d, 20, 0, M.mad, { top: '#d8b186' });
      const cores = ['#9aa0a8', M.teal, '#c9ccd2', '#7f868f'];
      if (o.dir === 'n') {
        const n = Math.round(w / 1.8);
        for (let i = 0; i < n; i++) {
          const cx = x + .15 + i * (w - .3) / n, cw = (w - .3) / n - .08;
          ISO.box(ctx, cx, y + .1, cw, .32, 26, 20, cores[(i + 1) % 4], { top: ISO.shade(cores[(i + 1) % 4], .15) });
          ISO.box(ctx, cx, y + .42, cw, d - .55, 5, 20, cores[i % 4], { top: ISO.shade(cores[i % 4], .15) });
        }
      } else {
        const n = Math.round(d / 1.8);
        for (let i = 0; i < n; i++) {
          const cy = y + .15 + i * (d - .3) / n, cd = (d - .3) / n - .08;
          ISO.box(ctx, x + .15, cy, w - .55, cd, 5, 20, cores[i % 4], { top: ISO.shade(cores[i % 4], .15) });
          ISO.box(ctx, x + w - .42, cy, .32, cd, 26, 20, cores[(i + 2) % 4], { top: ISO.shade(cores[(i + 2) % 4], .15) });
        }
      }
    }
  };

  /* ===========================================================
     PEÇAS REUTILIZADAS
     =========================================================== */

  /** iMac em cima da mesa. estilo: office | dev | criativo */
  function monitor(ctx, x, y, w, telaVisivel, busy, t, estilo, seed) {
    const baseZ = TOP;
    ISO.box(ctx, x + w / 2 - .22, y + .02, .44, .3, 1.5, baseZ, '#c4c8cf', { top: '#d8dbe0' });
    ISO.box(ctx, x + w / 2 - .06, y + .08, .12, .08, 9, baseZ + 1.5, '#b9bdc4');
    const pz = baseZ + 9, ph = estilo === 'criativo' ? 30 : 26;
    ISO.box(ctx, x, y, w, .1, ph, pz, '#d9dce1', { top: '#e6e8ec' });

    faceY(ctx, x + .02, y + .1, w - .04, pz + ph - 1, (c, len) => {
      if (!telaVisivel) {
        const g = c.createLinearGradient(0, 0, len, 0);
        g.addColorStop(0, '#d2d5da'); g.addColorStop(.5, '#e8eaee'); g.addColorStop(1, '#cdd0d6');
        c.fillStyle = g; c.fillRect(0, 0, len, ph - 2);
        c.fillStyle = 'rgba(120,128,140,.35)';
        c.beginPath(); c.arc(len / 2, (ph - 2) / 2, 3, 0, 7); c.fill();
        return;
      }
      const tela = ph - 7;
      c.fillStyle = '#111317'; c.fillRect(0, 0, len, tela + 1.5);
      c.fillStyle = '#d9dce1'; c.fillRect(0, tela + 1.5, len, ph - tela - 3.5);       // queixo do iMac
      const sx = 2, sy = 2, sw = len - 4, sh = tela - 2.5;
      if (!busy) {
        const g = c.createLinearGradient(0, 0, sw, sh);
        g.addColorStop(0, '#2b4bff'); g.addColorStop(1, '#1b2a8f');
        c.fillStyle = g; c.fillRect(sx, sy, sw, sh);
        if (WORLD.pronta(WORLD.IMG.b)) c.drawImage(WORLD.IMG.b, sx + sw / 2 - 5, sy + sh / 2 - 5, 10, 10);
        return;
      }
      if (estilo === 'dev') {
        c.fillStyle = '#1e1f29'; c.fillRect(sx, sy, sw, sh);
        c.fillStyle = '#16171f'; c.fillRect(sx, sy, 8, sh);
        const cores = ['#7c5cff', '#32bcad', '#e8a317', '#ff7aa8', '#9fb0ff'];
        for (let i = 0; i < 7; i++) {
          const ly = sy + 2 + ((i * 2.6 + (t * 6 + seed) % 2.6)) ;
          if (ly > sy + sh - 2) continue;
          const ind = (i * 7 + seed) % 3 * 4;
          const lw = (sw - 16 - ind) * (.2 + .6 * Math.abs(Math.sin(i * 3.1 + seed + Math.floor(t * 1.5))));
          c.fillStyle = cores[(i + seed) % cores.length];
          c.fillRect(sx + 11 + ind, ly, lw, 1.2);
        }
      } else if (estilo === 'criativo') {
        c.fillStyle = '#2a2b30'; c.fillRect(sx, sy, sw, sh);
        c.fillStyle = '#f4f4f2'; c.fillRect(sx + 12, sy + 3, sw - 24, sh - 6);
        c.fillStyle = M.azul; c.fillRect(sx + 16, sy + 6, (sw - 32) * .6, (sh - 12) * .55);
        c.fillStyle = M.laranja;
        c.beginPath(); c.arc(sx + sw - 26, sy + sh - 9, 4 + Math.sin(t) * .8, 0, 7); c.fill();
        c.fillStyle = '#3a3b40'; c.fillRect(sx, sy, 9, sh); c.fillRect(sx + sw - 9, sy, 9, sh);
      } else {
        c.fillStyle = '#f5f6f8'; c.fillRect(sx, sy, sw, sh);
        c.fillStyle = M.azul; c.fillRect(sx, sy, 10, sh);
        c.fillStyle = '#e3e7f0'; c.fillRect(sx + 10, sy, sw - 10, 3.5);
        for (let i = 0; i < 4; i++) {
          c.fillStyle = i === 1 ? ISO.rgba(M.pix, .8) : 'rgba(80,90,120,.35)';
          c.fillRect(sx + 14, sy + 6 + i * 3.2, (sw - 22) * (.3 + .6 * Math.abs(Math.sin(i * 2.3 + seed + Math.floor(t * .7)))), 1.4);
        }
      }
    });
  }

  function teclado(ctx, x, y) {
    ISO.box(ctx, x, y, 1.3, .32, 1.5, TOP, '#e9eaec', { top: '#f6f6f7' });
    ISO.box(ctx, x + 1.45, y + .06, .18, .26, 2.5, TOP, '#f2f2f3');
  }

  /**
   * Cadeira de escritório em duas camadas (veja cadeira()). De costas para a
   * câmera, a cadeira inteira vai na frente do boneco; de frente, vai atrás.
   * p = { cor, costas, base, alt, bracos }
   */
  function cadeiraBase(ctx, o, p) {
    const ESC = AVATAR.SCALE;
    const ASSENTO = AVATAR.SEAT * ESC;
    const { x, y, w, d } = o;
    const f = o.face || 'n';
    const camada = o.camada || 'tras';
    const costasNaFrente = (f === 'n' || f === 'w');
    const cor = p.cor, corD = ISO.shade(cor, -.16), corL = ISO.shade(cor, .1);
    const cx = x + w / 2, cy = y + d / 2;
    const eixoX = (f === 'e' || f === 'w');
    const H = p.alt * ESC;

    const seg = (a0, a1, esp, rec) =>
      f === 'n' ? [x + w * a0, y + d - rec - esp, w * (a1 - a0), esp]
    : f === 's' ? [x + w * a0, y + rec,           w * (a1 - a0), esp]
    : f === 'e' ? [x + rec,          y + d * a0,  esp, d * (a1 - a0)]
    :             [x + w - rec - esp, y + d * a0, esp, d * (a1 - a0)];
    const bx = (s, h, z, c, opt) => ISO.box(ctx, s[0], s[1], s[2], s[3], h, z, c, opt);

    if (camada === 'tras') {
      ISO.shadow(ctx, cx, cy, .6, .16);
      if (costasNaFrente) return;
    } else if (!costasNaFrente) {
      return;
    }

    // base estrela + pistão
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + .35;
      const ex = cx + Math.cos(a) * w * .36, ey = cy + Math.sin(a) * d * .36;
      ISO.box(ctx, (cx + ex) / 2 - .06, (cy + ey) / 2 - .06, .12, .12, 2.5, 1, p.base);
      ISO.cyl(ctx, ex, ey, .06, 3.5, 0, '#3a3d44');
    }
    ISO.cyl(ctx, cx, cy, .06, ASSENTO - 6, 3, '#9aa0aa');

    // assento
    ISO.box(ctx, x + .12, y + .12, w - .24, d - .24, 5, ASSENTO - 6, cor, { top: corL });

    // encosto de tela (moldura + tela)
    const painel = () => {
      bx(seg(.12, .88, .12, .34), H, ASSENTO, cor, { top: corL });
      if (costasNaFrente) bx(seg(.12, .88, .125, .335), H, ASSENTO, p.costas, { top: corL });
      const mol = seg(.1, .9, .13, .33);
      ISO.box(ctx, mol[0], mol[1], mol[2], mol[3], 2.5, ASSENTO + H - 2.5, p.base);
    };
    const haste = () => {
      const hs = seg(.46, .54, .08, .36);
      ISO.box(ctx, hs[0], hs[1], hs[2], hs[3], 8, ASSENTO - 2, p.base);
    };
    if (costasNaFrente) { haste(); painel(); } else { painel(); haste(); }

    if (p.bracos) {
      const br = eixoX
        ? [[x + .15, y + .02, w - .3, .1], [x + .15, y + d - .12, w - .3, .1]]
        : [[x + .02, y + .15, .1, d - .3], [x + w - .12, y + .15, .1, d - .3]];
      for (const a of br) {
        ISO.box(ctx, a[0] + (eixoX ? a[2] / 2 : 0), a[1] + (eixoX ? 0 : a[3] / 2), eixoX ? .06 : a[2], eixoX ? a[3] : .06, 8, ASSENTO - 1, p.base);
        ISO.box(ctx, a[0], a[1], a[2], a[3], 2.5, ASSENTO + 7, p.base);
      }
    }
  }

  return { items, workSlots, restSlots, meetSlots, drawItem, depth, caneca, TOP };
})();
