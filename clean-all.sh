#!/bin/bash
PLATFORM=$1
ls $PLATFORM |xargs -t -I app rm -Rf $PLATFORM/app/gen/

