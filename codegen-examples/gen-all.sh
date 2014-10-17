find . -name gen |cut -d '/' -f 3 | xargs -t -I prj ./gen.sh $1 prj

