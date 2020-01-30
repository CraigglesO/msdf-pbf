// @flow
import zlib from 'zlib'
import Protobuf from 'pbf'
import MSDF from './MSDF'
import MSDFFont from './MSDFFont'

export type Fonts = Array<Font>

type Font = {
  name: string,
  instructionSet: Instructions,
  textures: Array<Texture>
}

type Instructions = {
  chars: Array<Char>,
  info: Info,
  common: Common,
  kernings: Array<Kerning>
}

type Char = {
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

type Info = {
  face: string,
  size: number,
  bold: number,
  italic: number,
  charset: Array<string>,
  unicode: number,
  stretchH: number,
  smooth: number,
  aa: number,
  padding: [number, number, number, number],
  spacing: [number, number]
}

type Common = {
  lineHeight: number,
  base: number,
  scaleW: number,
  scaleH: number,
  pages: number,
  packed: number,
  alphaChnl: number,
  redChnl: number,
  greenChnl: number,
  blueChnl: number
}

type Kerning = {
  first: number,
  second: number,
  amount: number
}

type Texture = {
  id: number,
  data: Buffer
}

export default function serialize (fonts: Fonts, compress?: boolean = false) {
  const out = new Protobuf()
  writeMSDF(fonts, out)
  let finish = out.finish()
  if (compress) finish = zlib.gzipSync(finish)
  return finish
}

function writeMSDF (fonts: Fonts, pbf: Protobuf) {
  pbf.writeVarintField(15, 1)
  for (const font of fonts) pbf.writeMessage(1, writeFont, font)
}

function writeFont (font: Font, pbf: Protobuf) {
  // info
  pbf.writeMessage(1, writeInfo, font.instructionSet)
  // name
  pbf.writeStringField(2, font.name)
  // charset
  for (const char of font.instructionSet.chars) pbf.writeMessage(3, writeChar, char)
  // kernings
  for (const kerning of font.instructionSet.kernings) {
    if (kerning.amount !== 0) pbf.writeMessage(4, writeKerning, kerning)
  }
  // textures
  for (const texture of font.textures) pbf.writeMessage(5, writeTexture, texture)
}

function writeInfo (instructionSet: Instructions, pbf: Protobuf) {
  const { info, common } = instructionSet
  pbf.writeVarintField(1, info.size)
  pbf.writeBooleanField(2, !!info.bold)
  pbf.writeBooleanField(3, !!info.italic)
  pbf.writeBooleanField(4, !!info.smooth)
  pbf.writeBooleanField(5, !!info.aa)
  pbf.writeVarintField(6, info.padding[0])
  pbf.writeVarintField(7, info.padding[1])
  pbf.writeVarintField(8, info.padding[2])
  pbf.writeVarintField(9, info.padding[3])
  pbf.writeVarintField(10, info.spacing[0])
  pbf.writeVarintField(11, info.spacing[1])
  pbf.writeVarintField(12, common.lineHeight)
  pbf.writeVarintField(13, common.base)
  pbf.writeVarintField(14, common.scaleW)
  pbf.writeVarintField(15, common.scaleH)
  pbf.writeVarintField(16, common.pages)
}

function writeChar (char: Char, pbf: Protobuf) {
  pbf.writeVarintField(1, char.id)
  pbf.writeVarintField(2, char.index)
  pbf.writeStringField(3, char.char)
  pbf.writeVarintField(4, char.width)
  pbf.writeVarintField(5, char.height)
  pbf.writeSVarintField(6, char.xoffset)
  pbf.writeSVarintField(7, char.yoffset)
  pbf.writeSVarintField(8, char.xadvance)
  pbf.writeVarintField(9, char.chnl)
  pbf.writeVarintField(10, char.x)
  pbf.writeVarintField(11, char.y)
  pbf.writeVarintField(12, char.page)
}

function writeKerning (kerning: Kerning, pbf: Protobuf) {
  pbf.writeVarintField(1, kerning.first)
  pbf.writeVarintField(2, kerning.second)
  pbf.writeSVarintField(3, kerning.amount)
}

function writeTexture (texture: Texture, pbf: Protobuf) {
  pbf.writeVarintField(1, texture.id)
  pbf.writeBytesField(2, texture.data)
}
