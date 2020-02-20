// @flow
import fs from 'fs'
import generateBMFont from 'msdf-bmfont-xml'
import serialize from './serialize'

// find all options here: https://github.com/soimy/msdf-bmfont-xml#api
export type Options = {
  compress?: boolean,
  textureSize: [number, number],
  fontSize: number
}

export type Font = {
  name: string,
  file: string
}

const DEFAULT_OPTIONS = {
  outputType: 'json',
  fieldType: 'sdf',
  textureSize: [175, 175],
  fontSize: 21
}

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

function buildFont (input: Font, opts: Options): Promise {
  return new Promise((resolve, reject) => {
    generateBMFont(input.file, opts, (error, textures, font) => {
      if (error) reject(error)
      // prep font
      const instructionSet = JSON.parse(font.data)
      // prep textures
      textures = textures.map((texture, i) => {
        return {
          id: i,
          data: texture.texture
        }
      })
      // send back
      resolve({ instructionSet, textures, name: input.name })
    })
  })
}
