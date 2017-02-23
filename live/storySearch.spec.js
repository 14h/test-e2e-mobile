var utils = require('../helper/utils.js');

utils.cleanupBaseUrlInConfig(browser);
if (utils.shouldSpecRun('search_enabled')) {
    describe('The search feature for the magazin', function() {


        var EC = protractor.ExpectedConditions; 
        var search = $('#amazine .ProfileSearch');

        beforeAll(function () {
            utils.cleanupBaseUrlInConfig(browser);

            browser.driver.get(browser.baseUrl);
            utils.popupHandling(browser.baseUrlNoProto);
        });

        it('should be accessible from the main feed', function() {
            expect(search.isDisplayed()).toBe(true);
        });

        it('should find a given story', function() {
            var storyTitle = utils.getSiteProperty('search_enabled'); 
            search.$('input').sendKeys(storyTitle, protractor.Key.ENTER).then(function () {

                // need to scroll into view, so that the search result is acutally loaded 
                browser.driver.executeScript(function () { 
                    window.scrollBy(0, window.innerHeight);
                });

                browser.driver.wait(EC.presenceOf($('.FeedSearch')));
                expect($$('article').count()).toBe(1);

                $('article .headline a').getText().then(function(foundTitle) {
                    expect(foundTitle.toLowerCase()).toEqual(storyTitle);
                });
            });
        });
    });
}
