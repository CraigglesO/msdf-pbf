const fs = require('fs')
const zlib = require('zlib')
const MSDF = require('./lib/MSDF').default

const pbfDefault = zlib.gunzipSync(fs.readFileSync('./default.pbf'))
const roboto = zlib.gunzipSync(fs.readFileSync('./Roboto.pbf'))

const msdf = new MSDF()

console.time('build')
const defaultMSDF = new MSDF(pbfDefault)
const robotoMSDF = new MSDF(roboto)
console.timeEnd('build')

msdf.addFonts(defaultMSDF)
msdf.addFonts(robotoMSDF)

console.log('msdf', msdf)
// console.log('default', defaultMSDF)
// console.log('roboto', robotoMSDF)
// const font = msdf.fonts.robotoRegular // robotoMedium
// const font = msdf.fonts.default // robotoMedium
// console.log('font', font)

// const char = font.chars['a']
// const char = font.chars['忐']
// console.log('char', char)

// fs.writeFileSync('./char.png', char.data)
