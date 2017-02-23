"use strict";

var utils = require('../helper/utils.js');
var EC = require('protractor').ExpectedConditions;

var Login = function () {

    this.divLoginPane = $('.Login');
    this.frmEmail = this.divLoginPane.$('.loginEmail');
    this.frmPwd = this.divLoginPane.$('.loginPassword');

    this.login = function() {

        utils.cleanupBaseUrlInConfig(browser);

        browser.driver.get(browser.baseUrl + '/logout');
        utils.waitUntilPageReady();
        // browser.driver.wait(EC.presenceOf($('.YourMagazine.isGuest')));
        browser.driver.get(browser.baseUrl + '/login');
        // expect($('.YourMagazine.isGuest').isPresent()).toBe(true);

        this.frmEmail.sendKeys(browser.params[browser.baseUrlNoProto].login.email);
        this.frmPwd.sendKeys(browser.params[browser.baseUrlNoProto].login.pass);

        $('.buttonLogin').click();
    };
};

module.exports = Login;
