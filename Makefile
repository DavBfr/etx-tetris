DEST=_site

all: $(DEST)/index.html

_site/index.html: README.md template.html metadata.yml
	mkdir -p $(DEST)
	pandoc -s $< -c mvp.css --metadata-file=metadata.yml --template template.html -o $@
	cp *.jpg $(DEST)
	cp *.css $(DEST)
	cp *.lua $(DEST)
