
all: index.html

index.html: README.md template.html
	pandoc $< --template template.html --metadata title="Tetris on Edge TX" -o $@
