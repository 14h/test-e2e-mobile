/*
 * Created by Elias Liedholm on 17/03/2016.
 */
describe('Theme styling ', function() {
    var utils = require('../helper/utils.js');

    it('should be applied to stories in feed', function() {
        browser.driver.get(browser.baseUrl);
        utils.waitUntilPageReady();

        expect($(".Feed.theme-styling").isPresent()).toBe(true);
    });

    it('should be applied to the search box', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, { "client_feedSearch" : true }));
        expect($(".ProfileSearch.theme-styling").isPresent()).toBe(true);
    });

    it('should be applied to the categories bar', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, { "profile_showBoards" : true }));
        expect($(".Boardbar.theme-styling").isPresent()).toBe(true);
    });

    var feedProduct;
    var EC = require('protractor').ExpectedConditions;
    it('should be applied to Tooltips', function() {
        browser.driver.get(browser.baseUrl);
        feedProduct = $$("article .imgWrap .isShopLink img").first();
        browser.actions().mouseMove(feedProduct).perform();

        var tooltip = $("#amazine:not(.AmazinePopup) .Tooltip");
        browser.driver.wait(EC.visibilityOf(tooltip));
        expect($(".Tooltip.theme-styling").isPresent()).toBe(true);
    });

    it('should be applied to popup close button', function() {
        browser.driver.get(browser.baseUrl);
        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        expect($(".AmazinePopup .close.theme-styling").isPresent()).toBe(true);
    });

    it('should be applied to open story header', function() {
        expect($(".StoryHead .storyHead.theme-styling").isPresent()).toBe(true);
    });

    it('should be applied to open story content', function() {
        expect($(".StoryContent .storyContent.theme-styling").isPresent()).toBe(true);
    });

});
