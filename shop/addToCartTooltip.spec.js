/*
 * Created by Elias Liedholm on 18/01/2016.
 */
describe('An Add-To-Cart Tooltip ', function() {
    'use strict';

    var EC = require('protractor').ExpectedConditions;
    var utils = require('../helper/utils.js');
    utils.cleanupBaseUrlInConfig(browser);

    var feedProduct; 
    var tooltipCss = "#amazine .Tooltip";
    it('should open over a feed\'s product image', function() {
        browser.driver.get(browser.baseUrl);
        feedProduct = $$("article .imgWrap .isShopLink img").first();
        browser.actions().mouseMove(feedProduct).perform();

        // #amazine should be unique, but it's not - because of reasons. Elias knows why
        var tooltip = $(tooltipCss);
        browser.driver.wait(EC.visibilityOf(tooltip));
        expect(tooltip.isDisplayed()).toBe(true);
    });
    

    var storyTooltip = ".StoryOpen .Tooltip";
    it('should open over a story popup\'s product image', function() {
        // there's an animation on the popup, have to wait until this is finished.
        // otherwise the tooltip would pop up on the story page, and not on the feed!
        browser.driver.sleep(1000);
        
        feedProduct.click()
        utils.waitUntilPageReady(); 

        var storyProduct = $$(".StoryOpen .pImg .isShopLink img").first();
        browser.actions().mouseMove(storyProduct).perform();

        browser.driver.wait(EC.visibilityOf($(storyTooltip)));
        expect($(storyTooltip).isDisplayed()).toBe(true);
    });
    
    it('should be present in the DOM only once while in a story', function() {
        expect($$(tooltipCss).count()).toBe(1);
    });

    it('should hide when hover out', function() {
        browser.actions().mouseMove($('.closeIcon')).perform();
        browser.driver.wait(EC.invisibilityOf($(storyTooltip)));
        expect($(storyTooltip).isDisplayed()).toBe(false);
    });
});
