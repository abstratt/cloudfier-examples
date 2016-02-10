#!/bin/bash
CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi

PLATFORM=$1
APPLICATION=$2
CLOUDFIER_USER=${3:-test}
BASE_APPLICATION_PATH=${4:-cloudfier-examples}
APPLICATION_URL=$CLOUDFIER_URL/services/generator/$CLOUDFIER_USER-${BASE_APPLICATION_PATH//\//-}-$APPLICATION

echo "Generating $APPLICATION on $PLATFORM (hosted at $APPLICATION_URL)"

mkdir -p node_modules
#!/bin/bash
CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi

PLATFORM=$1
APPLICATION=$2
CLOUDFIER_USER=${3:-test}
BASE_APPLICATION_PATH=${4:-cloudfier-examples}
APPLICATION_URL=$CLOUDFIER_URL/services/generator/$CLOUDFIER_USER-${BASE_APPLICATION_PATH//\//-}-$APPLICATION

echo "*** Generating $APPLICATION on $PLATFORM (hosted at $APPLICATION_URL)"

wget -v -d  $APPLICATION_URL/platform/$PLATFORM  -O generated.zip
if [ $? -ne 0 ] ; then 
    exit 1
fi
find $PLATFORM/$APPLICATION/gen/ -type f -not -name '.project' | xargs rm -Rf 
mkdir -p $PLATFORM/$APPLICATION/gen
unzip -o -d $PLATFORM/$APPLICATION/gen generated.zip
rm -Rf generated.zip


