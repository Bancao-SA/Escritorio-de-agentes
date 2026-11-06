/* ===========================================================
   world.js — a planta do Bancão SA - Office
   Um andar inteiro de prédio corporativo (Faria Lima), grade 60 x 46.
   Fachada de vidro nas paredes externas, divisórias de vidro entre as
   salas, piso de madeira, carpete cinza, porcelanato e grama sintética
   como no projeto de arquitetura.

     linha de cima : Diretoria · Reunião · Comercial & Financeiro ·
                     Podcast · Criativos
     meio          : Recepção · Operação (open space) · Tecnologia ·
                     Auditório
     linha de baixo: Sala de Jogos · Café Pix & Copa · Cabines ·
                     Lounge Verde
   =========================================================== */
const WORLD = (() => {

  const W = 60, H = 46;

  const VOID = 0, FLOOR = 1, WALL = 2, DOOR = 3;

  /* ---------- paleta Bancão ---------- */
  const C = {
    azul: '#2b4bff', azulEsc: '#1b2a8f', marinho: '#0f1a4a',
    laranja: '#f25a1d', ouro: '#e8a317', pix: '#32bcad',
    parede: '#f1f0ec', paredeTopo: '#d4d2cc', perfil: '#3a3d44',
    // nomes antigos, ainda usados por alguns painéis
    fire1: '#2b4bff', fire2: '#5b74ff', fire3: '#e8a317',
    volt1: '#32bcad', volt2: '#1b2a8f',
    dark: '#0f1a4a', wall: '#f1f0ec', wallTop: '#d4d2cc'
  };

  /* ---------- salas ----------
     bx/by/bw/bh: retângulo com as paredes. tipo: trabalho, reuniao,
     descanso ou apoio. piso: material padrão do chão da sala.          */
  const ROOMS = {
    diretoria: {
      name: 'DIRETORIA · CEO', short: 'Diretoria', tipo: 'trabalho',
      bx: 0, by: 0, bw: 14, bh: 14, accent: '#1b2a8f', piso: 'madeira',
      desc: 'Sala do CEO. Mesa em nogueira, estar com sofá, estante e vista para a Faria Lima.'
    },
    reuniao: {
      name: 'SALA DE REUNIÃO', short: 'Reunião', tipo: 'reuniao',
      bx: 13, by: 0, bw: 13, bh: 14, accent: '#2b4bff', piso: 'carpete',
      desc: 'Mesa de oito lugares e TV de 75". É aqui que os agentes se reúnem.'
    },
    comercial: {
      name: 'DEPARTAMENTO COMERCIAL & FINANCEIRO', short: 'Comercial & Fin.', tipo: 'trabalho',
      bx: 25, by: 0, bw: 13, bh: 14, accent: '#e8a317', piso: 'carpete',
      desc: 'Quatro estações, mesa de apoio para fechar negócio e o painel de metas do mês.'
    },
    podcast: {
      name: 'ESTÚDIO DE PODCAST', short: 'Podcast', tipo: 'descanso',
      bx: 37, by: 0, bw: 10, bh: 14, accent: '#e0245e', piso: 'acustico',
      desc: 'Tratamento acústico, três microfones, câmera e luz de estúdio. No ar!'
    },
    criativos: {
      name: 'CRIATIVOS · PUBLICIDADE', short: 'Criativos', tipo: 'trabalho',
      bx: 46, by: 0, bw: 14, bh: 14, accent: '#f25a1d', piso: 'concreto',
      desc: 'Estúdio de criação: moodboard, mesas de design, fundo infinito para fotos.'
    },
    recepcao: {
      name: 'RECEPÇÃO', short: 'Recepção', tipo: 'apoio',
      bx: 0, by: 17, bw: 15, bh: 16, accent: '#2b4bff', piso: 'porcelanato',
      desc: 'Entrada pelo elevador, logo Bancão na parede, video wall e poltronas azuis.'
    },
    servico: {
      name: 'OPERAÇÃO · OPEN SPACE', short: 'Operação', tipo: 'trabalho',
      bx: 14, by: 17, bw: 17, bh: 16, accent: '#32bcad', piso: 'carpete',
      desc: 'Bancadas de 6 lugares, muxarabi de madeira e armário da impressora.'
    },
    tecnologia: {
      name: 'TECNOLOGIA', short: 'Tecnologia', tipo: 'trabalho',
      bx: 30, by: 17, bw: 11, bh: 16, accent: '#7c5cff', piso: 'carpete',
      desc: 'Sala menor e silenciosa para os desenvolvedores: monitores duplos, rack e quadro da sprint.'
    },
    auditorio: {
      name: 'AUDITÓRIO', short: 'Auditório', tipo: 'descanso',
      bx: 40, by: 17, bw: 20, bh: 16, accent: '#2b4bff', piso: 'madeira',
      desc: 'Palco com telão de projeção, arquibancada de madeira e grama sintética.'
    },
    lounge: {
      name: 'SALA DE JOGOS', short: 'Jogos', tipo: 'descanso',
      bx: 0, by: 36, bw: 18, bh: 10, accent: '#7c5cff', piso: 'madeira',
      desc: 'Sinuca, pebolim, pingue-pongue e videogame com puffs.'
    },
    cafe: {
      name: 'CAFÉ PIX & COPA', short: 'Café', tipo: 'descanso',
      bx: 17, by: 36, bw: 16, bh: 10, accent: '#32bcad', piso: 'porcelanato',
      desc: 'Bancada de café, parede Pix · Open Finance, geladeira, mesas altas e banheiros.'
    },
    cabines: {
      name: 'CABINES', short: 'Cabines', tipo: 'descanso',
      bx: 32, by: 36, bw: 10, bh: 10, accent: '#f25a1d', piso: 'carpete',
      desc: 'Cabines de foco e call: laranja, azul e área técnica.'
    },
    jardim: {
      name: 'LOUNGE VERDE', short: 'Lounge', tipo: 'descanso',
      bx: 41, by: 36, bw: 19, bh: 10, accent: '#3f8f3a', piso: 'grama',
      desc: 'Grama sintética, banco de madeira com almofadas, sofá verde-petróleo e oliveiras.'
    },
    corredor: {
      name: 'CIRCULAÇÃO', short: 'Corredor', tipo: 'apoio', piso: 'concreto',
      accent: '#8d9096',
      desc: 'Corredores em cimento queimado ligando todas as salas.'
    }
  };
  for (const [id, r] of Object.entries(ROOMS)) {
    r.id = id;
    if (r.bw !== undefined) {
      r.x1 = r.bx + 1; r.y1 = r.by + 1;
      r.x2 = r.bx + r.bw - 2; r.y2 = r.by + r.bh - 2;
    }
  }
  /** ordem em que as salas aparecem no painel */
  const ORDER = ['diretoria', 'reuniao', 'comercial', 'podcast', 'criativos',
                 'recepcao', 'servico', 'tecnologia', 'auditorio',
                 'lounge', 'cafe', 'cabines', 'jardim', 'corredor'];

  /* ---------- trechos de piso diferente dentro das salas ---------- */
  const ZONES = [
    { x: 41, y: 18, w: 18, h: 4,  m: 'palco' },     // palco do auditório
    { x: 41, y: 25, w: 18, h: 7,  m: 'grama' },     // grama da arquibancada
    { x: 47, y: 39, w: 6,  h: 5,  m: 'madeira' },   // deck redondo do lounge verde
    { x: 1,  y: 18, w: 13, h: 2,  m: 'madeira' },   // faixa de madeira na recepção
    { x: 15, y: 18, w: 15, h: 1,  m: 'madeira' },   // passarela de madeira no open space
    { x: 52, y: 2,  w: 6,  h: 5,  m: 'infinito' },  // fundo infinito dos criativos
    { x: 3,  y: 7,  w: 6,  h: 4,  m: 'tapete' }     // tapete da diretoria
  ];

  /* ---------- portas ---------- */
  const DOORS = [
    { x: 6,  y: 13, o: 'h' }, { x: 7,  y: 13, o: 'h' },   // diretoria
    { x: 18, y: 13, o: 'h' }, { x: 19, y: 13, o: 'h' },   // reunião
    { x: 30, y: 13, o: 'h' }, { x: 31, y: 13, o: 'h' },   // comercial & financeiro
    { x: 41, y: 13, o: 'h' }, { x: 42, y: 13, o: 'h' },   // podcast
    { x: 52, y: 13, o: 'h' }, { x: 53, y: 13, o: 'h' },   // criativos
    { x: 6,  y: 17, o: 'h' }, { x: 7,  y: 17, o: 'h' },   // recepção (cima)
    { x: 6,  y: 32, o: 'h' }, { x: 7,  y: 32, o: 'h' },   // recepção (baixo)
    { x: 14, y: 24, o: 'v' }, { x: 14, y: 25, o: 'v' },   // recepção -> operação
    { x: 21, y: 17, o: 'h' }, { x: 22, y: 17, o: 'h' },   // operação (cima)
    { x: 21, y: 32, o: 'h' }, { x: 22, y: 32, o: 'h' },   // operação (baixo)
    { x: 35, y: 17, o: 'h' }, { x: 36, y: 17, o: 'h' },   // tecnologia
    { x: 35, y: 32, o: 'h' }, { x: 36, y: 32, o: 'h' },   // tecnologia (baixo)
    { x: 46, y: 32, o: 'h' }, { x: 47, y: 32, o: 'h' },   // auditório (fundo)
    { x: 55, y: 32, o: 'h' }, { x: 56, y: 32, o: 'h' },   // auditório (fundo 2)
    { x: 8,  y: 36, o: 'h' }, { x: 9,  y: 36, o: 'h' },   // jogos
    { x: 25, y: 36, o: 'h' }, { x: 26, y: 36, o: 'h' },   // café
    { x: 32, y: 42, o: 'v' }, { x: 32, y: 43, o: 'v' },   // café -> cabines
    { x: 41, y: 42, o: 'v' }, { x: 41, y: 43, o: 'v' },   // cabines -> lounge verde
    { x: 47, y: 36, o: 'h' }, { x: 48, y: 36, o: 'h' }    // lounge verde
  ];

  /* ---------- grade ---------- */
  const kind    = new Uint8Array(W * H);
  const roomOf  = new Array(W * H).fill(null);
  const blocked = new Uint8Array(W * H);

  const idx = (x, y) => y * W + x;
  const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H;

  function buildGrid() {
    kind.fill(FLOOR);
    for (let i = 0; i < W * H; i++) roomOf[i] = 'corredor';
    for (let x = 0; x < W; x++) { kind[idx(x, 0)] = WALL; kind[idx(x, H - 1)] = WALL; }
    for (let y = 0; y < H; y++) { kind[idx(0, y)] = WALL; kind[idx(W - 1, y)] = WALL; }

    for (const r of Object.values(ROOMS)) {
      if (r.bw === undefined) continue;
      const x0 = r.bx, y0 = r.by, x1 = r.bx + r.bw - 1, y1 = r.by + r.bh - 1;
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
        if (!inside(x, y)) continue;
        const borda = (x === x0 || x === x1 || y === y0 || y === y1);
        kind[idx(x, y)] = borda ? WALL : FLOOR;
        roomOf[idx(x, y)] = r.id;
      }
    }
    for (const d of DOORS) if (inside(d.x, d.y)) kind[idx(d.x, d.y)] = DOOR;
  }
  buildGrid();

  const kindAt = (x, y) => inside(x, y) ? kind[idx(x, y)] : VOID;
  const roomAt = (x, y) => inside(x, y) ? roomOf[idx(x, y)] : null;
  const isWall = (x, y) => kindAt(x, y) === WALL;

  function walkable(x, y) {
    if (!inside(x, y)) return false;
    const k = kind[idx(x, y)];
    return (k === FLOOR || k === DOOR) && !blocked[idx(x, y)];
  }
  function setBlocked(x, y, v = 1) { if (inside(x, y)) blocked[idx(x, y)] = v; }

  /* ---------- paredes ----------
     Parede com chão atrás dela taparia a visão: vira divisória de vidro
     (rodapé baixo + vidro com faixa jateada). As outras são as paredes
     altas da fachada, com janelas para a cidade.                     */
  const WALL_H = 112, PARAPET = 10;

  function wallOccludes(x, y) {
    const a = kindAt(x - 1, y), b = kindAt(x, y - 1);
    return a === FLOOR || a === DOOR || b === FLOOR || b === DOOR;
  }

  /* ---------- painéis nas paredes altas ---------- */
  const SIGNS = [
    { o: 'n', x: 2,  y: 0, len: 5, kind: 'eventos'   },  // diretoria
    { o: 'w', x: 0,  y: 3, len: 7, kind: 'quadro'    },  // diretoria
    { o: 'n', x: 27, y: 0, len: 8, kind: 'metas'     },  // comercial & financeiro
    { o: 'n', x: 38, y: 0, len: 8, kind: 'podcast'   },  // estúdio
    { o: 'n', x: 47, y: 0, len: 5, kind: 'moodboard' },  // criativos
    { o: 'w', x: 0,  y: 18, len: 5, kind: 'logo'     },  // recepção
    { o: 'w', x: 0,  y: 23, len: 3, kind: 'elevador' },  // recepção: entrada
    { o: 'w', x: 0,  y: 27, len: 5, kind: 'video'    },  // recepção: video wall
    { o: 'w', x: 0,  y: 38, len: 6, kind: 'jogos'    }   // sala de jogos
  ];
  const signAt = (x, y) => SIGNS.find(s => s.o === 'n'
    ? (s.y === y && x >= s.x && x < s.x + s.len)
    : (s.x === x && y >= s.y && y < s.y + s.len));

  /* ---------- imagens da marca ---------- */
  const IMG = {};
  if (typeof Image !== 'undefined') {
    for (const [k, src] of [['logo', 'img/bancao-logo.png'], ['branco', 'img/bancao-logo-branco.png'],
                            ['b', 'img/bancao-b.png']]) {
      const im = new Image(); im.src = src; IMG[k] = im;
    }
  }
  const pronta = im => im && im.complete && im.naturalWidth > 0;

  /** logo Pix desenhado em vetor (losango com o X vazado + "pix") */
  function pix(c, x, y, s, cor = '#32bcad', comTexto = true, fundo = null) {
    c.save();
    c.translate(x + s / 2, y + s / 2);
    c.rotate(Math.PI / 4);
    c.fillStyle = cor;
    const q = s * .34;
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      ISO.rrect(c, dx * q * .56 - q / 2, dy * q * .56 - q / 2, q, q, q * .28); c.fill();
    }
    c.restore();
    if (comTexto) {
      c.save();
      c.fillStyle = cor; c.textBaseline = 'middle'; c.textAlign = 'left';
      c.font = `600 ${s * .78}px 'Nunito', 'Barlow', sans-serif`;
      c.fillText('pix', x + s * 1.08, y + s * .46);
      c.restore();
    }
    void fundo;
  }

  /** "open finance" com o círculo dourado, como na parede do café */
  function openFinance(c, x, y, s) {
    c.save();
    c.textBaseline = 'middle'; c.textAlign = 'left';
    c.fillStyle = '#e8a317';
    c.beginPath(); c.arc(x + s * .32, y + s * .5, s * .3, 0, 7); c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(x + s * .32, y + s * .5, s * .13, 0, 7); c.fill();
    c.font = `800 ${s * .62}px 'Nunito', 'Barlow', sans-serif`;
    c.fillStyle = '#b8860b';
    c.fillText('open', x + s * .7, y + s * .52);
    const w = c.measureText('open').width;
    c.font = `500 ${s * .62}px 'Nunito', 'Barlow', sans-serif`;
    c.fillStyle = '#6b5a2a';
    c.fillText('finance', x + s * .7 + w, y + s * .52);
    c.restore();
  }

  /* ===========================================================
     DESENHO
     =========================================================== */

  function wallFace(ctx, orient, x, y, lenTiles, topZ, fn) {
    const T = ISO.TW;
    let o, a, b;
    if (orient === 'n') {
      o = ISO.toScreen(x, y + 1, topZ);
      a = ISO.HW / T; b = ISO.HH / T;
    } else {
      o = ISO.toScreen(x + 1, y + lenTiles, topZ);
      a = ISO.HW / T; b = -ISO.HH / T;
    }
    ctx.save();
    ctx.transform(a, b, 0, 1, o.x, o.y);
    fn(ctx, lenTiles * T);
    ctx.restore();
  }

  /* ---------- materiais de piso ---------- */
  function hash2(x, y, s = 0) {
    let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }

  const PISO = {
    madeira:     ['#cfa77c', '#c99f73'],
    palco:       ['#9a6a43', '#93643e'],
    carpete:     ['#9b9ea3', '#989ba0'],
    grama:       ['#62ad3d', '#5ba637'],
    porcelanato: ['#e9e6e0', '#e4e1db'],
    acustico:    ['#3d4048', '#3a3d45'],
    concreto:    ['#d3d0ca', '#cfccc6'],
    infinito:    ['#f6f5f2', '#f6f5f2'],
    tapete:      ['#d9d1c3', '#d4ccbe']
  };

  function materialAt(x, y) {
    let m = null;
    for (const z of ZONES) if (x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) m = z.m;
    if (m) return m;
    return (ROOMS[roomOf[idx(x, y)]] || ROOMS.corredor).piso;
  }

  function pintaTile(c, x, y, m, porta) {
    const P = ISO.toScreen;
    const cores = PISO[m] || PISO.concreto;
    let col = cores[(x + y) & 1];
    if (porta) col = ISO.shade(col, -.06);
    const r = hash2(x, y);
    col = ISO.shade(col, (r - .5) * .05);
    ISO.tile(c, x, y, col);

    c.save();
    const linha = (x0, y0, x1, y1, cor, lw = 1) => {
      const a = P(x0, y0), b = P(x1, y1);
      c.strokeStyle = cor; c.lineWidth = lw;
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    };
    if (m === 'madeira' || m === 'palco') {
      // tábuas correndo em x, com emendas desencontradas
      for (let i = 1; i < 4; i++) linha(x, y + i / 4, x + 1, y + i / 4, 'rgba(90,55,25,.16)');
      for (let i = 0; i < 4; i++) {
        const e = hash2(x, y, i + 3);
        if (e < .45) { const fx = x + .15 + e * 1.5; linha(fx, y + i / 4, fx, y + (i + 1) / 4, 'rgba(90,55,25,.2)'); }
      }
      linha(x, y, x + 1, y, 'rgba(255,255,255,.06)');
    } else if (m === 'porcelanato' || m === 'concreto') {
      linha(x, y, x + 1, y, m === 'porcelanato' ? 'rgba(150,140,128,.35)' : 'rgba(120,115,108,.12)');
      linha(x, y, x, y + 1, m === 'porcelanato' ? 'rgba(150,140,128,.35)' : 'rgba(120,115,108,.12)');
    } else if (m === 'carpete') {
      // placas de carpete com o fio em direções alternadas
      const dir = ((x >> 1) + (y >> 1)) & 1;
      for (let i = 1; i < 5; i++) {
        if (dir) linha(x + i / 5, y, x + i / 5, y + 1, 'rgba(0,0,0,.035)');
        else     linha(x, y + i / 5, x + 1, y + i / 5, 'rgba(0,0,0,.035)');
      }
      if (!(x & 1) && !(y & 1)) linha(x, y, x + 2, y, 'rgba(0,0,0,.05)');
    } else if (m === 'grama') {
      for (let i = 0; i < 9; i++) {
        const fx = x + hash2(x, y, i * 2 + 1), fy = y + hash2(x, y, i * 2 + 2);
        const p = P(fx, fy);
        c.fillStyle = i % 3 ? 'rgba(30,90,20,.35)' : 'rgba(170,230,120,.35)';
        c.fillRect(p.x, p.y - 2, 1.2, 2.6);
      }
    } else if (m === 'acustico') {
      linha(x, y, x + 1, y, 'rgba(0,0,0,.18)');
    } else if (m === 'tapete') {
      linha(x, y + .5, x + 1, y + .5, 'rgba(120,100,80,.08)');
    }
    c.restore();
  }

  let pisoCache = null;
  function montaPiso() {
    const x0 = ISO.toScreen(0, H - 1).x - ISO.TW;
    const x1 = ISO.toScreen(W - 1, 0).x + ISO.TW;
    const y0 = ISO.toScreen(0, 0).y - 4;
    const y1 = ISO.toScreen(W - 1, H - 1).y + ISO.TH + 30;
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(x1 - x0);
    cv.height = Math.ceil(y1 - y0);
    const c = cv.getContext('2d');
    c.translate(-x0, -y0);

    // laje do prédio por baixo do andar (a borda aparece na frente)
    const P = ISO.toScreen;
    ISO.quad(c, [P(0, H, 0), P(W, H, 0), P(W, H, -22), P(0, H, -22)], '#a9a59e');
    ISO.quad(c, [P(W, 0, 0), P(W, H, 0), P(W, H, -22), P(W, 0, -22)], '#8f8b85');

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const k = kind[idx(x, y)];
      if (k === WALL) { ISO.tile(c, x, y, '#c8c5bf'); continue; }
      pintaTile(c, x, y, materialAt(x, y), k === DOOR);
    }

    // luz natural entrando pela fachada (norte e oeste)
    c.save();
    c.globalCompositeOperation = 'soft-light';
    for (let x = 1; x < W - 1; x += 2) {
      const p = P(x + 1, 2.2);
      ISO.glow(c, p.x, p.y, 90, '#fff6dc', .5);
    }
    for (let y = 1; y < H - 1; y += 2) {
      const p = P(2.2, y + 1);
      ISO.glow(c, p.x, p.y, 90, '#fff6dc', .5);
    }
    c.restore();

    // sombra de contato ao pé das paredes altas
    c.save();
    for (let x = 1; x < W - 1; x++) {
      if (!isWall(x, 1)) ISO.quad(c, [P(x, 1), P(x + 1, 1), P(x + 1, 1.35), P(x, 1.35)], 'rgba(60,50,40,.08)');
    }
    for (let y = 1; y < H - 1; y++) {
      if (!isWall(1, y)) ISO.quad(c, [P(1, y), P(1, y + 1), P(1.35, y + 1), P(1.35, y)], 'rgba(60,50,40,.08)');
    }
    c.restore();

    pisoCache = { cv, x: x0, y: y0 };
  }

  function drawFloor(ctx) {
    if (!pisoCache) montaPiso();
    ctx.drawImage(pisoCache.cv, pisoCache.x, pisoCache.y);
  }

  /* ---- rótulo de cada sala, pintado no chão ---- */
  const LABEL_POS = {
    diretoria: [7, 12.1], reuniao: [19.5, 12.1], comercial: [31, 12.1], podcast: [41.8, 12.1],
    criativos: [52.5, 12.1], recepcao: [7.5, 31.4], servico: [22, 31.4], tecnologia: [35.5, 31.4],
    auditorio: [50, 31.3], lounge: [8.5, 44.4], cafe: [25, 44.4], cabines: [37, 44.4], jardim: [50, 44.4]
  };
  function drawRoomLabels(ctx) {
    for (const [id, pos] of Object.entries(LABEL_POS)) {
      const r = ROOMS[id];
      const p = ISO.toScreen(pos[0], pos[1], 0);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = "800 11px 'Nunito', 'Barlow Semi Condensed', sans-serif";
      ctx.letterSpacing = '3px';
      ctx.fillStyle = ISO.rgba(id === 'jardim' || id === 'auditorio' ? '#ffffff' : r.accent,
                               id === 'podcast' ? .55 : .5);
      ctx.fillText(r.name, p.x, p.y);
      ctx.restore();
    }
  }

  /* ---------- janelas da fachada ---------- */
  function periodo() {
    const d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    return (h >= 6.2 && h < 17.4) ? 'dia' : (h >= 17.4 && h < 18.8) ? 'tarde' : 'noite';
  }
  let perAtual = periodo(), perT = 0;

  const cacheJanela = new Map();
  /** janela de um tile: céu, skyline contínuo de São Paulo e caixilho preto */
  function janela(gi, per) {
    const k = gi + ':' + per;
    let cv = cacheJanela.get(k);
    if (cv) return cv;
    cv = document.createElement('canvas');
    cv.width = ISO.TW; cv.height = WALL_H;
    const c = cv.getContext('2d');
    const L = ISO.TW, gy0 = 8, gy1 = WALL_H - 24;

    const ceu = {
      dia:   ['#7fb6e6', '#cfe5f5', '#e9f2f8'],
      tarde: ['#f3a86b', '#f6c98f', '#fde7c4'],
      noite: ['#0b1433', '#1a2752', '#2a3a6a']
    }[per];
    const g = c.createLinearGradient(0, gy0, 0, gy1);
    g.addColorStop(0, ceu[0]); g.addColorStop(.65, ceu[1]); g.addColorStop(1, ceu[2]);
    c.fillStyle = g; c.fillRect(0, gy0, L, gy1 - gy0);

    // dois planos de prédios, contínuos de um tile para o outro
    const camadas = per === 'noite'
      ? [{ w: 9,  min: 14, var: 30, cor: '#1c2748' }, { w: 15, min: 6, var: 22, cor: '#141c36' }]
      : [{ w: 9,  min: 14, var: 30, cor: per === 'tarde' ? '#c79a86' : '#aebdcc' },
         { w: 15, min: 6,  var: 22, cor: per === 'tarde' ? '#9c7a72' : '#8fa1b5' }];
    for (const cam of camadas) {
      for (let px = 0; px < L; px++) {
        const u = gi * L + px;
        const bi = Math.floor(u / cam.w);
        const hb = cam.min + Math.floor(hash2(bi, cam.w) * cam.var);
        c.fillStyle = cam.cor;
        c.fillRect(px, gy1 - hb, 1, hb);
        // janelinhas acesas à noite
        if (per === 'noite' && (u % 3 === 1)) {
          for (let wy = gy1 - hb + 3; wy < gy1 - 2; wy += 4) {
            if (hash2(u, wy) > .62) { c.fillStyle = 'rgba(255,214,120,.85)'; c.fillRect(px, wy, 1, 1.6); }
          }
        }
      }
    }
    // reflexo no vidro
    c.fillStyle = per === 'noite' ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.22)';
    c.beginPath(); c.moveTo(L * .1, gy0); c.lineTo(L * .45, gy0); c.lineTo(L * .05, gy1); c.lineTo(0, gy1); c.lineTo(0, gy0 + 10); c.fill();

    // caixilho preto, travessa e peitoril
    c.fillStyle = '#2d3036';
    c.fillRect(0, gy0 - 3, L, 3);
    c.fillRect(0, gy0, 2, gy1 - gy0);
    c.fillRect(L - 2, gy0, 2, gy1 - gy0);
    c.fillRect(0, gy0 + 22, L, 1.6);
    c.fillStyle = '#e6e3dd'; c.fillRect(0, gy1, L, 4);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, gy1 + 4, L, 2);

    if (cacheJanela.size > 400) cacheJanela.clear();
    cacheJanela.set(k, cv);
    return cv;
  }

  const cacheGrad = new Map();
  function gradFace(ctx, ck, pts, c0, c1) {
    let g = cacheGrad.get(ck);
    if (!g) {
      g = ctx.createLinearGradient(0, pts[0].y, 0, pts[2].y);
      g.addColorStop(0, c0); g.addColorStop(1, c1);
      cacheGrad.set(ck, g);
    }
    return g;
  }

  /* ---- uma parede ---- */
  function drawWallTile(ctx, x, y, t, rgbOn, zoom) {
    const detalhe = (zoom === undefined || zoom > 0.55);
    const occ = wallOccludes(x, y);
    const P = ISO.toScreen;
    const showLeft  = !isWall(x, y + 1);
    const showRight = !isWall(x + 1, y);

    if (occ) {
      /* divisória de vidro */
      const h = PARAPET;
      if (showLeft)  ISO.quad(ctx, [P(x, y+1, h), P(x+1, y+1, h), P(x+1, y+1, 0), P(x, y+1, 0)], '#c9c6c0');
      if (showRight) ISO.quad(ctx, [P(x+1, y, h), P(x+1, y+1, h), P(x+1, y+1, 0), P(x+1, y, 0)], '#b3b0aa');
      ISO.plane(ctx, x, y, 1, 1, h, '#dddad4');
      if (!detalhe) return;
      const faces = [];
      if (showLeft)  faces.push([P(x, y+.5, WALL_H), P(x+1, y+.5, WALL_H), P(x+1, y+.5, h), P(x, y+.5, h)]);
      if (showRight) faces.push([P(x+.5, y, WALL_H), P(x+.5, y+1, WALL_H), P(x+.5, y+1, h), P(x+.5, y, h)]);
      if (!showLeft && !showRight) {
        // trecho do meio de uma divisória comprida: só o vidro no eixo
        const horiz = isWall(x - 1, y) || isWall(x + 1, y);
        faces.push(horiz
          ? [P(x, y+.5, WALL_H), P(x+1, y+.5, WALL_H), P(x+1, y+.5, h), P(x, y+.5, h)]
          : [P(x+.5, y, WALL_H), P(x+.5, y+1, WALL_H), P(x+.5, y+1, h), P(x+.5, y, h)]);
      }
      for (const f of faces) {
        ISO.quad(ctx, f, 'rgba(190,220,235,.13)');
        // faixa jateada
        const a = f[0], b = f[1], cc = f[2], d = f[3];
        const lerp = (p, q, s) => ({ x: p.x + (q.x - p.x) * s, y: p.y + (q.y - p.y) * s });
        const s0 = (WALL_H - 58) / (WALL_H - h), s1 = (WALL_H - 50) / (WALL_H - h);
        ISO.quad(ctx, [lerp(a, d, s0), lerp(b, cc, s0), lerp(b, cc, s1), lerp(a, d, s1)], 'rgba(255,255,255,.42)');
        // perfil de alumínio preto em cima
        ISO.quad(ctx, [a, b, lerp(b, cc, .035), lerp(a, d, .035)], '#3a3d44');
        // montante a cada 2 tiles
        if (((x + y) & 1) === 0) {
          ctx.strokeStyle = 'rgba(40,44,52,.55)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(d.x, d.y); ctx.stroke();
        }
      }
      return;
    }

    /* parede alta da fachada */
    if (!showLeft && !showRight) { ISO.plane(ctx, x, y, 1, 1, WALL_H, C.paredeTopo); return; }
    const faces = [];
    if (showLeft)  faces.push({ o: 'n', pts: [P(x, y+1, WALL_H), P(x+1, y+1, WALL_H), P(x+1, y+1, 0), P(x, y+1, 0)],
                                c0: '#f5f4f0', c1: '#e4e2dc' });
    if (showRight) faces.push({ o: 'w', pts: [P(x+1, y, WALL_H), P(x+1, y+1, WALL_H), P(x+1, y+1, 0), P(x+1, y, 0)],
                                c0: '#e2e0da', c1: '#cfccc6' });
    for (const f of faces) {
      ISO.quad(ctx, f.pts, gradFace(ctx, x + ',' + y + f.o, f.pts, f.c0, f.c1));
      // rodapé
      ISO.quad(ctx, [f.pts[3], f.pts[2], { x: f.pts[2].x, y: f.pts[2].y - 6 }, { x: f.pts[3].x, y: f.pts[3].y - 6 }],
               '#d0cdc6');
      const ehJanela = !signAt(x, y) &&
        ((f.o === 'n' && y === 0 && !isWall(x, 1)) || (f.o === 'w' && x === 0 && !isWall(1, y)));
      if (ehJanela && detalhe) {
        const gi = f.o === 'n' ? x : 200 - y;
        wallFace(ctx, f.o, x, y, 1, WALL_H, (c) => c.drawImage(janela(gi, perAtual), 0, 0));
      }
    }
    ISO.plane(ctx, x, y, 1, 1, WALL_H, C.paredeTopo);

    // sanca com luz indireta no topo da parede
    if (rgbOn) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const f of faces) {
        ISO.quad(ctx, [f.pts[0], f.pts[1], { x: f.pts[1].x, y: f.pts[1].y + 4 }, { x: f.pts[0].x, y: f.pts[0].y + 4 }],
                 'rgba(255,236,200,.35)');
      }
      ctx.restore();
    }

    drawSignTile(ctx, x, y, t, rgbOn);
  }

  function drawSignTile(ctx, x, y, t, rgbOn) {
    const s = signAt(x, y);
    if (!s) return;
    const T = ISO.TW;
    const off = s.o === 'n' ? (x - s.x) * T : (s.y + s.len - 1 - y) * T;
    const cv = placaCanvas(s, t, rgbOn);
    wallFace(ctx, s.o, x, y, 1, WALL_H, (c) => c.drawImage(cv, off, 0, T, WALL_H, 0, 0, T, WALL_H));
  }

  /* ---- porta: batentes e bandeira de alumínio preto ---- */
  function drawDoorTile(ctx, x, y) {
    const d = DOORS.find(d => d.x === x && d.y === y);
    if (!d) return;
    const P = ISO.toScreen;
    const h = WALL_H;
    if (d.o === 'h') {
      ISO.quad(ctx, [P(x, y+.5, h), P(x+1, y+.5, h), P(x+1, y+.5, h-14), P(x, y+.5, h-14)], 'rgba(190,220,235,.16)');
      ISO.quad(ctx, [P(x, y+.5, h), P(x+1, y+.5, h), P(x+1, y+.5, h-4), P(x, y+.5, h-4)], '#3a3d44');
      ISO.quad(ctx, [P(x, y+.5, h-14), P(x+1, y+.5, h-14), P(x+1, y+.5, h-16), P(x, y+.5, h-16)], '#3a3d44');
      if (isWall(x - 1, y)) ISO.box(ctx, x, y + .44, .06, .12, h, 0, '#3a3d44');
      if (isWall(x + 1, y)) ISO.box(ctx, x + .94, y + .44, .06, .12, h, 0, '#3a3d44');
    } else {
      ISO.quad(ctx, [P(x+.5, y, h), P(x+.5, y+1, h), P(x+.5, y+1, h-14), P(x+.5, y, h-14)], 'rgba(190,220,235,.16)');
      ISO.quad(ctx, [P(x+.5, y, h), P(x+.5, y+1, h), P(x+.5, y+1, h-4), P(x+.5, y, h-4)], '#3a3d44');
      if (isWall(x, y - 1)) ISO.box(ctx, x + .44, y, .12, .06, h, 0, '#3a3d44');
      if (isWall(x, y + 1)) ISO.box(ctx, x + .44, y + .94, .12, .06, h, 0, '#3a3d44');
    }
  }

  function signDepth(s) {
    return s.o === 'n' ? (s.x + s.len / 2) + (s.y + 1) : (s.x + 1) + (s.y + s.len / 2);
  }

  /* ---- conteúdo das placas ---- */
  function pintaPlaca(c, s, len, t, rgbOn) {
    const f = PLACAS[s.kind];
    if (f) f(c, len, t, rgbOn);
  }

  const cachePlaca = new Map();
  function placaCanvas(s, t, rgbOn) {
    let c = cachePlaca.get(s);
    if (!c) {
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(s.len * ISO.TW); cv.height = WALL_H;
      c = { cv, ctx: cv.getContext('2d'), t: -1e9, rgb: null };
      cachePlaca.set(s, c);
    }
    const anima = s.kind === 'video' || s.kind === 'podcast' || s.kind === 'metas' || s.kind === 'logo';
    const intervalo = anima ? 0.16 : 2;
    if (t - c.t > intervalo || c.t > t || c.rgb !== rgbOn) {
      c.t = t; c.rgb = rgbOn;
      c.ctx.clearRect(0, 0, c.cv.width, c.cv.height);
      pintaPlaca(c.ctx, s, c.cv.width, t, rgbOn);
    }
    // o período do dia muda as janelas: confere de vez em quando
    if (t - perT > 30 || perT > t) { perT = t; perAtual = periodo(); }
    return c.cv;
  }

  function drawSigns(ctx, t, rgbOn, lista) {
    for (const s of (lista || SIGNS)) {
      const cv = placaCanvas(s, t, rgbOn);
      wallFace(ctx, s.o, s.x, s.y, s.len, WALL_H, (c) => c.drawImage(cv, 0, 0));
    }
  }

  const FONT = "'Nunito', 'Barlow', sans-serif";
  const UI   = "'Barlow Semi Condensed', sans-serif";

  /** relógio digital de LED, como o da parede da recepção no render */
  function relogioLED(c, x, y, alt, cor) {
    const d = new Date();
    const txt = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    c.save();
    c.font = `300 ${alt}px 'Barlow', sans-serif`;
    c.textBaseline = 'top'; c.textAlign = 'left';
    c.fillStyle = cor; c.shadowColor = ISO.rgba('#ffffff', .9); c.shadowBlur = 4;
    c.fillText(txt, x, y);
    c.restore();
  }

  const PLACAS = {

    /* logo Bancão na parede da recepção, em acrílico, com o relógio de LED */
    logo(c, len) {
      relogioLED(c, 18, 10, 18, '#c8ccd4');
      const im = IMG.logo;
      if (pronta(im)) {
        const w = len - 50, h = w * im.naturalHeight / im.naturalWidth;
        c.save();
        c.shadowColor = 'rgba(20,30,90,.25)'; c.shadowBlur = 6; c.shadowOffsetX = 2; c.shadowOffsetY = 3;
        c.drawImage(im, 25, 40, w, h);
        c.restore();
      } else {
        c.font = `800 40px ${FONT}`; c.fillStyle = C.azul; c.textBaseline = 'top';
        c.fillText('Bancão', 30, 42);
      }
    },

    /* video wall 2x2 com slides da marca */
    video(c, len, t) {
      const x0 = 8, y0 = 10, w = len - 16, h = 74;
      c.fillStyle = '#16181d'; ISO.rrect(c, x0 - 3, y0 - 3, w + 6, h + 6, 3); c.fill();
      const slide = Math.floor(t / 6) % 3;
      const g = c.createLinearGradient(x0, y0, x0 + w, y0 + h);
      if (slide === 0) {
        g.addColorStop(0, '#2b4bff'); g.addColorStop(1, '#1b2a8f');
        c.fillStyle = g; c.fillRect(x0, y0, w, h);
        if (pronta(IMG.branco)) {
          const lw = w * .62, lh = lw * IMG.branco.naturalHeight / IMG.branco.naturalWidth;
          c.drawImage(IMG.branco, x0 + (w - lw) / 2, y0 + (h - lh) / 2 - 4, lw, lh);
        }
        c.font = `600 9px ${UI}`; c.fillStyle = 'rgba(255,255,255,.8)'; c.textAlign = 'center';
        c.fillText('INFRAESTRUTURA PARA O SISTEMA FINANCEIRO', x0 + w / 2, y0 + h - 8);
      } else if (slide === 1) {
        g.addColorStop(0, '#f4fbfa'); g.addColorStop(1, '#dff3f0');
        c.fillStyle = g; c.fillRect(x0, y0, w, h);
        pix(c, x0 + w / 2 - 70, y0 + 14, 40, '#32bcad');
        c.font = `700 11px ${UI}`; c.fillStyle = '#1b2a8f'; c.textAlign = 'center';
        c.fillText('PIX 24/7 · LIQUIDAÇÃO INSTANTÂNEA', x0 + w / 2, y0 + h - 12);
      } else {
        g.addColorStop(0, '#0f1a4a'); g.addColorStop(1, '#1b2a8f');
        c.fillStyle = g; c.fillRect(x0, y0, w, h);
        c.font = `700 9px ${UI}`; c.fillStyle = '#9fb0ff'; c.textAlign = 'left';
        c.fillText('TRANSAÇÕES · ÚLTIMAS 24H', x0 + 10, y0 + 12);
        c.strokeStyle = '#32bcad'; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 24; i++) {
          const px = x0 + 10 + i * (w - 20) / 24;
          const py = y0 + h - 12 - (18 + 30 * Math.abs(Math.sin(i * .5 + 1)) + 6 * Math.sin(t + i));
          i ? c.lineTo(px, py) : c.moveTo(px, py);
        }
        c.stroke();
      }
      // emendas das telas
      c.fillStyle = 'rgba(0,0,0,.55)';
      c.fillRect(x0 + w / 2 - .6, y0, 1.2, h);
      c.fillRect(x0, y0 + h / 2 - .6, w, 1.2);
    },

    /* agenda da diretoria */
    eventos(c, len) {
      const evs = (typeof QUADRO !== 'undefined') ? QUADRO.eventos() : [];
      const x0 = 10, y0 = 14, w = len - 20, h = 78;
      c.fillStyle = '#ffffff'; ISO.rrect(c, x0, y0, w, h, 6); c.fill();
      c.strokeStyle = 'rgba(27,42,143,.18)'; c.lineWidth = 1; c.stroke();
      c.fillStyle = C.azul; c.fillRect(x0, y0, 4, h);
      c.textBaseline = 'middle'; c.textAlign = 'left';
      c.font = `800 10px ${FONT}`; c.fillStyle = C.azulEsc; c.letterSpacing = '1.5px';
      c.fillText('PRÓXIMOS EVENTOS', x0 + 12, y0 + 12);
      c.letterSpacing = '0px';
      if (!evs.length) {
        c.font = `600 10px ${UI}`; c.fillStyle = 'rgba(60,70,100,.55)';
        c.fillText('nenhum evento marcado', x0 + 12, y0 + 34);
        return;
      }
      evs.slice(0, 4).forEach((e, i) => {
        const ry = y0 + 30 + i * 13;
        c.font = `700 9.5px ${UI}`; c.fillStyle = C.azul; c.fillText(e.data, x0 + 12, ry);
        c.font = `600 9.5px ${UI}`; c.fillStyle = '#2a2f3a'; c.fillText(e.nome, x0 + 52, ry);
      });
    },

    /* quadro branco de ideias */
    quadro(c, len) {
      const ideias = (typeof QUADRO !== 'undefined') ? QUADRO.ideias() : [];
      const x0 = 12, y0 = 14, w = len - 24, h = 80;
      c.fillStyle = '#9aa0aa'; ISO.rrect(c, x0 - 3, y0 - 3, w + 6, h + 6, 4); c.fill();
      const g = c.createLinearGradient(0, y0, 0, y0 + h);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#e9ecf0');
      c.fillStyle = g; ISO.rrect(c, x0, y0, w, h, 2); c.fill();
      c.textBaseline = 'middle'; c.textAlign = 'left';
      c.font = `800 11px ${FONT}`; c.fillStyle = C.azul;
      c.fillText('IDEIAS', x0 + 12, y0 + 13);
      c.font = `600 8px ${UI}`; c.fillStyle = 'rgba(70,80,100,.6)';
      c.fillText('botão 📌 Quadro', x0 + 60, y0 + 13);
      const cores = ['#2b4bff', '#32bcad', '#f25a1d', '#1b2a8f', '#e8a317'];
      ideias.slice(0, 5).forEach((txt, i) => {
        const ry = y0 + 30 + i * 11.5;
        c.fillStyle = cores[i % cores.length];
        c.beginPath(); c.arc(x0 + 16, ry - 1, 2, 0, 7); c.fill();
        c.font = `600 10px ${UI}`; c.fillText(txt, x0 + 24, ry);
      });
      if (!ideias.length) {
        c.font = `italic 600 10px ${UI}`; c.fillStyle = 'rgba(70,80,100,.5)';
        c.fillText('quadro vazio', x0 + 24, y0 + 32);
      }
      ['#f25a1d', '#2b4bff', '#32bcad'].forEach((cor, i) => {
        c.fillStyle = cor; ISO.rrect(c, x0 + w - 54 + i * 14, y0 + h - 7, 11, 4, 2); c.fill();
      });
    },

    /* painel de metas do Comercial & Financeiro */
    metas(c, len, t) {
      const x0 = 10, y0 = 12, w = len - 20, h = 80;
      c.fillStyle = '#0f1a4a'; ISO.rrect(c, x0, y0, w, h, 6); c.fill();
      c.textBaseline = 'middle'; c.textAlign = 'left';
      c.font = `800 10px ${FONT}`; c.fillStyle = '#ffffff'; c.letterSpacing = '1.5px';
      c.fillText('COMERCIAL & FINANCEIRO', x0 + 12, y0 + 12);
      c.letterSpacing = '0px';
      c.fillStyle = C.ouro; c.fillRect(x0 + 12, y0 + 20, 26, 2);
      const RO = (typeof ROSTER !== 'undefined') ? ROSTER : null;
      const n = st => RO ? RO.count(st) : 0;
      const cels = [
        { r: 'EQUIPE ATIVA', v: String(n('trabalhando') + n('reuniao')), cor: '#32bcad' },
        { r: 'EM REUNIÃO',   v: String(n('reuniao')),                    cor: '#9fb0ff' },
        { r: 'DESCANSO',     v: String(n('descanso')),                   cor: C.ouro },
        { r: 'DATA',         v: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), cor: '#ffffff' }
      ];
      const cw = (w - 20) / cels.length;
      cels.forEach((cel, i) => {
        const cx = x0 + 10 + i * cw;
        c.font = `600 8px ${UI}`; c.fillStyle = 'rgba(200,210,240,.7)';
        c.fillText(cel.r, cx + 4, y0 + 36);
        c.font = `800 19px ${FONT}`; c.fillStyle = cel.cor;
        c.fillText(cel.v, cx + 4, y0 + 54);
        c.fillStyle = ISO.rgba(cel.cor, .45);
        c.fillRect(cx + 4, y0 + 68, (cw - 16) * (.5 + .4 * Math.abs(Math.sin(t * .4 + i))), 2.5);
      });
    },

    /* espuma acústica + luz "NO AR" */
    podcast(c, len, t) {
      for (let i = 0; i * 18 < len - 10; i++) for (let j = 0; j < 4; j++) {
        const px = 8 + i * 18, py = 18 + j * 18;
        const g = c.createLinearGradient(px, py, px + 16, py + 16);
        g.addColorStop(0, (i + j) & 1 ? '#3a3e47' : '#2e3139'); g.addColorStop(1, '#22252b');
        c.fillStyle = g; c.fillRect(px, py, 16, 16);
        c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1;
        for (let k = 4; k < 16; k += 4) {
          c.beginPath();
          if ((i + j) & 1) { c.moveTo(px + k, py); c.lineTo(px + k, py + 16); }
          else             { c.moveTo(px, py + k); c.lineTo(px + 16, py + k); }
          c.stroke();
        }
      }
      // letreiro NO AR
      const bx = len / 2 - 42, by = 2;
      c.fillStyle = '#16181d'; ISO.rrect(c, bx, by, 84, 13, 3); c.fill();
      const on = Math.sin(t * 2.2) > -0.6;
      c.font = `800 9px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = on ? '#ff3b5c' : '#5a2430';
      if (on) { c.shadowColor = '#ff3b5c'; c.shadowBlur = 8; }
      c.fillText('● NO AR', len / 2, by + 7);
      c.shadowBlur = 0;
      // marca do podcast
      c.fillStyle = 'rgba(255,255,255,.9)'; c.font = `800 12px ${FONT}`;
      c.fillText('BANCÃO CAST', len / 2, 98);
    },

    /* moodboard dos criativos */
    moodboard(c, len) {
      c.fillStyle = '#d9b98f'; ISO.rrect(c, 8, 10, len - 16, 82, 4); c.fill();   // cortiça
      c.fillStyle = 'rgba(120,80,40,.15)';
      for (let i = 0; i < 160; i++) c.fillRect(10 + (i * 37) % (len - 20), 12 + (i * 53) % 78, 1.5, 1.5);
      c.font = `800 10px ${FONT}`; c.fillStyle = '#3b2a1a'; c.textAlign = 'left'; c.textBaseline = 'middle';
      c.fillText('CRIATIVOS · PUBLICIDADE', 16, 20);
      // paleta da marca
      ['#2b4bff', '#1b2a8f', '#f25a1d', '#e8a317', '#32bcad', '#ffffff'].forEach((cor, i) => {
        c.fillStyle = cor; c.fillRect(16 + i * 16, 30, 13, 18);
        c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(16 + i * 16, 48, 13, 1);
      });
      // polaroids
      const fotos = [['#2b4bff', -0.08], ['#32bcad', 0.06], ['#f25a1d', -0.04], ['#1b2a8f', 0.09]];
      fotos.forEach(([cor, rot], i) => {
        c.save();
        c.translate(128 + i * 50, 50 + (i & 1) * 6); c.rotate(rot);
        c.fillStyle = '#ffffff'; c.fillRect(-20, -24, 40, 46);
        c.fillStyle = cor; c.fillRect(-16, -20, 32, 30);
        if (i === 0 && pronta(IMG.b)) c.drawImage(IMG.b, -10, -16, 20, 20);
        if (i === 1) pix(c, -9, -14, 18, '#ffffff', false);
        c.fillStyle = '#e04040'; c.beginPath(); c.arc(0, -22, 2.2, 0, 7); c.fill();
        c.restore();
      });
      // post-its
      [['#ffe680', 16, 58], ['#ffb3c7', 46, 62], ['#b6f0d8', 80, 58]].forEach(([cor, px, py]) => {
        c.fillStyle = cor; c.fillRect(px, py, 24, 24);
        c.fillStyle = 'rgba(0,0,0,.25)';
        for (let k = 0; k < 3; k++) c.fillRect(px + 4, py + 7 + k * 5, 16 - k * 3, 1.2);
      });
    },

    /* sala de jogos: ripado de madeira, letreiro e alvo de dardos */
    jogos(c, len) {
      for (let i = 0; i * 9 < len; i++) {
        c.fillStyle = i & 1 ? '#b98a5c' : '#c49568';
        c.fillRect(i * 9, 6, 8, WALL_H - 14);
      }
      c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, WALL_H - 9, len, 2);
      c.font = `800 22px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = '#ffffff'; c.shadowColor = 'rgba(124,92,255,.8)'; c.shadowBlur = 10;
      c.fillText('GAME ROOM', len * .38, 40);
      c.shadowBlur = 0;
      // alvo de dardos
      const ax = len * .8, ay = 46;
      [['#1a1a1a', 22], ['#e8e2d0', 18], ['#c0392b', 14], ['#e8e2d0', 10], ['#1f7a44', 6], ['#c0392b', 2.5]]
        .forEach(([cor, r]) => { c.fillStyle = cor; c.beginPath(); c.arc(ax, ay, r, 0, 7); c.fill(); });
    },

    /* porta do elevador: entrada do andar */
    elevador(c, len) {
      const x0 = 20, w = len - 40, y0 = 14;
      c.fillStyle = '#2d3036'; c.fillRect(x0 - 5, y0 - 5, w + 10, WALL_H - y0 - 1);
      const g = c.createLinearGradient(x0, 0, x0 + w, 0);
      g.addColorStop(0, '#c9ced6'); g.addColorStop(.5, '#eef1f5'); g.addColorStop(1, '#b7bcc5');
      c.fillStyle = g; c.fillRect(x0, y0, w, WALL_H - y0 - 6);
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(x0 + w / 2 - .8, y0, 1.6, WALL_H - y0 - 6);
      c.fillStyle = '#16181d'; ISO.rrect(c, len / 2 - 18, 1, 36, 10, 2); c.fill();
      c.font = `700 8px ${UI}`; c.fillStyle = '#7cf0c4'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('▲ 1º ▼', len / 2, 6);
      // botoeira
      c.fillStyle = '#9aa0aa'; c.fillRect(len - 14, 56, 6, 14);
      c.fillStyle = '#7cf0c4'; c.beginPath(); c.arc(len - 11, 60, 1.5, 0, 7); c.fill();
    }
  };

  function drawDecals() { /* piso já tem tudo no cache */ }

  /* ---------- pontos de interesse ---------- */
  const SPAWN = { x: 1.6, y: 24.5 };          // porta do elevador, na recepção

  return {
    W, H, VOID, FLOOR, WALL, DOOR, C,
    ROOMS, ORDER, DOORS, SPAWN, WALL_H, PARAPET, IMG,
    SIGNS, signDepth,
    kindAt, roomAt, isWall, walkable, setBlocked, wallOccludes,
    drawFloor, drawWallTile, drawDoorTile, drawSigns, drawDecals, drawRoomLabels,
    wallFace, pix, openFinance, pronta
  };
})();
