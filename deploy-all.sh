#!/bin/bash
set -e
set -o pipefail

CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

CLOUDFIER_USER=${1:-test}
BASE_APPLICATION_PATH=${2:-/cloudfier-examples/}
PLATFORM=${3:-jee}
for app_path in ${PLATFORM}/* ; do

    if [ ! -f $app_path/.cloudfier-ignore ]
    then
	app=${app_path##*/}
        echo "*** Processing $app under $app_path"
        ./deploy.sh $app $CLOUDFIER_USER
    else
        echo "*** Skipping $app_path"
    fi
done

