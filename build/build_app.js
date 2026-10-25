// Builds the app version of Banao (www/) from the Banao sources:
// index.html (standalone), offline fonts, icons and splash images.
// Usage: node build_app.js
const fs = require('fs'), path = require('path');
const sharp = require('sharp');
const SRC = path.join(__dirname, '..', 'src'), OUT = path.join(__dirname, '..', 'www');
const FONTS_DIR = path.join(__dirname, 'node_modules', '@fontsource');

const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const head = read('a_head.html');
const css = head.slice(head.indexOf('<style id="banao-css">') + '<style id="banao-css">'.length, head.indexOf('</style>'));
const bar = head.slice(head.indexOf('<header class="bar" id="banao-bar">'), head.indexOf('</header>') + '</header>'.length);
const fontsHref = (head.match(/<link rel="stylesheet" id="banao-fonts" href="([^"]+)"/) || [])[1];
const js = '\n"use strict";\n' + ['b_data.js','q_qr.js','c_render.js','c2_soft.js','d_engine.js','d2_ai.js','d3_cmd.js','e_ui.js'].map(read).join('');
if (/<\/script/i.test(js)) throw new Error('script contains a closing script tag');

fs.rmSync(OUT, {recursive:true, force:true});
fs.mkdirSync(path.join(OUT, 'fonts', 'files'), {recursive:true});

/* offline fonts: latin + latin-ext faces for the weights Banao and its designs use */
const WANT = {
  'bricolage-grotesque':['600','700','800'], 'hanken-grotesk':['400','500','600','700'], 'jetbrains-mono':['400','500','600'],
  'plus-jakarta-sans':['400','500','700','800'], 'archivo-black':['400'], 'archivo':['400','500','600'],
  'cormorant-garamond':['500','600','700','500-italic'], 'dm-sans':['400','500','700'], 'dm-serif-display':['400'],
  'nunito':['400','600','800'], 'sora':['400','600','700']
};
let fontCss = '/* Fonts bundled from Fontsource (SIL Open Font License) so Banao looks right offline */\n';
let fontBytes = 0;
for (const fam of Object.keys(WANT)) for (const w of WANT[fam]) {
  const f = path.join(FONTS_DIR, fam, w + '.css');
  const txt = fs.readFileSync(f, 'utf8');
  const blocks = txt.split('/*').filter(b => /-latin(-ext)?-[\d]+-(normal|italic) \*\//.test(b));
  for (const b of blocks) {
    const file = (b.match(/url\(\.\/files\/([^)]+\.woff2)\)/) || [])[1];
    if (!file) continue;
    fs.copyFileSync(path.join(FONTS_DIR, fam, 'files', file), path.join(OUT, 'fonts', 'files', file));
    fontBytes += fs.statSync(path.join(OUT, 'fonts', 'files', file)).size;
    fontCss += '/*' + b.replace(/src: url\(\.\/files\/([^)]+\.woff2)\) format\('woff2'\), url\([^)]+\) format\('woff'\);/, "src: url(files/$1) format('woff2');");
  }
}
fs.writeFileSync(path.join(OUT, 'fonts', 'fonts.css'), fontCss);

/* the page */
const html = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#14162B">\n<title>Banao</title>\n<link rel="icon" href="icon-192.png">\n<link rel="stylesheet" href="fonts/fonts.css">\n' +
  (fontsHref ? '<link rel="stylesheet" id="banao-fonts" href="' + fontsHref + '">\n' : '') +
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n' +
  '<style id="banao-css">' + css + '</style>\n</head>\n<body>\n' + bar + '\n<main id="view"></main>\n<div id="modal" hidden></div>\n<div class="toast" id="toast" role="status" aria-live="polite"></div>\n<script>' + js + '</script>\n</body>\n</html>\n';
fs.writeFileSync(path.join(OUT, 'index.html'), html);

/* icons */
const ICON = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="${pad ? 0 : 112}" fill="#14162B"/><g transform="translate(256 262) scale(${pad ? 0.62 : 0.86}) translate(-256 -256)"><rect x="96" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="264" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="180" y="152" width="152" height="112" rx="26" fill="#F2A900"/></g></svg>`;
const FG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g transform="translate(256 262) scale(0.55) translate(-256 -256)"><rect x="96" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="264" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="180" y="152" width="152" height="112" rx="26" fill="#F2A900"/></g></svg>`;
const SPLASH = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#14162B"/><g transform="translate(${w / 2} ${h / 2}) scale(${Math.min(w, h) / 1400}) translate(-256 -256)"><rect x="96" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="264" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="180" y="152" width="152" height="112" rx="26" fill="#F2A900"/></g></svg>`;
(async () => {
  const ICONS = path.join(__dirname, '..', 'icons'); fs.mkdirSync(ICONS, {recursive:true});
  for (const s of [16, 24, 32, 48, 64, 128, 192, 256, 512]) await sharp(Buffer.from(ICON(false))).resize(s, s).png().toFile(path.join(ICONS, 'icon-' + s + '.png'));
  await sharp(Buffer.from(ICON(true))).resize(1024, 1024).flatten({background:'#14162B'}).png().toFile(path.join(ICONS, 'icon-1024-square.png'));
  await sharp(Buffer.from(FG)).resize(432, 432).png().toFile(path.join(ICONS, 'foreground-432.png'));
  await sharp(Buffer.from(SPLASH(2732, 2732))).png().toFile(path.join(ICONS, 'splash-2732.png'));
  fs.copyFileSync(path.join(ICONS, 'icon-192.png'), path.join(OUT, 'icon-192.png'));
  fs.copyFileSync(path.join(ICONS, 'icon-512.png'), path.join(OUT, 'icon-512.png'));
  // Windows .ico with PNG entries
  const sizes = [16, 24, 32, 48, 64, 128, 256], imgs = sizes.map(s => fs.readFileSync(path.join(ICONS, 'icon-' + s + '.png')));
  const hdr = Buffer.alloc(6 + 16 * sizes.length); hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(sizes.length, 4);
  let off = hdr.length;
  sizes.forEach((s, i) => { const o = 6 + i * 16; hdr.writeUInt8(s >= 256 ? 0 : s, o); hdr.writeUInt8(s >= 256 ? 0 : s, o + 1); hdr.writeUInt8(0, o + 2); hdr.writeUInt8(0, o + 3); hdr.writeUInt16LE(1, o + 4); hdr.writeUInt16LE(32, o + 6); hdr.writeUInt32LE(imgs[i].length, o + 8); hdr.writeUInt32LE(off, o + 12); off += imgs[i].length; });
  fs.writeFileSync(path.join(ICONS, 'banao.ico'), Buffer.concat([hdr].concat(imgs)));
  console.log('www built:', (fs.statSync(path.join(OUT, 'index.html')).size / 1024 | 0) + 'KB page,', (fontBytes / 1024 | 0) + 'KB fonts,', fs.readdirSync(path.join(OUT, 'fonts', 'files')).length, 'font files');
})();
