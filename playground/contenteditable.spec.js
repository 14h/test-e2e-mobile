// will not work in phantomjs, because Does not support contenteditable
describe('The Editor', function() {

    var EC = protractor.ExpectedConditions;
    var Login = require('../community/loginPageObject.js');
    var utils = require('../helper/utils.js');
 
    it('should be possible to save text as draft', function() {

        var headline = 'This is a simple headline';

        browser.driver.get('file:///media/data/styla/code/frontend/test/e2e/misc/contenteditable.html');
        
        $('h1').getText().then(function(text){
            console.log(text);
        });
        
        $('h1').sendKeys(headline);

        browser.pause();
    });
});
