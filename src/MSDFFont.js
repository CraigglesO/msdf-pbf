// @flow
import Protobuf from 'pbf'

export type Font = {
  name: string,
  scale: number,
  charSet: Array<Char>
}

export type Char = {
  char: string,
  stretchH: number,
  width: number,
  height: number,
  xoffset: number,
  yoffset: number,
  xadvance: number,
  x: number,
  y: number,
  data: Buffer
}

export default class MSDFFont {
  name: string
  scale: number
  chars: { [string]: Char } = {}
  constructor (pbf: Protobuf, end: number) {
    pbf.readFields(this.readFont, this, end)
  }

  readFont (tag: number, font: MSDFFont, pbf: Protobuf) {
    if (tag === 1) {
      font.name = pbf.readString()
    } else if (tag === 2) {
      font.scale = pbf.readVarint()
    } else if (tag === 3) {
      const char = {}
      pbf.readFields(font.parseChar, char, pbf.readVarint() + pbf.pos)
      font.chars[char.char] = char
    }
  }

  parseChar (tag: number, char: Char, pbf: Protobuf) {
    if (tag === 1) char.char = pbf.readString()
    else if (tag === 2) char.stretchH = pbf.readVarint()
    else if (tag === 3) char.width = pbf.readVarint()
    else if (tag === 4) char.height = pbf.readVarint()
    else if (tag === 5) char.xoffset = pbf.readSVarint()
    else if (tag === 6) char.yoffset = pbf.readSVarint()
    else if (tag === 7) char.xadvance = pbf.readSVarint()
    else if (tag === 8) char.x = pbf.readSVarint()
    else if (tag === 9) char.y = pbf.readSVarint()
    else if (tag === 10) char.data = pbf.readBytes()
  }
}
