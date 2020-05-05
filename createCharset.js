const fs = require('fs')
const opentype = require('opentype.js')

const font = opentype.loadSync('./testFonts/NotoSans-Regular.ttf')
const glyphs = font.glyphs.glyphs

let charset = ''

for (const key in glyphs) {
  const glyph = glyphs[key]
  if (glyph.unicode) charset += String.fromCharCode(glyph.unicode)
}

fs.writeFileSync('./charset.txt', charset)
