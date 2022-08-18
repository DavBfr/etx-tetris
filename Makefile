DEST=_site

all: $(DEST)/index.html

_site/index.html: README.md template/template.html template/metadata.yml
	mkdir -p $(DEST)
	pandoc -s $< -c template/mvp.css --metadata-file=template/metadata.yml --template template/template.html -o $@
	cp site/* $(DEST)/
	mkdir -p $(DEST)

clean:
	rm -rf $(DEST)
