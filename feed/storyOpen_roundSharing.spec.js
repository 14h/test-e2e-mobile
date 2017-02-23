describe('The sharing icons in a story ', function() {
    var utils = require('../helper/utils.js');

    // TODO monkey-patch this into jasmine, all describes should run in logged-out state by default
    beforeAll(function() {
        browser.driver.get(browser.baseUrl + '/api/logout');
    });
    
    it('should use sharing icon style 1 when storyOpen_roundSharing is turned off', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, { "storyOpen_roundSharing" : false }));
        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        expect($(".PostShare .shareIconStyle1").isPresent()).toBe(true);
    });

    it('should use sharing icon style 2 when storyOpen_roundSharing is turned on', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, { "storyOpen_roundSharing" : true }));
        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        expect($(".PostShare .shareIconStyle2").isPresent()).toBe(true);
    });

    it('should be colored when storyOpen_roundSharing and storyOpen_roundSharing_color is turned on', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, {
            "storyOpen_roundSharing"       : true,
            "storyOpen_roundSharing_color" : true
        }));

        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        expect($(".PostShare .colored").isPresent()).toBe(true);
    });

    it('should not be colored when storyOpen_roundSharing and storyOpen_roundSharing_color is turned off', function() {
        browser.driver.get(utils.overrideFeatures(browser.baseUrl, {
            "storyOpen_roundSharing"       : false,
            "storyOpen_roundSharing_color" : false
        }));
        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        expect($(".PostShare .colored").isPresent()).toBe(false);
    });
});
