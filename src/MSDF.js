// @flow
import MSDFFont from './MSDFFont'
import Protobuf from 'pbf'

type Fonts = {
  [string]: MSDFFont
}

export default class MSDF {
  version: number = 1
  fonts: Fonts = {}
  constructor (data: Buffer, end?: number = 0) {
    if (data) this._buildFonts(data, end)
  }

  _buildFonts (buffer: Buffer, end: number) {
    const pbf = new Protobuf(buffer)
    pbf.readFields(this.readData, this, end)
  }

  readData (tag: number, msdf: MSDF, pbf: Protobuf) {
    if (tag === 15) {
      msdf.version = pbf.readVarint()
    } else if (tag === 1) {
      const font: MSDFFont = new MSDFFont(pbf, pbf.readVarint() + pbf.pos)
      msdf.fonts[font.name] = font
    }
  }

  addFonts (msdf: MSDF) {
    for (const name in msdf.fonts) this.fonts[name] = msdf.fonts[name]
  }
}
