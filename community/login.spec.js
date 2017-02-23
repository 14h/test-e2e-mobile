var Login = require('./loginPageObject.js');

describe('The Community Login Page', function() {

    var login = new Login();
    it('should login the user', function() {
        login.login();
        expect($('.YourMagazine .isMember').isPresent()).toBe(true);
    });

    it('should display profile picture in the header after login', function() {
        expect($('.Header .CreateStory .profileImg').isDisplayed()).toBe(true);
    });
});
