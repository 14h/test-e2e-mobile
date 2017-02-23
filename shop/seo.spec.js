describe ('SEO HTML tags', function () {
    'use strict';

    var utils = require('../helper/utils.js');
    var assert = require('assert');
    var cheerio = require('cheerio');

    utils.cleanupBaseUrlInConfig(browser);

    function _doCommonBrowserChecks() {
        it('should have exactly one single <title> tag', function() {
            expect($$('title').count()).toBe(1);
        });

        it('should have exactly one single <link canonical> tag', function() {
            expect($$("link[rel='canonical']").count()).toBe(1);
        });
    }


    if (utils.shouldSpecRun('seo_disabled')) {

        var firstStoryUrl;
        // see comments in smo.spec.js about this trailing slash issue
        var baseurlPossibleTrailingSlash = new RegExp(browser.baseUrl + '/?');

        describe('in a feed page (Javascript enabled)', function() {

            beforeAll(function () {
                browser.driver.get(browser.baseUrl);
            });

            _doCommonBrowserChecks(browser.baseUrl);

            it('should have <link canonical> matching the current url', function() {
                expect($("link[rel='canonical']").getAttribute('href')).toMatch(baseurlPossibleTrailingSlash);
            });
        });


        describe('in a story page (Javascript enabled)', function() {

            beforeAll(function () {
                $$('article .headline a').first().getAttribute('href').then(function (storyUrl) {
                    firstStoryUrl = storyUrl;
                    browser.driver.get(firstStoryUrl);
                });
            });

            _doCommonBrowserChecks();

            it('should have <link canonical> matching the current url', function() {
                assert(firstStoryUrl != undefined);
                expect($("link[rel='canonical']").getAttribute('href')).toEqual(firstStoryUrl);
            });
        });


        describe('in a feed page (Javascript disabled)', function() {
            var pageSrc;

            beforeAll(function (done) {
                // open a dummy page to start fresh
                browser.driver.get('about:/');

                utils.loadPageSrc(browser.baseUrl).then(function(pageSrc_) {
                    pageSrc = pageSrc_;
                    utils.injectHeadOnly(pageSrc, done);
                });
            });

            _doCommonBrowserChecks();

            it('should have <link canonical> matching the current url', function() {
                expect($("link[rel='canonical']").getAttribute('href')).toMatch(baseurlPossibleTrailingSlash);
            });
            
        });


        describe('in a story page (Javascript disabled)', function() {
            var pageSrc;

            beforeAll(function (done) {
                utils.loadPageSrc(firstStoryUrl).then(function(pageSrc_) {
                    pageSrc = pageSrc_;
                    utils.injectHeadOnly(pageSrc, done);
                });
            });

            _doCommonBrowserChecks();

            // because of the frakking ControlFlow crap of webdriverjs, here firstStory URL is only defined at runtime
            // so this test cannot be setup in _doCommonBrowserChecks().
            it('should have <link canonical> matching the current url', function() {
                assert(firstStoryUrl != undefined);
                expect($("link[rel='canonical']").getAttribute('href')).toEqual(firstStoryUrl);
            });


            it('should have exactly one <stylaContentSEO> id element in body', function() {
                assert(pageSrc != null);
                var parser = cheerio.load(pageSrc);

                expect(parser("#stylaContentSEO").length).toBe(1);
            });

        });

        describe('for seo pagination (Javascript disabled)', function() {
            var pageSrc;
            var previousNextLink;

            beforeAll(function (done) {
                // open a dummy page to start fresh
                browser.driver.get('about:/');

                utils.loadPageSrc(browser.baseUrl).then(function(pageSrc_) {
                    pageSrc = pageSrc_;
                    done();
                });
            });

            it('should have valid <link next> tag', function() {
                assert(pageSrc != null);
                var parsedPage = cheerio.load(pageSrc);
                var nextLink = parsedPage("link[rel='next']").attr('href');
                expect(nextLink).not.toBe(null);
                previousNextLink = nextLink;
            });

            it('should have different <link next> tag on next page', function(done) {
                assert(previousNextLink != undefined && previousNextLink != '');
                utils.loadPageSrc(previousNextLink).then(function(nextPageSrc) {
                    var parsedNextPage = cheerio.load(nextPageSrc);
                    expect(parsedNextPage("link[rel='next']").attr('href')).not.toBe(previousNextLink);
                    done();
                });

            });

        });

        // tags are only setup on the october magazine
        if (utils.shouldSpecRun('shop_system', 'october')) {

            var tagUrl = browser.baseUrl + '/tag/weather';
            describe('on a tag feed (Javascript enabled)', function() {

                beforeAll(function () {
                    browser.driver.get(tagUrl);
                });

                _doCommonBrowserChecks();

                // disabled, breaks on test magazine, but works on live. needs further investigation
                it('should have robots meta', function() {
                    expect($("meta[name=robots]").getAttribute('content')).toEqual("noindex");
                });
            });


            describe('on a tag feed (Javascript disabled)', function() {

                beforeAll(function (done) {
                    utils.loadPageSrc(tagUrl).then(function(pageSrc_) {
                        utils.injectHeadOnly(pageSrc_ + '/tag/running', done);
                    });
                });


                _doCommonBrowserChecks();

                // see above
                it('should have robots meta', function() {
                    expect($("meta[name=robots]").getAttribute('content')).toEqual("noindex");
                });
            });
        }
    }
});
