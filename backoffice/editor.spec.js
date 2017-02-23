describe('The Editor', function() {

    "use strict";

    var utils = require('../helper/utils');
    var Login = require('../community/loginPageObject.js');
    var Editor = require('./editor.po.js');

    it('should be possible to save text as draft', function() {
        // will not work in firefox nor phantomjs for different reasons

        browser.getCapabilities().then(function (capabilities) {
            if (capabilities.caps_.browserName == 'chrome') {

                var login = new Login();
                login.login();

                var headline = 'This is a simple headline';
                var description = 'And look how beautiful this headline is. Isn\'t it amazing!';

                var emptyEditor = new Editor(browser);
                emptyEditor.go();

                emptyEditor.setHeadline(headline);
                emptyEditor.setDescription(description);

                emptyEditor.saveDraft().then(function resolved(draftUrl) {

                    // discard the draft, change to some random page first
                    // to ensure that the draft is not visible anymore
                    browser.driver.get(browser.baseUrl);

                    var newEdior = new Editor(browser, draftUrl);
                    newEdior.go();

                    // editor auto-caps headings on save
                    expect(newEdior.getHeadline()).toMatch(new RegExp(headline, 'i'));
                    expect(newEdior.getDescription()).toMatch(description);
                });

            } else {
                // pending marks it wrongly as failed!
                // https://github.com/angular/protractor/issues/2454
                // TODO refactor as soon as this bug is resolved
                // pending('This test does only work on chrome');
                console.log('This test does only work on chrome');
            }
        });
    });
});
