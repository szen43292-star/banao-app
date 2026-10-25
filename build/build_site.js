// Assembles the Banao download website in ../site (for Netlify).
// It offers files to download; it does not run Banao in the browser.
// Usage: node build_app.js && sh ../windows/build.sh && node build_site.js
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const sharp = require('sharp');
const R = path.join(__dirname, '..'), SITE = path.join(R, 'site'), WWW = path.join(R, 'www'), SRC = path.join(R, 'site-src');
const VERSION = process.env.BANAO_VERSION || '1.0.0';
const DATE = new Date().toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Kolkata'});
const cp = (a, b) => { fs.mkdirSync(path.dirname(b), {recursive:true}); fs.copyFileSync(a, b); };
const sha = buf => crypto.createHash('sha256').update(buf).digest('hex');
const size = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';

fs.rmSync(SITE, {recursive:true, force:true});
fs.mkdirSync(path.join(SITE, 'downloads'), {recursive:true});

/* fonts for the page itself: the three Banao families only */
const FAM = /^(bricolage-grotesque|hanken-grotesk|jetbrains-mono)-/;
const allCss = fs.readFileSync(path.join(WWW, 'fonts', 'fonts.css'), 'utf8');
const blocks = allCss.split('/*').slice(1).map(b => '/*' + b).filter(b => FAM.test(b.slice(3).trim()));
let pageFontCss = '/* Fonts from Fontsource (SIL Open Font License) */\n';
for (const b of blocks) {
  const file = (b.match(/url\(files\/([^)]+)\)/) || [])[1]; if (!file) continue;
  cp(path.join(WWW, 'fonts', 'files', file), path.join(SITE, 'fonts', 'files', file));
  pageFontCss += b;
}
fs.writeFileSync(path.join(SITE, 'fonts', 'fonts.css'), pageFontCss);

/* Banao.html: the whole builder in one file for Mac, Linux and Chromebook, with its own fonts inside */
let one = fs.readFileSync(path.join(WWW, 'index.html'), 'utf8');
const inlineFonts = blocks.map(b => b.replace(/url\(files\/([^)]+)\)/, (m, f) => 'url(data:font/woff2;base64,' + fs.readFileSync(path.join(WWW, 'fonts', 'files', f)).toString('base64') + ')')).join('');
const iconData = 'data:image/png;base64,' + fs.readFileSync(path.join(WWW, 'icon-192.png')).toString('base64');
one = one.replace('<link rel="icon" href="icon-192.png">', '<link rel="icon" href="' + iconData + '">')
         .replace('<link rel="stylesheet" href="fonts/fonts.css">', '<style>' + inlineFonts + '</style>');
if (/href="fonts\/|href="icon-192/.test(one)) throw new Error('Banao.html still points at local files');
fs.writeFileSync(path.join(SITE, 'downloads', 'Banao.html'), one);

/* Windows */
const exePath = path.join(R, 'windows', 'Banao.exe');
if (!fs.existsSync(exePath)) throw new Error('windows/Banao.exe not found: run sh windows/build.sh first');
cp(exePath, path.join(SITE, 'downloads', 'Banao.exe'));
/* Android and iPhone builds are picked up automatically when they exist */
const EXTRA = path.join(R, 'downloads-extra');
if (fs.existsSync(path.join(EXTRA, 'Banao.apk'))) cp(path.join(EXTRA, 'Banao.apk'), path.join(SITE, 'downloads', 'Banao.apk'));
if (fs.existsSync(path.join(EXTRA, 'Banao-unsigned.ipa'))) cp(path.join(EXTRA, 'Banao-unsigned.ipa'), path.join(SITE, 'downloads', 'Banao.ipa'));

const exe = fs.readFileSync(path.join(SITE, 'downloads', 'Banao.exe')), html1 = fs.readFileSync(path.join(SITE, 'downloads', 'Banao.html'));
const vars = {VERSION, DATE, EXE_SIZE:size(exe.length), EXE_SHA:sha(exe), HTML_SIZE:size(html1.length), HTML_SHA:sha(html1)};

(async () => {
  let page = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8').replace(/\{\{(\w+)\}\}/g, (m, k) => { if (!(k in vars)) throw new Error('unknown placeholder ' + k); return vars[k]; });
  fs.writeFileSync(path.join(SITE, 'index.html'), page);
  cp(path.join(SRC, '404.html'), path.join(SITE, '404.html'));
  for (const f of ['studio-editor.webp', 'phone-editor.webp', 'site-hospital.webp', 'site-shoes.webp', 'site-restaurant.webp', 'site-hotel.webp', 'site-gym.webp', 'site-cafe.webp', 'soft-pharmacy.webp', 'soft-pos.webp', 'soft-invoice.webp']) cp(path.join(SRC, 'shots', f), path.join(SITE, 'shots', f));
  if (fs.existsSync(path.join(SRC, 'og.png'))) cp(path.join(SRC, 'og.png'), path.join(SITE, 'og.png'));
  cp(path.join(R, 'icons', 'icon-32.png'), path.join(SITE, 'favicon-32.png'));
  cp(path.join(R, 'icons', 'icon-192.png'), path.join(SITE, 'icon-192.png'));
  cp(path.join(R, 'icons', 'banao.ico'), path.join(SITE, 'favicon.ico'));
  await sharp(path.join(R, 'icons', 'icon-1024-square.png')).resize(180, 180).png().toFile(path.join(SITE, 'apple-touch-icon.png'));
  fs.writeFileSync(path.join(SITE, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/shots/*
  Cache-Control: public, max-age=604800

/downloads/*
  Content-Disposition: attachment
  Cache-Control: no-cache

/downloads/Banao.apk
  Content-Type: application/vnd.android.package-archive
  Content-Disposition: attachment

/downloads/Banao.ipa
  Content-Type: application/octet-stream
  Content-Disposition: attachment
`);
  fs.writeFileSync(path.join(SITE, '_redirects'), '/windows  /downloads/Banao.exe  302\n/mac  /downloads/Banao.html  302\n/download  /#download  302\n/app/*  /  301\n');
  fs.writeFileSync(path.join(SITE, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  fs.writeFileSync(path.join(SITE, 'netlify.toml'), '# Netlify serves this folder as it is; there is nothing to build.\n[build]\n  publish = "."\n');
  const walk = d => fs.readdirSync(d, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const all = walk(SITE);
  console.log('download site built:', all.length, 'files,', size(all.reduce((a, f) => a + fs.statSync(f).size, 0)), '| exe', vars.EXE_SIZE, '| html', vars.HTML_SIZE);
})();
