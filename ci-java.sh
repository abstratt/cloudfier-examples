set -e
set -o pipefail
CWD=$WORKSPACE : ${CWD:=$PWD}

if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi

PLATFORM=$1
APPLICATION=$2
CLOUDFIER_USER=${3:-test}

echo ">\n>\n>\n>\n"	
echo "*** Generating code for - $APPLICATION"	
./gen.sh $PLATFORM $APPLICATION $CLOUDFIER_USER
echo ">\n>\n>\n>\n"	
echo "*** Running tests for - $APPLICATION"
./test.sh $PLATFORM $APPLICATION "-DreportsDirectory=$CWD/test-reports"
echo ">\n>\n>\n>\n"	
echo "*** Finished running tests for - $APPLICATION"
