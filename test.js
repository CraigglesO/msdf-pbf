const buildFonts = require('./lib/buildFonts').default

const fonts = [
  { name: 'robotoRegular', file: './testFonts/Roboto-Regular.ttf' },
  { name: 'robotoMedium', file: './testFonts/Roboto-Medium.ttf' }
]

buildFonts(fonts, './fontPack.pbf', { compress: true })
