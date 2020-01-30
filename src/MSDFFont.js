// @flow
import Protobuf from 'pbf'

export type Info = {
  size: number,
  bold?: boolean,
  italic?: boolean,
  smooth?: boolean,
  aa?: boolean,
  padding: [number, number, number, number],
  lineHeight: number,
  base: number,
  scaleW: number,
  scaleH: number,
  pages: number
}

export type Char = {
  id: number,
  index: number,
  char: string,
  width: number,
  height: number,
  xoffset: number,
  yoffset: number,
  xadvance: number,
  chnl: number,
  x: number,
  y: number,
  page: number
}

export type Kerning = {
  first: number,
  second: number,
  amount: number
}

export type Texture = {
  id: number,
  data: Uint8ClampedArray
}

export default class MSDFFont {
  info: Info
  name: string
  chars: { [string]: Char } = {}
  kernings: { [string | number]: { [string | number]: number } } = {} // { first: { second: number } }
  textures: { [string | number]: Uint8ClampedArray } = {}
  constructor (pbf: Protobuf, end: number) {
    pbf.readFields(this.readFont, this, end)
  }

  readFont (tag: number, font: MSDFFont, pbf: Protobuf) {
    if (tag === 1) {
      const info = { padding: [0, 0, 0, 0], spacing: [0, 0] }
      pbf.readFields(font.parseInfo, info, pbf.readVarint() + pbf.pos)
      font.info = info
    } else if (tag === 2) font.name = pbf.readString()
    else if (tag === 3) {
      const char = {}
      pbf.readFields(font.parseChar, char, pbf.readVarint() + pbf.pos)
      font.chars[char.char] = char
    } else if (tag === 4) {
      const kerning = {}
      pbf.readFields(font.parseKerning, kerning, pbf.readVarint() + pbf.pos)
      if (!font.kernings[kerning.first]) font.kernings[kerning.first] = {}
      font.kernings[kerning.first][kerning.second] = kerning.amount
    } else if (tag === 5) {
      const texture = {}
      pbf.readFields(font.parseTexture, texture, pbf.readVarint() + pbf.pos)
      font.textures[texture.id] = texture
    }
  }

  parseInfo (tag: number, info: Info, pbf: Protobuf) {
    if (tag === 1) {
      info.size = pbf.readVarint()
    } else if (tag === 2) {
      info.bold = pbf.readBoolean()
    } else if (tag === 3) {
      info.italic = pbf.readBoolean()
    } else if (tag === 4) {
      info.smooth = pbf.readBoolean()
    } else if (tag === 5) {
      info.aa = pbf.readBoolean()
    } else if (tag === 6) {
      info.padding[0] = pbf.readVarint()
    } else if (tag === 7) {
      info.padding[1] = pbf.readVarint()
    } else if (tag === 8) {
      info.padding[2] = pbf.readVarint()
    } else if (tag === 9) {
      info.padding[3] = pbf.readVarint()
    } else if (tag === 10) {
      info.spacing[0] = pbf.readVarint()
    } else if (tag === 11) {
      info.spacing[1] = pbf.readVarint()
    } else if (tag === 12) {
      info.lineHeight = pbf.readVarint()
    } else if (tag === 13) {
      info.base = pbf.readVarint()
    } else if (tag === 14) {
      info.scaleW = pbf.readVarint()
    } else if (tag === 15) {
      info.scaleH = pbf.readVarint()
    } else if (tag === 16) {
      info.pages = pbf.readVarint()
    }
  }

  parseChar (tag: number, char: Char, pbf: Protobuf) {
    if (tag === 1) {
      char.id = pbf.readVarint()
    } else if (tag === 2) {
      char.index = pbf.readVarint()
    } else if (tag === 3) {
      char.char = pbf.readString()
    } else if (tag === 4) {
      char.width = pbf.readVarint()
    } else if (tag === 5) {
      char.height = pbf.readVarint()
    } else if (tag === 6) {
      char.xoffset = pbf.readSVarint()
    } else if (tag === 7) {
      char.yoffset = pbf.readSVarint()
    } else if (tag === 8) {
      char.xadvance = pbf.readSVarint()
    } else if (tag === 9) {
      char.chnl = pbf.readVarint()
    } else if (tag === 10) {
      char.x = pbf.readVarint()
    } else if (tag === 11) {
      char.y = pbf.readVarint()
    } else if (tag === 12) {
      char.page = pbf.readVarint()
    }
  }

  parseKerning (tag: number, kerning: Kerning, pbf: Protobuf) {
    if (tag === 1) {
      kerning.first = pbf.readVarint()
    } else if (tag === 2) {
      kerning.second = pbf.readVarint()
    } else if (tag === 3) {
      kerning.amount = pbf.readSVarint()
    }
  }

  parseTexture (tag: number, texture: Texture, pbf: Protobuf) {
    if (tag === 1) {
      texture.id = pbf.readVarint()
    } else if (tag === 2) {
      texture.data = pbf.readBytes()
    }
  }
}
