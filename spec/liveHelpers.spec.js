// mocking protractor globals
jasmine.getGlobal().browser = {
    baseUrlNoProto : 'irrelevant'
}

var liveHelpers = require('../helper/live.js');
describe ('shouldSpecRun', function () {
   
    it ('should mark a spec as runnable when the site has a given property', function () {
        liveHelpers.config = {
            'irrelevant': {
                spec_enabled: null
            }
        }
        expect(liveHelpers.shouldSpecRun('spec_enabled')).toEqual(true);
    });
    
    it ('should mark a spec as skippable when the site does not have a given property ', function () {
        liveHelpers.config = {
            'irrelevant': {
            }
        }
        expect(liveHelpers.shouldSpecRun('spec_enabled')).toEqual(false);
    });
    
    it ('should mark spec as skippable when the site has a property ending with _disabled', function () {
        liveHelpers.config = {
            'irrelevant': {
                spec_disabled: null
            }
        }
        expect(liveHelpers.shouldSpecRun('spec_disabled')).toEqual(false);
    });
    
    it ('should mark a spec as runnable when the site does not have a property ending with _disabled', function () {
        liveHelpers.config = {
            'irrelevant': {
            }
        }
        expect(liveHelpers.shouldSpecRun('spec_disabled')).toEqual(true);
    });
});

describe ('getSiteProperty', function() {

    it ('should throw an Exception when the property does not exit for that url', function () {
        liveHelpers.config = {
            'irrelvant': {
                existing_prop: "value"
            }
        }

        expect(function () {
            liveHelpers.getSiteProperty('non_existing_prop'); 
        }).toThrow();
    });
    it ('should throw an Exception when that url does not have any properties', function () {
        liveHelpers.config = {
            'irrelvant': {
            }
        }

        expect(function () {
            liveHelpers.getSiteProperty('non_existing_prop'); 
        }).toThrow();
    });
});
