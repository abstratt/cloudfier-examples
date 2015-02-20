#!/bin/bash
if [ "$#" -lt 1 ] ; then
    echo 'Parameters APPLICATION is required'
    exit 1
fi
APPLICATION=$1
echo mvn clean install -f jee/$APPLICATION/gen/pom.xml $2 $3 $4 $5 $6 $7 $8 $9
mvn clean install -f jee/$APPLICATION/gen/pom.xml $2 $3 $4 $5 $6 $7 $8 $9
