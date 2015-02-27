set -e
set -o pipefail
CWD=$WORKSPACE
: ${CWD:=$PWD}

CLOUDFIER_USER=$1

for app_path in jee/* ; do
	app=${app_path##*/}
	echo "Running tests for - $app"
	./gen.sh jee $app $CLOUDFIER_USER
	./test.sh jee $app "-DreportsDirectory=$CWD/test-reports"
done

