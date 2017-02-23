#!/bin/bash
# starts a local webdriver manager. You need this when you want to execute e2e tests locally

npm install
$(npm bin)/webdriver-manager update
$(npm bin)/webdriver-manager start --seleniumPort 5555 -Dapple.awt.UIElement="true"
