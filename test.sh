#!/bin/bash
if [ "$#" -lt 2 ] ; then
    echo 'Parameters PLATFORM and APPLICATION are required'
    exit 1
fi
PLATFORM=$1
APPLICATION=$2
./$PLATFORM-test.sh $APPLICATION $3 $4 $5 $6 $7 $8 $9
