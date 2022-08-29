DEST?=_site

all: lua $(DEST)/index.html

_site/index.html: README.md template/template.html template/metadata.yml
	mkdir -p $(DEST)
	pandoc -s $< -c template/mvp.css --metadata-file=template/metadata.yml --template template/template.html -o $@
	cp site/* $(DEST)/

deps: node_modules/.bin/tstl

node_modules/.bin/tstl: package.json
	npm i

lua: deps
	node_modules/.bin/tstl
	mkdir -p $(DEST)/SCRIPTS/TOOLS
	mv -f tetris.lua $(DEST)/SCRIPTS/TOOLS/Tetris.lua
	mkdir -p $(DEST)/WIDGETS/Tetris
	cp -f src/tetris-widget.lua $(DEST)/WIDGETS/Tetris/main.lua
	mkdir -p $(DEST)/WIDGETS/Outputs
	mv -f outputs.lua $(DEST)/WIDGETS/Outputs/main.lua
	mkdir -p $(DEST)/WIDGETS/Timer
	mv -f timer.lua $(DEST)/WIDGETS/Timer/main.lua
	cp assets/mask_rscale.png $(DEST)/WIDGETS/Timer/
	cp assets/mask_timer.png $(DEST)/WIDGETS/Timer/
	cp assets/mask_timer_bg.png $(DEST)/WIDGETS/Timer/

dev:
	find src/ | entr make lua

clean:
	rm -f package-lock.json
	rm -rf $(DEST) node_modules
