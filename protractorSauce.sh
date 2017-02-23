#!/bin/bash
# runs protractror against SauceLabs

$(npm bin)/protractor develop.conf.js "$@"
