// for live tests
const os                = require('os');
const fs                = require('fs');
const stylaHostConfig   = require( './config/hosts.live.conf.js' );

const jobName           = 'e2e run on ${os.hostname()}';


function crx2b64( filename )
{
    return fs.readFileSync( filename ).toString( 'base64' );
}


function runsOnJenkins()
{
    return ( process.env.JENKINS_URL !== undefined );
}

// setup protractor environment
function initProtractor() {
    // add a global logger
    browser.winston = require('winston');
    browser.winston.level = 'info';
    browser.log = browser.winston.log;

    browser.ignoreSynchronization = true;
    // timout for each spec in ms
    // if you adjust this value here, make sure that the timeout in
    // liveTestAll.sh is not too low!
    browser.driver.manage().timeouts().implicitlyWait(10000);

    beforeAll(function () {
        browser.driver.manage().window().setSize(1280, 800);
    });

    // globally add extended jasmine matchers. Don't include them individually in each spec.
    require('jasmine-expect');

    var utils = require('./helper/utils.js');
    var reportDir = 'reports';
    // needs jasmine-reporters >= 2.0.7
    var jasmineReporters = require('jasmine-reporters');
    var SpecReporter = require('jasmine-spec-reporter');
    // returning the promise makes protractor wait for the reporter config before executing tests
    // see https://github.com/larrymyers/jasmine-reporters#multi-capabilities
    return browser.getProcessedConfig().then(function(config) {
        utils.cleanupBaseUrlInConfig(config);

        // jasmine-spec-reporter has nicer output than jasmine-reporters.TerminalReporter
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'summary',
            colors: !runsOnJenkins()
        }));

        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            filePrefix: config.baseUrlNoProto.replace(/\//g, "_"),
            savePath: reportDir,
            modifySuiteName: function(generatedSuiteName, suite) {
                return config.baseUrlNoProto + " : " + generatedSuiteName;
            }
        }));
    });
}

config = {
    //seleniumAddress: 'http://localhost:5555/wd/hub',

    // this would slow down tests dramatically
	// restartBrowserBetweenTests: true,
    sauceUser: 'styla',
    sauceKey: 'd07aa760-bfc5-4a23-943f-9ad3a40ddaa4',
    framework: "jasmine2",
    suites: {
        basic: ['live/basic.spec.js'],
        markup: [
            'live/robotstxt.spec.js',
            'shop/seo.spec.js',
            'shop/smo.spec.js'
            ]
    },


   capabilities: {
      deviceName: 'iPhone 7 Simulator',
      platformName: 'iOS',
      platformVersion: '10.0',
      deviceOrientation : 'portrait',
      browserName: 'Safari',
      appiumVersion: '1.6.3',
  },
  /*
  capabilities: {
     browserName: 'chrome',
     appiumVersion: '1.5.3',
     deviceName: 'Samsung Galaxy S7 Device',
     deviceOrientation: 'portrait',
     platformVersion: '6.0',
     platformName: 'Android',
 },
 */
    baseUrl: "www.amazine.com",
    onPrepare: initProtractor,
    params: stylaHostConfig,

    // ----- Options to be passed to minijasminenode -----
    jasmineNodeOpts: {
        // onComplete will be called just before the driver quits.
        onComplete: null,
        // disable protractor reporter
		print: function() {},
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 300000
    }
}


exports.config = config;
