#!/bin/bash
if [ "$#" -lt 1 ] ; then
    echo 'Parameter PLATFORM is required'
    exit 1
fi
PLATFORM=$1
ls $PLATFORM | xargs -t -I app find "$PLATFORM/app/gen" -maxdepth 1 -not -name '.gitignore' | grep -v gen$ | xargs rm -Rf


