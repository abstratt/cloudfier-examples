if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi

echo Continuous testing of generation of $APPLICATION on $PLATFORM 

PLATFORM=$1
APPLICATION=$2
CLOUDFIER_USER=${3:-test}
BASE_APPLICATION_PATH=${4:-cloudfier-examples}
./gen.sh $PLATFORM $APPLICATION $CLOUDFIER_USER $BASE_APPLICATION_PATH
echo 0
if [[ $? -ne 0 ]] ; then
    exit 1
fi
cd $PLATFORM/$APPLICATION/gen
rm -Rf node_modules
npm install -p
cd -
echo Testing $APPLICATION on $PLATFORM 
mkdir -p test-reports
./test.sh $PLATFORM $APPLICATION --reporter xunit 1> test-reports/$PLATFORM-$APPLICATION-test-report.xml
