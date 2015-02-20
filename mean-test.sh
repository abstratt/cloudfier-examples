#!/bin/bash
if [ "$#" -lt 1 ] ; then
    echo 'Parameters APPLICATION is required'
    exit 1
fi
APPLICATION=$1
unlink $PWD/mean/$APPLICATION/gen/node_modules
ln -s $PWD/node_modules $PWD/mean/$APPLICATION/gen/
mean/$APPLICATION/gen/node_modules/mocha/bin/mocha -u tdd mean/$APPLICATION/gen/test $2 $3 $4 $5 $6 $7 $8 $9
