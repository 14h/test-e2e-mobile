describe('Shop analytics integration', function() {
    var utils = require('../helper/utils');
    utils.cleanupBaseUrlInConfig(browser);

    // GA is configured properly only on the oxid systems
    if (utils.shouldSpecRun('shop_system', 'oxid')) {
        it('should trigger the GA event once when adding product to cart', function() {
            browser.driver.get(utils.overrideFeatures(browser.baseUrl, { "feed_forceShopItTooltip" : false }));
            browser.actions().mouseMove($('.pImg')).perform();
            // TODO hack, because of dom updates
            browser.driver.sleep(1000);
            expect($('.js-stylaAddToCart').isPresent()).toBe(true);
            $('.js-stylaAddToCart').click();
            utils.waitUntilPageReady();

            browser.manage().logs().get('browser').then(function(browserLog) {
                var addToCartEvents = 0;
                utils.getAnalyticsBeacons(browserLog).forEach(function(beacon) {
                    if (
                        beacon.hitType === 'event' &&
                        beacon.eventCategory === 'Styla Feed' &&
                        beacon.eventAction === 'Add to cart'
                       ) {
                           addToCartEvents += 1;
                       }
                });
                expect(addToCartEvents).toBe(1);
            });
        });
    }
});
