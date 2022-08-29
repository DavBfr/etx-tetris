const name = "Gauge1"

const options: any[] = [
  ["Source", SOURCE, 1],
  ["Min", VALUE, -FULLSCALE, -FULLSCALE, FULLSCALE],
  ["Max", VALUE, FULLSCALE, -FULLSCALE, FULLSCALE],
  ["Color", COLOR, COLOR_THEME_WARNING],
]

interface Options {
  Source: number,
  Min: number,
  Max: number,
  Color: number,
}

interface Widget {
  zone: Zone
  options: Options
}

function update(widget: Widget, options: Options) {
  widget.options = options
}

function create(zone: Zone, options: Options) {
  const widget: Widget = {
    zone: zone,
    options: options,
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


function draw(widget: Widget, x: number, y: number, width: number, height: number) {

  const index = widget.options.Source;
  let min = widget.options.Min;
  let max = widget.options.Max;
  const color = widget.options.Color;
  let value = getValue(index);

  if (min > max) {
    const m = min
    min = max
    max = m
    value = value - min - max;
  }

  value = clamp(min, value, max);

  const w = divRoundClosest(width * (value - min), (max - min));
  const percent = divRoundClosest(100 * (value - min), (max - min));

  // Gauge label
  lcd.drawSource(0, 0, index, SMLSIZE | COLOR_THEME_PRIMARY2);

  // Gauge
  lcd.setColor(CUSTOM_COLOR, color);
  lcd.drawFilledRectangle(0, 16, width, 16, COLOR_THEME_PRIMARY2);
  lcd.drawText(0 + width / 2, 14, `${percent}%`, SMLSIZE | CUSTOM_COLOR | CENTER);
  lcd.invertRect(w, 16, width - w, 16, CUSTOM_COLOR);
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
  } as unknown as LuaTable<String, String>

  const v = tr.get(text)
  return v == null ? v : text
}

export { refresh, name, create, update, options, translate }
