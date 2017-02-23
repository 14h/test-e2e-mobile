
const cheerio   = require( 'cheerio' );
const request   = require( 'request' );
const xml2js    = require( 'xml2js' );
const driver    = browser.driver;



/**
 * ## buildUrl
 *
 * builds a url using browser protocol
 * a given subdomain will overwrite the previous one
 *
 * @param {String} path path
 * @param {String} subdomain new subdomain
 *
 * @return _String_ assembled url
 */
exports.buildUrl = function( path, subdomain )
{
    let url     = require( 'url' );
    let host    = url.parse( browser.baseUrl );
    let fqdn    = host.host;

    if ( subdomain )
    {
        fqdn = subdomain + fqdn.substring( fqdn.indexOf( '.' ) );
    }

    return host.protocol + `//${fqdn}${path}`;
};


/**
 * ## cleanupBaseUrlInConfig
 *
 * allow baseUrl parameter both with or without 'http://'
 *
 * @param {String} configObj configiuration data
 *
 * @return _Void_
 */
exports.cleanupBaseUrlInConfig = function( configObj )
{
    let protocol = configObj.baseUrl.match( /^https?:\/\// );

    if ( protocol == null )
    {
        configObj.baseUrlNoProto    = configObj.baseUrl;
        configObj.baseUrl           = `http://${configObj.baseUrl}`;
    }
    else
    {
        configObj.baseUrlNoProto    = configObj.baseUrl.replace( protocol[0], '' );
    }
};


/*
 * exports the config params
 */
exports.config = browser.params;


/**
 * ## fetchXmlAsJson
 *
 * gets XML from URL as JSON object
 *
 * @param {String} url fetch url
 * @param {Function} callback callback to run after fetch
 *
 * @return _Void_
 */
exports.fetchXmlAsJson = function( url, callback )
{
    let parser  = new xml2js.Parser();
    let conf    = { uri : url, timeout : 5000 };

    request( conf, ( error, response, body ) =>
    {
        if ( error || response.statusCode != 200 )
        {
            fail( error );
        }
        else
        {
            parser.parseString( body, ( error, xml ) =>
            {
                if ( error )
                {
                    fail( error );
                }

                callback( xml );
            } );
        }
    } );
};


/**
 * ## getAnalyticsBeacons
 *
 * translates analytics into readable results
 *
 * @param {String} browserLog log in original format
 *
 * @return _Array_ translated ga params
 */
exports.getAnalyticsBeacons = function( browserLog )
{
    let pattern = /Sent beacon:\s*([^\s]+)/i;

    let paramToKey = {
        't'     : 'hitType',
        'ea'    : 'eventAction',
        'ec'    : 'eventCategory',
        'dl'    : 'location',
        'dt'    : 'title',
        'dp'    : 'page',
        'tid'   : 'trackingId'
    };

    let _arr = [ ...Array( 21 ).keys() ].slice( 1 );
    _arr.forEach( n =>
    {
        paramToKey[ `cd${n}` ] = `dimension${n}`;
        paramToKey[ `cm${n}` ] = `metric${n}`;
    } );

    let logs = this.prettyPrintAnalyticsLogs( browserLog );

    return logs.map( item =>
    {
        let match = pattern.exec( item );

        if ( match != null && match[ 1 ] )
        {
            let params = {};
            match[ 1 ].split( '&' ).forEach( entry =>
            {
                entry       = entry.split( '=' );
                let key     = paramToKey[ entry[ 0 ] ];
                let value   = decodeURIComponent( entry[ 1 ] );

                if ( key != null )
                {
                    params[ key ] = value;
                }
            } );

            return params;
        }
    } );
}


/**
 * ## getSiteProperty
 *
 * gets a site's property if it exists
 *
 * @param {String} property prop to retrieve
 *
 * @return _Object_ property to be retrieved
 */
exports.getSiteProperty = function( property )
{
    let site = this.config[ browser.baseUrlNoProto ];

    if ( site && site[ property ] )
    {
        return site[ property ];
    }

    throw `No such property: ${browser.baseUrlNoProto}>${property}`;
};


/**
 * ## injectHeadOnly
 *
 * injects the <head> only into a running browser, replacing current page
 *
 * @param {String} pageSrc page url
 * @param {Function} cbDone done callback
 *
 * @return _Void_
 */
exports.injectHeadOnly = function( pageSrc, cbDone )
{
    let parser      = cheerio.load( pageSrc );
    let pageHead    = parser( 'head' ).html();
    let fakePage    = `<html>
                            <head>${pageHead}</head>
                            <body>Fake head-only for ${parser( 'title' ).text()}</body>
                        </html>`;

    browser.log( 'debug', 'injected head:', fakePage );

    driver.executeScript( page =>
    {
        document.write( page );
        document.close();
    }, fakePage );

    cbDone();
};


/**
 * ## joinUrlElements
 *
 * joins supplied url args into one string
 * http://stackoverflow.com/questions/16301503/can-i-use-requirepath-join-to-safely-concatenate-urls
 *
 * @return _String_
 */
exports.joinUrlElements = function()
{
    let regex   = new RegExp( '^\/|\/$','g' ),
    args        = Array.prototype.slice.call( arguments );

    return args.map( element =>
    {
        return element.replace( regex, '' );
    } ).join( '/' );
};


/**
 * ## loadPageSrc
 *
 * loads the page source
 *
 * @param {String} url url to load
 *
 * @return _Promise_ page source
 */
exports.loadPageSrc = function( url )
{
    let d = protractor.promise.defer();

    request( url, ( error, response, body ) =>
    {
        if ( error && response.statusCode != 200 )
        {
            fail( error );
        }
        else
        {
            d.fulfill( body );
        }
    } );

    return d;
};


/**
 * ## overrideFeatures
 *
 * adds feature overrides to the url
 *
 * @param {String} url url to be added to
 * @param {Object} features features to override
 *
 * @return _String_ altered url
 */
exports.overrideFeatures = function( url, features )
{
    url += url.indexOf( '?' ) === -1 ? '?' : '&';
    url += '__featureOverride=' + JSON.stringify( features );

    return url;
};


/**
 * ## pageReady
 *
 * tests if a styla page has finished building
 *
 * @return {Boolean} page ready or not
 */
exports.pageReady = function()
{
    return driver.executeScript( () =>
    {
        if ( typeof styla === 'undefined' )
        {
            return 9;
        }

        if ( !styla.require( 'core/lib/backbone' ).History.started )
        {
            return 8;
        }

        return styla.require( 'core/lib/jquery' ).active;
    } ).then( ret =>
    {
        return ret == 0;
    } );
};


/*
 * how long to wait until page is ready - in ms
 */
exports.pageReadyTimeout = 10000;


/**
 * ## popupHandling
 *
 * destroys the first DOM element it finds with the given class
 *
 * @param {String} url url to check
 *
 * @return _Void_
 */
exports.popupHandling = function( url )
{
    let config    = this.config;

    if ( url[ url.length - 1 ] === '/' )
    {
        url = url.split( '' );
        url.pop();
        url = url.join( '' );
    }


    let configUrl = config[ url ] || config[ `${url}/` ];

    if ( configUrl && configUrl.popup_close_css )
    {
        console.log( 'popup handling active for this site' );
        driver.sleep( 1000 );

        configUrl.popup_close_css.forEach( popupCloseSelector =>
        {
            let popupCloseButton    = $( popupCloseSelector );

            popupCloseButton.isDisplayed().then( () =>
            {
                console.log( 'popup found' );

                driver.executeScript( selector =>
                {
                    let popupCloseArray = document.querySelectorAll( selector );
                    Array.prototype.slice.call( popupCloseArray ).forEach( _el =>
                    {
                        _el.parentNode.removeChild( _el );
                    } );
                }, popupCloseSelector );

                driver.sleep( 2000 );

            } ).then( null, onError =>
            {
                console.log( 'there was an error removing the popup - continuing ...' );
            } );
        } );
    }
};


/**
 * ## prettyPrintAnalyticsLogs
 *
 * pushes only the needed values to the logs
 *
 * @param {Array} browserLog array of data objects
 *
 * @return _Array_ array of cleaned up values
 */
exports.prettyPrintAnalyticsLogs = function( browserLog )
{
    let ppLogs = [];

    browserLog.forEach( e =>
    {
        try
        {
            let gaMessage   = JSON.parse( e.message );
            let gaParams    = gaMessage.message.parameters;

            if ( gaParams != null )
            {
                let log = gaParams[ 0 ].value;
                ppLogs.push( log );

            }
        }
        catch( e )
        {}
    } );

    return ppLogs;
};


/**
 * ## scrollIntoView
 *
 * scrolls into view when an element is outside of browser window
 *
 * @param {Object} element protractor ElementFinder
 *
 * @return _Void_
 */
exports.scrollIntoView = function( element )
{
    driver.executeScript( el =>
    {
        el.scrollIntoView( true );
    }, element.getWebElement() );
};


/**
 * ## setup
 *
 * this is a wrapper around all necessary setup funtions
 *
 * @param {Object} configObj config object
 *
 * @return _Void_
 */
exports.setup = function( configObj )
{
    this.cleanupBaseUrlInConfig( configObj );
};


/**
 * ## shouldSpecRun
 *
 * test if the spec can run or not
 *
 * @param {String} property which property to look up
 * @param {String} compare optional. Which value to compare the property against
 *
 * @return _Boolean_
 */
exports.shouldSpecRun = function( property, compare )
{
    if ( compare === undefined )
    {
        return this._shouldSpecRun_oneArg( property );
    }
    else
    {
        return this._shouldSpecRun_twoArgs( property, compare );
    }
};


/**
 * ## _shouldSpecRun_oneArg
 *
 * helper to decide if the spec should run when there is only one argument
 *
 * @param {String} property which property to look up
 *
 * @return _Boolean_
 */
exports._shouldSpecRun_oneArg = function( property )
{
    let disabled    = property.split( '_' ).pop() === 'disabled';
    let site        = this.config[ browser.baseUrlNoProto ];
    let shouldRun   = site && site[ property ];

    if ( disabled )
    {
        shouldRun = !shouldRun;
    }

    if ( disabled && !shouldRun )
    {
        console.log ( `skipping some tests because of ${property}` );
    }

    if ( !disabled && shouldRun )
    {
        console.log ( `running extra tests because of ${property}` );
    }

    return shouldRun;
};

/**
 * ## _shouldSpecRun_twoArg
 *
 * helper to decide if the spec should run when there are two arguments
 *
 * @param {String} property which property to look up
 * @param {String} compare which value to compare the property against
 *
 * @return _Boolean_
 */
exports._shouldSpecRun_twoArgs = function( property, compare ) {
    try 
    {
        let shouldRun = ( this.getSiteProperty( property ) === compare );
        if ( shouldRun ) 
        {
            console.log( 'runnig extra test because ' + property + ' = ' + compare );
        }
        return shouldRun;
    } catch (e) // property is not added to site config
    {
        browser.log('debug', e);
        return false;
    }
}

/**
 * ## waitUntilPageReady
 *
 * after click() returns -> page has not immediately started loading...
 *
 * @return _Void_
 */
exports.waitUntilPageReady = function()
{
    browser.sleep( 3000 );
    //increased browser sleep from 500 to 3000

    driver.getCurrentUrl().then( url =>
    {
        driver.wait( this.pageReady, this.pageReadyTimeout );
    } );
};
