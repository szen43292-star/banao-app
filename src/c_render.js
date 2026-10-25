/* ================= Banao · generators ================= */
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function ico(n, cls){ return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || ICONS.star) + '</svg>'; }
function slugify(s){ return String(s || 'site').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g,'').trim().replace(/[\s_]+/g,'-').replace(/-+/g,'-').slice(0,40) || 'site'; }
function safeJSON(o){ return JSON.stringify(o).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'); }

/* ---------- colour maths (exported files get plain hex) ---------- */
function hx(h){ h = String(h || '#000').replace('#',''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h.slice(0,6), 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function toHex(r,g,b){ return '#' + [r,g,b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,'0')).join('').toUpperCase(); }
function mix(a,b,t){ const A = hx(a), B = hx(b); return toHex(A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t, A[2]+(B[2]-A[2])*t); }
function lum(c){ return hx(c).map(v => { v /= 255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); }).reduce((s,v,i) => s + v*[.2126,.7152,.0722][i], 0); }
function contrast(a,b){ const x = lum(a), y = lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
function onColor(c){ return contrast(c,'#FFFFFF') >= contrast(c,'#111111') ? '#FFFFFF' : '#111111'; }
function readable(c, bg, min){ min = min || 4.5; let out = c; const toward = lum(bg) > .35 ? '#000000' : '#FFFFFF'; for (let i = 0; i < 9 && contrast(out,bg) < min; i++) out = mix(out, toward, .2); return out; }
function rgba(c,a){ const [r,g,b] = hx(c); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; }
function upiURL(upi, name, amount, note){ if (!/^[\w.\-]{2,}@[\w.\-]{2,}$/.test(String(upi || '').trim())) return ''; return 'upi://pay?pa=' + String(upi).trim() + '&pn=' + encodeURIComponent(name || '') + (amount ? '&am=' + Number(amount).toFixed(2) : '') + '&cu=INR' + (note ? '&tn=' + encodeURIComponent(note) : ''); }
/* QR as SVG (serialised into exported software too, keep self-contained) */
function qrSvg(text, lib){ try { var q = lib(0, 'M'); q.addData(text); q.make(); var n = q.getModuleCount(), d = ''; for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) d += 'M' + c + ' ' + r + 'h1v1h-1z'; return '<svg viewBox="-2 -2 ' + (n + 4) + ' ' + (n + 4) + '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="UPI QR code"><rect x="-2" y="-2" width="' + (n + 4) + '" height="' + (n + 4) + '" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>'; } catch (e) { return ''; } }
const QRL = qrLib();
const makeQR = t => qrSvg(t, QRL);

const STYLE_BASE = {
  clean:{bg:'#FFFFFF', tint:.025, ink:'#121821', card:'#FFFFFF', r:16, rb:12,  dark:false},
  bold: {bg:'#F3F2EE', tint:0,    ink:'#0E0E0E', card:'#FFFFFF', r:0,  rb:0,   dark:false},
  luxe: {bg:'#F7F5F0', tint:.02,  ink:'#1C1B19', card:'#FFFDF9', r:4,  rb:0,   dark:false},
  warm: {bg:'#FFF8F0', tint:.035, ink:'#2A1D14', card:'#FFFFFF', r:24, rb:999, dark:false},
  dark: {bg:'#0C0E13', tint:.05,  ink:'#EDEFF3', card:'#151820', r:18, rb:12,  dark:true}
};
const SERIF_FONTS = {elegant:1, editorial:1};
function siteVars(s){
  const b = STYLE_BASE[s.style] || STYLE_BASE.clean, f = FONTS[s.font] || FONTS.modern;
  const bg = mix(b.bg, s.p, b.tint), ink = b.ink, card = b.dark ? mix(b.card, s.p, .05) : b.card;
  const soft = mix(bg, s.p, b.dark ? .16 : .08);
  const serif = !!SERIF_FONTS[s.font];
  return {
    p:s.p, a:s.a, bg, ink, card, soft,
    softA: mix(bg, s.a, b.dark ? .18 : .15),
    line: mix(bg, ink, .1), line2: mix(bg, ink, .2), muted: mix(ink, bg, .35),
    pText: readable(s.p, bg), pTextCard: readable(s.p, card), onP: onColor(s.p), onA: onColor(s.a),
    aOnP: contrast(s.a, s.p) > 2.4 ? s.a : onColor(s.p),
    footBg: b.dark ? mix(bg, '#000000', .45) : mix(ink, s.p, .16), footInk: b.dark ? ink : '#F4F4F2',
    g1: rgba(s.a, b.dark ? .45 : .55), g2: rgba(s.p, b.dark ? .7 : .55), g3: b.dark ? card : mix(bg, s.p, .14), g4: b.dark ? mix(card, s.p, .3) : mix(bg, s.p, .32),
    panelInk: b.dark ? mix(ink, s.p, .25) : readable(s.p, mix(bg, s.p, .2), 3),
    t0a: soft, t0b: mix(bg, s.p, b.dark ? .32 : .24), t1a: mix(bg, s.a, .18), t1b: mix(bg, s.a, .42), t2a: mix(bg, s.p, .12), t2b: mix(bg, s.a, .3),
    r: b.r + 'px', rb: b.rb + 'px', hf: f.h, bf: f.b, hw: f.hw, dark: b.dark,
    hls: s.font === 'bold' ? '0' : serif ? '-.005em' : '-.02em', hls2: s.font === 'bold' ? '-.005em' : serif ? '-.015em' : '-.035em'
  };
}

/* ================= WEBSITE CSS ================= */
const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const SITE_CSS = `
.site{container-type:inline-size;position:relative;min-height:100%;background:var(--bg);color:var(--ink);font-family:var(--bf);font-size:16.5px;line-height:1.65;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:clip}
.site *,.site *::before,.site *::after{box-sizing:border-box}
.site :where(h1,h2,h3,h4,p,ul,ol,blockquote,figure,dl,dd){margin:0}
.site :where(ul,ol){padding:0;list-style:none}
.site :where(a){color:inherit;text-decoration:none}
.site :where(img){max-width:100%;display:block}
.site :where(button){font:inherit;color:inherit}
.site .ic{width:1.15em;height:1.15em;flex:none}
.site :focus-visible{outline:2.5px solid var(--p);outline-offset:3px}
.wrap{max-width:1180px;margin:0 auto;padding-left:max(28px,env(safe-area-inset-left,0px));padding-right:max(28px,env(safe-area-inset-right,0px))}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:52px;padding:0 26px;border-radius:var(--rb);font-weight:650;font-size:15.5px;border:1.5px solid transparent;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,filter .18s;white-space:nowrap;line-height:1.1}
.btn:hover{transform:translateY(-2px)}
.btn .ic{width:18px;height:18px}
.btn-p{background:var(--p);color:var(--onP);box-shadow:0 12px 26px -14px var(--shadowP)}
.btn-g{background:var(--card);border-color:var(--line2);color:var(--ink)}
.btn-w{background:#25D366;color:#05371A}
.btn-sm{min-height:42px;padding:0 18px;font-size:14.5px}
.nav{position:sticky;top:0;z-index:30;background:var(--navBg);backdrop-filter:saturate(1.5) blur(14px);-webkit-backdrop-filter:saturate(1.5) blur(14px);border-bottom:1px solid var(--line)}
.nav-in{display:flex;align-items:center;gap:30px;height:76px}
.brand{display:flex;align-items:center;gap:11px;font-family:var(--hf);font-weight:var(--hw);font-size:21px;letter-spacing:var(--hls);line-height:1.1;min-width:0}
.brand span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mark{width:42px;height:42px;border-radius:calc(var(--r) * .7 + 2px);display:grid;place-items:center;background:var(--p);color:var(--onP);flex:none;box-shadow:inset 0 -3px 0 rgba(0,0,0,.14)}
.mark .ic{width:21px;height:21px}
.links{display:flex;gap:28px;margin-left:auto;font-size:15px;font-weight:500;color:var(--muted)}
.links a{padding:6px 0;transition:color .15s}
.links a:hover{color:var(--ink)}
.nav-act{display:flex;align-items:center;gap:10px;margin-left:auto}
.links + .nav-act{margin-left:0}
.call{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:14.5px;padding:0 6px;white-space:nowrap}
.bag{position:relative;width:46px;height:46px;display:grid;place-items:center;border-radius:var(--rb);border:1.5px solid var(--line2);background:var(--card);cursor:pointer}
.bag b{position:absolute;top:-6px;right:-6px;min-width:21px;height:21px;padding:0 5px;border-radius:999px;background:var(--a);color:var(--onA);font-size:11px;display:grid;place-items:center}
.burger{display:none;width:46px;height:46px;place-items:center;border:1.5px solid var(--line2);border-radius:var(--rb);background:var(--card);cursor:pointer}
.hero{position:relative;overflow:hidden;isolation:isolate;padding:76px 0 0}
.hero::before{content:"";position:absolute;right:-12%;top:-30%;width:70%;height:130%;background:radial-gradient(closest-side,var(--glow),transparent);z-index:-1;pointer-events:none}
.hero-in{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:60px;align-items:center}
.pill{display:inline-flex;align-items:center;gap:9px;padding:7px 15px 7px 11px;border-radius:999px;background:var(--card);border:1px solid var(--line);font-size:13.5px;font-weight:600;box-shadow:0 6px 18px -12px var(--shadow)}
.pill i{width:8px;height:8px;border-radius:50%;background:var(--a);box-shadow:0 0 0 4px var(--ringA)}
.hero h1{font-family:var(--hf);font-weight:var(--hw);font-size:clamp(40px,5.9cqi,78px);line-height:1.02;letter-spacing:var(--hls2);margin-top:24px;text-wrap:balance}
.hero h1 em{font-style:normal;color:var(--pText)}
.lead{font-size:clamp(17px,1.5cqi,19.5px);line-height:1.65;color:var(--muted);margin-top:22px;max-width:33em}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}
.trust{display:flex;align-items:center;gap:14px;margin-top:34px;font-size:14.5px;color:var(--muted)}
.avs{display:flex}
.avs span{width:38px;height:38px;border-radius:50%;border:2.5px solid var(--bg);display:grid;place-items:center;font-size:12.5px;font-weight:700;margin-left:-11px}
.avs span:first-child{margin-left:0}
.trust b{color:var(--ink)}
.stars{display:flex;gap:2px;color:#F4B400}
.stars svg{width:16px;height:16px}
.av0{background:var(--soft);color:var(--pTextCard)}.av1{background:var(--softA);color:var(--ink)}.av2{background:var(--p);color:var(--onP)}
.hc{width:100%;max-width:560px;justify-self:end;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:minmax(0,1fr) auto;gap:14px;aspect-ratio:1/1.1}
.hc.solo{grid-template-rows:minmax(0,1fr)}
.hc-panel{position:relative;grid-column:1/-1;min-height:220px;border-radius:calc(var(--r) * 2 + 10px);overflow:hidden;isolation:isolate;background:radial-gradient(circle at 18% 14%,var(--g1),transparent 52%),radial-gradient(circle at 88% 86%,var(--g2),transparent 55%),linear-gradient(160deg,var(--g3),var(--g4));box-shadow:0 40px 80px -46px var(--shadow)}
.hc-panel::before{content:"";position:absolute;inset:0;background-image:${NOISE};opacity:.07;z-index:0;pointer-events:none}
.hc-panel::after{content:"";position:absolute;width:150%;aspect-ratio:1;left:24%;top:8%;border-radius:50%;background:repeating-radial-gradient(circle,transparent 0 38px,var(--ringLine) 38px 39px);z-index:0}
.hc-panel img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.hc-icon{position:absolute;right:10%;top:50%;transform:translateY(-50%);width:min(40%,220px);aspect-ratio:1;color:var(--panelInk);z-index:1;opacity:.9}
.hc-icon .ic{width:100%;height:100%;stroke-width:.9}
.hc-tile{min-width:0;border-radius:calc(var(--r) + 8px);padding:18px 20px;display:flex;flex-direction:column;justify-content:center;gap:8px}
.hc-feat{background:var(--soft);color:var(--ink)}
.hc-info{background:var(--p);color:var(--onP)}
.hf-k{font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--pText);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc-feat h4{font-size:16px;font-weight:700;line-height:1.3;overflow-wrap:anywhere}
.hc-feat small{display:block;color:var(--muted);font-size:13px;line-height:1.4}
.hf-row{display:flex;align-items:center;gap:12px;min-width:0}
.hf-row>div{min-width:0}
.hf-pic{position:relative;width:54px;height:54px;border-radius:calc(var(--r) * .6 + 4px);overflow:hidden;display:grid;place-items:center;background:var(--bg);color:var(--pText);flex:none}
.hf-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hf-pic .ic{width:50%;height:50%;stroke-width:1.4}
.hf-pic.avatar{border-radius:50%;margin:0;font-size:17px}
.hc-feat .price{font-size:18px}
.hc-feat .mc-menu li{padding:6px 0;font-size:14px}
.hf-time{display:flex;gap:7px;align-items:center;font-size:13px;color:var(--muted)}
.hc-info ul{display:flex;flex-direction:column;gap:10px}
.hc-info li{display:flex;gap:10px;align-items:flex-start;font-weight:600;font-size:14.5px;line-height:1.35}
.hc-info li .ic{width:18px;height:18px;margin-top:1px;opacity:.85}
.hc-info small{font-size:13.5px;line-height:1.45;opacity:.9}
.mc-tile{position:relative;aspect-ratio:16/10;border-radius:calc(var(--r) * .7 + 2px);overflow:hidden;display:grid;place-items:center;color:var(--pText);margin-bottom:14px}
.mc-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mc-tile::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,var(--dot) 1.2px,transparent 0) 0 0/16px 16px}
.mc-tile .ti{position:relative;width:34%;aspect-ratio:1;border-radius:50%;background:var(--card);display:grid;place-items:center;box-shadow:0 14px 30px -18px var(--shadow)}
.mc-tile .ti .ic{width:48%;height:48%;stroke-width:1.3}
.mc h4{font-size:16.5px;font-weight:700;line-height:1.3}
.mc small{display:block;color:var(--muted);font-size:13.5px;margin-top:2px}
.mc-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}
.mc-row .price{font-size:19px}
.mc-person{display:flex;gap:12px;align-items:center}
.mc-person .avatar{width:54px;height:54px;font-size:17px;margin:0}
.mc-time{display:flex;gap:8px;align-items:center;font-size:13.5px;margin-top:14px;padding:10px 12px;border-radius:calc(var(--r) * .6);background:var(--soft)}
.mc-menu li{display:flex;align-items:baseline;gap:10px;padding:9px 0;border-bottom:1px dashed var(--line2);font-size:14.5px}
.mc-menu li:last-child{border-bottom:0}
.mc-menu li span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.mc-menu li b{font-variant-numeric:tabular-nums}
.mc-head{font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--pTextCard);margin-bottom:6px}
.mc-plan .amt{font-size:30px;margin:6px 0 10px}
.mc-plan li{display:flex;gap:8px;align-items:center;font-size:14px;padding:3px 0}
.mc-plan li .ic{color:var(--pTextCard)}
.hstats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:76px;border-top:1px solid var(--line)}
.hstat{padding:26px 24px 30px;border-left:1px solid var(--line)}
.hstat:first-child{border-left:0;padding-left:0}
.hstat b{display:block;font-family:var(--hf);font-weight:var(--hw);font-size:clamp(28px,3cqi,38px);line-height:1.1;letter-spacing:var(--hls);color:var(--pText)}
.hstat span{font-size:14px;color:var(--muted)}
.marq{border-block:1px solid var(--line);background:var(--card);overflow:hidden;padding:20px 0}
.marq-in{display:flex;width:max-content;animation:marq 42s linear infinite}
.marq-in span{display:inline-flex;align-items:center;gap:40px;padding-right:40px;white-space:nowrap;font-family:var(--hf);font-weight:var(--hw);font-size:22px;letter-spacing:var(--hls)}
.marq-in span::after{content:"✦";color:var(--a);font-size:15px}
@keyframes marq{to{transform:translateX(-50%)}}
.sec{padding:112px 0}
.sec-alt{background:var(--soft)}
.sec-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:20px 64px;align-items:end;margin-bottom:56px}
.sec-head p{color:var(--muted);font-size:17px;max-width:30em}
.kicker{display:inline-flex;align-items:center;gap:10px;font-size:12.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--pText);margin-bottom:16px}
.kicker::before{content:"";width:22px;height:2px;background:currentColor}
.h2{font-family:var(--hf);font-weight:var(--hw);font-size:clamp(32px,4.1cqi,54px);line-height:1.06;letter-spacing:var(--hls2);text-wrap:balance}
.site h3{font-family:var(--bf);font-size:18.5px;font-weight:700;line-height:1.3;letter-spacing:-.005em}
.grid{display:grid;grid-template-columns:repeat(var(--cols,3),minmax(0,1fr));gap:20px}
.svc{position:relative;padding:32px 28px 30px;border-radius:calc(var(--r) + 4px);background:var(--card);border:1px solid var(--line);transition:transform .2s ease,box-shadow .2s ease,border-color .2s}
.svc:hover{transform:translateY(-4px);box-shadow:0 26px 50px -32px var(--shadow);border-color:var(--line2)}
.si{width:56px;height:56px;border-radius:calc(var(--r) * .8);display:grid;place-items:center;background:var(--soft);color:var(--pTextCard);margin-bottom:28px}
.si .ic{width:26px;height:26px}
.svc p{color:var(--muted);font-size:15.5px;margin-top:8px}
.person{background:var(--card);border:1px solid var(--line);border-radius:calc(var(--r) + 4px);padding:26px;display:flex;flex-direction:column;gap:4px}
.avatar{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:23px;margin-bottom:16px;letter-spacing:.02em}
.person .role{color:var(--muted);font-size:14.5px}
.person .time{display:flex;gap:8px;align-items:center;font-size:13.5px;margin-top:14px;padding-top:14px;border-top:1px dashed var(--line2)}
.person .lnk{margin-top:auto;padding-top:16px;font-weight:650;color:var(--pTextCard);font-size:14.5px;display:inline-flex;gap:6px;align-items:center}
.card{background:var(--card);border:1px solid var(--line);border-radius:calc(var(--r) + 4px);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease}
.card:hover{transform:translateY(-4px);box-shadow:0 26px 50px -32px var(--shadow)}
.tile{aspect-ratio:4/3;position:relative;display:grid;place-items:center;overflow:hidden;color:var(--pText)}
.tile::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,var(--dot) 1.2px,transparent 0) 0 0/18px 18px;opacity:.9}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.tile .ti{position:relative;width:38%;aspect-ratio:1;display:grid;place-items:center;color:var(--pText)}
.tile .ti .ic{width:100%;height:100%;stroke-width:1}
.t0{background:linear-gradient(145deg,var(--t0a),var(--t0b))}.t1{background:linear-gradient(145deg,var(--t1a),var(--t1b))}.t2{background:linear-gradient(145deg,var(--t2a),var(--t2b))}
.tag{position:absolute;z-index:2;top:14px;left:14px;padding:5px 12px;border-radius:999px;background:var(--a);color:var(--onA);font-size:12px;font-weight:700;box-shadow:0 6px 14px -8px var(--shadow)}
.card-b{padding:22px 24px 24px;display:flex;flex-direction:column;gap:4px;flex:1}
.meta{color:var(--muted);font-size:14.5px}
.card-f{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:auto;padding-top:20px;flex-wrap:wrap}
.price{font-family:var(--hf);font-weight:var(--hw);font-size:20px;letter-spacing:var(--hls);font-variant-numeric:tabular-nums}
.menu{display:grid;grid-template-columns:1fr 1fr;gap:0 64px}
.mi{padding:22px 0;border-bottom:1px dashed var(--line2)}
.mi-top{display:flex;align-items:baseline;gap:12px}
.mi-top .dots{flex:1;min-width:20px;border-bottom:2px dotted var(--line2);transform:translateY(-5px)}
.mi p{color:var(--muted);font-size:14.5px;margin-top:4px}
.mi em{font-style:normal;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--pText);margin-left:10px;white-space:nowrap;vertical-align:2px}
.plan{background:var(--card);border:1px solid var(--line);border-radius:calc(var(--r) + 4px);padding:34px 30px;display:flex;flex-direction:column;gap:16px;position:relative}
.plan.hot{background:var(--hotBg);color:var(--hotInk);border-color:transparent;box-shadow:0 30px 60px -30px var(--shadowP)}
.plan.hot li .ic{color:var(--a)}
.plan.hot .btn-p{background:var(--a);color:var(--onA)}
.badge{position:absolute;top:-13px;left:28px;background:var(--a);color:var(--onA);font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px}
.amt{font-family:var(--hf);font-weight:var(--hw);font-size:36px;line-height:1.1;letter-spacing:var(--hls)}
.plan ul{display:flex;flex-direction:column;gap:10px;font-size:15px}
.plan li{display:flex;gap:10px;align-items:flex-start}
.plan li .ic{color:var(--pTextCard);margin-top:3px}
.plan .btn{margin-top:auto}
.about{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:72px;align-items:center}
.about-vis{position:relative;aspect-ratio:1/1.05;border-radius:calc(var(--r) * 2 + 10px);overflow:hidden;isolation:isolate;background:radial-gradient(circle at 80% 10%,var(--g1),transparent 50%),radial-gradient(circle at 10% 90%,var(--g2),transparent 55%),linear-gradient(200deg,var(--g3),var(--g4))}
.about-vis::before{content:"";position:absolute;inset:0;background-image:${NOISE};opacity:.07;z-index:0;pointer-events:none}
.about-vis img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
.about-art{position:relative}
.about-vis .hc-icon{right:10%;top:10%;width:38%;transform:none}
.about-text p{font-size:17.5px;color:var(--muted);margin-top:20px;max-width:34em}
.points{display:flex;flex-direction:column;gap:12px;margin-top:30px}
.point{display:flex;gap:14px;align-items:center;font-weight:600}
.point i{width:30px;height:30px;border-radius:50%;background:var(--p);color:var(--onP);display:grid;place-items:center;flex:none}
.point i .ic{width:16px;height:16px}
.rev{background:var(--card);border:1px solid var(--line);border-radius:calc(var(--r) + 4px);padding:30px;display:flex;flex-direction:column;gap:18px;position:relative}
.rev::before{content:"\\201C";position:absolute;right:24px;top:6px;font-family:Georgia,serif;font-size:90px;line-height:1;color:var(--softA)}
.rev blockquote{font-size:16.5px;line-height:1.6;position:relative}
.who{margin-top:auto;display:flex;gap:12px;align-items:center;font-size:14px}
.who .avatar{width:42px;height:42px;font-size:14px;margin:0}
.who b{display:block}
.who span{color:var(--muted)}
.gal{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:220px;gap:14px}
.gal figure{border-radius:calc(var(--r) + 2px);overflow:hidden;background:var(--soft)}
.gal figure:first-child{grid-row:span 2}
.gal img{width:100%;height:100%;object-fit:cover}
.faq{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:64px;align-items:start}
.faq-side p{color:var(--muted);margin-top:16px;max-width:24em}
.qa{border-bottom:1px solid var(--line2)}
.qa:first-child{border-top:1px solid var(--line2)}
.qa summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 0;font-weight:650;font-size:17.5px}
.qa summary::-webkit-details-marker{display:none}
.qa summary::after{content:"+";flex:none;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--soft);color:var(--pTextCard);font-size:20px;font-weight:500;transition:transform .2s}
.qa[open] summary::after{transform:rotate(45deg)}
.qa p{padding:0 48px 24px 0;color:var(--muted)}
.cta-band{padding:0 0 112px}
.cta-box{position:relative;overflow:hidden;isolation:isolate;border-radius:calc(var(--r) * 2 + 10px);background:var(--p);color:var(--onP);padding:64px;display:grid;grid-template-columns:minmax(0,1.2fr) auto;gap:32px;align-items:center}
.cta-box::before{content:"";position:absolute;width:90%;aspect-ratio:1;right:-30%;top:-60%;border-radius:50%;background:repeating-radial-gradient(circle,transparent 0 34px,var(--ctaLine) 34px 35px);z-index:-1}
.cta-box::after{content:"";position:absolute;inset:0;background-image:${NOISE};opacity:.06;z-index:-1;pointer-events:none}
.cta-box h2{font-family:var(--hf);font-weight:var(--hw);font-size:clamp(28px,3.4cqi,46px);line-height:1.08;letter-spacing:var(--hls2);text-wrap:balance}
.cta-box p{opacity:.86;margin-top:12px;font-size:17px}
.cta-box .cta-row{margin-top:0;justify-content:flex-end}
.cta-box .btn-p{background:var(--onP);color:var(--p);box-shadow:none}
.cta-box .btn-g{background:transparent;color:var(--onP);border-color:currentColor}
.contact{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:64px;align-items:start}
.info{display:flex;flex-direction:column;gap:18px;margin-top:32px}
.info li{display:flex;gap:14px;align-items:flex-start}
.ii{width:48px;height:48px;border-radius:calc(var(--r) * .75);background:var(--soft);color:var(--pText);display:grid;place-items:center;flex:none}
.info small{display:block;color:var(--muted);font-size:13px}
.info b{font-weight:600;overflow-wrap:anywhere}
.c-acts{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.pay{margin-top:28px;display:flex;gap:18px;align-items:center;padding:18px;border:1px solid var(--line);border-radius:calc(var(--r) + 2px);background:var(--card)}
.pay .qr{width:128px;flex:none;border-radius:10px;overflow:hidden;border:1px solid var(--line)}
.pay .qr svg{display:block;width:100%;height:auto}
.pay b{display:block;font-size:17px}
.pay code{display:inline-block;margin-top:6px;font-size:14px;padding:4px 8px;border-radius:6px;background:var(--soft);overflow-wrap:anywhere}
.pay small{display:block;color:var(--muted);font-size:13px;margin-top:6px}
.copy{margin-top:8px;font-size:13px;font-weight:650;color:var(--pTextCard);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}
.form{background:var(--card);border:1px solid var(--line);border-radius:calc(var(--r) * 1.2 + 4px);padding:34px;display:grid;grid-template-columns:1fr 1fr;gap:16px;box-shadow:0 30px 70px -50px var(--shadow)}
.form h3{grid-column:1/-1;font-family:var(--hf);font-weight:var(--hw);font-size:26px;letter-spacing:var(--hls)}
.fld{display:flex;flex-direction:column;gap:7px;font-size:14px;font-weight:600;min-width:0}
.fld.full,.form .btn,.form-ok{grid-column:1/-1}
.fld input,.fld select,.fld textarea{font:inherit;font-weight:400;font-size:15.5px;padding:12px 14px;border-radius:calc(var(--r) * .55);border:1.5px solid var(--line2);background:var(--bg);color:var(--ink);width:100%;min-height:50px}
.fld textarea{min-height:120px;resize:vertical}
.fld input:focus,.fld select:focus,.fld textarea:focus{outline:none;border-color:var(--p);box-shadow:0 0 0 4px var(--ring)}
.fld [aria-invalid=true]{border-color:#D92D20}
.form-ok{display:flex;gap:14px;align-items:flex-start;padding:18px;border-radius:var(--r);background:var(--soft)}
.form-ok .ic{color:var(--pText);width:26px;height:26px}
.form-ok a{display:inline-flex;margin-top:10px}
.foot{background:var(--footBg);color:var(--footInk);padding:80px 0 32px}
.foot-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:48px}
.foot .brand{font-size:24px}
.foot .mark{background:var(--a);color:var(--onA)}
.foot p,.foot li{opacity:.78;font-size:14.5px}
.foot h4{margin:0 0 14px;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.55}
.foot ul{display:flex;flex-direction:column;gap:9px}
.foot-b{margin-top:56px;padding-top:22px;border-top:1px solid var(--footLine);font-size:13px;opacity:.65;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.wa-float{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:40;width:60px;height:60px;border-radius:50%;background:#25D366;color:#fff;display:grid;place-items:center;box-shadow:0 16px 34px -12px rgba(0,0,0,.5);transition:transform .2s}
.wa-float:hover{transform:scale(1.06)}
.wa-float .ic{width:32px;height:32px}
/* --- bold --- */
.s-bold .hero{background:var(--p);color:var(--onP)}
.s-bold .hero::before{display:none}
.s-bold .pill{background:var(--a);color:var(--onA);border:2px solid var(--ink);box-shadow:3px 3px 0 var(--ink)}
.s-bold .pill i{background:var(--ink);box-shadow:none}
.s-bold .hero h1{text-transform:uppercase;font-size:clamp(44px,7.6cqi,108px);line-height:.93}
.s-bold .hero h1 em{color:var(--aOnP)}
.s-bold .hero .lead,.s-bold .trust{color:var(--onP);opacity:.88}
.s-bold .trust b{color:var(--onP)}
.s-bold .hero .btn-p{background:var(--a);color:var(--onA);box-shadow:4px 4px 0 var(--ink);border:2px solid var(--ink)}
.s-bold .hero .btn-g{background:transparent;border-color:currentColor;color:var(--onP)}
.s-bold .hc-panel{background:var(--a);border:3px solid var(--ink);box-shadow:12px 12px 0 var(--ink);border-radius:0}
.s-bold .hc-panel::after{background:repeating-linear-gradient(45deg,transparent 0 18px,rgba(0,0,0,.08) 18px 20px);inset:0;width:auto;left:0;top:0;border-radius:0}
.s-bold .hc-icon{color:var(--ink)}
.s-bold .hc-feat{background:var(--card);color:var(--ink)}
.s-bold .hc-info{background:var(--a);color:var(--onA)}
.s-bold .hc-tile,.s-bold .svc,.s-bold .card,.s-bold .person,.s-bold .plan,.s-bold .rev,.s-bold .form,.s-bold .pay{border:2px solid var(--ink);border-radius:0;box-shadow:6px 6px 0 var(--ink)}
.s-bold .hstats{border-top-color:rgba(255,255,255,.25)}
.s-bold .hstat{border-left-color:rgba(255,255,255,.25)}
.s-bold .hstat b{color:var(--aOnP)}
.s-bold .hstat span{color:var(--onP);opacity:.8}
.s-bold .marq{background:var(--ink);color:var(--bg);border:0}
.s-bold .h2,.s-bold .cta-box h2{text-transform:uppercase}
.s-bold .grid{gap:26px}
.s-bold .btn{border-width:2px}
.s-bold .cta-box{border-radius:0;border:3px solid var(--ink);box-shadow:10px 10px 0 var(--ink)}
.s-bold .tag,.s-bold .badge{border-radius:0}
/* --- luxe --- */
.s-luxe .hero{padding-top:88px}
.s-luxe .hc{max-width:none;justify-self:stretch;aspect-ratio:21/9;grid-template-columns:minmax(0,2.3fr) minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr));text-align:left}
.s-luxe .hc.solo{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
.s-luxe .hc-panel{grid-column:1;grid-row:1/3;border-radius:var(--r)}
.s-luxe .hc.solo .hc-panel{grid-row:1}
.s-luxe .hc-tile{border-radius:var(--r)}
.s-luxe .hc-icon{width:min(24%,190px);right:12%}
.s-luxe .hero-in{grid-template-columns:minmax(0,1fr);justify-items:center;text-align:center;gap:56px}
.s-luxe .hero h1{font-size:clamp(44px,6.6cqi,88px);max-width:13em;font-weight:500}
.s-luxe .hero h1 em{font-style:italic;color:inherit}
.s-luxe .lead{margin-left:auto;margin-right:auto}
.s-luxe .cta-row,.s-luxe .trust{justify-content:center}
.s-luxe .pill{background:transparent;box-shadow:none;border-color:var(--line2);letter-spacing:.12em;text-transform:uppercase;font-size:12px}
.s-luxe .btn{text-transform:uppercase;letter-spacing:.14em;font-size:12.5px}
.s-luxe .sec-head{grid-template-columns:minmax(0,1fr);justify-items:center;text-align:center}
.s-luxe .kicker::after{content:"";width:22px;height:2px;background:currentColor}
.s-luxe .svc{background:transparent;border:0;border-top:1px solid var(--line2);border-radius:0;padding:30px 4px 0}
.s-luxe .svc:hover{transform:none;box-shadow:none}
.s-luxe .si{background:transparent;border:1px solid var(--line2);border-radius:50%}
.s-luxe .svc h3,.s-luxe .card h3,.s-luxe .person h3,.s-luxe .mi h3,.s-luxe .plan h3,.s-luxe .hc-feat h4{font-family:var(--hf);font-weight:var(--hw);font-size:25px;letter-spacing:0}
.s-luxe .rev{background:transparent}
.s-luxe .tag{border-radius:0}
.s-luxe .marq-in span{font-style:italic}
/* --- warm --- */
.s-warm .hero::before{right:auto;left:-20%;top:-40%;background:radial-gradient(closest-side,var(--softA),transparent)}
.s-warm .hc-panel{border-radius:46% 54% 42% 58% / 54% 44% 56% 46%}
.s-warm .hc-tile{border-radius:calc(var(--r) * 2 + 6px)}
.s-warm .svc{background:var(--soft);border-color:transparent}
.s-warm .sec-alt{background:var(--softA)}
.s-warm .about-vis{border-radius:54% 46% 48% 52% / 46% 54% 46% 54%}
/* --- dark --- */
.s-dark{color-scheme:dark}
.s-dark .hc-panel{border:1px solid var(--line2)}
.s-dark .btn-p{box-shadow:0 14px 40px -12px var(--shadowP)}
.s-dark .plan.hot{box-shadow:0 0 70px -20px var(--shadowP)}
.s-dark .marq{background:transparent}
/* --- narrow screens (container queries: preview and phones agree) --- */
@container (max-width: 900px){
  .links,.call{display:none}
  .burger{display:grid}
  .nav-in{gap:12px;height:68px}
  .site.nav-open .links{display:flex;position:absolute;left:0;right:0;top:68px;flex-direction:column;gap:0;padding:8px 28px 20px;background:var(--bg);border-bottom:1px solid var(--line);font-size:17px;color:var(--ink)}
  .site.nav-open .links a{padding:13px 0;border-bottom:1px solid var(--line)}
  .hero{padding-top:44px}
  .hero-in{grid-template-columns:minmax(0,1fr);gap:44px}
  .hc{justify-self:stretch;max-width:none}
  .s-luxe .hc{aspect-ratio:16/10}
  .hstats{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:52px}
  .hstat{padding:20px 16px}
  .hstat:nth-child(odd){border-left:0;padding-left:0}
  .hstat:nth-child(n+3){border-top:1px solid var(--line)}
  .sec{padding:76px 0}
  .sec-head{grid-template-columns:minmax(0,1fr);margin-bottom:40px}
  .grid{--cols:2 !important}
  .about,.contact,.faq{grid-template-columns:minmax(0,1fr);gap:40px}
  .menu{grid-template-columns:minmax(0,1fr)}
  .cta-box{grid-template-columns:minmax(0,1fr);padding:44px}
  .cta-box .cta-row{justify-content:flex-start}
  .foot-grid{grid-template-columns:1fr 1fr}
  .gal{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:180px}
}
@container (max-width: 600px){
  .wrap{padding-left:max(18px,env(safe-area-inset-left,0px));padding-right:max(18px,env(safe-area-inset-right,0px))}
  .nav-act > .btn{display:none}
  .brand{font-size:18.5px}
  .mark{width:38px;height:38px}
  .hero h1{font-size:clamp(36px,10.5cqi,52px)}
  .s-bold .hero h1{font-size:clamp(40px,12cqi,60px)}
  .lead{font-size:16.5px}
  .btn{min-height:50px;padding:0 20px}
  .cta-row .btn{flex:1 1 auto}
  .hc,.s-luxe .hc{aspect-ratio:auto;grid-template-columns:minmax(0,1fr);grid-template-rows:auto;gap:10px}
  .hc-panel,.s-luxe .hc-panel{grid-column:1;grid-row:auto;aspect-ratio:4/3;min-height:0}
  .hc-tile{padding:14px 16px}
  .grid{--cols:1 !important}
  .form{grid-template-columns:minmax(0,1fr);padding:22px}
  .h2{font-size:clamp(30px,8.6cqi,40px)}
  .cta-box{padding:32px 24px}
  .foot-grid{grid-template-columns:1fr}
  .gal{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-auto-rows:140px}
  .pay{flex-direction:column;align-items:flex-start}
  .s-bold .hc-tile,.s-bold .svc,.s-bold .card,.s-bold .person,.s-bold .plan,.s-bold .rev,.s-bold .form,.s-bold .pay{box-shadow:4px 4px 0 var(--ink)}
  .wa-float{width:54px;height:54px}
}
@media (prefers-reduced-motion: reduce){.site *{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
`;

function siteCSS(s){
  const v = siteVars(s);
  const vars = {
    '--p':v.p, '--a':v.a, '--bg':v.bg, '--ink':v.ink, '--card':v.card, '--soft':v.soft, '--softA':v.softA,
    '--line':v.line, '--line2':v.line2, '--muted':v.muted, '--pText':v.pText, '--pTextCard':v.pTextCard,
    '--onP':v.onP, '--onA':v.onA, '--aOnP':v.aOnP, '--footBg':v.footBg, '--footInk':v.footInk, '--footLine':rgba(v.footInk,.14),
    '--t0a':v.t0a, '--t0b':v.t0b, '--t1a':v.t1a, '--t1b':v.t1b, '--t2a':v.t2a, '--t2b':v.t2b,
    '--g1':v.g1, '--g2':v.g2, '--g3':v.g3, '--g4':v.g4, '--panelInk':v.panelInk, '--ringLine':rgba(v.dark ? '#FFFFFF' : v.p, v.dark ? .07 : .12),
    '--ctaLine':rgba(v.onP, .12), '--hotBg':v.dark ? mix(v.card, v.p, .35) : mix(v.ink, v.p, .3), '--hotInk':v.dark ? v.ink : '#FFFFFF',
    '--navBg':rgba(v.bg,.84), '--dot':rgba(v.p, v.dark ? .3 : .16), '--ring':rgba(v.p,.18), '--ringA':rgba(v.a,.28),
    '--glow':rgba(v.p, v.dark ? .28 : .12), '--shadow':v.dark ? 'rgba(0,0,0,.65)' : rgba(mix(v.ink, v.p, .3), .32), '--shadowD':v.dark ? 'rgba(0,0,0,.7)' : rgba(mix(v.ink, v.p, .35), .4), '--shadowP':rgba(v.p, .6),
    '--r':v.r, '--rb':v.rb, '--hf':v.hf, '--bf':v.bf, '--hw':v.hw, '--hls':v.hls, '--hls2':v.hls2
  };
  return '.site{' + Object.entries(vars).map(([k,val]) => k + ':' + val).join(';') + '}' + SITE_CSS;
}

/* ================= WEBSITE HTML ================= */
function initials(n){ return String(n).replace(/^(Dr|Adv|Mr|Mrs|Ms|Prof|Col|Shri|Smt)\.?\s+/i,'').split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).slice(0,2).map(w => w[0].toUpperCase()).join('') || '•'; }
const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L3.4 9.7l6-.7z"/></svg>';
const SHOW_ID = {people:'team', cards:'collection', menu:'menu', plans:'plans'};
function digitsOf(p){ let d = String(p || '').replace(/\D/g, ''); if (d.length === 10) d = '91' + d; if (d.length === 11 && d[0] === '0') d = '91' + d.slice(1); return d; }
function heroTitle(t){
  t = String(t || '').trim();
  const m = t.match(/^(.{6,}?[,.:–—])\s+(.+)$/);
  if (m && m[2].split(/\s+/).length <= 6) return esc(m[1]) + ' <em>' + esc(m[2]) + '</em>';
  const w = t.split(/\s+/); if (w.length < 3) return esc(t);
  const k = w.length > 6 ? 3 : 2;
  return esc(w.slice(0, -k).join(' ')) + ' <em>' + esc(w.slice(-k).join(' ')) + '</em>';
}
function colsFor(n){ return n % 3 === 0 ? 3 : n === 4 ? 4 : n === 2 ? 2 : n === 1 ? 1 : 3; }
function defaultFaq(s){
  const out = [];
  if (s.address) out.push({q:'Where are you located?', a:s.address + (s.city && s.address.indexOf(s.city) < 0 ? ', ' + s.city : '') + '. Tap “Open in Google Maps” in the contact section for directions.'});
  if (s.hours) out.push({q:'What are your timings?', a:s.hours + '.'});
  out.push({q:'How do I ' + (/order|bag|shop/i.test(s.hero.cta) ? 'place an order' : 'book') + '?', a:'Use the “' + s.form.title + '” form on this page, or message us on WhatsApp' + (s.phone ? ' at ' + s.phone : '') + '. We confirm quickly.'});
  out.push({q:'Which payment methods do you accept?', a:'Cash, UPI (Google Pay, PhonePe, Paytm) and all major debit and credit cards.'});
  return out;
}
function heroCollage(s){
  const it = (s.show.items || [])[0], t = s.show.type, chips = (s.chips || []).filter(Boolean);
  let feat = '';
  if (it && t === 'people') feat = '<div class="hc-tile hc-feat"><div class="hf-row"><span class="hf-pic avatar av0">' + esc(initials(it.t)) + '</span><div><p class="hf-k">' + esc(s.show.title) + '</p><h4>' + esc(it.t) + '</h4><small>' + esc(it.m) + '</small></div></div>' + (it.p ? '<p class="hf-time">' + ico('clock') + esc(it.p) + '</p>' : '') + '</div>';
  else if (it && t === 'menu') feat = '<div class="hc-tile hc-feat"><p class="hf-k">' + esc(s.show.title) + '</p><ul class="mc-menu">' + s.show.items.slice(0, 2).map(x => '<li><span>' + esc(x.t) + '</span><b>' + esc(x.p) + '</b></li>').join('') + '</ul></div>';
  else if (it && t === 'plans') { const hp = s.show.items.find(x => /popular|most|best/i.test(x.tag || '')) || it; feat = '<div class="hc-tile hc-feat"><p class="hf-k">' + esc(hp.tag || s.show.title) + '</p><h4>' + esc(hp.t) + '</h4><span class="price">' + esc(hp.p) + '</span></div>'; }
  else if (it) feat = '<div class="hc-tile hc-feat"><div class="hf-row"><span class="hf-pic">' + (it.img ? '<img src="' + it.img + '" alt="' + esc(it.t) + '">' : ico(s.show.icon || s.icon)) + '</span><div><p class="hf-k">' + esc(s.show.title) + '</p><h4>' + esc(it.t) + '</h4>' + (it.p ? '<span class="price">' + esc(it.p) + '</span>' : '') + '</div></div></div>';
  const info = chips.length ? '<div class="hc-tile hc-info"><ul>' + chips.slice(0, 2).map(c => '<li>' + ico('check') + '<span>' + esc(c) + '</span></li>').join('') + '</ul></div>'
    : s.hours ? '<div class="hc-tile hc-info"><ul><li>' + ico('clock') + '<span>' + esc(s.hours) + '</span></li></ul></div>' : '';
  const panel = '<div class="hc-panel">' + (s.image ? '<img src="' + s.image + '" alt="' + esc(s.name) + '">' : '<div class="hc-icon">' + ico(s.icon) + '</div>') + '</div>';
  const tiles = feat && info ? feat + info : (feat || info) ? (feat || info).replace('class="hc-tile', 'style="grid-column:1/-1" class="hc-tile') : '';
  return '<div class="hc' + (tiles ? '' : ' solo') + '">' + panel + tiles + '</div>';
}
function siteHTML(s){
  const sec = s.sections, sid = SHOW_ID[s.show.type] || 'collection', items = s.show.items || [];
  const faq = s.faq || defaultFaq(s), gallery = s.gallery || [];
  const has = {stats: sec.stats && s.stats.length, services: sec.services && s.services.items.length, show: sec.show && items.length, about: sec.about,
    reviews: sec.reviews && s.reviews.length, faq: sec.faq !== false && faq.length, gallery: sec.gallery !== false && gallery.length, contact: sec.contact, cta: sec.cta !== false};
  const wa = s.whatsapp !== false ? digitsOf(s.phone) : '', waOk = wa.length >= 11;
  const links = [];
  if (has.services) links.push(['services', s.services.title]);
  if (has.show) links.push([sid, s.show.title]);
  if (has.about) links.push(['about', 'About']);
  if (has.faq) links.push(['faq', 'FAQ']);
  if (has.contact) links.push(['contact', 'Contact']);
  const ctaHref = has.contact ? '#contact' : '#' + sid;
  const cart = !!(s.show.cart && has.show);
  const h = [];
  h.push('<div class="site s-' + s.style + '">');
  h.push('<header class="nav"><div class="wrap nav-in"><a class="brand" href="#top"><span class="mark">' + ico(s.icon) + '</span><span>' + esc(s.name) + '</span></a>');
  h.push('<nav class="links" aria-label="Main">' + links.slice(0, 5).map(l => '<a href="#' + l[0] + '">' + esc(l[1]) + '</a>').join('') + '</nav>');
  h.push('<div class="nav-act">' + (s.phone ? '<a class="call" href="tel:' + esc(String(s.phone).replace(/[^\d+]/g, '')) + '">' + ico('phone') + esc(s.phone) + '</a>' : '') + (cart ? '<button class="bag" type="button" data-bag aria-label="Your bag">' + ico('bag') + '<b data-count>0</b></button>' : '') + '<a class="btn btn-p btn-sm" href="' + ctaHref + '">' + esc(s.hero.cta) + '</a><button class="burger" type="button" data-burger aria-label="Menu">' + ico('menu') + '</button></div></div></header>');
  const rating = (s.stats || []).find(x => /★|rating/i.test(x.v + ' ' + x.l));
  const revNames = (s.reviews || []).map(r => r.n).filter(Boolean).slice(0, 3);
  h.push('<section class="hero" id="top"><div class="wrap"><div class="hero-in"><div class="hero-copy">');
  if (s.hero.eyebrow) h.push('<p class="pill"><i></i>' + esc(s.hero.eyebrow) + '</p>');
  h.push('<h1>' + heroTitle(s.hero.title) + '</h1><p class="lead">' + esc(s.hero.sub) + '</p>');
  h.push('<div class="cta-row"><a class="btn btn-p" href="' + ctaHref + '">' + esc(s.hero.cta) + ico('right') + '</a>' + (s.hero.cta2 && has.show ? '<a class="btn btn-g" href="#' + sid + '">' + esc(s.hero.cta2) + '</a>' : waOk ? '<a class="btn btn-g" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">' + ico('wa') + 'WhatsApp us</a>' : '') + '</div>');
  if (revNames.length && has.reviews) h.push('<div class="trust"><div class="avs">' + revNames.map((n, i) => '<span class="av' + (i % 3) + '">' + esc(initials(n)) + '</span>').join('') + '</div><div>' + (rating ? '<div class="stars">' + STAR.repeat(5) + '</div><span><b>' + esc(rating.v) + '</b> ' + esc(rating.l) + '</span>' : '<span><b>Loved by customers</b>' + (s.city ? ' across ' + esc(s.city) : '') + '</span>') + '</div></div>');
  h.push('</div>' + heroCollage(s) + '</div>');
  if (has.stats) h.push('<div class="hstats">' + s.stats.slice(0, 4).map(x => '<div class="hstat"><b>' + esc(x.v) + '</b><span>' + esc(x.l) + '</span></div>').join('') + '</div>');
  else h.push('<div style="height:72px"></div>');
  h.push('</div></section>');
  if (has.services && s.services.items.length >= 3) { const words = s.services.items.map(x => '<span>' + esc(x.t) + '</span>').join(''); h.push('<div class="marq" aria-hidden="true"><div class="marq-in">' + words + words + words + words + '</div></div>'); }
  if (has.services) {
    h.push('<section class="sec" id="services"><div class="wrap"><div class="sec-head"><div><p class="kicker">What we do</p><h2 class="h2">' + esc(s.services.title) + '</h2></div><p>' + esc(s.services.sub || s.tagline) + '</p></div>');
    h.push('<div class="grid" style="--cols:' + colsFor(s.services.items.length) + '">' + s.services.items.map(x => '<article class="svc"><div class="si">' + ico(x.i || s.icon) + '</div><h3>' + esc(x.t) + '</h3><p>' + esc(x.d) + '</p></article>').join('') + '</div></div></section>');
  }
  if (has.show) {
    const t = s.show.type;
    h.push('<section class="sec sec-alt" id="' + sid + '"><div class="wrap"><div class="sec-head"><div><p class="kicker">' + esc({people:'The team', cards:'Take a look', menu:'Price list', plans:'Plans'}[t] || 'Take a look') + '</p><h2 class="h2">' + esc(s.show.title) + '</h2></div>' + (s.show.sub ? '<p>' + esc(s.show.sub) + '</p>' : '') + '</div>');
    if (t === 'people') h.push('<div class="grid" style="--cols:' + colsFor(items.length) + '">' + items.map((x, i) => '<article class="person"><div class="avatar av' + (i % 3) + '">' + esc(initials(x.t)) + '</div><h3>' + esc(x.t) + '</h3><p class="role">' + esc(x.m) + '</p>' + (x.p ? '<p class="time">' + ico('clock') + esc(x.p) + '</p>' : '') + (s.show.btn && has.contact ? '<a class="lnk" href="#contact" data-pick="' + esc(x.t) + '">' + esc(s.show.btn) + ico('right') + '</a>' : '') + '</article>').join('') + '</div>');
    else if (t === 'menu') h.push('<div class="menu">' + items.map(x => '<div class="mi"><div class="mi-top"><h3>' + esc(x.t) + (x.tag ? '<em>' + esc(x.tag) + '</em>' : '') + '</h3><span class="dots"></span><span class="price">' + esc(x.p) + '</span></div>' + (x.m ? '<p>' + esc(x.m) + '</p>' : '') + '</div>').join('') + '</div>');
    else if (t === 'plans') {
      let hot = items.findIndex(x => /popular|most|recommended|best/i.test(x.tag || '')); if (hot < 0) hot = items.length === 3 ? 1 : -1;
      h.push('<div class="grid" style="--cols:' + Math.min(4, items.length) + '">' + items.map((x, i) => '<article class="plan' + (i === hot ? ' hot' : '') + '">' + (x.tag ? '<span class="badge">' + esc(x.tag) + '</span>' : '') + '<h3>' + esc(x.t) + '</h3><div class="amt">' + esc(x.p) + '</div><ul>' + String(x.m || '').split(',').map(f => f.trim()).filter(Boolean).map(f => '<li>' + ico('check') + '<span>' + esc(f) + '</span></li>').join('') + '</ul>' + (s.show.btn ? '<a class="btn ' + (i === hot ? 'btn-p' : 'btn-g') + '" href="' + ctaHref + '" data-pick="' + esc(x.t) + '">' + esc(s.show.btn) + '</a>' : '') + '</article>').join('') + '</div>');
    } else h.push('<div class="grid" style="--cols:' + colsFor(items.length) + '">' + items.map((x, i) => '<article class="card"><div class="tile t' + (i % 3) + '">' + (x.img ? '<img src="' + x.img + '" alt="' + esc(x.t) + '" loading="lazy">' : '<span class="ti">' + ico(s.show.icon || s.icon) + '</span>') + (x.tag ? '<span class="tag">' + esc(x.tag) + '</span>' : '') + '</div><div class="card-b"><h3>' + esc(x.t) + '</h3><p class="meta">' + esc(x.m) + '</p><div class="card-f"><span class="price">' + esc(x.p) + '</span>' + (s.show.btn ? (cart ? '<button class="btn btn-p btn-sm" type="button" data-add data-t="' + esc(x.t) + '" data-p="' + esc(x.p) + '">' + ico('plus') + esc(s.show.btn) + '</button>' : '<a class="btn btn-g btn-sm" href="' + ctaHref + '" data-pick="' + esc(x.t) + '">' + esc(s.show.btn) + '</a>') : '') + '</div></div></article>').join('') + '</div>');
    h.push('</div></section>');
  }
  if (has.about) {
    const pic = gallery[0] || '';
    h.push('<section class="sec" id="about"><div class="wrap about"><div class="about-art"><div class="about-vis">' + (pic ? '<img src="' + pic + '" alt="' + esc(s.name) + '">' : '<div class="hc-icon">' + ico(s.icon) + '</div>') + '</div></div>');
    h.push('<div class="about-text"><p class="kicker">About ' + esc(s.name) + '</p><h2 class="h2">' + esc(s.about.title) + '</h2><p>' + esc(s.about.text) + '</p><ul class="points">' + (s.about.points || []).map(p => '<li class="point"><i>' + ico('check') + '</i><span>' + esc(p) + '</span></li>').join('') + '</ul></div></div></section>');
  }
  if (has.gallery) h.push('<section class="sec sec-alt" id="gallery"><div class="wrap"><div class="sec-head"><div><p class="kicker">Gallery</p><h2 class="h2">A look inside</h2></div></div><div class="gal">' + gallery.slice(0, 7).map((g, i) => '<figure><img src="' + g + '" alt="' + esc(s.name) + ' photo ' + (i + 1) + '" loading="lazy"></figure>').join('') + '</div></div></section>');
  if (has.reviews) {
    h.push('<section class="sec' + (has.gallery ? '' : ' sec-alt') + '" id="reviews"><div class="wrap"><div class="sec-head"><div><p class="kicker">Reviews</p><h2 class="h2">What people say about us</h2></div>' + (rating ? '<p><b>' + esc(rating.v) + '</b> ' + esc(rating.l) + '</p>' : '') + '</div><div class="grid" style="--cols:' + colsFor(s.reviews.length) + '">');
    h.push(s.reviews.map((r, i) => '<figure class="rev"><div class="stars" aria-label="5 out of 5">' + STAR.repeat(5) + '</div><blockquote>' + esc(r.q) + '</blockquote><figcaption class="who"><span class="avatar av' + (i % 3) + '">' + esc(initials(r.n)) + '</span><div><b>' + esc(r.n) + '</b><span>' + esc(r.r) + '</span></div></figcaption></figure>').join(''));
    h.push('</div></div></section>');
  }
  if (has.faq) h.push('<section class="sec" id="faq"><div class="wrap faq"><div class="faq-side"><p class="kicker">Questions</p><h2 class="h2">Good to know</h2><p>Anything else? Call ' + esc(s.phone || 'us') + (waOk ? ' or message us on WhatsApp' : '') + '.</p></div><div>' + faq.map((q, i) => '<details class="qa"' + (i === 0 ? ' open' : '') + '><summary>' + esc(q.q) + '</summary><p>' + esc(q.a) + '</p></details>').join('') + '</div></div></section>');
  if (has.cta) h.push('<section class="cta-band' + (has.faq ? '' : ' sec') + '"><div class="wrap"><div class="cta-box"><div><h2>' + esc((s.ctaBand && s.ctaBand.title) || 'Questions? Talk to a real person.') + '</h2><p>' + esc((s.ctaBand && s.ctaBand.sub) || ((s.phone ? 'Call or WhatsApp ' + s.phone + '. ' : '') + (s.hours ? s.hours.split('·')[0].trim() + '.' : 'We reply quickly.'))) + '</p></div><div class="cta-row"><a class="btn btn-p" href="' + ctaHref + '">' + esc(s.hero.cta) + '</a>' + (waOk ? '<a class="btn btn-g" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">' + ico('wa') + 'WhatsApp</a>' : '') + '</div></div></div></section>');
  if (has.contact) {
    const ff = s.form.fields; const halves = ff.filter(f => f.type !== 'textarea').length; let seen = 0;
    const fieldsHTML = ff.map((f, i) => {
      const id = 'f' + i, name = esc(f.l), req = i < 2 ? ' required' : '';
      let ctl, full = f.type === 'textarea';
      if (!full) { seen++; if (halves % 2 === 1 && seen === halves) full = true; }
      if (f.type === 'textarea') ctl = '<textarea id="' + id + '" name="' + name + '"' + req + '></textarea>';
      else if (f.type.indexOf('select:') === 0) {
        const src = f.type.slice(7), opts = src === 'services' ? s.services.items.map(x => x.t) : src === 'showcase' ? items.map(x => x.t) : src.split(',');
        ctl = '<select id="' + id + '" name="' + name + '"' + req + '><option value="">Choose…</option>' + opts.map(o => '<option>' + esc(String(o).trim()) + '</option>').join('') + '</select>';
      } else {
        const ty = {tel:'tel', date:'date', time:'time', number:'number', email:'email'}[f.type] || 'text';
        ctl = '<input id="' + id + '" name="' + name + '" type="' + ty + '"' + (ty === 'number' ? ' min="1"' : '') + (ty === 'tel' ? ' inputmode="tel" autocomplete="tel"' : '') + (i === 0 ? ' autocomplete="name"' : '') + req + '>';
      }
      return '<label class="fld' + (full ? ' full' : '') + '" for="' + id + '">' + name + ctl + '</label>';
    }).join('');
    const maps = s.address ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.address + (s.city && s.address.indexOf(s.city) < 0 ? ', ' + s.city : '')) : '';
    const upi = upiURL(s.upi, s.name);
    h.push('<section class="sec' + (has.faq || has.cta ? '' : ' sec-alt') + '" id="contact"><div class="wrap contact"><div><p class="kicker">Get in touch</p><h2 class="h2">' + esc(s.form.title) + '</h2><ul class="info">');
    if (s.address) h.push('<li><span class="ii">' + ico('pin') + '</span><div><small>Address</small><b>' + esc(s.address) + '</b></div></li>');
    if (s.phone) h.push('<li><span class="ii">' + ico('phone') + '</span><div><small>Phone</small><b>' + esc(s.phone) + '</b></div></li>');
    if (s.email) h.push('<li><span class="ii">' + ico('mail') + '</span><div><small>Email</small><b>' + esc(s.email) + '</b></div></li>');
    if (s.hours) h.push('<li><span class="ii">' + ico('clock') + '</span><div><small>Hours</small><b>' + esc(s.hours) + '</b></div></li>');
    h.push('</ul><div class="c-acts">' + (waOk ? '<a class="btn btn-w btn-sm" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">' + ico('wa') + 'WhatsApp</a>' : '') + (s.phone ? '<a class="btn btn-g btn-sm" href="tel:' + esc(String(s.phone).replace(/[^\d+]/g, '')) + '">' + ico('phone') + 'Call</a>' : '') + (maps ? '<a class="btn btn-g btn-sm" href="' + maps + '" target="_blank" rel="noopener">' + ico('map') + 'Open in Google Maps</a>' : '') + '</div>');
    if (upi) h.push('<div class="pay"><div class="qr">' + makeQR(upi) + '</div><div><b>Pay online with UPI</b><small>Scan with Google Pay, PhonePe, Paytm or any UPI app.</small><code>' + esc(s.upi) + '</code><br><button class="copy" type="button" data-copy="' + esc(s.upi) + '">Copy UPI ID</button></div></div>');
    h.push('</div><form class="form" data-form novalidate><h3>' + esc(s.form.title) + '</h3>' + fieldsHTML + '<button class="btn btn-p" type="submit">' + esc(s.form.btn || 'Send') + ico('right') + '</button></form></div></section>');
  }
  h.push('<footer class="foot"><div class="wrap"><div class="foot-grid"><div><a class="brand" href="#top"><span class="mark">' + ico(s.icon) + '</span><span>' + esc(s.name) + '</span></a><p style="margin-top:16px;max-width:26em">' + esc(s.tagline) + '</p></div>');
  h.push('<div><h4>Visit</h4><ul>' + (s.address ? '<li>' + esc(s.address) + '</li>' : '') + (s.hours ? '<li>' + esc(s.hours) + '</li>' : '') + '</ul></div>');
  h.push('<div><h4>Contact</h4><ul>' + (s.phone ? '<li>' + esc(s.phone) + '</li>' : '') + (s.email ? '<li>' + esc(s.email) + '</li>' : '') + links.map(l => '<li><a href="#' + l[0] + '">' + esc(l[1]) + '</a></li>').join('') + '</ul></div></div>');
  h.push('<div class="foot-b"><span>© ' + new Date().getFullYear() + ' ' + esc(s.name) + (s.city ? ', ' + esc(s.city) : '') + '</span><a href="#top">Back to top ↑</a></div></div></footer>');
  if (waOk) h.push('<a class="wa-float" href="https://wa.me/' + wa + '?text=' + encodeURIComponent('Hello ' + s.name + ', ') + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + ico('wa') + '</a>');
  h.push('</div>');
  return h.join('');
}

/* Runs inside the generated website (serialised with toString — keep it self-contained). */
function siteBehavior(root, cfg, opts){
  opts = opts || {};
  var scroller = opts.scroller || null, bag = [];
  function go(el){
    var y = el === root ? 0 : el.offsetTop - 76;
    if (scroller) scroller.scrollTo({top: Math.max(0, y), behavior: 'smooth'});
    else window.scrollTo({top: Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 76), behavior: 'smooth'});
  }
  function num(p){ var m = String(p || '').replace(/,/g, '').match(/\d+(\.\d+)?/); return m ? Number(m[0]) : 0; }
  function fillOrder(){
    var ta = root.querySelector('[data-form] textarea'); if (!ta || !bag.length) return;
    var total = 0, lines = bag.map(function(b){ total += num(b.p); return '- ' + b.t + (b.p ? ' (' + b.p + ')' : ''); });
    ta.value = 'Order:\n' + lines.join('\n') + (total ? '\nTotal: ₹' + total.toLocaleString('en-IN') : '');
  }
  root.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="#"]');
    if (a) {
      var id = a.getAttribute('href').slice(1), t = id === 'top' ? root : root.querySelector('#' + id);
      e.preventDefault(); root.classList.remove('nav-open');
      if (t) go(t);
      var pick = a.getAttribute('data-pick'), sel = pick && root.querySelector('[data-form] select');
      if (sel) { for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === pick) sel.selectedIndex = i; }
      return;
    }
    if (e.target.closest('[data-burger]')) { root.classList.toggle('nav-open'); return; }
    var add = e.target.closest('[data-add]');
    if (add) {
      bag.push({t: add.getAttribute('data-t'), p: add.getAttribute('data-p')});
      var b = root.querySelector('[data-count]'); if (b) b.textContent = bag.length;
      var old = add.innerHTML; add.textContent = 'Added ✓'; add.disabled = true; fillOrder();
      setTimeout(function(){ add.innerHTML = old; add.disabled = false; }, 1200);
      return;
    }
    if (e.target.closest('[data-bag]')) { fillOrder(); var c = root.querySelector('#contact'); if (c) go(c); return; }
    var cp = e.target.closest('[data-copy]');
    if (cp) { var v = cp.getAttribute('data-copy'); try { navigator.clipboard.writeText(v).then(function(){ cp.textContent = 'Copied ✓'; }, function(){ cp.textContent = v; }); } catch (err) { cp.textContent = v; } }
  });
  var form = root.querySelector('[data-form]');
  if (form) form.addEventListener('submit', function(e){
    e.preventDefault();
    var fields = form.querySelectorAll('input,select,textarea'), lines = [], name = '', phone = '', bad = null;
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i], v = (f.value || '').trim();
      f.removeAttribute('aria-invalid');
      if (f.required && !v && !bad) bad = f;
      if (v) lines.push(f.name + ': ' + v);
      if (i === 0) name = v; if (f.type === 'tel') phone = v;
    }
    if (bad) { bad.focus(); bad.setAttribute('aria-invalid', 'true'); return; }
    var msg = 'Hello ' + cfg.name + ',\n' + lines.join('\n');
    var d = String(cfg.phone || '').replace(/\D/g, ''); if (d.length === 10) d = '91' + d;
    var wa = cfg.whatsapp && d.length >= 11 ? 'https://wa.me/' + d + '?text=' + encodeURIComponent(msg) : '';
    var safe = function(x){ return String(x).replace(/[<>&"]/g, ''); };
    var ok = document.createElement('div'); ok.className = 'form-ok'; ok.setAttribute('role', 'status');
    ok.innerHTML = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><div><b>Almost done' + (name ? ', ' + safe(name) : '') + '.</b><br>' + (wa ? 'Tap below to send your details to us on WhatsApp. We reply quickly.<br><a class="btn btn-w btn-sm" href="' + wa + '" target="_blank" rel="noopener">Send on WhatsApp</a>' : 'We will call you back' + (phone ? ' on ' + safe(phone) : '') + ' shortly.') + '</div>';
    var prev = form.querySelector('.form-ok'); if (prev) prev.remove();
    form.appendChild(ok);
  });
}
