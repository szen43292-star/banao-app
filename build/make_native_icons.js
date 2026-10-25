// Writes Banao icons and splash screens into the generated Android and iOS projects.
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const M = path.join(__dirname, '..', 'mobile');
const BR = '<rect x="96" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="264" y="280" width="152" height="112" rx="26" fill="#F2A900"/><rect x="180" y="152" width="152" height="112" rx="26" fill="#F2A900"/>';
const full = (round) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${round ? '<circle cx="256" cy="256" r="256" fill="#14162B"/>' : '<rect width="512" height="512" rx="96" fill="#14162B"/>'}<g transform="translate(256 262) scale(${round ? .78 : .86}) translate(-256 -256)">${BR}</g></svg>`;
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#14162B"/><g transform="translate(256 262) scale(.7) translate(-256 -256)">${BR}</g></svg>`;
const fg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g transform="translate(256 262) scale(.55) translate(-256 -256)">${BR}</g></svg>`;
const splash = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#14162B"/><g transform="translate(${w / 2} ${h / 2}) scale(${Math.min(w, h) / 1500}) translate(-256 -256)">${BR}</g></svg>`;
(async () => {
  const res = path.join(M, 'android/app/src/main/res');
  for (const d of fs.readdirSync(res)) {
    const dir = path.join(res, d);
    for (const f of fs.readdirSync(dir)) {
      const file = path.join(dir, f); if (!f.endsWith('.png')) continue;
      const {width, height} = await sharp(file).metadata();
      let svg = f === 'ic_launcher.png' ? full(false) : f === 'ic_launcher_round.png' ? full(true) : f === 'ic_launcher_foreground.png' ? fg : f === 'splash.png' ? splash(width, height) : null;
      if (!svg) continue;
      await sharp(Buffer.from(svg)).resize(width, height).png().toFile(file + '.tmp'); fs.renameSync(file + '.tmp', file);
    }
  }
  fs.writeFileSync(path.join(res, 'values/ic_launcher_background.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#14162B</color>\n</resources>\n');
  const ios = path.join(M, 'ios/App/App/Assets.xcassets');
  await sharp(Buffer.from(square)).resize(1024, 1024).flatten({background:'#14162B'}).removeAlpha().png().toFile(path.join(ios, 'AppIcon.appiconset/AppIcon-512@2x.png'));
  for (const f of fs.readdirSync(path.join(ios, 'Splash.imageset')).filter(x => x.endsWith('.png'))) await sharp(Buffer.from(splash(2732, 2732))).png().toFile(path.join(ios, 'Splash.imageset', f));
  console.log('icons and splash screens written');
})();
