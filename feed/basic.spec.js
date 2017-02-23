describe('A basic feed', function() {

    var utils = require('../helper/utils.js');

    function clearBrowserLogs() {
        browser.manage().logs().get('browser');
    }

    // pretty print
    function ppGAlog(logEntries) {

        var ppLogs = [];
        for (e of logEntries) {
            var gaMessage = JSON.parse(e.message);
            var gaParams = gaMessage.message.parameters;
            if (gaParams != undefined) {
                ppLogs.push(gaParams[0].value);
            }
        }
        return ppLogs;
    }

    function isGAEventFired(gaLogEntries, eventName) {
        for (e of gaLogEntries) {
           if (e.indexOf('eventAction') == 0) {
               return (e.indexOf(eventName) != -1);
           }
        }
        return false;
    }

    it('should have a header', function() {
        browser.driver.get(browser.baseUrl);
        utils.waitUntilPageReady();
        expect($("#amazineFeed").isDisplayed()).toBe(true);
    });

    it('should have at least five stories', function() {
        expect($$('article').count()).toBeGreaterThan(4);
    });

    it('should have images on HTTPS', function() {
        $$('.imageContainer img').getAttribute('src').then(function(srcs) {
            expect(srcs.length).toBeGreaterThan(4);

            srcs.forEach(function(src) {
                expect(src.slice(0, 8)).toEqual('https://');
            });
        });
    });

    it('should be possible to open a profile', function() {
        var accLink = $$(".accLink").first();
        accName = accLink.getAttribute('title');
        accLink.click();
        browser.driver.wait(utils.pageReady, 5000);

        expect($(".userName").getText()).toEqual(accName);
    });

    it('should allow to open a story within the feed', function() {
        clearBrowserLogs();
        var story = $$("article").first();
        story.click();
        utils.waitUntilPageReady();

        var openStory = $('.StoryOpen.content');
        expect(openStory.isDisplayed()).toBeTruthy();
    });


    /* DEACTIVATED FAILING TEST */

    // it('should fire an "Open story" event after a story was openend', function() {
    //     browser.manage().logs().get('browser').then(function(browserLog) {
    //         expect(isGAEventFired(ppGAlog(browserLog), 'Open story')).toEqual(true);
    //     });
    // });


});
