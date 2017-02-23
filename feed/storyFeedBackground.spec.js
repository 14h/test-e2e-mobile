/**
 * Created by maciejhirsz on 22/09/15.
 *
 * WARNING: Due to query string this test will fail in PhantomJS
 */

/* DEACTIVATED FAILING TEST */

// describe('Feed in the background of a Story page', function() {
//     var utils = require('../helper/utils');
//     var storyUrl = null;
//
//     it('Can open the story with feed in the background', function() {
//         browser.driver.get(utils.overrideFeatures(storyUrl, { "story_feedInBackground" : true }));
//         expect($("#amazineFeed").isDisplayed()).toBe(true);
//     });
//
//     it('Can open the story without feed in the background', function() {
//         console.log(storyUrl);
//         browser.driver.get(utils.overrideFeatures(storyUrl, { "story_feedInBackground" : false }));
//         expect($("#amazineFeed").isPresent()).toBe(false);
//     });
// });
