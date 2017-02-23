describe('The story screenshot ', function() {
    var utils = require('../helper/utils.js');

    it('should render images as divs with background-image', function() {
        browser.driver.get(browser.baseUrl);
        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        browser.driver.executeScript(function() {
            permalink = window.location.href.match(/[^/]*$/g)[0];
            return window.styla.require('api/model/db/stories').instance().find(function (model) {return model.getPermalinkSlug() === permalink;}).id;
        }).then(function(id) {
            browser.driver.get(browser.baseUrl + '/storyScreen/' + id);
            utils.waitUntilPageReady();

            expect($(".imageContainer div.i1").isPresent()).toBe(true);
        });

    });

});
