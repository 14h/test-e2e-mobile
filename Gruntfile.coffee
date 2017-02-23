module.exports = (grunt) ->

    require('load-grunt-tasks')(grunt)

    # Project configuration
    grunt.initConfig

        # Configuration for protractor e2e tests
        # https://github.com/teerapap/grunt-protractor-runner
        protractor:
            options:
                configFile: "develop.conf.js"
                keepAlive: true,

            # one task per host to test against
            general:
                options:
                    args:
                        suite: 'general'

            backoffice:
                options:
                    args:
                        suite: 'backoffice'

            shop_magento1:
                options:
                    args:
                        baseUrl: 'http://magento1.stage.eu.magalog.net/magazine'
                        suite: 'shop'

            shop_magento2:
                options:
                    args:
                        baseUrl: 'http://magento2.stage.eu.magalog.net/magazine'
                        suite: 'shop'

            shop_october:
                options:
                    args:
                        baseUrl: 'http://october.magalog.net'
                        specs: ['shop/smo.spec.js', 'shop/seo.spec.js']

            shop_oxid:
                options:
                    args:
                        baseUrl: 'http://oxid.stage.eu.magalog.net/magazine'
                        suite: 'shop'

            shop_oxido:
                options:
                    args:
                        baseUrl: 'http://oxido.stage.eu.magalog.net/magazine'
                        suite: 'shop'

            shop_shopware4:
                options:
                    args:
                        # important to have trailing slash b/c of a shopware issue with query strings
                        # see https://trello.com/c/15Hy5G0o/702-issues-with-new-staging-environments
                        baseUrl: 'http://shopware4.stage.eu.magalog.net/magazine/'
                        suite: 'shop'

            shop_shopware5:
                options:
                    args:
                        baseUrl: 'http://shopware5.stage.eu.magalog.net/magazine/'
                        suite: 'shop'

            widget:
                options:
                    args:
                        baseUrl: 'http://static.styla.com/test/widget/index.html'
                        suite: 'widget'

            analytics:
                options:
                    args:
                        baseUrl: 'http://stories.analyticstest.magalog.net/'
                        suite: 'analytics'

    grunt.registerTask 'default', 'Runs e2e tests', [
        'protractor'
    ]

    grunt.registerTask 'nyan', 'Runs e2e tests, only those related to nyan team', [
        'protractor:shop_magento1'
        'protractor:shop_magento2'
        'protractor:shop_october'
        'protractor:shop_oxid'
        'protractor:shop_oxido'
        'protractor:shop_shopware4'
        'protractor:shop_shopware5'
    ]

    grunt.registerTask 'doge', 'Runs e2e tests, only those related to doge team', [
        'protractor:general'
        'protractor:widget'
        #   'protractor:backoffice'
        #   'protractor:analytics'
    ]
