describe ('General HTML page', function () {
    'use strict';

    var utils = require('../helper/utils.js');
    utils.cleanupBaseUrlInConfig(browser);

    beforeAll(function () {
        browser.driver.get(browser.baseUrl);
    });

    // Some jQuery functions deliver wrong results if a DOCTYPE is missing, which could lead to an endless load of stories
    // TODO test currently disabled. On current chrome at magento19.amazine.com/magazin it gives 
    // "Maximum call stack size exceeded". Will work fine on Firefox
    xit('should include a valid DOCTYPE', function() {
        browser.driver.executeScript(function(){
            return document.doctype
        }).then( function(type){
            expect(type).not.toBe(null);
        });
    });

});
