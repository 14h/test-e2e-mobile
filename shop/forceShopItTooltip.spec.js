/**
 * Created by christian korndoerfer on 07/10/15.
 * Testing the 'feed_forceShopItTooltip' feature flag which force "add to cart" tooltips to always be "shop it" tooltips
 */

describe('The "Go to shop" tooltip ', function() {
    var utils = require('../helper/utils');

    it('should be hidden when feature is turned off', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, { "feed_forceShopItTooltip" : false }));
        browser.actions().mouseMove($('.pImg')).perform();
        // TODO hack, because of dom updates
        browser.driver.sleep(1000);
        expect($(".Tooltips .Product").isPresent()).toBe(true);
        expect($(".Tooltips .isShopLink").isPresent()).toBe(false);
    });

    it('should be visible when feature is turned on', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, { "feed_forceShopItTooltip" : true }));
        browser.actions().mouseMove($('.pImg')).perform();
        // TODO hack, because of dom updates
        browser.driver.sleep(1000);
        expect($(".Tooltips .Product").isPresent()).toBe(false);
        expect($(".Tooltips .isShopLink").isPresent()).toBe(true);
    });
});
