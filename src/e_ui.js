/* ================= Banao · studio UI ================= */
const $ = (s, r) => (r || document).querySelector(s);
const SELF = (() => { try { return {js:document.currentScript ? document.currentScript.textContent : '', css:(document.getElementById('banao-css') || {}).textContent || '', bar:(document.getElementById('banao-bar') || {}).outerHTML || '', fonts:(document.getElementById('banao-fonts') || {}).href || ''}; } catch (e) { return {js:'', css:'', bar:'', fonts:''}; } })();
const view = $('#view');
const CAP = name => { try { return window.claude && window.claude.use ? window.claude.use(name).catch(() => null) : Promise.resolve(null); } catch (e) { return Promise.resolve(null); } };
const DL = CAP('downloads');
/* inside the Android or iPhone app, files are saved and shared through the phone */
const NATIVE = (() => { try { const C = window.Capacitor; return C && typeof C.nativePromise === 'function' && typeof C.isNativePlatform === 'function' && C.isNativePlatform() ? C : null; } catch (e) { return null; } })();
async function nativeSave(name, data){
  let saved = '';
  try { await NATIVE.nativePromise('Filesystem', 'writeFile', {path:'Banao/' + name, data, directory:'DOCUMENTS', encoding:'utf8', recursive:true}); saved = 'Documents › Banao'; } catch (e) {}
  const r = await NATIVE.nativePromise('Filesystem', 'writeFile', {path:name, data, directory:'CACHE', encoding:'utf8', recursive:true});
  try { await NATIVE.nativePromise('Share', 'share', {title:name, files:[r.uri], dialogTitle:'Save or send ' + name}); } catch (e) {}
  return saved;
}
if (NATIVE) document.addEventListener('click', e => {
  const a = (e.composedPath ? e.composedPath() : [e.target]).find(n => n && n.tagName === 'A');
  if (!a || e.defaultPrevented) return;
  const href = a.getAttribute('href') || '';
  if (/^(https?:|tel:|mailto:|upi:|whatsapp:|sms:)/i.test(href) && !href.startsWith(location.origin)) { e.preventDefault(); location.href = href; }
}, true);

const STATE = {view:'home', prev:'home', filter:'all', q:'', cur:null, device:(window.innerWidth < 700 ? 'phone' : 'desktop'), prompt:'', kindPick:'auto', open:new Set(['Business','Hero','Modules']), confirmDel:null, build:null, nameSeed:1, cmdMsg:null};
const PV_MEM = new Map();
const PV_STORE = {get: k => PV_MEM.has(k) ? PV_MEM.get(k) : null, set: (k, v) => PV_MEM.set(k, v)};

/* ---------- saved projects (this browser only) ---------- */
const LS_KEY = 'mistri.v1.projects';
function loadProjects(){ try { const v = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
let projects = loadProjects();
function stripImages(p){ const c = clone(p); if (c.spec) { c.spec.image = ''; c.spec.gallery = []; (c.spec.show && c.spec.show.items || []).forEach(i => delete i.img); } delete c.history; return c; }
function persist(){
  const list = projects.slice(0, 40).map(p => { const c = Object.assign({}, p); delete c.history; return c; });
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); }
  catch (e) { try { localStorage.setItem(LS_KEY, JSON.stringify(list.map(stripImages))); toast('Photos are too large to keep in Saved. They stay in this session and in downloads.'); } catch (e2) {} }
}
function upsertProject(){ const p = STATE.cur; if (!p) return; p.updated = Date.now(); projects = [p].concat(projects.filter(x => x.id !== p.id)); persist(); updateCount(); }
let saveT; function saveSoon(){ clearTimeout(saveT); saveT = setTimeout(upsertProject, 500); }
function updateCount(){ const el = $('#pcount'); if (el) el.textContent = projects.length ? projects.length : ''; }

/* ---------- helpers ---------- */
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600); }
function ago(ts){ const m = Math.round((Date.now() - ts) / 60000); if (m < 1) return 'just now'; if (m < 60) return m + ' min ago'; const h = Math.round(m / 60); if (h < 24) return h + ' h ago'; return Math.round(h / 24) + ' days ago'; }
function getPath(o, p){ return p.split('.').reduce((a, k) => a == null ? a : a[k], o); }
function setPath(o, p, v){ const ks = p.split('.'); const last = ks.pop(); const t = ks.reduce((a, k) => (a[k] == null ? (a[k] = {}) : a[k]), o); t[last] = v; }
function loadImage(file, max){
  return new Promise((res, rej) => {
    const rd = new FileReader();
    rd.onload = () => { const img = new Image(); img.onload = () => { const sc = Math.min(1, (max || 1600) / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .82)); }; img.onerror = rej; img.src = rd.result; };
    rd.onerror = rej; rd.readAsDataURL(file);
  });
}
const kindLabel = k => k === 'website' ? 'Website' : 'Software';

/* ---------- live miniature screens ---------- */
const NULL_STORE = {get: () => null, set: () => {}};
const THUMB_SPEC = new Map();
let thumbIO = null;
const liveThumb = key => '<div class="lt" data-lt="' + esc(key) + '" aria-hidden="true"><div class="lt-stage"></div></div>';
function thumbSpec(key){
  if (THUMB_SPEC.has(key)) return THUMB_SPEC.get(key);
  let spec = null;
  if (key.indexOf('proj:') === 0) { const p = projects.find(x => x.id === key.slice(5)); spec = p && p.spec; }
  else { const c = CATALOG.find(x => x.key === key); if (c) spec = c.kind === 'website' ? webFromTemplate(c.t) : softFromTemplate(c.t); if (spec) THUMB_SPEC.set(key, spec); }
  return spec;
}
function paintThumb(el){
  const spec = thumbSpec(el.dataset.lt), st = el.querySelector('.lt-stage'); if (!spec || !st || st.shadowRoot) return;
  try {
    const root = st.attachShadow({mode:'open'});
    if (spec.kind === 'website') root.innerHTML = '<style>' + siteCSS(spec) + '</style>' + siteHTML(spec);
    else { root.innerHTML = '<style>' + softCSS(spec) + '</style><div class="mount" style="height:100%"></div>'; mountSoftware(root.querySelector('.mount'), Object.assign({}, spec, {icons:ICONS}), {store:NULL_STORE, standalone:false, qr:makeQR}); }
    el.classList.add('on');
  } catch (e) { el.classList.add('on'); }
}
function scaleThumbs(){ const any = view.querySelector('.lt'); if (any && any.clientWidth) view.style.setProperty('--lts', (any.clientWidth / 1280).toFixed(4)); }
function observeThumbs(){
  scaleThumbs();
  if (thumbIO) thumbIO.disconnect();
  const els = view.querySelectorAll('.lt:not(.on)');
  if (!window.IntersectionObserver) { els.forEach(paintThumb); return; }
  thumbIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { thumbIO.unobserve(e.target); paintThumb(e.target); } }), {rootMargin:'400px 0px'});
  els.forEach(el => thumbIO.observe(el));
}

/* ---------- home ---------- */
const ORDER = ['web:hospital','soft:hospital-ms','soft:pharmacy-ms','web:hotel','soft:hotel-ms','web:shoes','soft:retail-ms','web:restaurant','soft:restaurant-ms','web:school','soft:school-ms','web:gym','soft:gym-ms','web:dental','soft:clinic-ms','web:fashion','web:cafe','web:realestate','soft:realestate-ms','web:salon','web:law','web:startup','web:portfolio','web:travel','web:events','soft:library-ms','soft:hr-ms'];
const CATALOG = ORDER.map(k => { const [kind, id] = k.split(':'); const t = (kind === 'web' ? WEB_TEMPLATES : SOFT_TEMPLATES).find(x => x.id === id); return t ? {key:k, kind:kind === 'web' ? 'website' : 'software', t} : null; }).filter(Boolean);
WEB_TEMPLATES.concat(SOFT_TEMPLATES).forEach(t => { if (!CATALOG.some(c => c.t === t)) CATALOG.push({key:(t.title ? 'soft:' : 'web:') + t.id, kind:t.title ? 'software' : 'website', t}); });
const EXAMPLES = [
  ['drop','Dairy farm software','Dairy farm management with cows, milk records, feed stock and vaccinations in Anand'],
  ['shoe','Shoe brand website','Website for my shoe brand called StrideX in Mumbai, bold and sporty'],
  ['pill','Pharmacy billing','Pharmacy billing software with GST bills and expiry alerts'],
  ['lotus','Yoga studio website','Website for a yoga studio in Rishikesh, calm green colours'],
  ['book','Coaching institute','Coaching institute software with students, batches, fees and WhatsApp reminders'],
  ['cup','Tea shop website','Website for an organic tea shop named Leafline in Darjeeling'],
  ['car','Garage job cards','Car repair garage system with job cards, spare parts and invoices'],
  ['bed','Hotel website','Luxury hotel website in Udaipur']
];
function renderHome(){
  view.innerHTML = '<section class="hero"><div class="page"><div class="hero-in">' +
    '<p class="badge"><i></i>Free · No API key · Works offline</p>' +
    '<h1 class="hd">Describe your business. <span class="hl">Banao builds it.</span></h1>' +
    '<p class="sub">A complete website or management software with real content, ready to use. Change anything, then download one file that runs on any computer or phone.</p>' +
    '<div class="composer"><label for="prompt" class="sr">Describe what to build</label><textarea id="prompt" class="prompt" placeholder="For example: software for my dairy farm in Anand to track cows, milk, feed and sales">' + esc(STATE.prompt) + '</textarea>' +
    '<div class="c-foot"><div class="seg" role="group" aria-label="What to build">' + [['auto','Auto'],['website','Website'],['software','Software']].map(k => '<button type="button" data-kind="' + k[0] + '" class="' + (STATE.kindPick === k[0] ? 'on' : '') + '" aria-pressed="' + (STATE.kindPick === k[0]) + '">' + k[1] + '</button>').join('') + '</div>' +
    '<button class="b b-acc b-lg" type="button" data-act="build">' + ico('spark') + 'Build it</button></div></div><p class="err-line" id="perr" hidden></p>' +
    '<div class="ex" aria-label="Examples"><span class="ex-l">Try</span>' + EXAMPLES.map(e => '<button class="exb" type="button" data-ex="' + esc(e[2]) + '" title="' + esc(e[2]) + '">' + ico(e[0]) + esc(e[1]) + '</button>').join('') + '</div></div>' +
    '<ol class="how"><li><span class="n">1</span><div><b>Describe it</b><span>One line about your business. Banao picks the pages, modules, name and colours.</span></div></li><li><span class="n">2</span><div><b>Change anything</b><span>Edit text, photos, prices and modules, or type a change like “add a gallery”.</span></div></li><li><span class="n">3</span><div><b>Download one file</b><span>Open it in any browser. Bills, bookings and orders work offline, with no API key.</span></div></li></ol></div></section>' +
    '<section class="page"><div class="gal-head"><div><h2>Start from a ready design</h2><p>Real, working designs. Click one to make it yours.</p></div><div class="gal-tools"><div class="seg" role="group" aria-label="Filter designs">' +
    [['all','All', CATALOG.length], ['website','Websites', WEB_TEMPLATES.length], ['software','Software', SOFT_TEMPLATES.length]].map(f => '<button type="button" data-filter="' + f[0] + '" class="' + (STATE.filter === f[0] ? 'on' : '') + '" aria-pressed="' + (STATE.filter === f[0]) + '">' + f[1] + ' <em>' + f[2] + '</em></button>').join('') +
    '</div><label class="find">' + ico('search') + '<input id="q" type="search" placeholder="Search: hospital, shoes…" value="' + esc(STATE.q) + '" aria-label="Search designs"></label></div></div><div class="cards" id="cards"></div></section>' + footer();
  renderCards();
}
const footer = () => '<footer class="page foot"><span><b>Banao</b> builds websites and management software on your device. Nothing is sent to a server.</span><button class="b b-ghost b-sm" type="button" data-act="getapp">' + ico('download') + 'Download Banao</button></footer>';
function renderCards(){
  const q = STATE.q.trim().toLowerCase();
  const list = CATALOG.filter(c => (STATE.filter === 'all' || c.kind === STATE.filter) && (!q || (c.t.label + ' ' + c.t.desc + ' ' + c.t.kw + ' ' + c.t.name).toLowerCase().includes(q)));
  const cards = list.map(c => '<button class="tcard" type="button" data-open="' + c.key + '" aria-label="' + esc(kindLabel(c.kind) + ': ' + c.t.label + '. ' + c.t.desc) + '">' + liveThumb(c.key) + '<div class="tmeta"><span class="kind ' + (c.kind === 'website' ? 'k-web' : 'k-soft') + '">' + kindLabel(c.kind) + '</span><h3>' + esc(c.t.label) + ico('right') + '</h3><p>' + esc(c.t.desc) + '</p></div></button>').join('');
  $('#cards').innerHTML = cards || '<p class="small" style="grid-column:1/-1">No ready design for “' + esc(q) + '”. Describe it in the box above and Banao builds it.</p>';
  observeThumbs();
}

/* ---------- build: the offline engine, shown step by step ---------- */
let buildT = null;
function startBuild(text){
  const r = understand(text, STATE.kindPick === 'auto' ? null : STATE.kindPick);
  STATE.prompt = text;
  const extra = r.spec.kind === 'website'
    ? [['Pages', 'Home, ' + [r.spec.services.title, r.spec.show.title, 'About', r.spec.sections.reviews !== false && 'Reviews', 'FAQ', 'Contact'].filter(Boolean).join(', ')], ['Works', 'Links, ' + (r.spec.show.cart ? 'shopping bag, ' : '') + 'WhatsApp form' + (r.spec.upi ? ', UPI QR' : '')]]
    : [['Screens', 'Dashboard, ' + r.spec.modules.filter(m => m.on !== false).map(m => m.name).join(', ') + ', Reports, Settings'], ['Works', [r.spec.billing && 'GST billing counter', 'Excel import and export', 'WhatsApp reminders', 'backup'].filter(Boolean).join(', ')]];
  const steps = r.notes.filter(n => !/^(Sections|Modules)$/.test(n[0])).concat(extra);
  STATE.build = {text, spec:r.spec, steps, i:0};
  go('build');
  clearInterval(buildT);
  buildT = setInterval(() => { const b = STATE.build; if (!b || STATE.view !== 'build') { clearInterval(buildT); return; } b.i++; paintBuild(); if (b.i > b.steps.length) { clearInterval(buildT); setTimeout(() => { if (STATE.view === 'build' && STATE.build === b) finishBuild(); }, 380); } }, 230);
}
function finishBuild(){ const b = STATE.build; if (!b) return; clearInterval(buildT); STATE.build = null; openSpec(b.spec, b.text); toast('Built. Change anything you like.'); }
function renderBuild(){
  const b = STATE.build;
  view.innerHTML = '<section class="page build"><div class="bcard" role="status" aria-live="polite"><p class="eyebrow">' + (b.spec.kind === 'website' ? 'Building your website' : 'Building your software') + '</p><h1 class="hd">' + esc(b.spec.name) + '</h1><p class="bquote">“' + esc(b.text) + '”</p><ol class="bsteps" id="bsteps"></ol><div class="b-row"><span class="small">Made on this device by Banao’s builder. No API key, nothing uploaded.</span><button class="b b-ink" type="button" data-act="openbuild">Open it' + ico('right') + '</button></div></div></section>';
  paintBuild();
}
function paintBuild(){
  const b = STATE.build, ol = $('#bsteps'); if (!b || !ol) return;
  ol.innerHTML = b.steps.map((s, i) => '<li class="' + (i < b.i ? 'done' : i === b.i ? 'now' : '') + '"><span class="st">' + (i < b.i ? ico('check') : '') + '</span><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></li>').join('');
}

/* ---------- projects ---------- */
function renderProjects(){
  const head = '<div class="proj-head"><div><p class="eyebrow">Saved in this browser</p><h1 class="hd">Your projects</h1></div>' + (projects.length ? '<button class="b b-acc" type="button" data-nav="home">' + ico('plus') + 'New project</button>' : '') + '</div>';
  if (!projects.length) { view.innerHTML = '<section class="page">' + head + '<div class="empty-st"><h2>Nothing saved yet</h2><p>Everything you build or open is saved here automatically, in this browser.</p><button class="b b-acc" type="button" data-nav="home">' + ico('spark') + 'Build something</button></div></section>' + footer(); return; }
  THUMB_SPEC.forEach((v, k) => { if (k.indexOf('proj:') === 0) THUMB_SPEC.delete(k); });
  view.innerHTML = '<section class="page">' + head + '<div class="proj">' +
    projects.map(p => '<article class="pcard">' + liveThumb('proj:' + p.id) + '<div class="tmeta"><span class="kind ' + (p.spec.kind === 'website' ? 'k-web' : 'k-soft') + '">' + kindLabel(p.spec.kind) + ' · ' + esc(p.spec.label) + '</span><h3>' + esc(p.spec.name) + '</h3><p>Edited ' + ago(p.updated || Date.now()) + '</p></div><div class="pact"><button class="b b-ink b-sm" type="button" data-proj="' + p.id + '">' + ico('edit') + 'Open</button><button class="b b-ghost b-sm" type="button" data-projdl="' + p.id + '">' + ico('download') + 'Download</button>' + (STATE.confirmDel === p.id ? '<button class="b b-danger b-sm" type="button" data-projdel="' + p.id + '">Delete for good</button>' : '<button class="b b-ghost b-sm" type="button" data-projdel="' + p.id + '" aria-label="Delete ' + esc(p.spec.name) + '">' + ico('trash') + '</button>') + '</div></article>').join('') + '</div></section>' + footer();
  observeThumbs();
}

/* ---------- editor ---------- */
function openSpec(spec, prompt){
  STATE.cur = {id:newId(), created:Date.now(), updated:Date.now(), prompt:prompt || '', spec};
  STATE.open = new Set(['Business', spec.kind === 'website' ? 'Hero' : 'Modules']);
  STATE.cmdMsg = null;
  upsertProject(); go('editor');
}
let shadow = null, ro = null, io = null;
function renderEditor(){
  const s = STATE.cur.spec;
  view.innerHTML = '<div class="page"><div class="ed-bar"><button class="b b-ghost" type="button" data-nav="back" aria-label="Back">' + ico('left') + '<span>Back</span></button><div class="ed-title"><span class="kind ' + (s.kind === 'website' ? 'k-web' : 'k-soft') + '">' + kindLabel(s.kind) + ' · ' + esc(s.label) + '</span><b id="ed-name">' + esc(s.name) + '</b></div><button class="b b-acc" type="button" data-act="export">' + ico('download') + '<span>Download</span></button></div>' +
    '<div class="ed-body"><aside class="panel" id="panel" aria-label="Customize"></aside><div class="stage" id="stage">' +
    '<form class="cmd" data-cmd>' + ico('spark') + '<input id="cmdin" placeholder="' + esc(s.kind === 'website' ? 'Tell Banao what to change: “make it premium”, “add a gallery”' : 'Tell Banao what to change: “add GST billing”, “add a staff module”') + '" aria-label="Tell Banao what to change" autocomplete="off"><button class="b b-acc b-sm" type="submit">Apply</button></form>' +
    '<div class="cmd-hints" aria-label="Ideas">' + (CMD_HINTS[s.kind] || []).map(h => '<button class="hint" type="button" data-hint="' + esc(h) + '">' + esc(h) + '</button>').join('') + '</div><div class="cmd-msg" id="cmdmsg" role="status" aria-live="polite"></div>' +
    '<div class="pv-tools"><div class="seg" role="group" aria-label="Preview size"><button type="button" data-dev="desktop" class="' + (STATE.device === 'desktop' ? 'on' : '') + '" aria-pressed="' + (STATE.device === 'desktop') + '">' + ico('monitor') + 'Desktop</button><button type="button" data-dev="phone" class="' + (STATE.device === 'phone' ? 'on' : '') + '" aria-pressed="' + (STATE.device === 'phone') + '">' + ico('mobile') + 'Phone</button></div><span class="small">' + (s.kind === 'software' ? 'Live: try New bill, add records, reports' : 'Live: links, bag, form and WhatsApp work') + '</span></div>' +
    '<div class="pv-frame ' + STATE.device + '" id="frame"><div class="pv-stage" id="pvstage"><div class="pv-host" id="pvhost"></div></div></div></div></div></div>' +
    '<button class="b b-ink jump" type="button" data-act="jump">' + ico('eye') + 'Preview</button>';
  renderPanel(); paintCmdMsg();
  shadow = $('#pvhost').attachShadow({mode:'open'});
  updatePreview(); fitPreview();
  if (ro) ro.disconnect(); if (window.ResizeObserver) { ro = new ResizeObserver(fitPreview); ro.observe($('#frame')); }
  if (io) io.disconnect(); if (window.IntersectionObserver) { io = new IntersectionObserver(es => { const j = $('.jump'); if (j) j.classList.toggle('show', !es[0].isIntersecting); }); io.observe($('#frame')); }
}
function updatePreview(){
  const s = STATE.cur && STATE.cur.spec; if (!s || !shadow) return;
  const host = $('#pvhost'), keep = host.scrollTop;
  if (s.kind === 'website') {
    shadow.innerHTML = '<style>' + siteCSS(s) + '</style>' + siteHTML(s);
    siteBehavior(shadow.querySelector('.site'), siteRuntimeConfig(s), {scroller:host});
    host.scrollTop = keep;
  } else {
    shadow.innerHTML = '<style>' + softCSS(s) + '</style><div class="mount" style="height:100%"></div>';
    mountSoftware(shadow.querySelector('.mount'), Object.assign({}, s, {icons:ICONS}), {store:PV_STORE, standalone:false, qr:makeQR});
  }
}
let pvT; function previewSoon(){ clearTimeout(pvT); pvT = setTimeout(updatePreview, 140); }
function fitPreview(){
  const frame = $('#frame'), st = $('#pvstage'); if (!frame || !st) return;
  const W = frame.clientWidth, H = frame.clientHeight;
  if (STATE.device === 'desktop') { const base = Math.max(1280, W), s = W / base; Object.assign(st.style, {width:base + 'px', height:(H / s) + 'px', transform:'scale(' + s + ')', left:'0px', top:'0px'}); }
  else { const pw = 390, room = H - 32, s = Math.min(1, (W - 32) / pw), h = Math.min(room / s, 844); Object.assign(st.style, {width:pw + 'px', height:h + 'px', transform:'scale(' + s + ')', left:Math.max(0, (W - pw * s) / 2) + 'px', top:Math.max(16, (H - h * s) / 2) + 'px'}); }
}

/* ---------- change requests in plain words ---------- */
function runCmd(text){
  const t = String(text || '').trim(); if (!t || !STATE.cur) return;
  if (/^(undo|go back|revert)$/i.test(t)) { undoCmd(); return; }
  const before = STATE.cur.spec, r = applyCommand(before, t);
  if (r.done.length) {
    STATE.cur.history = (STATE.cur.history || []).concat([before]).slice(-10);
    STATE.cur.spec = r.spec;
    if (r.spec.kind === 'software') PV_MEM.delete('mistri:' + r.spec.slug);
    $('#ed-name').textContent = r.spec.name;
    renderPanel(); updatePreview(); saveSoon();
    const f = $('#frame'); if (f) { f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash'); }
    const inp = $('#cmdin'); if (inp) inp.value = '';
  }
  STATE.cmdMsg = {done:r.done, missed:r.missed};
  paintCmdMsg();
}
function undoCmd(){
  const h = STATE.cur && STATE.cur.history || [];
  if (!h.length) { STATE.cmdMsg = {done:[], missed:[], info:'Nothing to undo.'}; paintCmdMsg(); return; }
  STATE.cur.spec = h.pop(); if (STATE.cur.spec.kind === 'software') PV_MEM.delete('mistri:' + STATE.cur.spec.slug);
  $('#ed-name').textContent = STATE.cur.spec.name; renderPanel(); updatePreview(); saveSoon();
  STATE.cmdMsg = {done:[], missed:[], info:'Undone.'}; paintCmdMsg();
}
function paintCmdMsg(){
  const el = $('#cmdmsg'); if (!el) return; const m = STATE.cmdMsg;
  if (!m) { el.innerHTML = ''; el.className = 'cmd-msg'; return; }
  const kind = STATE.cur.spec.kind;
  let h = '';
  if (m.info) h = ico('check') + '<ul><li>' + esc(m.info) + '</li></ul>';
  else if (m.done.length) h = ico('check') + '<ul>' + m.done.map(d => '<li>' + esc(d) + '</li>').join('') + (m.missed.length ? '<li class="small">Skipped: “' + esc(m.missed.join('”, “')) + '”</li>' : '') + '</ul><button class="mini" type="button" data-act="undocmd">' + ico('left') + 'Undo</button>';
  else h = ico('alert') + '<ul><li>Banao didn’t catch that. Try short sentences like ' + (CMD_HINTS[kind] || []).slice(0, 3).map(x => '“' + esc(x) + '”').join(', ') + '.</li><li class="small">You can also change everything in the panel on the left.</li></ul>';
  el.className = 'cmd-msg' + (m.done.length || m.info ? '' : ' warn');
  el.innerHTML = h;
}

/* ---------- customise panel ---------- */
const fld = (label, k, type, ph) => { const v = getPath(STATE.cur.spec, k); const id = 'k-' + k.replace(/\./g, '-'); return '<label class="f" for="' + id + '">' + esc(label) + (type === 'area' ? '<textarea class="in" id="' + id + '" data-k="' + k + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(v) + '</textarea>' : '<input class="in" id="' + id + '" data-k="' + k + '"' + (type === 'num' ? ' type="number" step="any"' : '') + ' value="' + esc(v == null ? '' : v) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>') + '</label>'; };
const tog = (label, k) => { const id = 't-' + k.replace(/\./g, '-'); return '<label class="tog" for="' + id + '"><span>' + esc(label) + '</span><input type="checkbox" id="' + id + '" data-k="' + k + '"' + (getPath(STATE.cur.spec, k) !== false ? ' checked' : '') + '></label>'; };
const togOff = (label, k) => { const id = 't-' + k.replace(/\./g, '-'); return '<label class="tog" for="' + id + '"><span>' + esc(label) + '</span><input type="checkbox" id="' + id + '" data-k="' + k + '"' + (getPath(STATE.cur.spec, k) ? ' checked' : '') + '></label>'; };
const GRP_ICON = {Business:'building', Hero:'layout', Look:'brush', Show:'grid', Services:'star', Gallery:'camera', About:'user', Faq:'chat', Reviews:'smile', Stats:'chart', Sections:'eye', Form:'mail', Modules:'grid', Billing:'receipt', Settings:'gear'};
const grp = (key, title, body) => '<details class="grp" data-g="' + esc(key) + '"' + (STATE.open.has(key) ? ' open' : '') + '><summary>' + ico(GRP_ICON[key] || 'edit') + esc(title) + '</summary><div class="gb">' + body + '</div></details>';
function colours(label, key, list){
  const v = STATE.cur.spec[key];
  return '<div class="lab">' + esc(label) + '</div><div class="swatches">' + list.map(c => '<button type="button" class="swb' + (String(v).toUpperCase() === c.toUpperCase() ? ' on' : '') + '" style="background:' + c + '" data-color="' + key + '" data-v="' + c + '" aria-label="Colour ' + c + '"></button>').join('') + '<label class="swpick" title="Any colour"><input type="color" id="pick-' + key + '" data-k="' + key + '" value="' + v + '" aria-label="Pick any ' + esc(label.toLowerCase()) + '"></label></div>';
}
function nameIdeas(){
  const s = STATE.cur.spec, ideas = (s.nameIdeas && s.nameIdeas.length ? s.nameIdeas : suggestNames(s.label, s.city || '', STATE.nameSeed, s.name)).filter(n => n);
  return '<div class="lab">Name ideas</div><div class="chips">' + ideas.slice(0, 7).map(n => '<button class="chipb' + (n === s.name ? ' on' : '') + '" type="button" data-name="' + esc(n) + '">' + esc(n) + '</button>').join('') + '<button class="chipb more" type="button" data-act="morenames">' + ico('spark').replace('class="ic"', 'class="ic" style="width:14px;height:14px;vertical-align:-2px"') + ' More ideas</button></div>';
}
function listEd(path, fields, noun, photos){
  const arr = getPath(STATE.cur.spec, path) || [];
  return arr.map((it, i) => '<div class="item"><div class="item-h"><span>' + esc(noun) + ' ' + (i + 1) + '</span><span class="acts">' + (photos ? (it.img ? '<img class="ph" src="' + it.img + '" alt=""><button class="mini" type="button" data-rmphoto="' + path + '.' + i + '" aria-label="Remove photo">' + ico('x') + '</button>' : '<label class="mini" title="Add a photo">' + ico('camera') + 'Photo<input type="file" accept="image/*" data-photo="' + path + '.' + i + '" aria-label="Add a photo to ' + esc(noun.toLowerCase()) + ' ' + (i + 1) + '"></label>') : '') + '<button class="mini" type="button" data-rm="' + path + '" data-i="' + i + '" aria-label="Remove ' + esc(noun) + ' ' + (i + 1) + '">' + ico('trash') + '</button></span></div>' +
    fields.map(f => { const k = f[0] === '_' ? path + '.' + i : path + '.' + i + '.' + f[0]; const v = f[0] === '_' ? it : it[f[0]]; const id = 'k-' + k.replace(/\./g, '-'); return f[2] === 'area' ? '<textarea class="in" id="' + id + '" data-k="' + k + '" aria-label="' + esc(f[1]) + '" placeholder="' + esc(f[1]) + '">' + esc(v) + '</textarea>' : '<input class="in" id="' + id + '" data-k="' + k + '" aria-label="' + esc(f[1]) + '" placeholder="' + esc(f[1]) + '" value="' + esc(v) + '">'; }).join('') +
    '</div>').join('') + '<button class="addb" type="button" data-add="' + path + '">' + ico('plus') + 'Add ' + esc(noun.toLowerCase()) + '</button>';
}
const SHOW_FIELDS = {people:[['t','Name'],['m','Role'],['p','Timings']], cards:[['t','Title'],['m','Details'],['p','Price'],['tag','Tag (optional)']], menu:[['t','Item'],['m','Description'],['p','Price'],['tag','Label (optional)']], plans:[['t','Plan name'],['p','Price'],['m','Features, separated by commas','area'],['tag','Badge (optional)']]};
const SHOW_NOUN = {people:'Person', cards:'Card', menu:'Item', plans:'Plan'};
function renderPanel(){
  const p = $('#panel'); if (!p) return; const top = p.scrollTop; const s = STATE.cur.spec;
  let h = '';
  if (s.kind === 'website') {
    h += grp('Business', 'Business details', fld('Business name', 'name') + nameIdeas() + fld('Tagline', 'tagline') + '<div class="row2">' + fld('City', 'city') + fld('Phone / WhatsApp', 'phone') + '</div>' + fld('Email', 'email') + fld('Address', 'address') + fld('Opening hours', 'hours') + fld('UPI ID for online payments (optional)', 'upi', '', 'yourname@okhdfcbank') + '<p class="note">With a UPI ID, the contact section shows a QR code that customers scan with Google Pay, PhonePe or Paytm.</p>');
    h += grp('Hero', 'Top of the page', fld('Small line above the headline', 'hero.eyebrow') + fld('Headline', 'hero.title', 'area') + fld('Intro text', 'hero.sub', 'area') + '<div class="row2">' + fld('Main button', 'hero.cta') + fld('Second button', 'hero.cta2') + '</div>' +
      '<div class="lab">Main photo (optional)</div><div class="img-ctl">' + (s.image ? '<img src="' + s.image + '" alt="Current photo"><button class="b b-ghost b-sm" type="button" data-act="rmimg">' + ico('trash') + 'Remove</button>' : '') + '<label class="b b-ghost b-sm filelabel">' + ico('upload') + (s.image ? 'Replace' : 'Upload photo') + '<input type="file" id="imgfile" accept="image/*"></label></div><p class="note">Photos are resized and saved inside your file. Without one, the design uses an illustrated panel.</p>');
    h += grp('Look', 'Look and colours', '<div class="lab">Style</div><div class="chips">' + Object.keys(STYLES).map(k => '<button class="chipb' + (s.style === k ? ' on' : '') + '" type="button" data-pick="style" data-v="' + k + '" title="' + esc(STYLES[k].note) + '">' + STYLES[k].label + '</button>').join('') + '</div>' +
      colours('Main colour', 'p', SWATCHES) + colours('Highlight colour', 'a', ACCENTS) +
      '<div class="lab">Type</div><div class="chips">' + Object.keys(FONTS).map(k => '<button class="chipb' + (s.font === k ? ' on' : '') + '" type="button" data-pick="font" data-v="' + k + '" style="font-family:' + esc(FONTS[k].h) + '">' + FONTS[k].label + '</button>').join('') + '</div>');
    h += grp('Show', s.show.title, fld('Section heading', 'show.title') + (s.show.type !== 'menu' ? fld('Button text', 'show.btn') : '') + (s.show.type === 'cards' ? togOff('Shopping bag: visitors order on WhatsApp', 'show.cart') + '<p class="note">Add a photo to each item. With the bag on, visitors collect items and send the order to your WhatsApp.</p>' : '') + listEd('show.items', SHOW_FIELDS[s.show.type] || SHOW_FIELDS.cards, SHOW_NOUN[s.show.type] || 'Item', s.show.type === 'cards'));
    h += grp('Services', s.services.title, fld('Section heading', 'services.title') + listEd('services.items', [['t','Title'],['d','Short description','area']], 'Service'));
    h += grp('Gallery', 'Photo gallery', '<div class="gal-ed">' + (s.gallery || []).map((g, i) => '<figure><img src="' + g + '" alt="Gallery photo ' + (i + 1) + '"><button type="button" data-rmgal="' + i + '" aria-label="Remove photo ' + (i + 1) + '">' + ico('x') + '</button></figure>').join('') + '</div><label class="addb">' + ico('upload') + 'Add photos<input type="file" id="galfile" accept="image/*" multiple></label><p class="note">The first photo also appears beside the About section.</p>');
    h += grp('About', 'About', fld('Heading', 'about.title') + fld('Story', 'about.text', 'area') + '<div class="lab">Highlights</div>' + listEd('about.points', [['_','Highlight']], 'Highlight'));
    h += grp('Faq', 'Questions (FAQ)', listEd('faq', [['q','Question'],['a','Answer','area']], 'Question'));
    h += grp('Reviews', 'Reviews', '<p class="note">These are samples. Replace them with real reviews from customers, or turn the section off, before you publish.</p>' + listEd('reviews', [['q','Review','area'],['n','Name'],['r','Place or detail']], 'Review'));
    h += grp('Stats', 'Numbers', '<p class="note">Use real figures. These are examples.</p>' + listEd('stats', [['v','Number'],['l','Label']], 'Number'));
    h += grp('Sections', 'Sections on the page', tog('Numbers', 'sections.stats') + tog(s.services.title, 'sections.services') + tog(s.show.title, 'sections.show') + tog('About', 'sections.about') + tog('Gallery (when it has photos)', 'sections.gallery') + tog('Reviews', 'sections.reviews') + tog('FAQ', 'sections.faq') + tog('Call-to-action band', 'sections.cta') + tog('Contact form', 'sections.contact') + tog('WhatsApp button and form', 'whatsapp') + '<p class="note">The form needs no server: visitors tap “Send on WhatsApp” and their details arrive in your chat.</p>');
    h += grp('Form', 'Contact form', fld('Form heading', 'form.title') + fld('Button text', 'form.btn') + '<p class="note">Fields: ' + esc(s.form.fields.map(f => f.l).join(', ')) + '.</p>');
  } else {
    h += grp('Business', 'Business details', fld('Business name', 'name') + nameIdeas() + fld('Software title', 'title') + fld('Address on bills', 'biz.address') + '<div class="row2">' + fld('Phone', 'biz.phone') + fld('GSTIN', 'biz.gstin', '', 'Optional') + '</div><div class="row2">' + fld('UPI ID', 'biz.upi', '', 'name@bank') + fld('GST % in prices', 'biz.gst', 'num') + '</div>' + fld('Note at the bottom of bills', 'biz.note') + '<p class="note">The owner can also change these later inside the software, under Settings.</p>');
    h += grp('Modules', 'Modules', '<p class="note">Each module is a screen with a table, search, sorting, add, edit, delete, Excel import and export. Dashboard, Reports and Settings are always there.</p>' +
      s.modules.map((m, i) => '<div class="modrow"><label class="tog" for="t-mod-' + i + '"><input type="checkbox" id="t-mod-' + i + '" data-k="modules.' + i + '.on"' + (m.on !== false ? ' checked' : '') + ' aria-label="Show ' + esc(m.name) + '"></label><input class="in" id="k-mod-' + i + '" data-k="modules.' + i + '.name" value="' + esc(m.name) + '" aria-label="Module name"><button class="mini" type="button" data-rmmod="' + i + '" aria-label="Remove ' + esc(m.name) + '">' + ico('trash') + '</button></div>').join('') +
      '<div class="lab" style="margin-top:6px">Add your own module</div><div class="row2" style="grid-template-columns:minmax(0,1fr) auto"><input class="in" id="newmod" placeholder="Vaccinations: animal, vaccine, date, next dose" aria-label="New module name and columns"><button class="b b-ghost b-sm" type="button" data-act="addmod">' + ico('plus') + 'Add</button></div><p class="note">Name the module, then list its columns after a colon. Dates, amounts, phone numbers and quantities are recognised from the column names.</p>');
    h += grp('Billing', 'Billing counter', s.billing ? tog('“New bill” screen with GST bills', 'billing.on') + '<p class="note">Sells from <b>' + esc((s.modules.find(m => m.id === s.billing.items) || {}).name || '') + '</b>, saves bills in <b>' + esc((s.modules.find(m => m.id === s.billing.to) || {}).name || '') + '</b>' + (s.billing.stock ? ' and reduces stock automatically' : '') + '. Bills print as PDF and go out on WhatsApp with a UPI QR code.</p>' : '<p class="note">This software has no counter billing yet.</p><button class="b b-ghost b-sm" type="button" data-hint="Add GST billing">' + ico('receipt') + 'Add a billing counter</button>');
    h += grp('Look', 'Colours', colours('Main colour', 'p', SWATCHES) + colours('Highlight colour', 'a', ACCENTS));
    h += grp('Settings', 'Settings', '<label class="f" for="k-currency">Currency<select class="in" id="k-currency" data-k="currency">' + [['₹','₹ Rupee'],['$','$ Dollar'],['€','€ Euro'],['£','£ Pound'],['AED ','AED Dirham'],['৳','৳ Taka'],['Rs ','Rs (Nepal, Sri Lanka, Pakistan)']].map(c => '<option value="' + esc(c[0]) + '"' + (s.currency === c[0] ? ' selected' : '') + '>' + esc(c[1]) + '</option>').join('') + '</select></label>' +
      tog('Start with sample records', 'sample') + togOff('Password screen', 'login.on') + (s.login.on ? '<div class="row2">' + fld('Username', 'login.user') + fld('Password', 'login.pass') + '</div><p class="note">A simple lock for a shared counter computer. It is not bank-grade security, since the file runs in the browser.</p>' : ''));
  }
  p.innerHTML = h; p.scrollTop = top;
}

/* ---------- files: export and Banao itself ---------- */
function fileName(s){ return slugify(s.name) + (s.kind === 'software' ? '-' + slugify(s.title) : '') + '.html'; }
function selfHTML(){
  return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>Banao App Builder</title>\n' +
    (SELF.fonts ? '<link rel="stylesheet" id="banao-fonts" href="' + esc(SELF.fonts) + '">\n' : '') +
    '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n<style id="banao-css">' + SELF.css + '</style>\n</head>\n<body>\n' + SELF.bar +
    '\n<main id="view"></main>\n<div id="modal" hidden></div>\n<div class="toast" id="toast" role="status" aria-live="polite"></div>\n<scr' + 'ipt>' + SELF.js + '</scr' + 'ipt>\n</body>\n</html>\n';
}
function showFile(o){
  const kb = Math.max(1, Math.round(new Blob([o.html]).size / 1024)), m = $('#modal');
  m.innerHTML = '<div class="m-scrim" data-act="close-modal"></div><div class="m-box" role="dialog" aria-modal="true" aria-labelledby="m-title"><div class="m-head"><h2 id="m-title">' + esc(o.title) + '</h2><button class="mini" type="button" data-act="close-modal" aria-label="Close">' + ico('x') + '</button></div>' +
    '<div class="file"><span class="fi">HTML</span><div><b>' + esc(o.name) + '</b><span>' + kb + ' KB · one file · no API key · works offline</span></div></div>' +
    '<div class="m-act"><button class="b b-acc" type="button" data-act="download" id="dlbtn">' + ico('download') + 'Download file</button><button class="b b-ghost" type="button" data-act="copy">' + ico('copy') + 'Copy code</button></div><p class="m-msg" id="m-msg" role="status"></p>' +
    '<ol class="steps">' + o.steps.map(x => '<li><span>' + x + '</span></li>').join('') + '</ol><details class="codebox"><summary>View the code</summary><textarea class="code" id="code" readonly aria-label="File code">' + esc(o.html) + '</textarea></details></div>';
  m.hidden = false; STATE.exportHTML = o.html; STATE.exportName = o.name;
  setTimeout(() => { const b = $('#dlbtn'); if (b) b.focus(); }, 30);
}
function openExport(spec){
  const s = spec || STATE.cur.spec;
  showFile({title:'Your file is ready', name:fileName(s), html:exportHTML(s), steps:s.kind === 'website'
    ? ['Open the file in Chrome, Edge or Safari to check it. It works on phones too.', 'To put it online for free, rename it to <b>index.html</b> and drag it onto <a href="https://app.netlify.com/drop" target="_blank" rel="noopener">Netlify Drop</a>. You get a public link in about a minute. GitHub Pages works too.', 'Orders and enquiries arrive on WhatsApp at ' + esc(s.phone || 'your number') + '. To change anything later, open the project from Saved, edit, and download again.']
    : ['Open the file in Chrome or Edge on your counter computer or phone. It works without internet.', (s.billing ? 'Make bills from <b>New bill</b>, print them or save as PDF, and send them on WhatsApp. ' : '') + 'Fill in GSTIN and UPI ID under <b>Settings</b> so they print on bills.', 'Records stay in that browser. Use <b>Settings › Download backup</b> every week, and <b>Restore backup</b> to move to another computer. Import your old Excel lists from any module.']});
}
function openSelf(){
  if (!SELF.js) { toast('This copy of Banao cannot package itself. Open it from the original link.'); return; }
  showFile({title:'Banao for your computer', name:'banao.html', html:selfHTML(), steps:['Save the file anywhere, for example on your desktop, and open it in Chrome, Edge or Safari.', 'Everything works offline with no account and no API key: build, edit and download websites and software.', 'Saved projects stay in the browser you use it in. Download your projects as files to keep copies.']});
}
function closeModal(){ const m = $('#modal'); m.hidden = true; m.innerHTML = ''; }
async function doDownload(){
  const msg = $('#m-msg');
  if (NATIVE) { try { const where = await nativeSave(STATE.exportName, STATE.exportHTML); msg.textContent = where ? 'Saved in ' + where + '. You can also send it from the share menu.' : 'Choose where to keep or send ' + STATE.exportName + '.'; } catch (e) { msg.textContent = 'This phone could not save the file. Use Copy code instead.'; } return; }
  const d = await DL;
  if (!d) {
    try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([STATE.exportHTML], {type:'text/html'})); a.download = STATE.exportName; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); msg.textContent = 'Downloading ' + STATE.exportName + '. If nothing appears, use Copy code.'; }
    catch (e) { msg.textContent = 'Downloads are not available here. Use Copy code instead.'; }
    return;
  }
  try { const r = await d.save({filename:STATE.exportName, data:STATE.exportHTML}); msg.textContent = r && r.status === 'delivered' ? 'Sent.' : 'Saved ' + STATE.exportName + '. Open it from your downloads.'; }
  catch (e) { const c = e && e.code; msg.textContent = c === 'declined' ? 'Download cancelled. Nothing was saved.' : c === 'rate_limited' ? 'A download prompt is already open. Finish that one first.' : 'This view cannot save files. Use Copy code instead.'; }
}
async function doCopy(){
  const msg = $('#m-msg');
  try { await navigator.clipboard.writeText(STATE.exportHTML); msg.textContent = 'Code copied. Paste it into a text file and save it as ' + STATE.exportName + '.'; }
  catch (e) { const box = $('.codebox'); box.open = true; const t = $('#code'); t.focus(); t.select(); msg.textContent = 'Copying was blocked here. The code is selected below: press Ctrl+C, or long-press and choose Copy.'; }
}

/* ---------- navigation ---------- */
function go(v){
  if (v === 'back') v = STATE.prev && STATE.prev !== 'editor' && STATE.prev !== 'build' ? STATE.prev : 'home';
  if (STATE.view !== 'editor' && STATE.view !== 'build') STATE.prev = STATE.view;
  if (v !== 'build') { clearInterval(buildT); if (STATE.view === 'build' && v !== 'editor') STATE.build = null; }
  if (v !== 'editor') { if (ro) { ro.disconnect(); ro = null; } if (io) { io.disconnect(); io = null; } shadow = null; }
  if (thumbIO) { thumbIO.disconnect(); thumbIO = null; }
  STATE.view = v; STATE.confirmDel = null;
  ['home','projects'].forEach(t => { const b = $('#tab-' + t); const on = t === v || (t === 'home' && (v === 'build' || v === 'editor')); b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  if (v === 'home') renderHome(); else if (v === 'build') renderBuild(); else if (v === 'projects') renderProjects(); else if (v === 'editor') renderEditor();
  window.scrollTo(0, 0);
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-nav],[data-open],[data-act],[data-dev],[data-pick],[data-color],[data-add],[data-rm],[data-filter],[data-ex],[data-proj],[data-projdel],[data-projdl],[data-rmmod],[data-kind],[data-name],[data-rmphoto],[data-rmgal],[data-hint]');
  if (!t) return;
  if (t.hasAttribute('data-nav')) { go(t.dataset.nav); return; }
  if (t.hasAttribute('data-kind')) { STATE.kindPick = t.dataset.kind; document.querySelectorAll('[data-kind]').forEach(b => { b.classList.toggle('on', b === t); b.setAttribute('aria-pressed', b === t); }); return; }
  if (t.hasAttribute('data-filter')) { STATE.filter = t.dataset.filter; document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('on', b === t); b.setAttribute('aria-pressed', b === t); }); renderCards(); return; }
  if (t.hasAttribute('data-open')) { const [k, id] = t.dataset.open.split(':'); const tpl = (k === 'web' ? WEB_TEMPLATES : SOFT_TEMPLATES).find(x => x.id === id); openSpec(k === 'web' ? webFromTemplate(tpl) : softFromTemplate(tpl)); return; }
  if (t.hasAttribute('data-ex')) { const p = $('#prompt'); p.value = t.dataset.ex; STATE.prompt = p.value; p.focus(); return; }
  if (t.hasAttribute('data-proj')) { const p = projects.find(x => x.id === t.dataset.proj); if (p) { STATE.cur = clone(p); STATE.cmdMsg = null; STATE.open = new Set(['Business', p.spec.kind === 'website' ? 'Hero' : 'Modules']); go('editor'); } return; }
  if (t.hasAttribute('data-projdl')) { const p = projects.find(x => x.id === t.dataset.projdl); if (p) openExport(p.spec); return; }
  if (t.hasAttribute('data-projdel')) { const id = t.dataset.projdel; if (STATE.confirmDel === id) { projects = projects.filter(x => x.id !== id); persist(); updateCount(); STATE.confirmDel = null; toast('Project deleted'); } else STATE.confirmDel = id; renderProjects(); return; }
  if (t.hasAttribute('data-dev')) { STATE.device = t.dataset.dev; document.querySelectorAll('[data-dev]').forEach(b => { b.classList.toggle('on', b === t); b.setAttribute('aria-pressed', b === t); }); $('#frame').className = 'pv-frame ' + STATE.device; fitPreview(); return; }
  if (t.hasAttribute('data-hint')) { runCmd(t.dataset.hint); return; }
  const s = STATE.cur && STATE.cur.spec;
  if (t.hasAttribute('data-name')) { s.name = t.dataset.name; $('#ed-name').textContent = s.name; renderPanel(); updatePreview(); saveSoon(); return; }
  if (t.hasAttribute('data-pick')) { s[t.dataset.pick] = t.dataset.v; if (t.dataset.pick === 'style') s.font = STYLE_FONT[t.dataset.v] || s.font; renderPanel(); updatePreview(); saveSoon(); return; }
  if (t.hasAttribute('data-color')) { s[t.dataset.color] = t.dataset.v; renderPanel(); updatePreview(); saveSoon(); return; }
  if (t.hasAttribute('data-add')) {
    const path = t.dataset.add; let arr = getPath(s, path); if (!arr) { setPath(s, path, []); arr = getPath(s, path); }
    const blank = path === 'about.points' ? 'New highlight' : path === 'stats' ? {v:'100+', l:'New number'} : path === 'reviews' ? {q:'', n:'', r:''} : path === 'faq' ? {q:'New question?', a:''} : path === 'services.items' ? {t:'New service', d:'', i:s.icon} : {t:'New item', m:'', p:'', tag:''};
    arr.push(blank); renderPanel(); updatePreview(); saveSoon(); return;
  }
  if (t.hasAttribute('data-rm')) { getPath(s, t.dataset.rm).splice(+t.dataset.i, 1); renderPanel(); updatePreview(); saveSoon(); return; }
  if (t.hasAttribute('data-rmphoto')) { delete getPath(s, t.dataset.rmphoto).img; renderPanel(); updatePreview(); saveSoon(); return; }
  if (t.hasAttribute('data-rmgal')) { s.gallery.splice(+t.dataset.rmgal, 1); renderPanel(); updatePreview(); saveSoon(); return; }
  if (t.hasAttribute('data-rmmod')) { if (s.modules.length <= 1) { toast('Keep at least one module'); return; } const gone = s.modules.splice(+t.dataset.rmmod, 1)[0]; if (!s.modules.some(m => m.on !== false)) s.modules[0].on = true; if (s.billing && (s.billing.items === gone.id || s.billing.to === gone.id)) s.billing = null; renderPanel(); updatePreview(); saveSoon(); return; }
  const act = t.dataset.act;
  if (act === 'build') {
    const p = $('#prompt'), txt = p.value.trim(), err = $('#perr');
    if (txt.length < 4) { err.hidden = false; err.textContent = 'Describe your business first, for example “billing software for my bakery in Pune”.'; p.focus(); return; }
    err.hidden = true; startBuild(txt);
  }
  else if (act === 'openbuild') finishBuild();
  else if (act === 'undocmd') undoCmd();
  else if (act === 'morenames') { STATE.nameSeed++; s.nameIdeas = suggestNames(s.label, s.city || '', STATE.nameSeed, s.name); renderPanel(); }
  else if (act === 'export') openExport();
  else if (act === 'getapp') openSelf();
  else if (act === 'close-modal') closeModal();
  else if (act === 'download') doDownload();
  else if (act === 'copy') doCopy();
  else if (act === 'rmimg') { s.image = ''; renderPanel(); updatePreview(); saveSoon(); }
  else if (act === 'jump') $('#stage').scrollIntoView({behavior:'smooth', block:'start'});
  else if (act === 'addmod') {
    const inp = $('#newmod'), raw = inp.value.trim();
    if (!raw) { inp.focus(); return; }
    const parts = raw.split(':'), name = parts[0].trim(), cols = (parts[1] || '').split(/,|\band\b|&/i).map(x => x.trim()).filter(Boolean);
    const g = cols.length ? customModule(name, cols, s.modules) : genericModule(name);
    if (s.modules.some(m => m.id === g.id)) { toast('A module with that name already exists'); return; }
    if (!cols.length) g.rows = genRows(g, {titles:[], off:3, city:'', services:[], products:[]}, s.modules);
    s.modules.push(g); PV_MEM.delete('mistri:' + s.slug);
    STATE.open.add('Modules'); renderPanel(); updatePreview(); saveSoon(); toast('Added ' + g.name);
  }
});
document.addEventListener('submit', e => {
  if (!e.target.hasAttribute('data-cmd')) return;
  e.preventDefault();
  const inp = $('#cmdin'), v = (inp.value || '').trim(); if (v.length < 2) { inp.focus(); return; }
  runCmd(v);
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'q') { STATE.q = t.value; renderCards(); return; }
  if (t.id === 'prompt') { STATE.prompt = t.value; return; }
  const k = t.dataset && t.dataset.k; if (!k || !STATE.cur) return;
  const s = STATE.cur.spec;
  if (t.type === 'checkbox') return;
  setPath(s, k, t.type === 'number' ? (t.value === '' ? '' : Number(t.value)) : t.value);
  if (/^modules\.\d+\.name$/.test(k)) { const m = s.modules[+k.split('.')[1]]; m.sg = singular(t.value) || m.sg; }
  if (k === 'name') { const n = $('#ed-name'); if (n) n.textContent = t.value || 'Untitled'; }
  if (t.type === 'color') document.querySelectorAll('[data-color="' + k + '"]').forEach(b => b.classList.remove('on'));
  previewSoon(); saveSoon();
});
document.addEventListener('change', e => {
  const t = e.target;
  if (!STATE.cur) return;
  const s = STATE.cur.spec;
  if (t.id === 'imgfile' && t.files && t.files[0]) { loadImage(t.files[0], 1600).then(d => { s.image = d; renderPanel(); updatePreview(); saveSoon(); toast('Photo added'); }).catch(() => toast('That file could not be read as an image')); return; }
  if (t.id === 'galfile' && t.files && t.files.length) { Promise.all(Array.from(t.files).slice(0, 8).map(f => loadImage(f, 1400).catch(() => null))).then(list => { s.gallery = (s.gallery || []).concat(list.filter(Boolean)).slice(0, 12); renderPanel(); updatePreview(); saveSoon(); toast('Photos added'); }); return; }
  if (t.dataset && t.dataset.photo && t.files && t.files[0]) { const path = t.dataset.photo; loadImage(t.files[0], 900).then(d => { getPath(s, path).img = d; renderPanel(); updatePreview(); saveSoon(); toast('Photo added'); }).catch(() => toast('That file could not be read as an image')); return; }
  const k = t.dataset && t.dataset.k; if (!k || t.type !== 'checkbox') return;
  if (/^modules\.\d+\.on$/.test(k) && !t.checked && s.modules.filter(m => m.on !== false).length <= 1) { t.checked = true; toast('Keep at least one module'); return; }
  setPath(s, k, t.checked);
  if (k === 'show.cart' && t.checked && !/bag/i.test(s.show.btn || '')) s.show.btn = 'Add to bag';
  if (k === 'sample') PV_MEM.delete('mistri:' + s.slug);
  if (k === 'login.on' || k === 'sample' || k === 'show.cart') renderPanel();
  updatePreview(); saveSoon();
});
document.addEventListener('toggle', e => { const d = e.target; if (d.classList && d.classList.contains('grp')) { const g = d.dataset.g; if (d.open) STATE.open.add(g); else STATE.open.delete(g); } }, true);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
  if (e.key === 'Enter' && e.target.id === 'newmod') { e.preventDefault(); const b = document.querySelector('[data-act="addmod"]'); if (b) b.click(); }
  if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'prompt' && window.innerWidth > 700) { e.preventDefault(); const b = document.querySelector('[data-act="build"]'); if (b) b.click(); }
});
window.addEventListener('resize', () => { fitPreview(); scaleThumbs(); });

/* a link like /app/?q=bakery+billing+software opens Banao with that request and builds it */
let START_Q = '';
try { START_Q = (new URLSearchParams(location.search).get('q') || '').trim().slice(0, 500); if (START_Q) history.replaceState(null, '', location.pathname); } catch (e) {}
updateCount();
if (START_Q) { STATE.prompt = START_Q; go('home'); startBuild(START_Q); } else go('home');
