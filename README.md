# Protractor (uses Selenium and Jasmine) E2E Tests

Tests over the whole deployed application stack which cover multiple services (like frontend + backend + productapi + seoapi)

## default setup via Sauce Labs
To execute the tests on Sauce Labs, run the following commands in this folder

    npm install
    npm test

(This will launch multiple protractor runs sequentially, one for each target host the tests run against)

While running tests it will print URLs where to see details about the testruns. The URL have the format ```https://saucelabs.com/jobs/xxx```. You'll find the Sauce Labs credentials in LastPass.

You can also limit the tests by team responsibility: `npm test -- doge` or `npm test -- nyan`

## local setup (faster!)

Run tests locally when you
 - want to see immediately how tests execute
 - need to write new tests
 - want them to run faster!

to run locally, do this:

`(sudo) ./webdriverStart.sh`

`npm run testlocal` (to run all tests against all configured staging servers) *or*

`./protractorLocal.sh --baseUrl <magazine address> --specs path/to/your/spec.js`(if you want to run just a subset)

If driver doesn't start with the correct version do the following:

`npm remove webdriver-manager`

`npm install webdriver-manager`

To avoid typing sudo, follow this guide: http://stackoverflow.com/questions/19352976/npm-modules-wont-install-globally-without-sudo

### configs files and parameters

`./protractorLocal.sh` is just a wrapper around protractor, so it takes the same arguments. Helpful options
- `--baseUrl`: run tests on a different server than `stage.magalog.net`, e.g. `--baseUrl=http://oxid4.magalog.net/magazine`
- `--browser`: use a different browser than Chrome, e.g. `--browser firefox`
- `--specs`: choose the spec to run, e.g. `--specs shop/seo.spec.js`
- `--suite`: choose a predefined set of specs as configured in `develop.conf.js`, e.g. `--suite shop`

Settings for the e2e environment are defined in `develop.conf.js`. Settings for different staging servers are in `config/hosts.stage.conf.js`.

## LiveTests

All magazines are regulary checked via a Jenkins job on the ```stage``` branch, using a subeset of the regular tests. Live tests are executed via the ```./liveTestAll.sh``` script.

Notable configuration files:
 - magazines.live : defines which magazine urls are being checked against.
 - magazines.test : Use this file to test-run
 - config/hosts.live.conf.js : Additional settings for each magazine, e.g. for popup handling

Example: `./liveTestAll.sh --magazine-file magazines.test -- --browser chrome`

### resources

Protractor: https://github.com/angular/protractor/blob/master/docs/toc.md

Selenium: http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver.html

Jasmine 2.4: http://jasmine.github.io/2.4/introduction.html

Page Objects: https://code.google.com/p/selenium/wiki/PageObjects

Protractor Slides: http://ramonvictor.github.io/protractor/slides/


### Adding new tests

1. setup tests to run locally, not on SauceLabs (see above)
2. create a new spec file with your tests
  - put it into feed directory, they will be excecuted against stage.styla.com
  - put it into shop directory, it will be executed against the shopping test servers
3. write your tests (see tips below)
  - do not hard code host names in your tests. use ```browser.baseUrl``` instead
4. verify that your tests passes locally by running ./protractorLocal.sh --specs path/to/your/new/spec.js
5. after you're done, verify that test passes also on SauceLabs by running ./protractorSauce.sh --specs path/to/your/new/spec.js


### some commands to help you get started in writing specs

**Protractor/Selenium Webdriver**

call a page

    browser.driver.get('http://stage.styla.com');

find an element (returns a WebElement)

    browser.driver.findElement(By.css("#amazineFeed"));
    element(By.css("#amazineFeed");
    $("#amazineFeed);

find an element inside of another element

    browser.driver.findElement(By.css("#amazineFeed")).findElement(By.css("article"));
    element(By.css("#amazineFeed").element(By.css("article");
    $("#amazineFeed).$("article);

find a list of elements (returns an array of WebElement)

    browser.driver.findElements(by.css('article'));
    elements(by.css('article'));
    $$('article');

click an element

    browser.driver.findElement(By.css("article")).click();
    $("article").click();

check its visibility

    expect(browser.driver.findElement(By.css("#amazineFeed")).isDisplayed()).toBe(true);
    expect($("#amazineFeed").isDisplayed()).toBe(true);

return number of elements

    browser.driver.findElements(by.css('article')).then(function(data){return data.length;});
    $$('article').count();

get the visible (i.e. not hidden by CSS) innerText of this element

    browser.driver.findElement(By.css(".signupLink")).getText();
    $(".signupLink").getText();

return the value of the given attribute

    browser.driver.findElement(By.css(".accLink")).getAttribute('title');
    $(".accLink").getAttribute('title');

find a link by its text

    element(By.linkText("Join Now"))

**Jasmine**

match it against some expected string

    expect(browser.driver.findElement(By.css(".signupLink")).getText()).toMatch("Join now");
    expect($('.signupLink).getText()).toMatch("Join now");

some more matchers

    expect($$('article').count()).toBe(5);
    expect($$('article').count()).toEqual(5);
    expect($$('article').count()).toBeGreaterThan(5);

## debugging help

see http://angular.github.io/protractor/#/debugging

## hints

### Implicit waiting time

We configured Selenium to wait for each findElement up to 10 seconds to appear.

    browser.driver.manage().timeouts().implicitlyWait(10000);

This does not help if you want to find all elements, like

    $$('article').count();

This will only wait until the first article element is present, so this call could return 1 or any other higher number.

To make sure that the page finishes loading, use

    var utils = require('helper/utils.js');
    utils.waitUntilPageReady();


### Stale Element Exception

Sometimes there appear Selenium Stale Element Exceptions. That normally happens if you first use findElement or findElements to get some elements, and then in a second step do an action on them, a display check or a further findElement, while in between the 2 requests something changed the DOM and the element is not there anymore. This is mostly because of a render of the page, so some requests were still open.

The following example will be done in 2 requests to the Selenium server, you will see it if you watch the selenium log while executing.

    browser.driver.findElement(By.css("article")).click()

Whereas if you use the protractor version instead of the native Selenium Webdriver, it will issue the 2 requests together, because protractor always waits to issue an action on any selector you are doing, so the first part $('article') does not trigger a request to the selenium server, only when followed by an action like .click()

    $('article').click()
