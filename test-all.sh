#!/bin/bash
PLATFORM=$1
ls $PLATFORM |xargs -t -I app ./test.sh $PLATFORM app

