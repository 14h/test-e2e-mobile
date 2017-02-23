"use strict";

var EC = require('protractor').ExpectedConditions;
var utils = require('../helper/utils');

/**
 * The Dashboard page object
 * @browser reference to protractor's global browser object
 * @url (optional) sets a different that the default URL for the dashboard
 */
function Dashboard(browser, url) {
    this.browser = browser;
    this.url = url || browser.baseUrl + '/editor/dashboard';

    this.divDashboard = this.browser.$('.Dashboard');

    this.tblMenuBar = this.browser.$('.MenuBar');
    this.lblPublishedStories = this.tblMenuBar.element(by.linkText('Published Stories'));

    this.divContents = this.divDashboard.$('.dashContent');
    this.hdrHeadline = this.divContents.$('.Headline.HeadlineFilter');

    this.divFirstPublishedStory = this.divContents.$$('.DashboardStory').first();

    this.divFilterTotalCount = this.hdrHeadline.$('.TotalResults');
    this.btnFilterClear = this.hdrHeadline.$('.jsClearFilter');
    this.btnStoryFilter = this.divContents.$('.jsStoryDisplay');
    this.txtStoryFilter = this.divContents.$('.storyDropdown input');
}

Dashboard.prototype.go = function go() {
    browser.driver.get(this.url);
    utils.waitUntilPageReady();
    // hack for stale Elements
    browser.driver.sleep(2000);
}

Dashboard.prototype.gotoPublishedStories = function gotoPublishedStories() {
    this.lblPublishedStories.click();
    utils.waitUntilPageReady();
}

Dashboard.prototype.getHeadlineText = function getHeadlineText() {
    return this.hdrHeadline.getText();
}


Dashboard.prototype.filterByStory = function filterByStory(query) {
    this.btnStoryFilter.click();
    this.txtStoryFilter.sendKeys(query);

    var filteringFinished = EC.presenceOf(this.btnFilterClear);
    this.browser.wait(filteringFinished, 5000);
}

Dashboard.prototype.getFilterCount = function getFilterCount() {
    return this.divFilterTotalCount.getText().then(function(text) {
        return parseInt(text, 10);
    });
}



module.exports = Dashboard;
