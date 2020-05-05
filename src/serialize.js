// @flow
import zlib from 'zlib'
import Protobuf from 'pbf'

export type Fonts = Array<Font>

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

export default function serialize (fonts: Fonts) {
  const out = new Protobuf()
  writeMSDF(fonts, out)
  let finish = out.finish()
  return zlib.gzipSync(finish)
}

function writeMSDF (fonts: Fonts, pbf: Protobuf) {
  // version
  pbf.writeVarintField(15, 1)
  // fonts
  for (const font of fonts) pbf.writeMessage(1, writeFont, font)
}

function writeFont (font: Font, pbf: Protobuf) {
  // name
  pbf.writeStringField(1, font.name)
  // scale
  pbf.writeVarintField(2, font.scale)
  // charset
  for (const char of font.charSet) pbf.writeMessage(3, writeChar, char)
}

function writeChar (char: Char, pbf: Protobuf) {
  pbf.writeStringField(1, char.char)
  pbf.writeVarintField(2, char.stretchH)
  pbf.writeVarintField(3, char.width)
  pbf.writeVarintField(4, char.height)
  pbf.writeSVarintField(5, char.xoffset)
  pbf.writeSVarintField(6, char.yoffset)
  pbf.writeSVarintField(7, char.xadvance)
  pbf.writeSVarintField(8, char.x)
  pbf.writeSVarintField(9, char.y)
  pbf.writeBytesField(10, char.data)
}
