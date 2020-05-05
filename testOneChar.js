const generateBMFont = require('msdf-bmfont-xml')

const DEFAULT_OPTIONS = {
  outputType: 'json',
  fieldType: 'msdf',
  fontSize: 24,
  smartSize: true
}

DEFAULT_OPTIONS.charset = 'G'

generateBMFont('./testFonts/NotoSans-Regular.ttf', DEFAULT_OPTIONS, (error, textures, font) => {
  if (error) return console.log('ERROR', error)
  // prep font
  const instructionSet = JSON.parse(font.data)

  // console.log('font', font)
  console.log('textures', textures)
  console.log('instructionSet', instructionSet)
})
