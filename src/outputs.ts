
const name = "Outputs"

const ROW_HEIGHT = 17;
const RECT_BORDER = 1;

const options: any[] = [
  ["FirstChannel", VALUE, 1],
  ["Transparency", VALUE, 2, 0, 5],
  ["BgColor", COLOR, COLOR_THEME_SECONDARY3],
  ["TextColor", COLOR, COLOR_THEME_PRIMARY1 >> 16],
  ["BarColor", COLOR, COLOR_THEME_SECONDARY1 >> 16],
]

interface Options {
  FirstChannel: number,
  Transparency: number,
  BgColor: number,
  TextColor: number,
  BarColor: number,
}

interface Widget {
  zone: Zone
  options: Options
  limitPct: number
}

function update(widget: Widget, options: Options) {
  widget.options = options
}

function create(zone: Zone, options: Options) {
  const modelInfo = model.getInfo()

  const widget: Widget = {
    zone: zone,
    options: options,
    limitPct: modelInfo.extendedLimits ? LIMIT_EXT_PERCENT : LIMIT_STD_PERCENT
  }

  update(widget, options)
  return widget
}

function divRoundClosest(n: number, d: number): number {
  if (d == 0)
    return 0;
  else
    return ((n < 0) !== (d < 0)) ? Math.ceil((n - d / 2) / d) : Math.floor((n + d / 2) / d);
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

function drawChannels(widget: Widget, x: number, y: number, w: number, h: number, firstChan: number): number {
  const numChan = h / ROW_HEIGHT;
  const lastChan = firstChan + numChan;
  const rowH = (h - numChan * ROW_HEIGHT >= numChan ? ROW_HEIGHT + 1 : ROW_HEIGHT);
  const barW = w - RECT_BORDER * 2;
  const barH = rowH - RECT_BORDER;
  const barLft = x + RECT_BORDER;
  const barMid = barLft + barW / 2;
  const barColor = widget.options.BarColor;
  const txtColor = widget.options.TextColor;

  for (let curChan = firstChan; curChan < lastChan && curChan <= MAX_OUTPUT_CHANNELS; curChan++) {
    const chanVal = divRoundClosest(getOutputValue(curChan - 1) * 100, FULLSCALE);
    const rowTop = y + (curChan - firstChan) * rowH;
    const barTop = rowTop + RECT_BORDER;
    const fillW = divRoundClosest(barW * clamp(0, math.abs(chanVal), widget.limitPct), widget.limitPct * 2);

    if (widget.options.Transparency > 0) {
      lcd.setColor(CUSTOM_COLOR, widget.options.BgColor);
      lcd.drawFilledRectangle(barLft, barTop, barW, barH, CUSTOM_COLOR, widget.options.Transparency);
    }
    if (fillW != 0) {
      lcd.setColor(CUSTOM_COLOR, barColor);
      lcd.drawFilledRectangle((chanVal > 0 ? barMid : barMid - fillW), barTop, fillW, barH, CUSTOM_COLOR);
    }
    lcd.drawLine(barMid, barTop, barMid, barTop + barH, SOLID, COLOR_THEME_SECONDARY1);
    lcd.drawRectangle(x, rowTop, w, rowH + 1);
    lcd.setColor(CUSTOM_COLOR, txtColor);
    lcd.drawText(x + barW - 10, barTop - 2, `${chanVal}%`, SMLSIZE | CUSTOM_COLOR | RIGHT);
    const output = model.getOutput(curChan - 1);
    if (output.name.length > 0) {
      lcd.drawText(barLft + 1, barTop - 2, `${`${curChan}`.padStart(2, '0')} ${output.name}`, SMLSIZE | CUSTOM_COLOR | LEFT);
    } else {
      lcd.drawText(barLft + 1, barTop - 2, `CH${curChan}`, SMLSIZE | CUSTOM_COLOR | LEFT);
    }
  }

  return lastChan - 1;
}

function twoColumns(widget: Widget, x: number, y: number, w: number, h: number) {
  const endColumn =
    drawChannels(widget, 0, 0, (w / 2) - 1, h, widget.options.FirstChannel);
  drawChannels(widget, w / 2, 0, (w / 2) - 1, h, endColumn + 1);
}

function oneColumn(widget: Widget, x: number, y: number, w: number, h: number) {
  drawChannels(widget, 0, 0, w, h, widget.options.FirstChannel);
}

function draw(widget: Widget, x: number, y: number, w: number, h: number) {
  if (w > 300 && h > 20)
    twoColumns(widget, x, y, w, h);
  else if (w > 100 && h > 20)
    oneColumn(widget, x, y, w, h);
}

function refresh(widget: Widget, event: any, touch: any) {
  if (event != null) {
    draw(widget, 0, 0, LCD_W, LCD_H)
  } else {
    draw(widget, widget.zone.x, widget.zone.y, widget.zone.w, widget.zone.h)
  }
}

function translate(text: String, lang: String): String {
  const tr = {
    FirstChannel: "First Channel",
    FillBackground: "Fill Background",
    BgColor: "Bg Color",
    TextColor: "Text Color",
    BarColor: "Bar Color",
  } as unknown as LuaTable<String, String>

  const v = tr.get(text)
  return v == null ? v : text
}

export { refresh, name, create, update, options, translate }
