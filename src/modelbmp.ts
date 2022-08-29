const name = "ModelBmp"

const options: any[] = [
  ["Color", COLOR, COLOR_THEME_SECONDARY1],
  ["Size", 5, 0],
  ["FillBackground", BOOL, 0],
  ["BgColor", COLOR, COLOR_THEME_SECONDARY3],
  ["UseThemeColor", BOOL, 1],
]

interface Options {
  Color: number,
  Size: number
  FillBackground: number
  BgColor: number
  UseThemeColor: number
}

interface Widget {
  filename?: string
  bitmap?: Bitmap
  bitmapWidth?: number
  bitmapHeight?: number
  zone: Zone
  options: Options
}

function create(zone: Zone, options: Options) {
  const widget: Widget = {
    zone: zone,
    options: options,
  }

  update(widget, options)
  return widget
}

function update(widget: Widget, options: Options) {
  widget.options = options
}

const sizes = [0, BOLD, TINSIZE, SMLSIZE, MIDSIZE, DBLSIZE, XXLSIZE]

function draw(widget: Widget, x: number, y: number, w: number, h: number): void {
  const modelInfo = model.getInfo()
  if (widget.filename != modelInfo.bitmap) {
    widget.filename = modelInfo.bitmap
    widget.bitmap = Bitmap.open(`/IMAGES/${modelInfo.bitmap}`)
    if (widget.bitmap != null) {
      const [width, height] = Bitmap.getSize(widget.bitmap)
      const nh = (h >= 96 && w >= 120) ? h - 38 : h;
      const r = Bitmap.resize(widget.bitmap, w, nh)
      if (r != null) {
        widget.bitmap = r;
        widget.bitmapWidth = w
        widget.bitmapHeight = nh
      } else {
        widget.bitmapWidth = width
        widget.bitmapHeight = height
      }
    }
  }

  const fontSize = sizes[widget.options.Size]
  const fontColor = widget.options.UseThemeColor == 0 ? widget.options.Color : COLOR_THEME_SECONDARY1

  if (widget.options.FillBackground != 0) {
    lcd.drawFilledRectangle(0, 0, w, h, widget.options.BgColor);
  }

  // big space to draw
  if (h >= 96 && w >= 120) {
    if (widget.bitmap != null) {
      lcd.drawBitmap(
        widget.bitmap,
        0,
        38)
    }

    lcd.drawText(x + 5, y + 5, modelInfo.name!, fontSize | fontColor)
  }
  // smaller space to draw
  else {
    if (widget.bitmap != null) {
      lcd.drawBitmap(widget.bitmap, 0, 0)
    }
    else {
      lcd.drawText(x + 5, y + 5, modelInfo.name!, fontSize | fontColor)
    }
  }
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
    // ModelBmp: "Models",
    FillBackground: "Fill Background",
    BgColor: "Bg Color",
    UseThemeColor: "Use Theme Color"
  } as unknown as LuaTable<String, String>

  const v = tr.get(text)
  return v == null ? v : text
}

export { refresh, name, create, update, options, translate }
