describe('A feed on a live server', function() {

    var utils = require('../helper/utils.js');
    utils.cleanupBaseUrlInConfig(browser);

    var isPageAlive = true;

    beforeAll(function (done) {
        var request = require('request');
        var url = require('url');

        var urlobj = url.parse(browser.baseUrl);
        var mainUrl = urlobj.protocol + '//' + urlobj.host;

        // verify that the main client site it up before verifying the actual magazine
        request(mainUrl, gotResponse);

        function gotResponse(error, response, body) {
            if (error) {
                browser.log('info', mainUrl + ': ' + error.message);
                isPageAlive = false;
            } else {
                browser.log('info', mainUrl + ': ' + response.statusCode);
                isPageAlive = (response.statusCode < 500);
                browser.driver.manage().window().setSize(1280, 800);
                browser.driver.get(browser.baseUrl);
                utils.popupHandling(browser.baseUrlNoProto);
            }
            browser.log('info', 'do tests: ' + isPageAlive);
            done();
        }
    });

    // TODO: change status to pending when page is not alive, after
    // https://github.com/angular/protractor/issues/2454 is resolved
    it('should have a header', function	() {
        if(isPageAlive) {
            expect($("#amazineFeed").isDisplayed()).toBe(true);
        }
    });

    it('should have at least one story', function() {
        if(isPageAlive) {
            expect($$('article').count()).toBeGreaterThan(0);
        }
    });

    if (utils.shouldSpecRun('spec_open_story_disabled')) {
        it('should allow to open the first story within the feed', function() {

            if(isPageAlive) {
                // given
                // this is how it should be
                // var firstStory = $('article');
                // however this only works in chrome - in ff it fails on some magazines
                // the click would do nothing
                var firstStory = $$('.Page article').first();

                // when
                browser.sleep( 1000 );
                //added browser sleep before opening a story, cause the test fails on some magazines "sportschuster"
                firstStory.click();
                utils.waitUntilPageReady();

                // then
                var openStory = $('.ci-story-link');
                expect(openStory.isDisplayed()).toBe(true);
            }
        });

        it('should allow to reload the open story', function() {
            if(isPageAlive) {
                // when
                browser.getCurrentUrl().then(function (url) {
                    browser.driver.get(url);
                });

                // then
                expect($('.StoryOpen .StoryContent').isDisplayed()).toBe(true);
            }
        });
    }

    // not every site has this
    /*
    it('should allow to go back to the main feed from the >Open Magazine< button', function() {
        $('.buttonOpenMag .button').click();
        utils.waitUntilPageReady();

        expect($("#amazineFeed").isDisplayed()).toBe(true);
    });
    */
});
