// special configurations based on the hosts where the tests are run
module.exports = {
    'october.magalog.net': {
        shop_system: 'october',
        seo_api_enabled: null
    },
    'oxid.stage.eu.magalog.net/magazine': {
        shop_system: 'oxid',
    },
    'oxido.stage.eu.magalog.net/magazine': {
        shop_system: 'oxid',
    },
    'shopware4.stage.eu.magalog.net/magazine/': {
        shop_system: 'shopware'
    },
    'shopware5.stage.eu.magalog.net/magazine/': {
        shop_system: 'shopware'
    },
    'stage.magalog.net': {
        login: {
            email: "support@frents.com",
            pass: "puffewnr!"
        }
    },
    'stage.magalog.net/seo/ci-basic': {
        login: {
            email: "ci-basic@magalog.net",
            pass: "ci-basic"
        }
    }
}
