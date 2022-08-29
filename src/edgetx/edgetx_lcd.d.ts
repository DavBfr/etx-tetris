

declare module lcd {
  function refresh(): void
  function clear(color?: number): void
  function resetBacklightTimeout(): void
  function drawPoint(x: number, y: number, flags?: number): void
  function drawLine(x1: number, y1: number, x2: number, y2: number, pattern: number, flags?: number): void
  function drawRectangle(x: number, y: number, w: number, h: number, flags?: number, thickness?: number): void
  function drawFilledRectangle(x: number, y: number, w: number, h: number, flags?: number, opacity?: number): void
  function invertRect(x: number, y: number, w: number, h: number, flags?: number): void
  function drawText(x: number, y: number, text: string, flags?: number, inversColor?: number): void
  function drawTextLines(): void
  function sizeText(text: string, flags?: number): LuaMultiReturn<[number, number]>
  function drawTimer(x: number, y: number, value: number, flags?: number, inversColor?: number): void
  function drawNumber(x: number, y: number, value: number, flags?: number, inversColor?: number): void
  function drawChannel(): void
  function drawSwitch(): void
  function drawSource(x: number, y: number, source: number, flags?: number): void
  function drawGauge(): void
  function drawBitmap(bitmap: Bitmap, x: number, y: number, scale?: number): void
  function drawBitmapPattern(bitmap: string, x: number, y: number, flags?: number): void
  function drawBitmapPatternPie(bitmap: string, x: number, y: number, startAngle: number, endAngle: number, flags?: number): void
  function setColor(colorIndex: number, color: number): void
  function getColor(): void
  function RGB(r: number, g: number, b: number): number
  function drawCircle(): void
  function drawFilledCircle(): void
  function drawTriangle(): void
  function drawFilledTriangle(): void
  function drawArc(): void
  function drawPie(): void
  function drawAnnulus(): void
  function drawLineWithClipping(): void
  function drawHudRectangle(): void
  function exitFullScreen(): void
}

declare module Bitmap {
  function open(name: string): Bitmap
  function getSize(bitmap: Bitmap): LuaMultiReturn<[number, number]>
  function toMask(bitmap: Bitmap): string
}

interface Bitmap { }

interface Zone {
  x: number
  y: number
  w: number
  h: number
  xabs: number
  yabs: number
}
