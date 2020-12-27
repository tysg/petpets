
.PHONY: convert compile open
all: convert compile open

up:
	./latexdockerdaemon.sh

down:
	docker stop latex_daemon

convert:
	pandoc -f markdown -t latex -s -o main.tex --atx-headers -N main.md --template eisvogel --listings 

compile:
	./latexdockerdaemoncmd.sh pdflatex main.tex 

open:
	open ./main.pdf