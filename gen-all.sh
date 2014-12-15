PLATFORM=$1
CLOUDFIER_USER=${2:-test}
ls $PLATFORM |xargs -t -I app ./gen.sh $PLATFORM app $CLOUDFIER_USER

