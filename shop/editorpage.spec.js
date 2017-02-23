describe('A magazine\'s editor page', function() {

    var Login = require('../community/loginPageObject.js');
    var utils = require('../helper/utils.js');
    var login = new Login();

    utils.cleanupBaseUrlInConfig(browser);
  
    if (utils.shouldSpecRun('shop_system', 'shopware')) {
        it('must be protected by a login popup', function() {
            browser.driver.get(utils.joinUrlElements(browser.baseUrl, 'editor'));

            expect(login.frmPwd.isDisplayed()).toEqual(true);
        });
    }
});
