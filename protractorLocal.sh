#!/bin/bash
# runs protractror locally instead on saucelabs
# needs webdriver-manger running locally, too

$(npm bin)/protractor develop.conf.js --seleniumAddress 'http://localhost:5555/wd/hub' "$@"
