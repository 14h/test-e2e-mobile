// conf.js

var os = require('os');
var fs = require('fs');
var jobName = 'e2e run on ' + os.hostname();

var stylaHostConfig = require('./config/hosts.stage.conf.js');

// http://stackoverflow.com/questions/27278222/is-it-possible-to-add-a-plugin-to-chromedriver-under-a-protractor-test/
function crx2b64(filename) {
    return fs.readFileSync(filename).toString('base64');
}

function runsOnJenkins() {
    return (process.env.JENKINS_URL !== undefined);
}

var config = {
    sauceUser: 'styla',
    sauceKey: 'd07aa760-bfc5-4a23-943f-9ad3a40ddaa4',
    framework: "jasmine2",
    suites: {
        // which tests to run for which hosts

        // can be run against all hosts
        general: [
            'feed/*.spec.js',
            ],

        // editor & dashboard tests (CURRENTLY NOT RUN BY ANY PACKAGE!!)
        backoffice: 'backoffice/*.spec.js',

        // fully integrated shops (products, seo)
        shop: 'shop/*.spec.js',

        // basic analytics integration tests
        analytics: 'analytics/*.spec.js',

        // community-related (grazia, rtl) features)
        community: 'community/*.spec.js',

        // special setup for the widget
        widget: 'widget/*.spec.js'
    },
    // when using suite, you cannot override using --specs on commandline
    // suite: 'general',
    capabilities: {
        browserName     : 'chrome', // assumes latest
        chromeOptions   : {
            extensions      : [
                crx2b64( __dirname + '/helper/chromeext/Google-Analytics-Debugger_repacked_enabledByDefault.crx' ),
                crx2b64( __dirname + '/helper/chromeext/analyticsOptOut.crx' ),
            ]
        },
        // should match the version that is currently used in protractor
        // but ... saucelabs is lagging behind on chrome releases, especially on Linux, 
        // so these does not always match 
        // find out supported versions here: 
        // https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options
        'chromedriver-version': '2.21', 
        name: jobName,
        build: process.env.BUILD_TAG
    },
    // must have protocol:// included
    baseUrl: 'http://stage.magalog.net/seo/ci-basic',

    // run once before tests starts
    onPrepare: function onPrepare() {

        // disable angular-specific handling
        browser.ignoreSynchronization = true;

        // implicit wait has some serious issues, so maybe get rid of it later
        // http://stackoverflow.com/questions/25249196/how-to-wait-for-a-page-to-load-or-element-to-be-present-when-using-protractor-fo
        // http://stackoverflow.com/questions/15164742/combining-implicit-wait-and-explicit-wait-together-results-in-unexpected-wait-ti/15174978#15174978
        browser.driver.manage().timeouts().implicitlyWait(20000);

        // add a global logger
        browser.winston = require('winston');
        browser.winston.level = 'info';
        browser.log = browser.winston.log;

        beforeAll(function () {
            browser.driver.manage().window().setSize(1280, 800);
        });

        // globally add extended jasmine matchers. Don't include them individually in each spec.
        require('jasmine-expect');

        // needs jasmine-reporters >= 2.0.7
        var jasmineReporters = require('jasmine-reporters');
        var SpecReporter = require('jasmine-spec-reporter');
		// returning the promise makes protractor wait for the reporter config before executing tests
		// see https://github.com/larrymyers/jasmine-reporters#multi-capabilities
	    return browser.getProcessedConfig().then(function(config) {
            var utils = require('./helper/utils.js');
            utils.cleanupBaseUrlInConfig(config);

            // jasmine-spec-reporter has nicer output than jasmine-reporters.TerminalReporter
            jasmine.getEnv().addReporter(new SpecReporter({
                displayStacktrace: 'summary',
                // displayStacktrace: 'all', // better for developing
                colors: !runsOnJenkins()
            }));

			jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
				consolidateAll: true,
				filePrefix: config.baseUrlNoProto.replace(/\//g, "_"),
				savePath: __dirname + '/reports/',
				modifySuiteName: function(generatedSuiteName, suite) {
					return config.baseUrlNoProto + " : " + generatedSuiteName;
				}
			}));
		});
    },

    // for Jenkins / Sauce Labs integration
    // https://docs.saucelabs.com/ci-integrations/jenkins
    onComplete: function(runner, log) {
        browser.driver.getSession().then(function(session) {
            console.log("SauceOnDemandSessionID=" + session.getId() + " job-name=" + jobName);
        });
    },

    // additional parameters unique for styla hosts
    params: stylaHostConfig,
    // ----- Options to be passed to jasmine2 ------
	// ----- beware, needs to be in jasmine_2_ format, not jasmine1!
    jasmineNodeOpts: {
        // Default time to wait in ms before jasmine assumes a test failure
        // set very high, so that protractor itself times out, and never jasmine
        defaultTimeoutInterval: 300000,
		// Normal protractor / jasmine output disabled -> see JasmineReporter above
		print: function() {}
    }
}

exports.config = config;
