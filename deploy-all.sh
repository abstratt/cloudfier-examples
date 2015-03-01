#!/bin/bash
set -e
set -o pipefail

CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

CLOUDFIER_USER=${1:-test}
BASE_APPLICATION_PATH=${2:-cloudfier-examples}

echo "Server:" $CLOUDFIER_URL

./deploy.sh blog $CLOUDFIER_USER
./deploy.sh car-rental $CLOUDFIER_USER
./deploy.sh carserv $CLOUDFIER_USER
./deploy.sh cities $CLOUDFIER_USER
./deploy.sh expenses $CLOUDFIER_USER
./deploy.sh meeting $CLOUDFIER_USER
./deploy.sh petstore $CLOUDFIER_USER
./deploy.sh shipit $CLOUDFIER_USER
./deploy.sh taxi-fleet $CLOUDFIER_USER
./deploy.sh timetracker $CLOUDFIER_USER
./deploy.sh todo $CLOUDFIER_USER
