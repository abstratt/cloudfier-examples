#!/bin/bash
PLATFORM=$1
ls $PLATFORM | xargs -t -I app find "$PLATFORM/app/gen" -maxdepth 1 -not -name '.gitignore' | grep -v gen$ | xargs rm -Rf


