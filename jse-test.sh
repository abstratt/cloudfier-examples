#!/bin/bash
if [ "$#" -lt 1 ] ; then
    echo 'Parameters APPLICATION is required'
    exit 1
fi
APPLICATION=$1
./java-test.sh $APPLICATION jse $2 $3 $4 $5 $6 $7 $8 $9
