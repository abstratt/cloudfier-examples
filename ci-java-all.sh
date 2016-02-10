set -e
set -o pipefail
CWD=$WORKSPACE : ${CWD:=$PWD}

PLATFORM=$1
CLOUDFIER_USER=$2

for app_path in ${PLATFORM}/* ; do

    if [ ! -f $app_path/.cloudfier-ignore ]
    then
	app=${app_path##*/}
        echo "Processing $app_path for platform $app"
	./ci-java.sh $PLATFORM $app $CLOUDFIER_USER
    else
        echo "Skipping $app_path"
    fi
done

