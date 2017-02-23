describe ('Social Media / Open Graph HTML tags', function () {
    'use strict';

    var cheerio = require('cheerio');
    var utils = require('../helper/utils.js');

    utils.cleanupBaseUrlInConfig(browser);
    
    var PROFILE = 'website';
    var STORY = 'article';

    /**
     * @params {String} expected_type - for og:type
     */
    function _doSmoChecks(expected_type) {
        it('should have only one single <og:title> tag each', function() {
            expect($$("meta[property='og:title']").count()).toBe(1);
        });

        // works only with plugins that use seo api instead of JSF, because of
        // https://trello.com/c/MrziwUOT/687-seo-og-title-and-title-don-t-match-for-all-clients-that-use-jsf-s
        if (utils.shouldSpecRun('seo_api_enabled')) {
            it('should have matching <title and og:title> tags', function() {
                $('title').getInnerHtml().then(function (title) {
                    expect($("meta[property='og:title']").getAttribute('content')).toEqual(title);
                });
            });
        }

        it('should have only one single <og:url> tag', function() {
            expect($$("meta[property='og:url']").count()).toBe(1);
        });

        // TODO possible bug or other problem with
        // $("link[rel='canonical']").getAttribute('href')
        // it adds trailing slashes, even though they are not there in
        // $("link[rel='canonical']").getInnerHtml()
        it('should have matching <link canonical and og:url> tags', function() {
            $("meta[property='og:url']").getAttribute('content').then(function (url) {
                var urlPossibleTrailingSlash = new RegExp(url + '/?');
                expect($("link[rel='canonical']").getAttribute('href')).toMatch(urlPossibleTrailingSlash);
            });
        });

        if(utils.shouldSpecRun('shop_system', 'oxid') && expected_type === STORY) {
            it('should have trailing slashes in <og:url> tags on oxid systems', function() {
                expect($("meta[property='og:url']").getAttribute('content')).toEndWith('/');
            });
        }

        // test proposed by ssachtleben
        it('should have the correct og:type', function() {
            $("meta[property='og:type']").getAttribute('content').then(function (type) {
                expect(type).toEqual(expected_type);
            });
        });


        // following test is mandatory only on a story page
        var verb = (expected_type === PROFILE ? 'might' : 'should');
        var has_og_image = false;
        it(verb + ' have at least one valid <og:image> tag', function() {
            var og_images = $$("meta[property='og:image']");
            og_images.count().then(function(count) {
                if (count > 0) {
                    has_og_image = true;

                    og_images.first().getAttribute('content').then(function (imageUrl) {
                        expect(imageUrl.substring(0, 4)).toEqual('http');
                    });
                } else {
                    if (expected_type === PROFILE) { 
                        browser.log ('info', 'no og:image found, ignoring this test.');
                    } else {
                        fail('missing og:image tag on story page');
                    }
                }
            });
        });

        it('should have valid <og:image:width / height> tags', function() {

            // this tests depends on the previous test
            // because of protractor's control flow, you cannot skip tests outside of the 'it', only inside
            // also because of https://github.com/angular/protractor/issues/2454
            // we cannont mark tests as pending. 
            if (has_og_image) {
                // og:image:width _must_ follow og:image
                var og_image_width = $("meta[property='og:image'] + meta");

                og_image_width.getOuterHtml().then(function(html) {
                    browser.log('debug', 'og_image_width html: ' + html);
                    var parser = cheerio.load(html);
                    expect(parser('meta').attr('property')).toEqual('og:image:width');
                    var width = parseInt(parser('meta').attr('content'));
                    expect(width).toBeWholeNumber();
                });

                // og:image:height _must_ follow og:image:width
                var og_image_height = $("meta[property='og:image:width'] + meta");

                og_image_height.getOuterHtml().then(function(html) {
                    var parser = cheerio.load(html);
                    expect(parser('meta').attr('property')).toEqual('og:image:height');
                    var height = parseInt(parser('meta').attr('content'));
                    expect(height).toBeWholeNumber();
                });
            }
        });
    }


    var firstStoryUrl;

    describe('in a feed page (Javascript enabled)', function() {

        beforeAll(function () {
            browser.driver.get(browser.baseUrl);
        });

        _doSmoChecks(PROFILE);
    }); 


    describe('in a story page (Javascript enabled)', function() {

        beforeAll(function () {
            $$('article .headline a').first().getAttribute('href').then(function (storyUrl) {
                firstStoryUrl = storyUrl;
                browser.driver.get(firstStoryUrl);
            });
        });

        _doSmoChecks(STORY);
    }); 

    describe('in a feed page (Javascript disabled)', function() {
        
        beforeAll(function (done) {
            // open a dummy page to start fresh
            browser.driver.get('about:/');
            
            utils.loadPageSrc(browser.baseUrl).then(function(pageSrc) {
                utils.injectHeadOnly(pageSrc, done);
            });
        });

        _doSmoChecks(PROFILE);
    }); 


    describe('in a story page (Javascript disabled)', function() {

        beforeAll(function (done) {
            utils.loadPageSrc(firstStoryUrl).then(function(pageSrc) {
                utils.injectHeadOnly(pageSrc, done);
            });
        });

        _doSmoChecks(STORY);
    }); 
});
