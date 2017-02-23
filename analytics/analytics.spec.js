describe('Analytics Setup', function() {

    var utils = require('../helper/utils.js');

    function clearBrowserLogs() {
        browser.manage().logs().get('browser');
    }

    it('should fire a GA pageview once on load', function() {
        browser.driver.get(browser.baseUrl);
        browser.driver.wait(utils.pageReady, 5000);
        browser.manage().logs().get('browser').then(function(browserLog) {
            var fired = false;
            var pageviews = 0;
            utils.getAnalyticsBeacons(browserLog).forEach(function(beacon) {
                if (beacon.hitType === 'pageview') {
                    pageviews += 1;
                    if (beacon.location === browser.baseUrl) {
                        fired = true;
                    }
                }
            });
            expect(pageviews).toEqual(1);
            expect(fired).toEqual(true);
        });
    });

    it('should trigger a no-bounce GA event after 10 seconds', function() {
        /*
         * Sleep for 10 seconds to get the no-bounce event.
         *
         * ACHTUNG: `waitUntilPageReady()` is necessary to access the logs!!!
         */
        browser.driver.sleep(10000);
        utils.waitUntilPageReady();

        browser.manage().logs().get('browser').then(function(browserLog) {
            var noBounceEvents = 0;

            utils.getAnalyticsBeacons(browserLog).forEach(function(beacon) {
                if (beacon.hitType === 'event'
                    && beacon.eventCategory === 'Styla No Bounce') {
                    noBounceEvents += 1;
                }
            });

            expect(noBounceEvents).toBe(1);
        });
    });

    it('should fire a GA event and a pageview once when opening a story', function() {
        clearBrowserLogs();

        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        browser.manage().logs().get('browser').then(function(browserLog) {
            var pageviews = 0;
            var storyPageviews = 0;
            var storyEventsFired = 0;

            utils.getAnalyticsBeacons(browserLog).forEach(function(beacon) {
                if (beacon.hitType === 'pageview') {
                    pageviews += 1;
                    if (beacon.page.indexOf('/story/') === 0) {
                        storyPageviews += 1;
                    }
                } else if (beacon.hitType === 'event'
                    && beacon.eventAction === 'Open story') {
                    storyEventsFired += 1;
                }
            });

            expect(pageviews).toEqual(1);
            expect(storyPageviews).toEqual(1);
            expect(storyEventsFired).toEqual(1);
        });
    });

    it('should fire a GA event and a pageview once when closing a story', function() {
        clearBrowserLogs();

        var closeButton = $$('#amazine > .close').first();
        closeButton.click();
        utils.waitUntilPageReady();

        browser.manage().logs().get('browser').then(function(browserLog) {
            var pageviews = 0;
            var storyCloseEventsFired = 0;
            utils.getAnalyticsBeacons(browserLog).forEach(function(beacon) {
                if (beacon.hitType === 'pageview') {
                    pageviews += 1;
                } else if (beacon.hitType === 'event'
                    && beacon.eventAction === 'Close story corner') {
                    storyCloseEventsFired += 1;
                }

            });
            expect(pageviews).toEqual(1);
            expect(storyCloseEventsFired).toEqual(1);
        })
    });
});
