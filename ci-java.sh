set -e
set -o pipefail
CWD=$WORKSPACE
: ${CWD:=$PWD}

PLATFORM=$1
CLOUDFIER_USER=$2

for app_path in $1/* ; do
	app=${app_path##*/}
	echo "Running tests for - $app"
	./gen.sh $PLATFORM $app $CLOUDFIER_USER
	./test.sh $PLATFORM $app "-DreportsDirectory=$CWD/test-reports"
done

