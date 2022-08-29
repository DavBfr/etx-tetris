local name = "Tetris"

local options = {}

local fileToLoad = "/SCRIPTS/TOOLS/Tetris.lua"

local function clearTable(t)
    if type(t) == "table" then
        for i, v in pairs(t) do
            if type(v) == "table" then
                clearTable(v)
            end
            t[i] = nil
        end
    end
    collectgarbage()
    return t
end

local function create(zone, options)
    local info = fstat(fileToLoad)
    local widget = {
        zone = zone,
        options = options,
        w = dofile(fileToLoad),
        time = info.time,
        fs = false
    }
    widget.w.init(zone.w, zone.h)
    return widget
end

local function update(widget, options)
    widget.options = options
end

local function refresh(widget, event, touch)
    local info = fstat(fileToLoad)
    local time = info.time
    if (time.sec ~= widget.time.sec or time.min ~= widget.time.min) then
        print("RELOAD " .. fileToLoad)
        widget.time = time
        clearTable(widget.w)
        widget.w = dofile(fileToLoad)
        if widget.fs then
            widget.w.init(LCD_W, LCD_H)
        else
            widget.w.init(widget.zone.w, widget.zone.h)
        end
    end

    if event ~= nil then
        if widget.fs == false then
            widget.w.init(LCD_W, LCD_H)
            widget.fs = true
        end
    else
        if widget.fs == true then
            widget.w.init(widget.zone.w, widget.zone.h)
            widget.fs = false
        end
    end

    widget.w.run(event, touch)
end

return {
    name = name,
    options = options,
    create = create,
    update = update,
    refresh = refresh
}
