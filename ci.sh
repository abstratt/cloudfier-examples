if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi

echo Continuous testing of generation of $APPLICATION on $PLATFORM 

PLATFORM=$1
APPLICATION=$2
CLOUDFIER_USER=${3:-test}
./gen.sh $PLATFORM $APPLICATION $CLOUDFIER_USER
echo 0
if [[ $? -ne 0 ]] ; then
    exit 1
fi
cd $PLATFORM/$APPLICATION/gen
npm install -p
cd -
echo Testing $APPLICATION on $PLATFORM 
./test.sh $PLATFORM $APPLICATION --reporter xunit 1> test-report.xml
