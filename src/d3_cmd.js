/* ================= Banao · change requests in plain words (offline, no API) ================= */
const CMD_VERBS = 'add|remove|delete|drop|hide|show|make|change|rename|call|name|set|turn|use|put|switch|enable|disable|include|create|track|need|want|replace|update';
const CMD_SPLIT = new RegExp('\\s*(?:[;\\n]+|\\.\\s+|\\.$|,?\\s+(?:and\\s+)?then\\s+|,?\\s+and\\s+(?=(?:also\\s+)?(?:' + CMD_VERBS + ')\\b)|,\\s+(?=(?:also\\s+)?(?:' + CMD_VERBS + ')\\b))\\s*', 'i');
const SEC_WORDS = [['reviews','reviews?|testimonials?'],['faq','faqs?|questions|q ?& ?a'],['stats','numbers|stats|statistics|counters'],['gallery','gallery|photos|pictures|images'],['about','about(?: us)?(?: section)?'],['services','services(?: section)?'],['contact','contact(?: form| section)?|enquiry form|booking form|form'],['cta','call[- ]to[- ]action|cta|banner'],['show','products|menu|rooms|plans|prices|price list|courses|team|doctors|packages|collection|showcase']];
const SEC_LABEL = {reviews:'Reviews', faq:'FAQ', stats:'Numbers', gallery:'Gallery', about:'About', services:'Services', contact:'Contact form', cta:'Call-to-action band', show:'Showcase'};
const ON_RX = /\b(add|show|turn on|enable|include|bring back|put|want|need|give|keep)\b/;
const OFF_RX = /\b(remove|hide|delete|drop|no|without|turn off|disable|get rid of|don'?t (?:want|need|show)|take out)\b/;
const MOD_ICON = [['steth',/vaccin|medic|health|treat|doctor|patient|checkup|clinic/],['paw',/animal|cow|cattle|goat|pet|buffalo|dog|sheep|poultry|hen|bird|calf|calves/],['drop',/milk|water|fuel|diesel|oil/],['leaf',/feed|crop|seed|plant|farm|fodder|garden|harvest/],['car',/vehicle|car|bike|fleet|trip/],['truck',/deliver|dispatch|shipment|transport/],['calendar',/event|booking|schedule|session|batch|shift/],['wallet',/expense|payment|fee|salary|loan|cash|income|collection|due/],['receipt',/bill|invoice|receipt|sale|order/],['box',/stock|item|product|part|material|inventory|asset|equipment/],['clipboard',/task|job|ticket|complaint|request|inspection|visit/],['book',/course|class|lesson|book|exam|test|homework/],['wrench',/repair|service|maintenance/],['users',/member|student|people|parent|guest|visitor|team|staff|worker|labour|labor|tenant|client|customer|supplier|vendor/]];

function cleanVal(v){ return String(v || '').trim().replace(/^["“'‘]+|["”'’]+$/g, '').replace(/^(?:to|as|is|be|:|=)\s+/i, '').replace(/[.!]+$/, '').replace(/^["“'‘]+|["”'’]+$/g, '').trim(); }
function nicer(v){ return /[A-Z]/.test(v) ? v : titleCase(v); }
function keyFrom(l){ return String(l).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').replace(/^(\d)/, 'f$1').slice(0, 24) || 'field'; }
function fmtAmt(v){ const n = Number(String(v).replace(/,/g, '')); return isFinite(n) && n >= 1000 && n === Math.round(n) ? n.toLocaleString('en-IN') : String(v); }
function priceIn(t){ const m = t.match(/(?:₹|\brs\.?\s*|\binr\s*|\$)\s*([\d,]+(?:\.\d+)?)/i) || t.match(/\b(?:for|at|@|price|priced at|costs?)\s+([\d,]{2,}(?:\.\d+)?)\b/i); return m ? ((/\$/.test(t) ? '$' : '₹') + fmtAmt(m[1])) : ''; }
function stripPrice(t){ return t.replace(/\s*(?:,|-|–)?\s*(?:for|at|@|price|priced at|costs?)?\s*(?:₹|\brs\.?\s*|\binr\s*|\$)\s*[\d,]+(?:\.\d+)?(?:\s*(?:\/-|only|each|per \w+))?/i, '').replace(/\s+(?:for|at|@|priced at|costs?)\s+[\d,]{2,}(?:\.\d+)?\b.*$/i, '').trim(); }

function fieldFromLabel(label, mods){
  const l = label.trim().replace(/\s+/g, ' '), low = ' ' + l.toLowerCase() + ' ';
  const f = {k:keyFrom(l), l:cap(l), t:'text', hide:false};
  const ref = mods.find(m => [m.name, m.sg].some(n => n && n.toLowerCase() === l.toLowerCase()));
  if (ref) { f.t = 'ref'; f.ref = ref.id; return f; }
  if (/ (notes?|remarks?|description|details|address|comments?) /.test(low)) { f.t = 'long'; f.hide = true; }
  else if (/ (phone|mobile|whatsapp|contact no|contact number|cell) /.test(low)) f.t = 'phone';
  else if (/ (e-?mail) /.test(low)) f.t = 'email';
  else if (/ status /.test(low)) { f.t = 'status'; f.o = ['Active','Pending','Done']; }
  else if (/ (time|slot) /.test(low)) f.t = 'time';
  else if (/ (date|dob|birthday|due|expiry|expires|next|joined|joining|issued|returned|deadline|day|on) /.test(low)) f.t = 'date';
  else if (/ (by|who|person|staff|name|owner) /.test(low)) f.t = 'text';
  else if (/ (amount|price|fees?|cost|salary|rent|total|paid|balance|mrp|rate|charges?|bill|payment|budget|revenue|expense|value|advance|deposit|wage|wages) /.test(low)) f.t = 'money';
  else if (/ (qty|quantity|stock|count|age|litres?|liters?|kg|weight|number|units|marks|score|days|hours|km|yield|milk|pieces|size|bags) /.test(low)) f.t = 'num';
  return f;
}
function customModule(name, cols, mods){
  const nm = nicer(name).slice(0, 40), sg = singular(nm);
  const fields = cols.map(c => fieldFromLabel(c, mods));
  if (!fields.length) return genericModule(name);
  if (fields[0].t !== 'text' && fields[0].t !== 'ref') fields.unshift({k:'name', l:sg, t:'text', hide:false});
  const seen = {}; fields.forEach(f => { let k = f.k, i = 2; while (seen[k]) k = f.k + '_' + i++; f.k = k; seen[k] = 1; });
  const low = nm.toLowerCase(), ic = (MOD_ICON.find(x => x[1].test(low)) || ['folder'])[0];
  const m = {id:'x_' + slugify(name).replace(/-/g, '_'), name:nm, sg, icon:ic, on:true, fields, rows:[]};
  m.rows = genRows(m, {titles:[], off:4, city:'', services:[], products:[]}, mods).map((r, i) => r.map((v, j) => {
    const f = fields[j];
    if (f.t === 'ref') { const rm = mods.find(x => x.id === f.ref); return rm && rm.rows.length ? rm.rows[i % rm.rows.length][0] : v; }
    if (f.t === 'date' && /next|due|expir|renew|return/i.test(f.l)) return '@' + [30, 7, 60, -3][i];
    if (v === '' && f.t === 'text') return f.l + ' ' + String.fromCharCode(65 + i);
    return v;
  }));
  return m;
}
function findModule(s, txt){
  const t = String(txt).toLowerCase().replace(/\b(the|module|tab|section|screen|page|list|my|all)\b/g, '').replace(/\s+/g, ' ').trim();
  if (!t) return null;
  const sgT = singular(t);
  return s.modules.find(m => m.name.toLowerCase() === t || m.sg.toLowerCase() === t || singular(m.name.toLowerCase()) === sgT) || s.modules.find(m => sgT.length > 3 && m.name.toLowerCase().includes(sgT)) || null;
}
function libModuleFor(rest){
  const t = rest.toLowerCase().trim(), pref = ['invoices','customers','products','orders','staff','payments','gbookings','tasks','employees','suppliers','purchases'];
  const ids = Object.keys(MODLIB).filter(id => MODLIB[id].name.toLowerCase() === t || MODLIB[id].syn.split(',').some(w => w === t || w === singular(t)));
  if (!ids.length) return null;
  return ids.find(id => MODLIB[id].name.toLowerCase() === t) || ids.find(id => pref.includes(id)) || ids[0];
}
function refreshSoftAuto(s){ if (!s.tpl) { s.stats = autoStats(s.modules); s.alerts = autoAlerts(s.modules); s.chart = autoChart(s.modules) || s.chart; } }
function colourPick(low){
  const out = []; Object.keys(COLOR_WORDS).forEach(w => { const i = low.search(phraseRx(w)); if (i > -1) out.push([i, w]); });
  return out.sort((a, b) => a[0] - b[0]).map(x => { const dk = new RegExp('\\b(dark|deep)\\s+' + x[1] + '\\b').test(low), lt = new RegExp('\\b(light|pale)\\s+' + x[1] + '\\b').test(low); let c = COLOR_WORDS[x[1]]; if (dk) c = mix(c, '#000000', .3); if (lt) c = mix(c, '#FFFFFF', .25); return [x[1], c, dk]; });
}

function applyCommand(spec0, text){
  const s = clone(spec0), done = [], missed = [];
  String(text || '').replace(/\brs\.\s*/gi, 'Rs ').split(CMD_SPLIT).map(c => (c || '').trim()).filter(c => c && c.length > 1).forEach(c => { if (!runClause(s, c, done)) missed.push(c); });
  return {spec:s, done, missed};
}

function runClause(s, raw, done){
  const c = raw.replace(/[’]/g, "'").replace(/^(?:please|pls|also|now|can you|could you|i want to|i want you to)\s+/i, '').replace(/^(?:please|also)\s+/i, '');
  const low = ' ' + c.toLowerCase() + ' ', web = s.kind === 'website', n0 = done.length;
  let m;
  /* rename a module (software) */
  if (!web && (m = c.match(/^rename\s+(?:the\s+)?(.+?)\s+(?:module\s+|tab\s+)?(?:to|as|into)\s+(.+)$/i))) {
    const mod = findModule(s, m[1]); if (mod) { const nn = nicer(cleanVal(m[2])).slice(0, 40); mod.name = nn; mod.sg = singular(nn); done.push('Renamed ' + m[1].trim() + ' to ' + nn); return true; }
  }
  /* business name */
  if ((m = c.match(/^(?:call (?:it|the business|my business|the shop|the software)|name (?:it|the business)|rename (?:it|the business|business|the shop)?\s*(?:to|as)?|change (?:the )?(?:business |shop |brand |company )?name (?:to|as)|(?:the )?(?:business |shop |brand |company )?name (?:is|should be|to|as|=|:))\s+(.+)$/i))) {
    const v = nicer(cleanVal(m[1])).slice(0, 50); if (v) { s.name = v; done.push('Name: ' + v); return true; }
  }
  /* software title */
  if (!web && (m = c.match(/^(?:change |set )?(?:the )?(?:software |app )?title (?:to|as|is|=|:|should be)\s+(.+)$/i))) { s.title = nicer(cleanVal(m[1])).slice(0, 50); done.push('Title: ' + s.title); return true; }
  /* website words */
  if (web) {
    if ((m = c.match(/^(?:change |set |make )?(?:the )?(?:main )?(?:headline|heading|hero title|main title|big title)\s*(?:to|as|is|=|:|should be|say|says)\s+(.+)$/i))) { s.hero.title = cleanVal(m[1]).slice(0, 90); done.push('Headline: ' + s.hero.title); return true; }
    if ((m = c.match(/^(?:change |set )?(?:the )?tag ?line\s*(?:to|as|is|=|:|should be)\s+(.+)$/i))) { s.tagline = cleanVal(m[1]).slice(0, 80); done.push('Tagline: ' + s.tagline); return true; }
    if ((m = c.match(/^(?:change |set )?(?:the )?(?:intro|intro text|sub ?heading|lead)\s*(?:to|as|is|=|:|should be)\s+(.+)$/i))) { s.hero.sub = cleanVal(m[1]).slice(0, 240); done.push('Intro text updated'); return true; }
    if ((m = c.match(/^(?:change |set )?(?:the )?(?:main |first )?button(?: text)?\s*(?:to|as|is|=|:|should be|say|says)\s+(.+)$/i))) { s.hero.cta = cleanVal(m[1]).slice(0, 30); done.push('Main button: ' + s.hero.cta); return true; }
    if ((m = c.match(/^(?:change |set )?(?:the )?about(?: us)?(?: text| story)?\s*(?:to|as|is|=|:|should be)\s+(.+)$/i))) { s.about.text = cleanVal(m[1]).slice(0, 600); done.push('About text updated'); return true; }
    /* price of an item */
    if ((m = c.match(/\bprice(?:\s+of)?\s+(?:the\s+)?(.+?)\s+(?:to|is|=|at|as)\s*(?:₹|rs\.?\s*|\$)?\s*([\d,]+(?:\.\d+)?)/i)) || (m = c.match(/^(?:make|set|change)\s+(?:the\s+)?(.+?)\s+(?:to|at|=)\s*(?:₹|rs\.?\s*|\$)\s*([\d,]+(?:\.\d+)?)/i))) {
      const t = m[1].toLowerCase().trim(), it = s.show.items.find(x => x.t.toLowerCase() === t) || s.show.items.find(x => x.t.toLowerCase().includes(t));
      if (it) { it.p = (/\$/.test(c) ? '$' : '₹') + fmtAmt(m[2]); done.push('Price of ' + it.t + ': ' + it.p); return true; }
    }
    /* add a named thing */
    if ((m = c.match(/^add\s+(?:a|an|one|another|new|more)?\s*(?:new\s+)?(products?|items?|dish(?:es)?|rooms?|plans?|packages?|courses?|class(?:es)?|doctors?|teachers?|trainers?|coach(?:es)?|lawyers?|services?|treatments?|faqs?|questions?|reviews?|testimonials?|highlights?|points?|photos?|pictures?)\b\s*(?:called|named|:|-|–)?\s*(.*)$/i))) {
      const what = m[1].toLowerCase(), rest = m[2].trim();
      if (/^(photos?|pictures?)$/.test(what)) { s.sections.gallery = true; done.push('Gallery is on. Upload photos under Photo gallery on the left'); return true; }
      if (!rest) { done.push('Say what to add, for example “add ' + what.replace(/s$/, '') + ' Air Runner for ₹2,499”'); return true; }
      if (/^(services?|treatments?)$/.test(what)) { const t = nicer(cleanVal(stripPrice(rest))); s.services.items.push({t, d:'', i:s.icon}); s.sections.services = true; done.push('Added service: ' + t); return true; }
      if (/^(faqs?|questions?)$/.test(what)) { const parts = rest.split('?'); const q = cleanVal(parts[0]) + '?'; s.faq.push({q:cap(q), a:cleanVal(parts.slice(1).join('?'))}); s.sections.faq = true; done.push('Added question: ' + cap(q)); return true; }
      if (/^(reviews?|testimonials?)$/.test(what)) { const bm = rest.match(/^(.*?)\s+by\s+([A-Za-z .]+)$/i); s.reviews.push({q:cleanVal(bm ? bm[1] : rest), n:bm ? nicer(bm[2].trim()) : '', r:s.city || ''}); s.sections.reviews = true; done.push('Added a review'); return true; }
      if (/^(highlights?|points?)$/.test(what)) { s.about.points.push(cap(cleanVal(rest))); done.push('Added highlight'); return true; }
      const p = priceIn(rest), t = nicer(cleanVal(stripPrice(rest)));
      s.show.items.push(s.show.type === 'people' ? {t, m:'', p:''} : s.show.type === 'plans' ? {t, p, m:'', tag:''} : {t, m:'', p, tag:''}); s.sections.show = true;
      done.push('Added to ' + s.show.title + ': ' + t + (p ? ' (' + p + ')' : '')); return true;
    }
    /* online orders */
    if (/\b(cart|bag|online orders?|order online|shopping|add to bag)\b/.test(low)) {
      if (OFF_RX.test(low)) { s.show.cart = false; if (/bag/i.test(s.show.btn)) s.show.btn = 'Enquire'; done.push('Online bag turned off'); return true; }
      if (s.show.type === 'cards') { s.show.cart = true; s.show.btn = 'Add to bag'; s.sections.show = true; done.push('Visitors can add items to a bag and send the order on WhatsApp'); return true; }
    }
    /* sections */
    const on = ON_RX.test(low), off = OFF_RX.test(low);
    if (on || off) {
      let hit = false;
      SEC_WORDS.forEach(([k, w]) => { if (new RegExp('\\b(?:' + w + ')\\b').test(low)) { s.sections[k] = !off; hit = true; done.push(SEC_LABEL[k] + (off ? ' removed' : ' shown') + (k === 'gallery' && !off && !(s.gallery || []).length ? '. Upload photos under Photo gallery on the left' : '')); } });
      if (/\bwhats ?app\b/.test(low)) { s.whatsapp = !off; hit = true; done.push('WhatsApp ' + (off ? 'button removed' : 'button on')); }
      if (hit) return true;
      if (off && (m = c.match(/^(?:remove|delete|drop|hide|take out)\s+(?:the\s+)?(?:product|item|dish|room|plan|service|question)?\s*(.+)$/i))) {
        const t = m[1].toLowerCase().trim();
        for (const path of ['show.items','services.items']) { const arr = getPath(s, path); const i = arr.findIndex(x => x.t.toLowerCase() === t || (t.length > 3 && x.t.toLowerCase().includes(t))); if (i > -1) { const gone = arr.splice(i, 1)[0]; done.push('Removed ' + gone.t); return true; } }
        const fi = s.faq.findIndex(x => t.length > 3 && x.q.toLowerCase().includes(t)); if (fi > -1) { s.faq.splice(fi, 1); done.push('Removed a question'); return true; }
      }
    }
    /* style and type */
    const cols = colourPick(low);
    if (!/^add\b/i.test(c) && !(cols.length && /\b(dark|deep)\s+\w/.test(low) && cols[0][2])) {
      for (const k of ['luxe','dark','bold','warm','clean']) if (MOODS[k].test(low) && !/\bfont|type ?face|typography\b/.test(low)) { s.style = k; s.font = STYLE_FONT[k]; done.push(STYLES[k].label + ' style'); break; }
    }
    if (/\b(font|fonts|type ?face|typography|lettering|text style)\b/.test(low)) {
      const fk = /serif|elegant|classic|royal|luxur/.test(low) ? 'elegant' : /editorial|magazine/.test(low) ? 'editorial' : /bold|strong|heavy|sport/.test(low) ? 'bold' : /friendly|round|cute|fun|kids/.test(low) ? 'friendly' : /tech|futur|code|mono/.test(low) ? 'tech' : /modern|clean|simple|sans/.test(low) ? 'modern' : null;
      if (fk) { s.font = fk; done.push(FONTS[fk].label + ' type'); }
    }
  }
  /* software words */
  const addWith = /^(?:add|create|include|need|want|track|make)\b.*\b(?:with|having|columns?|fields?)\b/i.test(c);
  if (!web) {
    if (!addWith && /\b(billing|new bill|bills?|pos|point of sale|billing counter|invoice counter|gst bills?)\b/.test(low) && !/\bnote\b|\bbottom\b|\bfooter\b/.test(low)) {
      if (OFF_RX.test(low)) { if (s.billing) { s.billing.on = false; done.push('Billing counter turned off'); } else done.push('There is no billing counter to turn off'); return true; }
      if (ON_RX.test(low) || /\b(make|set ?up)\b/.test(low)) {
        if (s.billing) { s.billing.on = true; done.push('Billing counter is on'); return true; }
        if (!s.modules.some(x => /^(products|menu|medicines)$/.test(x.id))) { const pm = buildModule('products'); pm.rows = genRows(pm, {titles:[], off:1, city:'', services:[], products:[]}, s.modules); s.modules.push(pm); done.push('Added Products'); }
        if (!s.modules.some(x => /^(orders|psales|korders|invoices)$/.test(x.id))) { const om = buildModule('orders'); const pr = s.modules.find(x => /^(products|menu|medicines)$/.test(x.id)); om.rows = genRows(om, {titles:[], off:2, city:'', services:[], products:pr ? pr.rows.map(r => r[0]) : []}, s.modules); s.modules.push(om); done.push('Added Sales'); }
        const b = autoBilling(s.modules);
        if (b) { s.billing = b; s.billing.on = true; s.biz = s.biz || {}; if (s.biz.gst == null || s.biz.gst === '') s.biz.gst = b.tax; refreshSoftAuto(s); done.push('Billing counter with GST bills, stock update and UPI QR'); }
        else done.push('Billing needs a list of things you sell with a price column');
        return true;
      }
    }
    if (!addWith && /\b(password|login|log in|lock|lock screen)\b/.test(low)) {
      s.login = s.login || {on:false, user:'admin', pass:'admin123'};
      if (OFF_RX.test(low) && !/\bchange\b/.test(low)) { s.login.on = false; done.push('Password screen off'); return true; }
      const pm = c.match(/\b(?:password)\s*(?:is|to|=|:|as)?\s+(\S{3,})\s*$/i), um = c.match(/\b(?:user ?name|user|login)\s*(?:is|to|=|:|as)?\s+(\S{3,})/i);
      s.login.on = true; if (pm && !/^(screen|lock|login|on|off)$/i.test(pm[1])) s.login.pass = cleanVal(pm[1]); if (um && !/^(screen|page|password)$/i.test(um[1])) s.login.user = cleanVal(um[1]);
      done.push('Password screen on (user ' + s.login.user + ', password ' + s.login.pass + ')'); return true;
    }
    const cur = /(\$|\busd\b|\bdollars?\b)/.test(low) ? '$' : /(€|\beuros?\b)/.test(low) ? '€' : /(£|\bpounds?\b|\bgbp\b)/.test(low) ? '£' : /\b(aed|dirhams?)\b/.test(low) ? 'AED ' : /\b(taka|bdt)\b/.test(low) ? '৳' : /\b(rupees?|inr)\b/.test(low) && /\b(currency|use|in|switch|change)\b/.test(low) ? '₹' : null;
    if (cur && /\b(currency|use|in|switch|change|set|show|prices?)\b/.test(low)) { s.currency = cur; done.push('Currency: ' + cur.trim()); return true; }
    if (/\b(sample|example|demo|dummy|fake)\s+(data|records|rows|entries)\b|\bstart (empty|blank|fresh)\b|\bempty\b/.test(low)) {
      s.sample = !(OFF_RX.test(low) || /\b(empty|blank|fresh|clear)\b/.test(low)); done.push(s.sample ? 'Starts with sample records' : 'Starts empty, without sample records'); return true;
    }
    /* remove a module */
    if ((m = c.match(/^(?:remove|delete|drop|hide|get rid of|take out)\s+(?:the\s+)?(.+?)(?:\s+(?:module|tab|section|screen|page))?$/i))) {
      const mod = findModule(s, m[1]);
      if (mod) {
        if (s.modules.length <= 1) { done.push('Keep at least one module'); return true; }
        s.modules = s.modules.filter(x => x !== mod);
        if (s.billing && (s.billing.items === mod.id || s.billing.to === mod.id)) s.billing = null;
        s.stats = (s.stats || []).filter(x => (Array.isArray(x) ? x[1] : x.m) !== mod.id); s.alerts = (s.alerts || []).filter(x => x.m !== mod.id); if (s.chart && s.chart.m === mod.id) s.chart = autoChart(s.modules);
        if (!s.stats.length) s.stats = autoStats(s.modules);
        done.push('Removed ' + mod.name); return true;
      }
    }
    /* add a module */
    if ((m = c.match(/^(?:add|create|include|need|want|track|manage|start tracking|i need|i want)\b\s*(.*)$/i)) && !colourPick(' ' + m[1].toLowerCase() + ' ').length) {
      let rest = m[1], colsTxt = '';
      const wm = rest.match(/^(.*?)\s+(?:with|having|showing|containing|including|that has|that have|columns?|fields?)\s*:?\s+(.+)$/i);
      if (wm) { rest = wm[1]; colsTxt = wm[2]; }
      rest = rest.replace(/^(?:a|an|the|new|my|our|one|another|separate)\s+/i, '').replace(/\b(?:module|tab|section|screen|page|register|records?)\b/gi, ' ').replace(/^\s*(?:for|of|called|named|to track|to manage)\s+/i, '').replace(/\s+(?:for|of)\s*$/i, '').replace(/\s+/g, ' ').trim();
      if (rest && rest.split(' ').length <= 4 && /^[a-z]/i.test(rest)) {
        const colList = colsTxt.split(/,|\band\b|&|\//i).map(x => x.replace(/\b(columns?|fields?|a|an|the|their|its|for each|each)\b/gi, '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 10);
        const lib = colList.length ? null : libModuleFor(rest);
        if (lib) {
          if (s.modules.some(x => x.id === lib)) { const ex = s.modules.find(x => x.id === lib); ex.on = true; done.push(ex.name + ' is already there'); return true; }
          const nm = buildModule(lib, MODLIB[lib].name.toLowerCase() === rest.toLowerCase() ? null : nicer(rest), null); if (nm.name !== MODLIB[lib].name) nm.sg = singular(nm.name);
          nm.rows = genRows(nm, {titles:[], off:5, city:'', services:[], products:[]}, s.modules); s.modules.push(nm); refreshSoftAuto(s);
          done.push('Added ' + nm.name + ' (' + nm.fields.filter(f => !f.hide).map(f => f.l.toLowerCase()).join(', ') + ')'); return true;
        }
        const ex = findModule(s, rest); if (ex && !colList.length) { ex.on = true; done.push(ex.name + ' is already there'); return true; }
        const cm = customModule(rest, colList, s.modules);
        if (s.modules.some(x => x.id === cm.id)) { done.push(cm.name + ' is already there'); return true; }
        s.modules.push(cm); refreshSoftAuto(s);
        done.push('Added ' + cm.name + ' (' + cm.fields.filter(f => !f.hide).map(f => f.l.toLowerCase()).join(', ') + ')'); return true;
      }
    }
  }
  /* colours (both) */
  const cl = colourPick(low);
  if (cl.length && !/^add\b/i.test(c)) {
    const hm = low.search(/\b(highlight|accent|second|secondary|buttons?)\b/);
    if (hm > -1 && cl.length === 1) { s.a = cl[0][1]; done.push('Highlight colour: ' + cl[0][0]); }
    else {
      let pi = 0, ai = 1;
      if (hm > -1 && cl.length > 1) { const d = x => Math.abs(low.search(phraseRx(x[0])) - hm); ai = d(cl[0]) < d(cl[1]) ? 0 : 1; pi = 1 - ai; }
      s.p = cl[pi][1]; if (cl[ai] && cl.length > 1) s.a = cl[ai][1];
      done.push('Main colour: ' + (cl[pi][2] ? 'dark ' : '') + cl[pi][0] + (cl.length > 1 ? ', highlight ' + cl[ai][0] : ''));
    }
  }
  /* contact facts (both) */
  const em = c.match(/\b[\w.+-]+@[\w-]+\.[a-z][\w.]+\b/i);
  const um = c.match(/\b([\w.-]{2,}@[a-z]{2,})\b(?!\.)/i);
  if (um && (!em || /\bupi\b/i.test(c)) && !(em && em[0].startsWith(um[1]))) { if (web) s.upi = um[1]; else { s.biz = s.biz || {}; s.biz.upi = um[1]; } done.push('UPI ID: ' + um[1]); }
  if (em && web) { s.email = em[0]; done.push('Email: ' + em[0]); }
  const ph = c.match(/(\+?\d[\d\s-]{8,16}\d)/);
  if (ph && ph[1].replace(/\D/g, '').length >= 10 && ph[1].replace(/\D/g, '').length <= 13) { if (web) s.phone = ph[1].trim(); else { s.biz = s.biz || {}; s.biz.phone = ph[1].trim(); } done.push('Phone: ' + ph[1].trim()); }
  if (!web) {
    const gi = c.match(/\b(\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d])\b/i);
    if (gi) { s.biz.gstin = gi[1].toUpperCase(); done.push('GSTIN: ' + s.biz.gstin); }
    else if ((m = c.match(/\bgst\b[^\d%]{0,14}(\d{1,2}(?:\.\d+)?)\s*%?/i))) { s.biz.gst = Number(m[1]); done.push('GST: ' + m[1] + '%'); }
    if ((m = c.match(/\b(?:bill note|note on bills?|bottom of (?:the )?bills?|footer)\s*(?:to|:|=|as|is|says?)?\s+(.+)$/i))) { s.biz.note = cleanVal(m[1]); done.push('Note on bills updated'); }
  }
  if ((m = c.match(/^(?:change |set )?(?:the )?address\s*(?:to|is|:|=|as)?\s+(.+)$/i))) { const v = cleanVal(m[1]); if (web) s.address = v; else s.biz.address = v; done.push('Address updated'); }
  if (web && (m = c.match(/\b(?:open(?:ing)?(?: hours)?|hours|timings?)\b\s*(?:are|is|:|=|to|from|change to|should be)?\s*(.*\d.*)$/i)) && !/\b(phone|whatsapp|call)\b/i.test(c)) { s.hours = cleanVal(m[1]); done.push('Hours: ' + s.hours); }
  if (/\b(city|located|based|move|moved|shift|branch)\b/.test(low) || /^(?:change |set )?(?:the )?city\b/i.test(c)) {
    const city = extractCity(c, low);
    if (city) {
      const old = web ? s.city : '';
      if (web) { s.city = city; if (old && s.address && s.address.includes(old)) s.address = 'Main Road, ' + city; ['hero.eyebrow','tagline'].forEach(k => { const v = getPath(s, k); if (old && v && v.includes(old)) setPath(s, k, v.split(old).join(city)); }); if (!s.address) s.address = 'Main Road, ' + city; (s.reviews || []).forEach(r => { if (old && r.r === old) r.r = city; }); }
      else { s.biz = s.biz || {}; s.biz.address = s.biz.address && /,/.test(s.biz.address) ? s.biz.address.replace(/[^,]+$/, ' ' + city) : 'Main Road, ' + city; }
      s.city = city; s.nameIdeas = null; done.push('City: ' + city);
    }
  }
  /* last try on websites: "add <thing> for ₹500" */
  if (web && done.length === n0 && (m = c.match(/^add\s+(.+)$/i))) {
    const p = priceIn(m[1]), t = nicer(cleanVal(stripPrice(m[1]).replace(/^(?:a|an|the|new|more)\s+/i, '')));
    if (t && t.split(' ').length <= 6) {
      if (p) { s.show.items.push(s.show.type === 'people' ? {t, m:'', p:''} : s.show.type === 'plans' ? {t, p, m:'', tag:''} : {t, m:'', p, tag:''}); done.push('Added to ' + s.show.title + ': ' + t + ' (' + p + ')'); }
      else { s.services.items.push({t, d:'', i:s.icon}); s.sections.services = true; done.push('Added service: ' + t); }
    }
  }
  return done.length > n0;
}

const CMD_HINTS = {
  website:['Make it premium','Make it dark','Change colour to green','Add product Classic Runner for ₹2,499','Remove reviews','Add a question: Do you deliver?','Open 9 am to 9 pm, Mon to Sat','Turn on online orders'],
  software:['Add vaccinations module with animal, vaccine, date and next dose','Add GST billing','Add a password','Rename customers to members','Remove suppliers','Change colour to blue','GST 18%','Start empty without sample data']
};
