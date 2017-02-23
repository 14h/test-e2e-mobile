describe ('the sitemaps.xml file', function () {
    'use strict';

    var utils = require('../helper/utils.js');

    it ('should contain protocol in URL', function(done) {
        var url = utils.buildUrl('/ci-selfmade/sitemap.xml', 'sitemaps');

        utils.fetchXmlAsJson(url, function(xml) {
            xml.sitemapindex.sitemap.forEach(function(sitemap) {
                sitemap.loc.forEach(function(path) {
                    expect(path).toMatch(/https?:\/\//i);
                });
            });
            done();
        });
    });

    it ('shouldn\'t contain magazine url, but /user and /category urls in pages.xml', function(done) {
        var url = utils.buildUrl('/ci-selfmade/pages.xml', 'sitemaps');
        var hasUserPath = false;
        var hasMagazinePath = false;
        var hasCategoryPath = false;
        // this is the magazine root url in pages sitemap, the rest should be based on this:
        var rootUrl = 'http://static.styla.com/stage';

        utils.fetchXmlAsJson(url, function(xml) {
            xml.urlset.url.forEach(function(url) {
                url.loc.forEach(function(path) {
                    expect(path).toContain(rootUrl);
                    // covers both magazine url and main user path
                    hasMagazinePath = hasMagazinePath || /\/ci-selfmade$/.test(path);
                    hasUserPath     = hasUserPath     || path.replace(rootUrl, '').indexOf('user/') != -1;
                    hasCategoryPath = hasCategoryPath || path.replace(rootUrl, '').indexOf('category/') != -1;
                });
            });

            expect(hasUserPath).toEqual(true);
            expect(hasMagazinePath).toEqual(false);
            expect(hasCategoryPath).toEqual(true);
            done();
        });
    });

    it ('should contain stories ordered by published date for stories_2000-0.xml', function(done) {
        var url = utils.buildUrl('/ci-selfmade/stories_2000-0.xml', 'sitemaps');
        var lastDate;

        utils.fetchXmlAsJson(url, function(xml) {
            xml.urlset.url.forEach(function(url) {
                var date = new Date(url.lastmod[0]);
                if(lastDate) expect(lastDate).not.toBeLessThan(date);
                lastDate = date;
            });

            done();
        });
    });
});
