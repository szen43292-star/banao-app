/* ================= Banao · management-software generator ================= */
function softVars(s){
  const bg = mix('#F4F6F8', s.p, .025), side = mix(s.p, '#0D1117', .58);
  return {
    '--p':s.p, '--a':s.a, '--onP':onColor(s.p), '--onA':onColor(s.a), '--side':side,
    '--sideHi':rgba('#FFFFFF',.12), '--bg':bg, '--card':'#FFFFFF', '--ink':'#151A22', '--muted':'#5D6573',
    '--line':mix(bg,'#151A22',.1), '--pSoft':mix('#FFFFFF', s.p, .1), '--pDeep':readable(s.p, mix('#FFFFFF', s.p, .1)),
    '--ring':rgba(s.p,.2), '--rowHi':mix('#FFFFFF', s.p, .035), '--th':mix('#FFFFFF', bg, .6),
    '--f':FONTS.modern.b
  };
}
const SOFT_CSS = `
.sw{container-type:inline-size;height:100%;font-family:var(--f);color:var(--ink);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
.sw *,.sw *::before,.sw *::after{box-sizing:border-box}
.sw :where(h1,h2,h3,p,dl,dd){margin:0}
.sw .ic{width:18px;height:18px;flex:none}
.sw :focus-visible{outline:2px solid var(--p);outline-offset:2px}
.app{position:relative;height:100%;display:grid;grid-template-columns:240px minmax(0,1fr);background:var(--bg);overflow:hidden}
.side{background:var(--side);color:#fff;display:flex;flex-direction:column;gap:18px;padding:18px 12px;overflow-y:auto;min-height:0}
.brand{display:flex;gap:10px;align-items:center;padding:4px 8px}
.bm{width:38px;height:38px;border-radius:10px;background:var(--a);color:var(--onA);display:grid;place-items:center;flex:none}
.brand b{display:block;font-size:14.5px;line-height:1.25}
.brand small{display:block;font-size:12px;opacity:.65}
.snav{display:flex;flex-direction:column;gap:2px}
.snav .sep{height:1px;background:rgba(255,255,255,.1);margin:6px 8px;flex:none}
.snav button,.sbtn{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;cursor:pointer;font-size:14px;font-weight:500;color:rgba(255,255,255,.76);width:100%}
.snav button:hover,.sbtn:hover{background:rgba(255,255,255,.07);color:#fff}
.snav button.on{background:var(--sideHi);color:#fff;font-weight:600}
.snav button.hl{background:var(--a);color:var(--onA);font-weight:700}
.snav button:focus-visible,.sbtn:focus-visible{outline:2px solid var(--a)}
.snav em{margin-left:auto;font-style:normal;font-size:12px;opacity:.6;font-variant-numeric:tabular-nums}
.side-foot{margin-top:auto;display:flex;flex-direction:column;gap:2px;font-size:12.5px}
.side-foot .note{padding:6px 12px 8px;opacity:.55;line-height:1.4}
.sbtn{font-size:13px;padding:7px 12px}
.main{display:flex;flex-direction:column;min-width:0;min-height:0}
.top{display:flex;align-items:center;gap:14px;padding:16px 26px;border-bottom:1px solid var(--line);background:var(--card);flex-wrap:wrap}
.top h1{font-size:19px;font-weight:700;line-height:1.25}
.top p{color:var(--muted);font-size:13px;margin-top:1px}
.top-act{margin-left:auto;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.search{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);width:240px;color:var(--muted)}
.search.wide{width:100%}
.search input{all:unset;flex:1;min-width:0;font-size:14px;color:var(--ink)}
.btn{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 16px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap}
.btn[disabled]{opacity:.45;cursor:default}
.btn-p{background:var(--p);color:var(--onP)}
.btn-p:hover{filter:brightness(1.07)}
.btn-g{border:1px solid var(--line);background:var(--card);color:var(--ink)}
.btn-g:hover{background:var(--bg)}
.btn-w{background:#25D366;color:#05371A}
.btn-sm{height:34px;padding:0 12px;font-size:13px}
.btn-lg{height:48px;font-size:15px;flex:1}
.content{flex:1;overflow:auto;padding:22px 26px 40px;min-height:0}
.kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;min-width:0}
.k-top{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--muted);font-size:13px}
.k-ic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:var(--pSoft);color:var(--pDeep);flex:none}
.kpi b{font-size:25px;font-weight:700;letter-spacing:-.01em;font-variant-numeric:tabular-nums;line-height:1.15;overflow-wrap:anywhere}
.dgrid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:14px;margin-top:14px}
.panel{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;min-width:0}
.panel h2{font-size:14.5px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.panel h2 small{font-weight:500;color:var(--muted);font-size:12.5px}
.alerts{display:flex;flex-direction:column;gap:8px}
.al{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:10px;font-size:13.5px;line-height:1.45}
.al span{flex:1}
.al .ic{width:16px;height:16px;margin-top:2px}
.al a{flex:none;display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:#0C6B34;background:#fff;border-radius:7px;padding:3px 8px;text-decoration:none}
.al a .ic{margin:0;width:14px;height:14px}
.al.crit{background:#FDECEC;color:#8A1C1C}.al.warn{background:#FFF4DE;color:#7A4800}.al.info{background:var(--pSoft);color:var(--pDeep)}
.clear{display:flex;gap:10px;align-items:center;color:#17663F;background:#E8F6EE;padding:12px;border-radius:10px;font-size:13.5px}
.bars{display:flex;flex-direction:column;gap:12px}
.bar-row{display:grid;grid-template-columns:minmax(0,120px) 1fr 40px;gap:12px;align-items:center;font-size:13px}
.bar-row span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar{height:10px;border-radius:99px;background:var(--bg);overflow:hidden}
.bar i{display:block;height:100%;border-radius:99px;background:var(--p)}
.bar-row b{text-align:right;font-variant-numeric:tabular-nums}
.recent{margin-top:14px}
.tbar{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:var(--muted);font-size:13px;flex-wrap:wrap}
.tbar .grow{flex:1;min-width:120px}
.twrap{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:auto}
.sw table{width:100%;border-collapse:collapse;font-size:13.5px}
.sw th{text-align:left;font-weight:600;color:var(--muted);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;padding:11px 14px;border-bottom:1px solid var(--line);white-space:nowrap;background:var(--th);position:sticky;top:0;z-index:1}
.sw th button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:4px}
.sw th button:focus-visible{outline:2px solid var(--p)}
.sw td{padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis}
.sw tbody tr:last-child td{border-bottom:0}
.sw tbody tr:hover{background:var(--rowHi)}
.sw td.t{font-weight:600}
.sw .num{text-align:right;font-variant-numeric:tabular-nums}
.ra{display:flex;gap:2px;justify-content:flex-end}
.ib{all:unset;box-sizing:border-box;cursor:pointer;width:32px;height:32px;border-radius:8px;display:grid;place-items:center;color:var(--muted)}
.ib:hover{background:var(--bg);color:var(--ink)}
.ib.wa{color:#139E4A}
.ib:focus-visible{outline:2px solid var(--p)}
.ib.confirm{width:auto;padding:0 10px;background:#C53030;color:#fff;font-size:12px;font-weight:700}
.pill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:600;white-space:nowrap}
.pill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.pill.good{background:#E5F5EC;color:#166036}.pill.warn{background:#FFF1D6;color:#7E4A00}.pill.crit{background:#FDE7E7;color:#A01D1D}.pill.info{background:var(--pSoft);color:var(--pDeep)}.pill.mute{background:#EDEFF2;color:#4A5260}
.empty{padding:44px 20px;text-align:center;color:var(--muted);display:flex;flex-direction:column;align-items:center;gap:12px}
.scrim{position:absolute;inset:0;background:rgba(12,16,22,.42);z-index:30}
.drawer{position:absolute;top:0;right:0;bottom:0;width:min(440px,100%);background:var(--card);z-index:31;display:flex;flex-direction:column;box-shadow:-24px 0 60px -24px rgba(0,0,0,.4)}
.dh{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 22px;border-bottom:1px solid var(--line)}
.dh h2{font-size:16.5px;font-weight:700}
.db{flex:1;overflow:auto;padding:18px 22px;display:flex;flex-direction:column;gap:14px}
.fl{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600}
.fl input,.fl select,.fl textarea{font:inherit;font-weight:400;font-size:14px;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--ink);width:100%;min-height:42px}
.fl textarea{min-height:90px;resize:vertical}
.fl input:focus,.fl select:focus,.fl textarea:focus{outline:none;border-color:var(--p);box-shadow:0 0 0 3px var(--ring)}
.fl .pre{display:flex;align-items:center;border:1px solid var(--line);border-radius:9px;overflow:hidden}
.fl .pre span{padding:0 10px;color:var(--muted);background:var(--bg);align-self:stretch;display:grid;place-items:center;border-right:1px solid var(--line)}
.fl .pre input{border:0;border-radius:0}
.fl .err{color:#A01D1D;font-weight:500;font-size:12.5px}
.fl small{font-weight:400;color:var(--muted)}
.df{display:flex;justify-content:flex-end;gap:10px;padding:14px 22px;border-top:1px solid var(--line)}
.toast{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);background:#151A22;color:#fff;padding:10px 16px;border-radius:10px;font-size:13.5px;z-index:60;box-shadow:0 12px 30px -10px rgba(0,0,0,.5);white-space:nowrap;max-width:90%;overflow:hidden;text-overflow:ellipsis}
.login{height:100%;display:grid;place-items:center;background:var(--side);padding:20px}
.lcard{background:#fff;border-radius:16px;padding:28px;width:min(360px,100%);display:flex;flex-direction:column;gap:14px;box-shadow:0 30px 60px -30px rgba(0,0,0,.6)}
.lcard .brand{padding:0;color:var(--ink)}
.lcard .hint{font-size:12.5px;color:var(--muted)}
.pos{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:14px;align-items:start}
.plist{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:12px;max-height:62vh;overflow:auto;padding:2px}
.pitem{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:3px;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--card);min-height:84px}
.pitem:hover{border-color:var(--p);box-shadow:0 0 0 3px var(--ring)}
.pitem:focus-visible{outline:2px solid var(--p)}
.pitem[disabled]{opacity:.45;cursor:default}
.pitem b{font-size:13.5px;line-height:1.3}
.pitem span{font-weight:700;color:var(--pDeep);font-variant-numeric:tabular-nums}
.pitem small{font-size:12px;color:var(--muted)}
.pitem small.low{color:#A01D1D;font-weight:600}
.cl{display:grid;grid-template-columns:minmax(0,1fr) auto 84px;gap:10px;align-items:center;padding:10px 0;border-bottom:1px dashed var(--line)}
.cl b{font-size:13.5px}
.cl small{display:block;color:var(--muted);font-size:12px}
.cl .lt{text-align:right;font-variant-numeric:tabular-nums}
.qty{display:flex;align-items:center;gap:6px}
.qty button{all:unset;cursor:pointer;width:30px;height:30px;border-radius:8px;border:1px solid var(--line);display:grid;place-items:center;font-weight:700}
.qty button:focus-visible{outline:2px solid var(--p)}
.qty span{min-width:22px;text-align:center;font-weight:700;font-variant-numeric:tabular-nums}
.cf{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}
.tot{display:flex;flex-direction:column;gap:6px;padding:12px 0;border-top:1px solid var(--line);font-size:13.5px}
.tot div{display:flex;justify-content:space-between;gap:10px;font-variant-numeric:tabular-nums}
.tot .g{color:var(--muted);font-size:12.5px}
.tot .big{font-size:20px;font-weight:800;padding-top:6px}
.hint2{color:var(--muted);font-size:13px;padding:18px 0;text-align:center}
.inv-wrap{position:absolute;inset:0;z-index:50;background:rgba(12,16,22,.55);overflow:auto;padding:20px}
.inv-bar{max-width:720px;margin:0 auto 12px;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.inv-sheet{max-width:720px;margin:0 auto;background:#fff;color:#111;border-radius:12px;padding:36px 40px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);font-size:13.5px}
.inv-h{display:flex;justify-content:space-between;gap:24px;padding-bottom:18px;border-bottom:2px solid #111}
.inv-h h2{font-size:22px;font-weight:800}
.inv-h p{color:#444;font-size:12.5px;line-height:1.5}
.inv-h .r{text-align:right}
.inv-h .doc{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--pDeep)}
.inv-to{display:flex;justify-content:space-between;gap:20px;padding:16px 0;font-size:13px}
.inv-to small{display:block;color:#666;text-transform:uppercase;letter-spacing:.08em;font-size:10.5px;font-weight:700;margin-bottom:3px}
.inv-sheet table{width:100%;border-collapse:collapse;margin-top:6px}
.inv-sheet th{background:#F3F4F6;color:#333;font-size:11px;position:static}
.inv-sheet td{white-space:normal;max-width:none}
.inv-sum{display:flex;justify-content:space-between;gap:24px;margin-top:16px;align-items:flex-start}
.inv-sum dl{min-width:240px;display:flex;flex-direction:column;gap:5px;margin:0}
.inv-sum dl div{display:flex;justify-content:space-between;gap:16px;font-variant-numeric:tabular-nums}
.inv-sum dl .big{font-size:18px;font-weight:800;border-top:2px solid #111;padding-top:8px;margin-top:4px}
.inv-sum dl .g{color:#666;font-size:12px}
.inv-qr{display:flex;gap:12px;align-items:center;font-size:12px;color:#444;max-width:300px}
.inv-qr .q{width:104px;flex:none}
.inv-qr svg{width:100%;height:auto;display:block}
.inv-words{margin-top:14px;font-size:12.5px;color:#333}
.inv-f{margin-top:28px;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;font-size:12px;color:#555}
.inv-f .sig{border-top:1px solid #999;padding-top:6px;min-width:160px;text-align:center}
.rgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.vbars{display:flex;align-items:flex-end;gap:10px;height:150px;padding-top:10px}
.vbar{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;min-width:0}
.vbar i{display:block;width:100%;max-width:46px;border-radius:7px 7px 3px 3px;background:var(--p);opacity:.75;min-height:3px}
.vbar:last-child i{opacity:1}
.vbar small{font-size:11.5px;color:var(--muted)}
.vbar b{font-size:10.5px;font-variant-numeric:tabular-nums;white-space:nowrap}
.rsum{display:flex;gap:18px;margin-bottom:6px;font-size:13px;color:var(--muted);flex-wrap:wrap}
.rsum b{display:block;font-size:18px;color:var(--ink)}
.settings{max-width:680px;display:flex;flex-direction:column;gap:14px}
.sgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media print{
  html,body,#app,.sw,.app,.main,.content{height:auto!important;overflow:visible!important;background:#fff!important}
  body *{visibility:hidden!important}
  .inv-sheet,.inv-sheet *{visibility:visible!important}
  .inv-wrap{position:static!important;background:none!important;padding:0!important}
  .inv-sheet{position:absolute!important;left:0;top:0;width:100%;max-width:none;box-shadow:none!important;border-radius:0;padding:10mm}
  .inv-bar{display:none!important}
}
@container (max-width: 860px){
  .pos,.rgrid{grid-template-columns:minmax(0,1fr)}
}
@container (max-width: 760px){
  .app{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}
  .side{flex-direction:row;align-items:center;gap:10px;padding:10px 12px;overflow-x:auto;overflow-y:hidden}
  .brand{padding:0 4px 0 0}
  .brand small,.snav em,.side-foot,.snav .sep{display:none}
  .brand b{white-space:nowrap;font-size:14px}
  .snav{flex-direction:row;gap:4px}
  .snav button{width:auto;padding:8px 11px;white-space:nowrap}
  .top{padding:12px 16px}
  .top-act{width:100%;margin-left:0}
  .search{flex:1;width:auto}
  .content{padding:14px 16px 32px}
  .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
  .kpi b{font-size:21px}
  .dgrid{grid-template-columns:minmax(0,1fr)}
  .inv-wrap{padding:10px}
  .inv-sheet{padding:22px 18px}
  .inv-h,.inv-sum,.inv-to{flex-direction:column}
  .inv-h .r{text-align:left}
  .inv-sum dl{min-width:0;width:100%}
  .sgrid,.cf{grid-template-columns:minmax(0,1fr)}
  .plist{max-height:none}
}
`;
function softCSS(s){ return '.sw{' + Object.entries(softVars(s)).map(([k,v]) => k + ':' + v).join(';') + '}' + SOFT_CSS; }

/* Runs inside the generated management software (serialised with toString — keep it self-contained). */
function mountSoftware(host, spec, opts){
  opts = opts || {};
  var I = spec.icons || {}, cur = spec.currency || '₹', SA = !!opts.standalone, QR = opts.qr || null, SAVE = opts.save || null;
  var mods = spec.modules.filter(function(m){ return m.on !== false; });
  var KEY = 'mistri:' + spec.slug;
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var store = opts.store || { get: function(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set: function(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };
  function modBy(id){ for (var i = 0; i < mods.length; i++) if (mods[i].id === id) return mods[i]; return null; }
  function fieldBy(m, k){ if (!m || !k) return null; for (var i = 0; i < m.fields.length; i++) if (m.fields[i].k === k) return m.fields[i]; return null; }
  var bill = spec.billing && spec.billing.on !== false && modBy(spec.billing.items) && modBy(spec.billing.to) && fieldBy(modBy(spec.billing.items), spec.billing.name) && fieldBy(modBy(spec.billing.items), spec.billing.price) ? spec.billing : null;
  var printable = (spec.printable || []).filter(function(id){ return modBy(id); }); if (bill && printable.indexOf(bill.to) < 0) printable.push(bill.to);
  var S = { view:'home', q:'', sortK:null, sortD:1, form:null, err:'', del:null, toast:'', confirmReset:false, authed: !(spec.login && spec.login.on), cart:[], cf:{mode:''}, pq:'', inv:null };
  if (!S.authed && SA) { try { if (sessionStorage.getItem(KEY + ':auth') === '1') S.authed = true; } catch(e){} }
  function ic(n){ return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[n] || '') + '</svg>'; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function iso(d){ return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function seedVal(v){
    if (typeof v !== 'string') return v;
    var m = /^@(-?\d+)$/.exec(v); if (m) { var d = new Date(); d.setDate(d.getDate() + (+m[1])); return iso(d); }
    m = /^@m(-?\d+)$/.exec(v); if (m) { var d2 = new Date(); d2.setDate(1); d2.setMonth(d2.getMonth() + (+m[1])); return MON[d2.getMonth()] + ' ' + d2.getFullYear(); }
    return v;
  }
  function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function seedMod(m){ return (spec.sample === false ? [] : (m.rows || [])).map(function(r){ var o = {_id: uid()}; m.fields.forEach(function(f, j){ o[f.k] = seedVal(r[j] == null ? '' : r[j]); }); return o; }); }
  function load(){
    var d = null; try { var raw = store.get(KEY); if (raw) d = JSON.parse(raw); } catch(e){ d = null; }
    if (!d || typeof d !== 'object') d = {};
    mods.forEach(function(m){ if (!Array.isArray(d[m.id])) d[m.id] = seedMod(m); });
    if (!d._settings || typeof d._settings !== 'object') d._settings = {};
    return d;
  }
  var data = load();
  function save(){ try { store.set(KEY, JSON.stringify(data)); } catch(e){} }
  save();
  function biz(){ var b = {}, k, a = spec.biz || {}, o = data._settings || {}; for (k in a) b[k] = a[k]; for (k in o) if (o[k] !== '' && o[k] != null) b[k] = o[k]; return b; }
  function money(v){ if (v === '' || v == null || isNaN(Number(v))) return ''; return cur + Number(v).toLocaleString('en-IN', {maximumFractionDigits: 2}); }
  function fdate(v){ if (!v) return ''; var p = String(v).split('-'); if (p.length !== 3) return String(v); return (+p[2]) + ' ' + MON[(+p[1]) - 1] + ' ' + p[0]; }
  function fmt(f, v){ if (!f) return v == null ? '' : String(v); if (f.t === 'money') return money(v); if (f.t === 'date') return fdate(v); if (f.t === 'num') return v === '' || v == null ? '' : Number(v).toLocaleString('en-IN'); return v == null ? '' : String(v); }
  function tone(v){
    var s = String(v).toLowerCase();
    if (/^(paid|active|available|completed|done|present|confirmed|checked in|returned|approved|won|free|on duty|ready|delivered|received|served|billed|in stock|healthy|sold|closed)$/.test(s)) return 'good';
    if (/(overdue|cancelled|expired|absent|lost|rejected|sold out|maintenance|suspended|resigned|no-show|out of stock|sick|critical|unpaid)/.test(s)) return 'crit';
    if (/(pending|due|scheduled|cleaning|in progress|processing|preparing|reserved|half day|late|follow-up|negotiation|site visit|contacted|ordered|under offer|booked|open|frozen|on leave|in surgery|wfh|issued|in garage|to do|partially|treatment|pregnant)/.test(s)) return 'warn';
    if (/(admitted|occupied|checked out|new|opd|discharged)/.test(s)) return 'info';
    return 'mute';
  }
  function daysFrom(v){ if (!v) return null; var p = String(v).split('-'); if (p.length !== 3) return null; var d = new Date(+p[0], +p[1] - 1, +p[2]), t = new Date(); t.setHours(0,0,0,0); return Math.round((d - t) / 86400000); }
  function test(r, w){
    var v = r[w.k], d;
    switch (w.op) {
      case 'eq': return String(v) === String(w.v);
      case 'ne': return String(v) !== String(w.v);
      case 'lt': return v !== '' && v != null && Number(v) < Number(w.v);
      case 'ltf': return v !== '' && v != null && Number(v) <= Number(r[w.f2]);
      case 'today': return daysFrom(v) === 0;
      case 'within': d = daysFrom(v); return d !== null && d >= 0 && d <= w.v;
      case 'past': d = daysFrom(v); return d !== null && d < 0;
    }
    return true;
  }
  function match(r, ws){ for (var i = 0; i < (ws || []).length; i++) if (!test(r, ws[i])) return false; return true; }
  function fill(tpl, m, r){ return String(tpl).replace(/\{(\w+)\}/g, function(_, k){ if (k === 'biz') return spec.name; return fmt(fieldBy(m, k), r[k]); }); }
  function title(m, r){ return r[m.fields[0].k]; }
  function phoneField(m){ for (var i = 0; i < m.fields.length; i++) if (m.fields[i].t === 'phone') return m.fields[i]; return null; }
  function waNum(p){ var d = String(p || '').replace(/\D/g, ''); if (d.length === 10) d = '91' + d; if (d.length === 11 && d[0] === '0') d = '91' + d.slice(1); return d.length >= 11 ? d : ''; }
  function waLink(p, text){ return 'https://wa.me/' + waNum(p) + '?text=' + encodeURIComponent(text); }
  function words(n){
    n = Math.round(n); if (!n) return 'Zero';
    var a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'], b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
    function two(x){ return x < 20 ? a[x] : b[Math.floor(x / 10)] + (x % 10 ? ' ' + a[x % 10] : ''); }
    function three(x){ var h = Math.floor(x / 100), r = x % 100; return (h ? a[h] + ' Hundred' + (r ? ' ' : '') : '') + (r ? two(r) : ''); }
    var out = [], cr = Math.floor(n / 1e7); n %= 1e7; var la = Math.floor(n / 1e5); n %= 1e5; var th = Math.floor(n / 1e3); n %= 1e3;
    if (cr) out.push(three(cr) + ' Crore'); if (la) out.push(two(la) + ' Lakh'); if (th) out.push(two(th) + ' Thousand'); if (n) out.push(three(n));
    return out.join(' ');
  }

  /* ----- layout ----- */
  function sideHTML(){
    var h = '<aside class="side"><div class="brand"><span class="bm">' + ic(spec.icon) + '</span><div><b>' + esc(spec.name) + '</b><small>' + esc(spec.title) + '</small></div></div><nav class="snav" aria-label="Sections">';
    h += '<button type="button" data-go="home" class="' + (S.view === 'home' ? 'on' : '') + '">' + ic('grid') + '<span>Dashboard</span></button>';
    if (bill) h += '<button type="button" data-go="pos" class="' + (S.view === 'pos' ? 'on' : 'hl') + '">' + ic('receipt') + '<span>New bill</span></button>';
    mods.forEach(function(m){ h += '<button type="button" data-go="' + m.id + '" class="' + (S.view === m.id ? 'on' : '') + '">' + ic(m.icon) + '<span>' + esc(m.name) + '</span><em>' + data[m.id].length + '</em></button>'; });
    h += '<div class="sep"></div><button type="button" data-go="reports" class="' + (S.view === 'reports' ? 'on' : '') + '">' + ic('chart') + '<span>Reports</span></button>';
    h += '<button type="button" data-go="settings" class="' + (S.view === 'settings' ? 'on' : '') + '">' + ic('gear') + '<span>Settings</span></button>';
    h += '</nav><div class="side-foot"><p class="note">' + (SA ? 'Saved in this browser on this device. Download a backup from Settings every week.' : 'Preview with sample data. Your downloaded file starts with the same sample data, which you can clear in Settings.') + '</p>';
    if (spec.login && spec.login.on) h += '<button class="sbtn" type="button" data-act="logout">' + ic('logout') + 'Lock</button>';
    return h + '</div></aside>';
  }
  function topHTML(){
    var d = new Date().toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
    if (S.view === 'home') return '<header class="top"><div><h1>Dashboard</h1><p>' + esc(d) + '</p></div><div class="top-act">' + (bill ? '<button class="btn btn-p" type="button" data-go="pos">' + ic('receipt') + 'New bill</button>' : mods[0] ? '<button class="btn btn-p" type="button" data-act="new" data-m="' + mods[0].id + '">' + ic('plus') + 'New ' + esc(mods[0].sg.toLowerCase()) + '</button>' : '') + '</div></header>';
    if (S.view === 'pos') return '<header class="top"><div><h1>New bill</h1><p>Tap items to add them, then save to print or send on WhatsApp</p></div></header>';
    if (S.view === 'reports') return '<header class="top"><div><h1>Reports</h1><p>Totals by month, worked out from your records</p></div></header>';
    if (S.view === 'settings') return '<header class="top"><div><h1>Settings</h1><p>Details printed on bills, backups and your data</p></div></header>';
    var m = modBy(S.view);
    return '<header class="top"><div><h1>' + esc(m.name) + '</h1><p>' + data[m.id].length + ' record' + (data[m.id].length === 1 ? '' : 's') + '</p></div><div class="top-act"><label class="search">' + ic('search') + '<input data-q type="search" placeholder="Search ' + esc(m.name.toLowerCase()) + '" value="' + esc(S.q) + '" aria-label="Search ' + esc(m.name) + '"></label><button class="btn btn-p" type="button" data-act="new" data-m="' + m.id + '">' + ic('plus') + '<span>Add ' + esc(m.sg.toLowerCase()) + '</span></button></div></header>';
  }
  /* ----- dashboard ----- */
  function statVal(st){
    var m = modBy(st[1]); if (!m) return null;
    var rows = data[m.id].filter(function(r){ return match(r, st[3]); });
    if (st[2] === 'count') return rows.length.toLocaleString('en-IN');
    var k = String(st[2]).split(':')[1], f = fieldBy(m, k), sum = 0; if (!f) return null;
    rows.forEach(function(r){ sum += Number(r[k]) || 0; });
    return f.t === 'money' ? money(sum) : sum.toLocaleString('en-IN');
  }
  function dashHTML(){
    var h = '<div class="kpis">';
    (spec.stats || []).forEach(function(st){ var v = statVal(st); if (v === null) return; h += '<div class="kpi"><div class="k-top"><span>' + esc(st[0]) + '</span><span class="k-ic">' + ic(st[4] || 'chart') + '</span></div><b>' + esc(v) + '</b></div>'; });
    h += '</div><div class="dgrid"><section class="panel"><h2>Needs attention</h2>';
    var list = [];
    (spec.alerts || []).forEach(function(a){ var m = modBy(a.m); if (!m) return; var pf = phoneField(m); data[m.id].forEach(function(r){ if (match(r, a.w)) list.push({lvl: a.lvl, t: fill(a.msg, m, r), wa: a.wa && pf && waNum(r[pf.k]) ? waLink(r[pf.k], fill(a.wa, m, r)) : ''}); }); });
    var order = {crit:0, warn:1, info:2}; list.sort(function(x, y){ return order[x.lvl] - order[y.lvl]; });
    if (!list.length) h += '<div class="clear">' + ic('check') + 'All clear. Nothing needs attention right now.</div>';
    else h += '<div class="alerts">' + list.slice(0, 7).map(function(x){ return '<div class="al ' + x.lvl + '">' + ic(x.lvl === 'info' ? 'clock' : 'alert') + '<span>' + esc(x.t) + '</span>' + (x.wa ? '<a href="' + x.wa + '" target="_blank" rel="noopener">' + ic('wa') + 'Remind</a>' : '') + '</div>'; }).join('') + (list.length > 7 ? '<p style="color:var(--muted);font-size:12.5px;padding:4px 2px">and ' + (list.length - 7) + ' more</p>' : '') + '</div>';
    h += '</section>';
    var c = spec.chart, cm = c && modBy(c.m), cf = cm && fieldBy(cm, c.k);
    if (cf && cf.o) {
      var counts = cf.o.map(function(o){ return [o, data[cm.id].filter(function(r){ return String(r[c.k]) === o; }).length]; }).filter(function(x){ return x[1] > 0; });
      var max = Math.max.apply(null, counts.map(function(x){ return x[1]; }).concat([1]));
      h += '<section class="panel"><h2>' + esc(c.t) + '<small>' + data[cm.id].length + ' total</small></h2><div class="bars">' + (counts.length ? counts.map(function(x){ return '<div class="bar-row"><span>' + esc(x[0]) + '</span><div class="bar"><i style="width:' + Math.max(4, Math.round(x[1] / max * 100)) + '%"></i></div><b>' + x[1] + '</b></div>'; }).join('') : '<p style="color:var(--muted)">No records yet.</p>') + '</div></section>';
    }
    h += '</div>';
    var m0 = bill ? modBy(bill.to) : mods[0];
    if (m0) h += '<section class="panel recent"><h2>Latest ' + esc(m0.name.toLowerCase()) + '<button class="btn btn-g btn-sm" type="button" data-go="' + m0.id + '">Open ' + esc(m0.name.toLowerCase()) + '</button></h2><div class="twrap">' + tableHTML(m0, data[m0.id].slice(0, 5), true) + '</div></section>';
    return h;
  }
  /* ----- tables ----- */
  function visible(m){ return m.fields.filter(function(f){ return !f.hide; }); }
  function filtered(m){
    var q = S.q.trim().toLowerCase(), rows = data[m.id].slice();
    if (q) rows = rows.filter(function(r){ return m.fields.some(function(f){ return String(fmt(f, r[f.k])).toLowerCase().indexOf(q) > -1; }); });
    if (S.sortK) { var f = fieldBy(m, S.sortK); rows.sort(function(a, b){ var x = a[S.sortK], y = b[S.sortK]; if (f && (f.t === 'num' || f.t === 'money')) { x = Number(x) || 0; y = Number(y) || 0; } else { x = String(x || '').toLowerCase(); y = String(y || '').toLowerCase(); } return (x > y ? 1 : x < y ? -1 : 0) * S.sortD; }); }
    return rows;
  }
  function tableHTML(m, rows, compact){
    var cols = visible(m); if (compact) cols = cols.slice(0, 5);
    var pf = phoneField(m), canPrint = printable.indexOf(m.id) > -1;
    if (!rows.length) return '<div class="empty">' + (S.q && !compact ? 'No ' + esc(m.name.toLowerCase()) + ' match “' + esc(S.q) + '”.' : 'No ' + esc(m.name.toLowerCase()) + ' yet.') + '<button class="btn btn-p" type="button" data-act="new" data-m="' + m.id + '">' + ic('plus') + 'Add the first ' + esc(m.sg.toLowerCase()) + '</button></div>';
    var h = '<table><thead><tr>' + cols.map(function(f){ var n = f.t === 'num' || f.t === 'money'; return '<th class="' + (n ? 'num' : '') + '">' + (compact ? esc(f.l) : '<button type="button" data-sort="' + f.k + '">' + esc(f.l) + (S.sortK === f.k ? (S.sortD > 0 ? ' ↑' : ' ↓') : '') + '</button>') + '</th>'; }).join('') + '<th class="num"><span style="position:absolute;left:-9999px">Actions</span></th></tr></thead><tbody>';
    rows.forEach(function(r){
      h += '<tr>' + cols.map(function(f, i){ var v = r[f.k], n = f.t === 'num' || f.t === 'money'; var cell = f.t === 'status' && v ? '<span class="pill ' + tone(v) + '">' + esc(v) + '</span>' : esc(fmt(f, v)); return '<td class="' + (i === 0 ? 't ' : '') + (n ? 'num' : '') + '" title="' + esc(fmt(f, v)) + '">' + cell + '</td>'; }).join('');
      h += '<td><div class="ra">';
      if (pf && waNum(r[pf.k])) h += '<a class="ib wa" href="' + waLink(r[pf.k], m.wa ? fill(m.wa, m, r) : 'Hello ' + title(m, r) + ', — ' + spec.name) + '" target="_blank" rel="noopener" aria-label="WhatsApp ' + esc(title(m, r)) + '">' + ic('wa') + '</a>';
      if (canPrint) h += '<button class="ib" type="button" data-inv="' + r._id + '" data-m="' + m.id + '" aria-label="Print bill">' + ic('printer') + '</button>';
      h += '<button class="ib" type="button" data-edit="' + r._id + '" data-m="' + m.id + '" aria-label="Edit">' + ic('edit') + '</button><button class="ib' + (S.del === r._id ? ' confirm' : '') + '" type="button" data-del="' + r._id + '" data-m="' + m.id + '" aria-label="Delete">' + (S.del === r._id ? 'Delete?' : ic('trash')) + '</button></div></td></tr>';
    });
    return h + '</tbody></table>';
  }
  function modHTML(){
    var m = modBy(S.view), rows = filtered(m);
    return '<div class="tbar"><span class="grow">' + (S.q ? rows.length + ' of ' + data[m.id].length + ' shown' : 'Tap a column name to sort') + '</span><button class="btn btn-g btn-sm" type="button" data-act="import">' + ic('upload') + 'Import from Excel</button><input type="file" accept=".csv,text/csv,.txt" data-import hidden>' + (SA ? '<button class="btn btn-g btn-sm" type="button" data-act="csv">' + ic('download') + 'Export to Excel</button>' : '') + '</div><div class="twrap" data-tbl>' + tableHTML(m, rows) + '</div>';
  }
  /* ----- billing counter ----- */
  function totals(){ var sub = 0; S.cart.forEach(function(l){ sub += l.price * l.qty; }); var disc = Math.min(sub, Math.max(0, Number(S.cf.disc) || 0)), total = sub - disc, rate = Number(biz().gst) || 0, gst = rate ? total * rate / (100 + rate) : 0; return {sub: sub, disc: disc, total: total, rate: rate, gst: gst}; }
  function plistHTML(){
    var im = modBy(bill.items), q = S.pq.trim().toLowerCase();
    var items = data[im.id].filter(function(r){ return !q || String(r[bill.name]).toLowerCase().indexOf(q) > -1; }).slice(0, 80);
    if (!items.length) return '<p class="hint2">No ' + esc(im.name.toLowerCase()) + ' found. Add them under ' + esc(im.name) + ' first.</p>';
    return items.map(function(r){ var st = bill.stock ? Number(r[bill.stock]) || 0 : null, inCart = 0; S.cart.forEach(function(l){ if (l.id === r._id) inCart = l.qty; }); return '<button type="button" class="pitem" data-addline="' + r._id + '"' + (st !== null && st - inCart <= 0 ? ' disabled' : '') + '><b>' + esc(r[bill.name]) + '</b><span>' + money(r[bill.price]) + '</span>' + (st !== null ? '<small class="' + (st <= 5 ? 'low' : '') + '">' + st + ' in stock' + (inCart ? ' · ' + inCart + ' in bill' : '') + '</small>' : (inCart ? '<small>' + inCart + ' in bill</small>' : '')) + '</button>'; }).join('');
  }
  function totHTML(t){ return '<div><span>Subtotal</span><span>' + money(t.sub) + '</span></div>' + (t.disc ? '<div><span>Discount</span><span>− ' + money(t.disc) + '</span></div>' : '') + '<div class="big"><span>Total</span><span>' + money(t.total) + '</span></div>' + (t.rate ? '<div class="g"><span>Includes GST ' + t.rate + '% (CGST ' + money(t.gst / 2) + ' + SGST ' + money(t.gst / 2) + ')</span></div>' : ''); }
  function cartHTML(){
    var t = totals(), tm = modBy(bill.to), mf = fieldBy(tm, (bill.map || {}).mode), modes = mf && mf.o ? mf.o : ['Cash','UPI','Card'];
    if (!S.cf.mode) S.cf.mode = modes[0];
    var h = '<section class="panel" data-cart><h2>Bill<small>' + S.cart.length + ' item' + (S.cart.length === 1 ? '' : 's') + '</small></h2>';
    h += S.cart.length ? S.cart.map(function(l, i){ return '<div class="cl"><div><b>' + esc(l.name) + '</b><small>' + money(l.price) + ' each</small></div><div class="qty"><button type="button" data-qty="' + i + '" data-d="-1" aria-label="One less">−</button><span>' + l.qty + '</span><button type="button" data-qty="' + i + '" data-d="1" aria-label="One more">+</button></div><b class="lt">' + money(l.price * l.qty) + '</b></div>'; }).join('') : '<p class="hint2">Tap items to add them to this bill.</p>';
    h += '<div class="cf"><label class="fl">Customer name<input data-cf="customer" value="' + esc(S.cf.customer || '') + '" placeholder="Walk-in"></label><label class="fl">Phone (for WhatsApp)<input data-cf="phone" type="tel" value="' + esc(S.cf.phone || '') + '" placeholder="98765 43210"></label><label class="fl">Payment<select data-cf="mode">' + modes.map(function(o){ return '<option' + (S.cf.mode === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></label><label class="fl">Discount (' + esc(cur.trim()) + ')<input data-cf="disc" type="number" min="0" step="any" value="' + esc(S.cf.disc || '') + '"></label></div>';
    h += '<div class="tot" data-tot>' + totHTML(t) + '</div><div style="display:flex;gap:8px"><button class="btn btn-g" type="button" data-act="clearcart"' + (S.cart.length ? '' : ' disabled') + '>Clear</button><button class="btn btn-p btn-lg" type="button" data-act="checkout"' + (S.cart.length ? '' : ' disabled') + '>' + ic('receipt') + 'Save bill</button></div></section>';
    return h;
  }
  function posHTML(){ return '<div class="pos"><section class="panel"><label class="search wide">' + ic('search') + '<input data-pq type="search" placeholder="Search ' + esc(modBy(bill.items).name.toLowerCase()) + '" value="' + esc(S.pq) + '" aria-label="Search items"></label><div class="plist" data-plist>' + plistHTML() + '</div></section>' + cartHTML() + '</div>'; }
  function nextNo(m, k){ if (!k) return ''; var max = 0, pre = 'B-', width = 0; data[m.id].forEach(function(r){ var mm = /^(.*?)(\d+)$/.exec(String(r[k] || '')); if (mm && +mm[2] >= max) { max = +mm[2]; pre = mm[1]; width = mm[2].length; } }); var n = String(max + 1); while (n.length < width) n = '0' + n; return pre + n; }
  function checkout(){
    if (!S.cart.length) return;
    var tm = modBy(bill.to), im = modBy(bill.items), mp = bill.map || {}, t = totals(), rec = {_id: uid()};
    tm.fields.forEach(function(f){ rec[f.k] = ''; });
    function put(k, v){ if (k && fieldBy(tm, k)) rec[k] = v; }
    var no = nextNo(tm, mp.no);
    put(mp.no, no); put(mp.customer, S.cf.customer || 'Walk-in'); put(mp.phone, S.cf.phone || ''); put(mp.date, iso(new Date()));
    put(mp.items, S.cart.map(function(l){ return l.name + ' ×' + l.qty; }).join(', ')); put(mp.total, Math.round(t.total * 100) / 100); put(mp.mode, S.cf.mode); put(mp.status, bill.paid || '');
    var sf = fieldBy(tm, mp.status); if (sf && sf.o && sf.o.indexOf(rec[mp.status]) < 0) rec[mp.status] = sf.o[0];
    rec._lines = S.cart.map(function(l){ return {n: l.name, q: l.qty, r: l.price}; }); rec._disc = t.disc; rec._phone = S.cf.phone || ''; rec._cust = S.cf.customer || '';
    data[tm.id].unshift(rec);
    if (bill.stock) S.cart.forEach(function(l){ data[im.id].forEach(function(r){ if (r._id === l.id) r[bill.stock] = (Number(r[bill.stock]) || 0) - l.qty; }); });
    save(); S.cart = []; S.cf = {mode: S.cf.mode}; S.inv = {m: tm.id, id: rec._id}; S.toast = 'Bill ' + (no || '') + ' saved'; render();
  }
  /* ----- bill / receipt ----- */
  function guessMap(m){
    var mp = {}, f = m.fields;
    function find(re, ts){ for (var i = 0; i < f.length; i++) if ((!ts || ts.indexOf(f[i].t) > -1) && re.test(f[i].k + ' ' + f[i].l)) return f[i].k; return null; }
    mp.no = find(/^no\b|bill|invoice|receipt/i, ['text']); mp.customer = find(/customer|patient|guest|member|student|buyer|client|lead|emp|table|name/i, ['text','ref']);
    mp.phone = find(/phone|mobile/i, ['phone']); mp.date = find(/date|issued|checkin|day/i, ['date']) || find(/./, ['date']);
    mp.total = find(/total|amount|net|value|fee|paid/i, ['money']) || find(/./, ['money']); mp.items = find(/items|service|task|title|desc|term|month|plan|for|note|reason/i, ['text','long','sel','ref']);
    mp.mode = find(/mode|payment/i, ['sel']); mp.status = find(/./, ['status']);
    return mp;
  }
  function invHTML(){
    var m = modBy(S.inv.m), r = m && data[m.id].filter(function(x){ return x._id === S.inv.id; })[0]; if (!r) { S.inv = null; return ''; }
    var b = biz(), mp = bill && bill.to === m.id ? bill.map : guessMap(m);
    var lines = r._lines || [{n: (mp.items && r[mp.items]) || m.sg, q: 1, r: Number(r[mp.total]) || 0}];
    var sub = 0; lines.forEach(function(l){ sub += l.q * l.r; });
    var disc = r._disc || 0, total = mp.total && r[mp.total] !== '' && r[mp.total] != null ? Number(r[mp.total]) : sub - disc, rate = Number(b.gst) || 0, gst = rate ? total * rate / (100 + rate) : 0;
    var st = mp.status ? String(r[mp.status] || '') : '', paid = !st || tone(st) === 'good';
    var cust = r._cust || (mp.customer ? r[mp.customer] : '') || 'Walk-in', phone = r._phone || (mp.phone ? r[mp.phone] : '');
    var no = (mp.no && r[mp.no]) || String(r._id).slice(-6).toUpperCase(), date = mp.date && r[mp.date] ? fdate(r[mp.date]) : fdate(iso(new Date()));
    var upiOk = /^[\w.\-]{2,}@[\w.\-]{2,}$/.test(String(b.upi || '').trim());
    var upi = upiOk ? 'upi://pay?pa=' + String(b.upi).trim() + '&pn=' + encodeURIComponent(spec.name) + '&am=' + total.toFixed(2) + '&cu=INR&tn=' + encodeURIComponent('Bill ' + no) : '';
    var doc = b.gstin ? 'Tax invoice' : (/fee|payment|receipt/i.test(m.name) ? 'Receipt' : 'Bill');
    var waText = 'Hello ' + cust + ',\n' + doc + ' ' + no + ' from ' + spec.name + ' (' + date + ')\n' + lines.map(function(l){ return l.n + ' × ' + l.q + ' = ' + money(l.q * l.r); }).join('\n') + (disc ? '\nDiscount: −' + money(disc) : '') + '\nTotal: ' + money(total) + (paid ? '\nPaid' + (mp.mode && r[mp.mode] ? ' by ' + r[mp.mode] : '') + '. Thank you!' : (upiOk ? '\nPay by UPI to ' + b.upi : '')) + (b.note ? '\n' + b.note : '');
    var h = '<div class="inv-wrap"><div class="inv-bar"><button class="btn btn-p" type="button" data-act="print">' + ic('printer') + 'Print or save PDF</button><a class="btn btn-w" href="' + (waNum(phone) ? waLink(phone, waText) : 'https://wa.me/?text=' + encodeURIComponent(waText)) + '" target="_blank" rel="noopener">' + ic('wa') + 'Send on WhatsApp</a><button class="btn btn-g" type="button" data-act="closeinv">' + ic('x') + 'Close</button></div>';
    h += '<div class="inv-sheet" id="invoice"><div class="inv-h"><div><h2>' + esc(spec.name) + '</h2><p>' + esc(b.address || '') + (b.phone ? '<br>Phone ' + esc(b.phone) : '') + (b.gstin ? '<br>GSTIN ' + esc(b.gstin) : '') + '</p></div><div class="r"><p class="doc">' + doc + '</p><p><b>No. ' + esc(no) + '</b><br>' + esc(date) + '</p></div></div>';
    h += '<div class="inv-to"><div><small>Billed to</small><b>' + esc(cust) + '</b>' + (phone ? '<br>' + esc(phone) : '') + '</div>' + (st ? '<div><small>Status</small><span class="pill ' + tone(st) + '">' + esc(st) + '</span>' + (mp.mode && r[mp.mode] ? ' · ' + esc(r[mp.mode]) : '') + '</div>' : '') + '</div>';
    h += '<table><thead><tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead><tbody>' + lines.map(function(l, i){ return '<tr><td>' + (i + 1) + '</td><td>' + esc(l.n) + '</td><td class="num">' + l.q + '</td><td class="num">' + money(l.r) + '</td><td class="num">' + money(l.q * l.r) + '</td></tr>'; }).join('') + '</tbody></table>';
    h += '<div class="inv-sum"><div class="inv-qr">' + (upi && QR && !paid ? '<div class="q">' + QR(upi) + '</div><div><b>Scan to pay ' + money(total) + '</b><br>Any UPI app · ' + esc(b.upi) + '</div>' : (paid ? '<div><b>Payment received.</b> Thank you!</div>' : '')) + '</div><dl><div><dt>Subtotal</dt><dd>' + money(sub) + '</dd></div>' + (disc ? '<div><dt>Discount</dt><dd>− ' + money(disc) + '</dd></div>' : '') + '<div class="big"><dt>Total</dt><dd>' + money(total) + '</dd></div>' + (rate ? '<div class="g"><dt>Includes GST ' + rate + '%</dt><dd>' + money(gst) + '</dd></div><div class="g"><dt>CGST ' + (rate / 2) + '% + SGST ' + (rate / 2) + '%</dt><dd>' + money(gst / 2) + ' each</dd></div>' : '') + '</dl></div>';
    if (cur.trim() === '₹') h += '<p class="inv-words">Amount in words: <b>Rupees ' + words(total) + ' only</b></p>';
    h += '<div class="inv-f"><span>' + esc(b.note || 'Thank you for your business.') + '</span><span class="sig">Authorised signatory</span></div></div></div>';
    return h;
  }
  /* ----- reports ----- */
  function short(v){ v = Number(v) || 0; if (v >= 1e7) return cur + (v / 1e7).toFixed(1) + ' Cr'; if (v >= 1e5) return cur + (v / 1e5).toFixed(1) + ' L'; if (v >= 1e3) return cur + (v / 1e3).toFixed(1) + 'k'; return v ? money(v) : ''; }
  function reportsHTML(){
    var blocks = [], now = new Date();
    mods.forEach(function(m){
      var df = null, mf = null, sf = null;
      m.fields.forEach(function(f){ if (!df && f.t === 'date') df = f; if (f.t === 'money' && (!mf || (/total|amount|net|value/i.test(f.k) && !/total|amount|net|value/i.test(mf.k)))) mf = f; if (f.t === 'status') sf = f; });
      if (!df || !mf) return;
      var months = []; for (var i = 5; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth() - i, 1); months.push({y: d.getFullYear(), m: d.getMonth(), sum: 0, n: 0}); }
      data[m.id].forEach(function(r){ var p = String(r[df.k] || '').split('-'); if (p.length !== 3) return; if (sf && /cancel|return|lost|reject/i.test(String(r[sf.k]))) return; months.forEach(function(mo){ if (+p[0] === mo.y && +p[1] - 1 === mo.m) { mo.sum += Number(r[mf.k]) || 0; mo.n++; } }); });
      var max = Math.max.apply(null, months.map(function(x){ return x.sum; }).concat([1]));
      blocks.push('<section class="panel"><h2>' + esc(m.name) + ': ' + esc(mf.l.toLowerCase()) + ' by month</h2><div class="rsum"><div>This month<b>' + money(months[5].sum) + '</b></div><div>Last month<b>' + money(months[4].sum) + '</b></div><div>Entries this month<b>' + months[5].n + '</b></div></div><div class="vbars">' + months.map(function(x){ return '<div class="vbar"><b>' + short(x.sum) + '</b><i style="height:' + Math.max(2, Math.round(x.sum / max * 100)) + '%"></i><small>' + MON[x.m] + '</small></div>'; }).join('') + '</div></section>');
    });
    if (bill) {
      var agg = {}; data[bill.to].forEach(function(r){ (r._lines || []).forEach(function(l){ agg[l.n] = agg[l.n] || {q: 0, a: 0}; agg[l.n].q += l.q; agg[l.n].a += l.q * l.r; }); });
      var top = Object.keys(agg).map(function(k){ return [k, agg[k]]; }).sort(function(a, b){ return b[1].a - a[1].a; }).slice(0, 8);
      blocks.push('<section class="panel"><h2>Best sellers<small>from bills made with New bill</small></h2>' + (top.length ? '<div class="twrap"><table><thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Sales</th></tr></thead><tbody>' + top.map(function(t){ return '<tr><td class="t">' + esc(t[0]) + '</td><td class="num">' + t[1].q + '</td><td class="num">' + money(t[1].a) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="hint2">Make a bill with “New bill” and your best sellers show up here.</p>') + '</section>');
    }
    mods.forEach(function(m){ var sf = null; m.fields.forEach(function(f){ if (f.t === 'status' && f.o) sf = f; }); if (!sf || blocks.length >= 6) return; var counts = sf.o.map(function(o){ return [o, data[m.id].filter(function(r){ return r[sf.k] === o; }).length]; }), mx = Math.max.apply(null, counts.map(function(c){ return c[1]; }).concat([1])); blocks.push('<section class="panel"><h2>' + esc(m.name) + ' by ' + esc(sf.l.toLowerCase()) + '</h2><div class="bars">' + counts.map(function(x){ return '<div class="bar-row"><span>' + esc(x[0]) + '</span><div class="bar"><i style="width:' + Math.max(3, Math.round(x[1] / mx * 100)) + '%"></i></div><b>' + x[1] + '</b></div>'; }).join('') + '</div></section>'); });
    return blocks.length ? '<div class="rgrid">' + blocks.join('') + '</div>' : '<div class="empty">Reports appear when a module has a date and an amount.</div>';
  }
  /* ----- settings ----- */
  function settingsHTML(){
    var b = biz();
    return '<form class="panel settings" data-settings><h2>Business details for bills</h2><div class="sgrid"><label class="fl">Address<input name="address" value="' + esc(b.address || '') + '"></label><label class="fl">Phone<input name="phone" type="tel" value="' + esc(b.phone || '') + '"></label><label class="fl">GSTIN <small>(leave empty if not registered)</small><input name="gstin" value="' + esc(b.gstin || '') + '" placeholder="27ABCDE1234F1Z5"></label><label class="fl">UPI ID for payments<input name="upi" value="' + esc(b.upi || '') + '" placeholder="yourname@okhdfcbank"></label><label class="fl">GST % included in your prices<input name="gst" type="number" min="0" max="28" step="any" value="' + esc(b.gst == null ? '' : b.gst) + '"></label><label class="fl">Note at the bottom of bills<input name="note" value="' + esc(b.note || '') + '" placeholder="Thank you! Visit again."></label></div><p style="color:var(--muted);font-size:12.5px">With a UPI ID, unpaid bills show a QR code that customers scan to pay the exact amount.</p><div><button class="btn btn-p" type="submit">' + ic('check') + 'Save settings</button></div></form>' +
      '<section class="panel settings" style="margin-top:14px"><h2>Your data</h2><p style="color:var(--muted);font-size:13px">Records are stored in this browser on this device. Download a backup every week, and use it to move to another computer.</p><div style="display:flex;gap:8px;flex-wrap:wrap">' + (SA ? '<button class="btn btn-g" type="button" data-act="backup">' + ic('download') + 'Download backup</button><button class="btn btn-g" type="button" data-act="restore">' + ic('upload') + 'Restore backup</button><input type="file" accept=".json,application/json" data-restore hidden>' : '') + '<button class="btn btn-g" type="button" data-act="reset" style="color:#A01D1D">' + ic('trash') + (S.confirmReset ? 'Tap again to delete every record' : 'Clear all records') + '</button></div></section>';
  }
  /* ----- forms ----- */
  function input(f, v){
    var n = 'name="' + f.k + '" id="i-' + f.k + '"';
    if (f.t === 'long') return '<textarea ' + n + '>' + esc(v) + '</textarea>';
    if (f.t === 'sel' || f.t === 'status' || f.t === 'ref') {
      var opts = f.o || [];
      if (f.t === 'ref') { var rm = modBy(f.ref); if (!rm) return '<input ' + n + ' value="' + esc(v) + '">'; opts = data[rm.id].map(function(r){ return String(title(rm, r)); }); }
      if (v && opts.indexOf(String(v)) < 0) opts = [String(v)].concat(opts);
      return '<select ' + n + '><option value="">Choose…</option>' + opts.map(function(o){ return '<option' + (String(v) === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
    }
    var ty = {num:'number', money:'number', date:'date', time:'time', phone:'tel', email:'email'}[f.t] || 'text';
    var el = '<input ' + n + ' type="' + ty + '"' + (ty === 'number' ? ' step="any"' : '') + ' value="' + esc(v) + '">';
    return f.t === 'money' ? '<div class="pre"><span>' + esc(cur.trim()) + '</span>' + el + '</div>' : el;
  }
  function formHTML(){
    var m = modBy(S.form.m), r = S.form.id ? data[m.id].filter(function(x){ return x._id === S.form.id; })[0] || {} : {};
    return '<div class="scrim" data-act="close"></div><form class="drawer" data-form aria-label="' + esc(m.sg) + '"><div class="dh"><h2>' + (S.form.id ? 'Edit ' : 'New ') + esc(m.sg.toLowerCase()) + '</h2><button class="ib" type="button" data-act="close" aria-label="Close">' + ic('x') + '</button></div><div class="db">' +
      m.fields.map(function(f, i){ return '<label class="fl" for="i-' + f.k + '">' + esc(f.l) + (i === 0 ? ' *' : '') + input(f, r[f.k] == null ? '' : r[f.k]) + (i === 0 && S.err ? '<span class="err">' + esc(S.err) + '</span>' : '') + '</label>'; }).join('') +
      '</div><div class="df"><button class="btn btn-g" type="button" data-act="close">Cancel</button><button class="btn btn-p" type="submit">Save ' + esc(m.sg.toLowerCase()) + '</button></div></form>';
  }
  function loginHTML(){
    return '<div class="sw"><div class="login"><form class="lcard" data-login><div class="brand"><span class="bm">' + ic(spec.icon) + '</span><div><b>' + esc(spec.name) + '</b><small style="opacity:.7">' + esc(spec.title) + '</small></div></div><label class="fl">Username<input name="u" autocomplete="username" value="' + esc(spec.login.user) + '"></label><label class="fl">Password<input name="p" type="password" autocomplete="current-password"></label>' + (S.err ? '<span class="fl"><span class="err">' + esc(S.err) + '</span></span>' : '') + '<button class="btn btn-p" type="submit">' + ic('lock') + 'Unlock</button>' + (SA ? '' : '<p class="hint">Preview: the password is “' + esc(spec.login.pass) + '”.</p>') + '</form></div></div>';
  }
  /* ----- render & events ----- */
  var toastTimer;
  function bodyHTML(){ if (S.view === 'pos' && bill) return posHTML(); if (S.view === 'reports') return reportsHTML(); if (S.view === 'settings') return settingsHTML(); if (S.view !== 'home' && !modBy(S.view)) S.view = 'home'; return S.view === 'home' ? dashHTML() : modHTML(); }
  function render(){
    if (!S.authed) { host.innerHTML = loginHTML(); return; }
    var body = bodyHTML();
    host.innerHTML = '<div class="sw"><div class="app">' + sideHTML() + '<main class="main">' + topHTML() + '<div class="content">' + body + '</div></main>' + (S.form ? formHTML() : '') + (S.inv ? invHTML() : '') + (S.toast ? '<div class="toast" role="status">' + esc(S.toast) + '</div>' : '') + '</div></div>';
    if (S.form) { var f = host.querySelector('.drawer input, .drawer select, .drawer textarea'); if (f) f.focus({preventScroll: true}); }
    if (S.toast) { clearTimeout(toastTimer); toastTimer = setTimeout(function(){ S.toast = ''; var t = host.querySelector('.toast'); if (t) t.remove(); }, 2400); }
  }
  function refreshTable(){ var m = modBy(S.view); if (!m) return render(); var w = host.querySelector('[data-tbl]'); if (w) w.innerHTML = tableHTML(m, filtered(m)); var tb = host.querySelector('.tbar .grow'); if (tb) tb.textContent = S.q ? filtered(m).length + ' of ' + data[m.id].length + ' shown' : 'Tap a column name to sort'; }
  function refreshPos(){ var c = host.querySelector('[data-cart]'); if (c) c.outerHTML = cartHTML(); var p = host.querySelector('[data-plist]'); if (p) p.innerHTML = plistHTML(); }
  function download(name, text, type){ if (SAVE) { SAVE(name, text, type); return; } var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], {type: type})); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function parseCSV(t){ var rows = [], row = [], f = '', q = false; t = String(t).replace(/^﻿/, ''); var first = t.split('\n')[0], sep = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ','; for (var i = 0; i < t.length; i++) { var c = t[i]; if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === sep || c === '\t') { row.push(f); f = ''; } else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; } else f += c; } if (f !== '' || row.length) { row.push(f); rows.push(row); } return rows.filter(function(r){ return r.some(function(x){ return String(x).trim(); }); }); }
  function importRows(m, text){
    var rows = parseCSV(text); if (!rows.length) return 0;
    var head = rows[0].map(function(h){ return String(h).trim().toLowerCase(); });
    var map = head.map(function(h){ for (var i = 0; i < m.fields.length; i++) { var f = m.fields[i]; if (f.l.toLowerCase() === h || f.k.toLowerCase() === h) return f; } return null; });
    var body = rows.slice(1);
    if (!map.some(Boolean)) { map = m.fields.slice(0, head.length); body = rows; }
    var n = 0;
    body.forEach(function(r){ var o = {_id: uid()}; m.fields.forEach(function(f){ o[f.k] = ''; }); map.forEach(function(f, i){ if (!f) return; var v = String(r[i] == null ? '' : r[i]).trim(); if (f.t === 'num' || f.t === 'money') { v = v.replace(/[^\d.\-]/g, ''); o[f.k] = v === '' ? '' : Number(v); } else if (f.t === 'date') { var d = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/.exec(v); o[f.k] = d ? (d[3].length === 2 ? '20' + d[3] : d[3]) + '-' + pad(+d[2]) + '-' + pad(+d[1]) : v.slice(0, 10); } else o[f.k] = v; }); if (String(o[m.fields[0].k]).trim()) { data[m.id].push(o); n++; } });
    save(); return n;
  }
  var delTimer;
  host.addEventListener('click', function(e){
    var t = e.target.closest('[data-go],[data-act],[data-sort],[data-edit],[data-del],[data-inv],[data-addline],[data-qty]'); if (!t) return;
    if (t.hasAttribute('data-go')) { S.view = t.getAttribute('data-go'); S.q = ''; S.sortK = null; S.del = null; S.confirmReset = false; render(); var c = host.querySelector('.content'); if (c) c.scrollTop = 0; return; }
    if (t.hasAttribute('data-sort')) { var k = t.getAttribute('data-sort'); if (S.sortK === k) S.sortD = -S.sortD; else { S.sortK = k; S.sortD = 1; } refreshTable(); return; }
    if (t.hasAttribute('data-edit')) { S.form = {m: t.getAttribute('data-m'), id: t.getAttribute('data-edit')}; S.err = ''; render(); return; }
    if (t.hasAttribute('data-inv')) { S.inv = {m: t.getAttribute('data-m'), id: t.getAttribute('data-inv')}; render(); return; }
    if (t.hasAttribute('data-addline')) {
      var id = t.getAttribute('data-addline'), im = modBy(bill.items), r = data[im.id].filter(function(x){ return x._id === id; })[0]; if (!r) return;
      var line = S.cart.filter(function(l){ return l.id === id; })[0]; if (line) line.qty++; else S.cart.push({id: id, name: String(r[bill.name]), price: Number(r[bill.price]) || 0, qty: 1});
      refreshPos(); return;
    }
    if (t.hasAttribute('data-qty')) { var qi = +t.getAttribute('data-qty'), dd = +t.getAttribute('data-d'), l = S.cart[qi]; if (!l) return; l.qty += dd; if (l.qty <= 0) S.cart.splice(qi, 1); refreshPos(); return; }
    if (t.hasAttribute('data-del')) {
      var did = t.getAttribute('data-del'), mid = t.getAttribute('data-m');
      if (S.del === did) { data[mid] = data[mid].filter(function(x){ return x._id !== did; }); S.del = null; save(); S.toast = 'Deleted'; render(); return; }
      S.del = did; clearTimeout(delTimer); delTimer = setTimeout(function(){ S.del = null; if (modBy(S.view)) refreshTable(); else render(); }, 3000);
      if (modBy(S.view)) refreshTable(); else render(); return;
    }
    var act = t.getAttribute('data-act');
    if (act === 'new') { S.form = {m: t.getAttribute('data-m'), id: null}; S.err = ''; render(); }
    else if (act === 'close') { S.form = null; S.err = ''; render(); }
    else if (act === 'checkout') checkout();
    else if (act === 'clearcart') { S.cart = []; refreshPos(); }
    else if (act === 'closeinv') { S.inv = null; render(); }
    else if (act === 'print') { if (SA) window.print(); else { S.toast = 'Printing works in your downloaded file'; render(); } }
    else if (act === 'import') { var fi = host.querySelector('[data-import]'); if (fi) fi.click(); }
    else if (act === 'csv') {
      var m = modBy(S.view), rows = [m.fields.map(function(f){ return f.l; })].concat(data[m.id].map(function(r){ return m.fields.map(function(f){ return r[f.k]; }); }));
      download(spec.slug + '-' + m.id + '.csv', '﻿' + rows.map(function(r){ return r.map(function(c){ return '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n'), 'text/csv');
    }
    else if (act === 'restore') { var fr = host.querySelector('[data-restore]'); if (fr) fr.click(); }
    else if (act === 'backup') { download(spec.slug + '-backup-' + iso(new Date()) + '.json', JSON.stringify({app: spec.slug, saved: new Date().toISOString(), data: data}, null, 1), 'application/json'); }
    else if (act === 'reset') {
      if (!S.confirmReset) { S.confirmReset = true; render(); setTimeout(function(){ if (S.confirmReset) { S.confirmReset = false; render(); } }, 4000); return; }
      mods.forEach(function(mm){ data[mm.id] = []; }); S.confirmReset = false; save(); S.toast = 'All records cleared'; render();
    }
    else if (act === 'logout') { S.authed = false; try { sessionStorage.removeItem(KEY + ':auth'); } catch(err){} render(); }
  });
  host.addEventListener('input', function(e){
    var el = e.target; if (!el.hasAttribute) return;
    if (el.hasAttribute('data-q')) { S.q = el.value; S.del = null; refreshTable(); }
    else if (el.hasAttribute('data-pq')) { S.pq = el.value; var p = host.querySelector('[data-plist]'); if (p) p.innerHTML = plistHTML(); }
    else if (el.hasAttribute('data-cf')) { S.cf[el.getAttribute('data-cf')] = el.value; var tt = host.querySelector('[data-tot]'); if (tt) tt.innerHTML = totHTML(totals()); }
  });
  host.addEventListener('change', function(e){
    var el = e.target; if (!el.hasAttribute || !el.files || !el.files[0]) return;
    var file = el.files[0], rd = new FileReader();
    if (el.hasAttribute('data-restore')) rd.onload = function(){ try { var o = JSON.parse(rd.result); if (!o || !o.data) throw 0; mods.forEach(function(m){ if (Array.isArray(o.data[m.id])) data[m.id] = o.data[m.id]; }); if (o.data._settings) data._settings = o.data._settings; save(); S.toast = 'Backup restored'; } catch(err){ S.toast = 'That file is not a backup from this app'; } render(); };
    else if (el.hasAttribute('data-import')) rd.onload = function(){ var m = modBy(S.view); var n = m ? importRows(m, rd.result) : 0; S.toast = n ? 'Imported ' + n + ' ' + (n === 1 ? m.sg.toLowerCase() : m.name.toLowerCase()) : 'Nothing imported. In Excel use File › Save As › CSV, with column names in the first row.'; render(); };
    else return;
    rd.readAsText(file); el.value = '';
  });
  host.addEventListener('keydown', function(e){ if (e.key === 'Escape') { if (S.inv) { S.inv = null; render(); } else if (S.form) { S.form = null; render(); } } });
  host.addEventListener('submit', function(e){
    e.preventDefault();
    var tg = e.target;
    if (tg.hasAttribute('data-login')) {
      var u = tg.elements.u.value.trim(), p = tg.elements.p.value;
      if (u === spec.login.user && p === spec.login.pass) { S.authed = true; S.err = ''; if (SA) { try { sessionStorage.setItem(KEY + ':auth', '1'); } catch(err){} } }
      else S.err = 'Wrong username or password.';
      render(); return;
    }
    if (tg.hasAttribute('data-settings')) { var o = {}; ['address','phone','gstin','upi','gst','note'].forEach(function(k){ o[k] = tg.elements[k].value.trim(); }); if (o.gst !== '') o.gst = Number(o.gst); data._settings = o; save(); S.toast = 'Settings saved'; render(); return; }
    if (!tg.hasAttribute('data-form')) return;
    var m = modBy(S.form.m), els = tg.elements, rec = {};
    m.fields.forEach(function(f){ var el = els[f.k]; var v = el ? el.value.trim() : ''; rec[f.k] = (f.t === 'num' || f.t === 'money') && v !== '' ? Number(v) : v; });
    if (rec[m.fields[0].k] === '' || rec[m.fields[0].k] == null) { S.err = m.fields[0].l + ' is required.'; render(); return; }
    if (S.form.id) { data[m.id] = data[m.id].map(function(r){ if (r._id !== S.form.id) return r; var keep = {}; for (var k1 in r) if (k1[0] === '_') keep[k1] = r[k1]; for (var k2 in rec) keep[k2] = rec[k2]; return keep; }); }
    else { rec._id = uid(); data[m.id].unshift(rec); }
    save(); S.toast = 'Saved ' + m.sg.toLowerCase(); S.form = null; S.err = ''; render();
  });
  render();
}

/* ================= EXPORT ================= */
function siteRuntimeConfig(s){ return {name: s.name, phone: s.phone, whatsapp: s.whatsapp !== false}; }
function favicon(s){ return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="' + s.p + '"/><g transform="translate(4 4) scale(.667)" fill="none" stroke="' + onColor(s.p) + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[s.icon] || ICONS.star) + '</g></svg>'); }
function exportHTML(spec){
  const stamp = new Date().toISOString().slice(0,10);
  const S1 = '<scr' + 'ipt>', S2 = '<\/scr' + 'ipt>', C1 = '<!-' + '- ', C2 = ' -' + '->';
  if (spec.kind === 'website') {
    const f = FONTS[spec.font] || FONTS.modern;
    return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>' + esc(spec.name) + ' · ' + esc(spec.tagline) + '</title>\n<meta name="description" content="' + esc(spec.hero.sub) + '">\n<meta property="og:title" content="' + esc(spec.name) + '">\n<meta property="og:description" content="' + esc(spec.tagline) + '">\n<meta name="theme-color" content="' + spec.p + '">\n<link rel="icon" href="' + favicon(spec) + '">\n' + C1 + 'Built with Banao on ' + stamp + '. Plain HTML: open it in any text editor to change words.' + C2 + '\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?' + f.q + '&display=swap">\n<style>\nhtml{scroll-behavior:smooth}body{margin:0}\n' + siteCSS(spec) + '\n</style>\n</head>\n<body>\n' + siteHTML(spec) + '\n' + S1 + '\n(' + siteBehavior.toString() + ')(document.querySelector(".site"), ' + safeJSON(siteRuntimeConfig(spec)) + ', {standalone: true});\n' + S2 + '\n</body>\n</html>\n';
  }
  const out = JSON.parse(JSON.stringify(spec));
  out.modules = out.modules.filter(m => m.on !== false);
  delete out.nameIdeas;
  out.icons = ICONS;
  return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>' + esc(spec.name) + ' · ' + esc(spec.title) + '</title>\n<meta name="theme-color" content="' + mix(spec.p, '#0D1117', .58) + '">\n<link rel="icon" href="' + favicon(spec) + '">\n' + C1 + 'Built with Banao on ' + stamp + '. Records are stored in this browser (localStorage). Use Settings, Download backup to keep a copy.' + C2 + '\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?' + FONTS.modern.q + '&display=swap">\n<style>\nhtml,body{margin:0;height:100%}#app{height:100vh;height:100dvh}\n' + softCSS(spec) + '\n</style>\n</head>\n<body>\n<div id="app"></div>\n' + S1 + '\nvar SPEC = ' + safeJSON(out) + ';\nvar QRLIB = (' + qrLib.toString() + ')();\nvar QRSVG = ' + qrSvg.toString() + ';\n(' + mountSoftware.toString() + ')(document.getElementById("app"), SPEC, {standalone: true, qr: function(t){ return QRSVG(t, QRLIB); }});\n' + S2 + '\n</body>\n</html>\n';
}
