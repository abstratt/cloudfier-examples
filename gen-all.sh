#!/bin/bash
PLATFORM=$1
CLOUDFIER_USER=${2:-test}
BASE_APPLICATION_PATH=${3:-cloudfier-examples}
ls $PLATFORM |xargs -t -I app ./gen.sh $PLATFORM app $CLOUDFIER_USER $BASE_APPLICATION_PATH

