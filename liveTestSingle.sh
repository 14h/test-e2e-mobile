#!/bin/bash  
# runs test for a single live magazine

if [[ $# -eq 0 ]] ; then
    echo "Use like: $0 stage.styla.com <protractor params>"
    exit
fi 

url=$1
shift

$(npm bin)/protractor --baseUrl="$url" "$@" liveTest.conf.js
