// playground to test stuff
xdescribe('Amazine homepage', function() {
  it('should have a title', function() {
    browser.driver.get('http://' + browser.params.url + '/latest');
	Test = require('./loginPageObject.js');
	t = new Test()

    expect(browser.driver.getTitle()).toEqual('Latest Feed | amazine.com - Curate Your Amazing Magazine');
    expect($('.signupLink').getText()).toEqual('Join now');
	expect($$('article').then(function(data){return data.length;})).toBeGreaterThan(4);
    expect($('#amazineFeed article').isDisplayed()).toBe(true);
  });

  it("should not find an element - (test)", function() {
     browser.driver.get('http://' + browser.params.url + '/latest');
     $('#amazineFexed').getText();
  });

  
  it("page reaady test", function() {
     browser.driver.get('http://' + browser.params.url + '/latest');
     $('.story4').getText();
  });
});
