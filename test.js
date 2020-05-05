const buildFonts = require('./lib/buildFonts').default

// const fonts = [
//   { name: 'robotoRegular', file: './testFonts/Roboto-Regular.ttf' },
//   { name: 'robotoMedium', file: './testFonts/Roboto-Medium.ttf' }
// ]
// buildFonts(fonts, './Roboto.pbf', { fontSize: 36, charset: ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' })

// const fonts = [
//   { name: 'default', file: './testFonts/NotoSans-Regular.ttf' }
// ]
// buildFonts(fonts, './default.pbf')

const fonts = [
  { name: 'default', file: './testFonts/arial-unicode-ms.ttf' }
]
buildFonts(fonts, './default.pbf', { fontSize: 36 })

// const fonts = [
//   { name: 'robotoRegular', file: './testFonts/Roboto-Regular.ttf' }
// ]
// buildFonts(fonts, './Roboto.pbf', { charset: 'abc' })
