#!/bin/bash
PLATFORM=$1
ls $PLATFORM |xargs -t -I app ./test.sh $PLATFORM app $2 $3 $4 $5 $6 $7 $8 $9


