const name = "Text1"

const options: any[] = [
  ["Text", STRING, "My Label"],
  ["Color", COLOR, COLOR_THEME_SECONDARY1],
  ["Size", 5, 0],
  ["Shadow", BOOL, 0],
]

interface Options {
  Text: string
  Color: number,
  Size: number
  Shadow: number
}

interface Widget {
  zone: Zone
  options: Options
}

function create(zone: Zone, options: Options) {
  const widget: Widget = {
    zone: zone,
    options: options,
  }
  return widget
}

function update(widget: Widget, options: Options) {
  widget.options = options
}

const sizes = [0, BOLD, TINSIZE, SMLSIZE, MIDSIZE, DBLSIZE, XXLSIZE]

function draw(widget: Widget, x: number, y: number, w: number, h: number): void {
  const fontSize = sizes[widget.options.Size]
  const fontColor = widget.options.Color

  if (widget.options.Shadow != 0) {
    lcd.drawText(1, 1, widget.options.Text, fontSize + BLACK);
  }

  lcd.drawText(0, 0, widget.options.Text, fontSize + fontColor);
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
