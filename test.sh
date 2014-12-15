if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi
PLATFORM=$1
APPLICATION=$2
node_modules/mocha/bin/mocha -u tdd $PLATFORM/$APPLICATION/gen/test $3 $4 $5 $6 $7 $8 $9
