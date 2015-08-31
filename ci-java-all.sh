set -e
set -o pipefail
CWD=$WORKSPACE : ${CWD:=$PWD}

PLATFORM=$1
CLOUDFIER_USER=$2

for app_path in $1/* ; do
	app=${app_path##*/}
	./ci-java.sh $PLATFORM $app $CLOUDFIER_USER
done

