const name = "Timer"

const options: any[] = [
  ["TimerSource", TIMER, 0],
]

interface Options {
  TimerSource: number,
}

interface Widget {
  zone: Zone
  options: Options
  bg: string
  rs: string
  tm: string
}

function update(widget: Widget, options: Options) {
  widget.options = options
}

function create(zone: Zone, options: Options) {
  const current_path = `/WIDGETS/${name}`
  const bg = Bitmap.open(`${current_path}/mask_timer_bg.png`)
  const rs = Bitmap.open(`${current_path}/mask_rscale.png`)
  const tm = Bitmap.open(`${current_path}/mask_timer.png`)

  const modelInfo = model.getInfo()

  const widget: Widget = {
    zone: zone,
    options: options,
    bg: Bitmap.toMask(bg),
    rs: Bitmap.toMask(rs),
    tm: Bitmap.toMask(tm)
  }

  update(widget, options)
  return widget
}

const SECONDSPERMIN = 60
const SECONDSPERHOUR = 60 * SECONDSPERMIN
const SECONDSPERDAY = 24 * SECONDSPERHOUR
const SECONDSPERYEAR = 365 * SECONDSPERDAY

function splitTimer(tme: number): string[] {
  let yy = math.floor(tme / SECONDSPERYEAR)
  tme = tme - yy * SECONDSPERYEAR
  let dd = math.floor(tme / SECONDSPERDAY)
  tme = tme - dd * SECONDSPERDAY
  let hh = math.floor(tme / SECONDSPERHOUR)
  tme = tme - hh * SECONDSPERHOUR
  let mm = math.floor(tme / SECONDSPERMIN)
  tme = tme - mm * SECONDSPERMIN
  let ss = math.floor(tme)

  if (yy == 0 && dd == 0 && hh == 0) {
    return [string.format("%02d", mm), string.format("%02d", ss), "M", "S"]
  } else if (yy == 0 && dd == 0) {
    return [string.format("%02d", hh), string.format("%02d", mm), "H", "M"]
  } else if (yy == 0) {
    return [string.format("%02d", dd), string.format("%02d", hh), "D", "H"]
  } else {
    return [string.format("%02d", yy), string.format("%02d", dd), "Y", "D"]
  }
}

function draw(widget: Widget, x: number, y: number, width: number, height: number) {
  const timer = model.getTimer(widget.options.TimerSource)

  // Middle size widget
  if (width >= 180 && height >= 70) {
    const colorBack = (timer.value! >= 0 || (timer.value! % 2) == 0)
      ? COLOR_THEME_PRIMARY2
      : COLOR_THEME_WARNING;
    const colorFore = (timer.value! >= 0 || (timer.value! % 2) == 0)
      ? COLOR_THEME_SECONDARY1
      : COLOR_THEME_SECONDARY2;

    // background
    lcd.drawBitmapPattern(widget.bg, 0, 0, colorBack)

    if (timer.start && timer.value! >= 0) {
      lcd.drawBitmapPatternPie(widget.rs, 2, 3, 0,
        timer.value! <= 0
          ? 360
          : 360 * (timer.start - timer.value!) / timer.start,
        colorFore);
    } else {
      lcd.drawBitmapPattern(widget.tm, 3, 4, colorFore);
    }

    // value
    let val = timer.value!;
    if (timer.start && timer.showElapsed &&
      timer.start != timer.value!)
      val = timer.start - timer.value!;
    let [sDigitGroup0, sDigitGroup1, sUnit0, sUnit1] = splitTimer(Math.abs(val));

    lcd.drawText(76, 31, sDigitGroup0, DBLSIZE | colorFore);
    lcd.drawText(76 + 35, 33, sUnit0, colorFore);
    lcd.drawText(76 + 50, 31, sDigitGroup1, DBLSIZE | colorFore);
    lcd.drawText(76 + 85, 33, sUnit1, colorFore);
    // name
    if (timer.name!.length > 0) {  // user name exist
      lcd.drawText(78, 20, timer.name!, SMLSIZE | colorFore);
    } else {  // user name not exist "TMRn"
      lcd.drawText(137, 17, `TMR${widget.options.TimerSource + 1}`, SMLSIZE | colorFore);
    }
  }
  // Small size widget
  else {
    // background
    if (timer.value! < 0 && timer.value! % 2) {
      lcd.drawFilledRectangle(0, 0, width, height, COLOR_THEME_WARNING);
    }
    // name
    if (timer.name!.length > 0) {  // user name exist
      lcd.drawText(2, 0, timer.name!, SMLSIZE | COLOR_THEME_PRIMARY2);
    } else {  // user name not exist "TMRn"
      lcd.drawText(2, 0, `TMR${widget.options.TimerSource + 1}`, SMLSIZE | COLOR_THEME_PRIMARY2);
    }
    // value
    let val = timer.value!;
    if (timer.start && timer.showElapsed &&
      timer.start != timer.value!)
      val = timer.start - timer.value!;
    if (width > 100 && height > 40) {
      if (Math.abs(val) >= 3600) {
        lcd.drawTimer(3, 20, Math.abs(val), COLOR_THEME_PRIMARY2 | LEFT | TIMEHOUR);
      } else {
        lcd.drawTimer(3, 18, Math.abs(val), COLOR_THEME_PRIMARY2 | LEFT);
      }
    }
    // very small size
    else {
      if (Math.abs(timer.value!) >= 3600) {
        lcd.drawTimer(3, 20, Math.abs(timer.value!), COLOR_THEME_PRIMARY2 | LEFT | SMLSIZE | TIMEHOUR);
      } else {
        // value
        let val = timer.value!;
        if (timer.start && timer.showElapsed &&
          timer.start != timer.value!)
          val = timer.start - timer.value!;
        lcd.drawTimer(3, 18, Math.abs(val), COLOR_THEME_PRIMARY2 | LEFT);
      }
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
    TimerSource: "Timer Source",
  } as unknown as LuaTable<String, String>

  const v = tr.get(text)
  return v == null ? v : text
}

export { refresh, name, create, update, options, translate }
