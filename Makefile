DEST=_site

all: $(DEST)/tetris.lua $(DEST)/index.html

_site/index.html: README.md template/template.html template/metadata.yml
	mkdir -p $(DEST)
	pandoc -s $< -c template/mvp.css --metadata-file=template/metadata.yml --template template/template.html -o $@
	cp site/* $(DEST)/

deps: node_modules/.bin/tstl

node_modules/.bin/tstl: package.json
	npm i

$(DEST)/tetris.lua: src/tetris.ts deps
	node_modules/.bin/tstl
	mkdir -p $(DEST)
	mv -f *.lua $(DEST)

dev: deps
	node_modules/.bin/tstl --watch

clean:
	rm -f package-lock.json
	rm -rf $(DEST) node_modules
