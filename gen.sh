#!/bin/bash
CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi

PLATFORM=$1
APPLICATION=$2
CLOUDFIER_USER=${3:-test}
BASE_APPLICATION_PATH=${4:-/cloudfier-examples/}
APPLICATION_URL=$CLOUDFIER_URL/services/generator/$CLOUDFIER_USER${BASE_APPLICATION_PATH//\//-}$APPLICATION
GENERATION_URL=$APPLICATION_URL/platform/$PLATFORM

echo "*** Generating $APPLICATION on $PLATFORM (served by $GENERATION_URL)"

rm -Rf generated.zip
wget -v -d  $GENERATION_URL --header "Accept: application/zip" -O generated.zip
if [ $? -ne 0 ] ; then 
    exit 1
fi
find $PLATFORM/$APPLICATION/gen/ -type f -not -name '.project' | xargs rm -Rf 
mkdir -p $PLATFORM/$APPLICATION/gen
unzip -o -d $PLATFORM/$APPLICATION/gen generated.zip


