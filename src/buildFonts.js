// @flow
import fs from 'fs'
import generateBMFont from 'msdf-bmfont-xml'
import opentype from 'opentype.js'
import serialize from './serialize'

// find all options here: https://github.com/soimy/msdf-bmfont-xml#api
export type Options = {
  compress?: boolean,
  textureSize?: [number, number],
  fontSize?: number,
  charset?: string,
  allGlyphs?: boolean,
  texturePadding?: number,
  border?: number,
  fieldType?: 'msdf' | 'sdf' | 'psdf',
  distanceRange?: number,
  roundDecimal?: number,
  vector?: boolean,
  smartSize?: boolean,
  pot?: boolean,
  square?: boolean,
  rot?: boolean,
  rtl?: boolean
}

export type Font = {
  name: string,
  file: string
}

const DEFAULT_OPTIONS = {
  outputType: 'json',
  fieldType: 'msdf',
  fontSize: 42,
  smartSize: true
}

// TODO: Currently this is a terrible solution as it keeps rebuilding the whole font object
// before solving for one charector at a time. For larger fonts it takes FOREVER
// build the WHOLE font, than copy paste chars into their own buffers and reset the x, y before storing...
// TODO: Remove x and y from char. Don't need that if it's always 0 for both o_O

export default function buildFonts (fonts: Array<Font>, out: string, opts?: Options = {}) {
  // merge with default
  opts = { ...DEFAULT_OPTIONS, ...opts }
  if (!opts.compress) opts.compress = false
  // build each font individually at first
  const promises = []
  for (const font of fonts) promises.push(buildFont(font, opts))
  Promise.all(promises)
    .then(msdfs => {
      // serialize
      const pbf = serialize(msdfs, opts.compress)
      // save
      fs.writeFileSync(out, pbf)
    })
    .catch(err => { throw new Error(err) })
}

async function buildFont (input: Font, opts: Options): Promise {
  const msdf = {
    name: input.name,
    scale: opts.fontSize,
    stretchH: 100,
    charSet: []
  }
  // get the total unicode set
  let charset = opts.charset
  if (!charset) charset = buildCharSet(input.file).replace(/(\r\n|\n|\r)/gm, '')
  const charsetLen = charset.length
  let pos = 0

  for (const char of charset) {
    // get data
    const glyph = await generateChar(char, input.file, opts)
    if (glyph) msdf.charSet.push(glyph)
    pos++
    console.log(`"${char}" ${pos}/${charsetLen}`)
  }

  return msdf
}

function generateChar (char: string, inputFile: string, opts: Options): Promise<any, null> {
  const charOptions = JSON.parse(JSON.stringify(opts))
  charOptions.charset = char

  return new Promise((resolve, reject) => {
    generateBMFont(inputFile, charOptions, (error, textures, font) => {
      if (error) resolve(null)
      // parse the instructionSet
      const instructionSet = JSON.parse(font.data)
      // get the char
      const char = instructionSet.chars[0]
      // prep textures
      char.data = textures[0].texture
      // stretchH
      if (instructionSet.info && instructionSet.info.stretchH) char.stretchH = instructionSet.info.stretchH
      else char.stretchH = 0
      // send back
      resolve(char)
    })
  })
}

function buildCharSet (inputFile: string): string {
  const font = opentype.loadSync(inputFile)
  const glyphs = font.glyphs.glyphs

  let charset = ''

  for (const key in glyphs) {
    const glyph = glyphs[key]
    if (glyph.unicode) charset += String.fromCharCode(glyph.unicode)
  }

  return charset
}
