describe ('Sitemap Linking', function() {
    'use strict';

    var utils = require('../helper/utils.js');
    var robots = require('robots');

    beforeAll(function () {
        utils.setup(browser);
    });

    describe('robots txt file', function() {

        var robotsParser = new robots.RobotsParser();
        it ('should be available', function(done) {
            var robotsUrl = utils.buildUrl('/robots.txt');

            robotsParser.setUrl(robotsUrl, function(undefined, success) {
                expect(success).toEqual(true);
                done();
            });
        });

        var allSitemaps = null;
        it ('should have at least one sitemap entry', function(done) {

            browser.log('debug', robotsParser.toString());
            robotsParser.getSitemaps(function (sitemaps) {
                allSitemaps = sitemaps;
                expect(allSitemaps.length > 0).toEqual(true);
                done();
            });
        });

        it ('should have at least one styla magazine sitemap entry', function() {
            browser.log('debug', allSitemaps);
            var stylaSiteMaps = allSitemaps.filter (function (entry) {
                return (entry.indexOf('amazine') >= 0 || entry.indexOf('styla') >= 0);
            });

            // console.log(stylaSiteMaps);
            expect(stylaSiteMaps.length > 0).toEqual(true);
        });
    });
});
