describe('The Editor Dashboard', function() {

    var utils     = require('../helper/utils'),
        Login     = require('../community/loginPageObject'),
        Dashboard = require('./dashboard.po');
        dashboard = new Dashboard(browser);

    it('should allow to navigate to published stories', function() {
        var login = new Login();
        login.login();

        dashboard.go();
        dashboard.gotoPublishedStories();
        expect(dashboard.divFirstPublishedStory.isPresent()).toEqual(true);
    });

    // TODO refactor this - use test data and check if all listed stories match the filter
    it('should allow to filter by story name', function() {
        var query = 'brooklyn';

        // before filter
        dashboard.gotoPublishedStories();
        expect(dashboard.getHeadlineText()).toEndWith(' Published Stories');

        // doing filter
        dashboard.filterByStory(query);
        expect(dashboard.getHeadlineText()).toEndWith(' Published Stories found for \'' + query + '\'');
        expect(dashboard.getFilterCount()).toBeGreaterThan(0);
    });
});
