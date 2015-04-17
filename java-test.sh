#!/bin/bash
if [ "$#" -lt 2 ] ; then
    echo 'Parameters APPLICATION and PLATFORM are required'
    exit 1
fi
APPLICATION=$1
PLATFORM=$2
echo mvn clean test -f $PLATFORM/$APPLICATION/gen/pom.xml $3 $4 $5 $6 $7 $8 $9
mvn clean test -f $PLATFORM/$APPLICATION/gen/pom.xml $3 $4 $5 $6 $7 $8 $9
