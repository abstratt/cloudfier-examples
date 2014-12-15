CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi

PLATFORM=$1
APPLICATION=$2
CLOUDFIER_USER=${3:-test}

echo Generating $APPLICATION on $PLATFORM 

rm -Rf $PLATFORM/$APPLICATION/gen
mkdir -p $PLATFORM/$APPLICATION/gen
wget -v -d  $CLOUDFIER_URL/services/generator/$CLOUDFIER_USER-cloudfier-examples-$APPLICATION/platform/$PLATFORM  -O generated.zip
if [ $? -ne 0 ] ; then 
    exit 1
fi
unzip -d $PLATFORM/$APPLICATION/gen generated.zip
rm -Rf generated.zip
ln -s ../../../node_modules $PLATFORM/$APPLICATION/gen/	

