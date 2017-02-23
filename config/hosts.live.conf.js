// special configurations based on the hosts where the tests are run


var beautylaneConfig = {
    popup_close_css : [
        '.footer--newsletter'
    ]
};

var juniqeConfig = {
    popup_close_css : [
        '.modal-backdrop',
        '.modal'
    ]
};


var jackWolfSkinConfig = {
    popup_close_css : [
        'div[data-ng-show="framework.isShopPickerVisible"]',
        'div[data-ng-show="framework.isShopPickerVisible"]',
        '.newsletter'
    ]
};

//var WalbuschConfig = {
  //  popup_close_css :
    //      '.mfp-bg',
    //      '.mfp-wrap'
    //  ]
  //};

module.exports = {
    '77onlineshop.de/magazin/'      : {
        seo_disabled: null
    },


  //  'www.bartu.com/magazin'         : { disabled for now, no more popup_close_css
  //      popup_close_css: [
    ///        '#nrOverlayModal.modal',
    //        '.modal-dialog'
    //    ]
 //},

    'www.blogwalk.de'               : {
        spec_open_story_disabled : true
    },

    'www.bettenrid.de/magazin'      : {
      popup_close_css : [
          '#nrOverlayModal'
        ]

     },
    'www.ellaparadis.com/magazine'                : {
        popup_close_css : [
            '#simpledialog-overlay',
            '#NostoOverlay',
            '#batBeacon0.24168696988854466'
        ]

    },
    'www.kaufdichgluecklich-shop.de/blog'       : {
          popup_close_css : [
              '.animate'
        ]
    },
      'shop.steffl-vienna.at/inspiration'       : {
            popup_close_css : [
                '#notice-cookie-block.message.global.cookie',
                '.accInfo'
          ]

  //  },
    //  'www.kissafrog.de/magazin'       : {  // To be added if pop-up fails the test
      //      popup_close_css : [
        //        '.newsletter-popup',
          //      '.bg'
          //]

//  },
//    'news.pkz.ch/fr'       : {   //liveChecker clicks on the user instead of story. this is not a pop-up blocker
  //      popup_close_css : [
      //      '.accInfo'
    //  ]

  },
    'www.lamoda.ru/lifestyle'       : {
        popup_close_css : [
            '#overlay',
            '.popup__inner'
        ]
    },

  //   'www.speedostore.co.uk/inspiration?geoip=geoip'       : {  //client fails from time to time due to SURVERY MONKEY but doesn't happen always
    //     popup_close_css : [
      //      '.smcx-widget',
        //    '#__smcx__'
    //    ]
  //  },

    'www.sport-schuster.de/blog/'               : {
        spec_open_story_disabled : true

    },
    'www.satselixia.no/inspirasjon-trening'       : {
          popup_close_css : [
              '.cookie-notice'
        ]
     },
    'themanual.boohoo.com/uk'       : {
         popup_close_css : [
            '.accInfo'
        ]
    },

    'www.beautylane.com/ch-de/magazin'  : beautylaneConfig,
    'www.beautylane.com/de-de/magazin'  : beautylaneConfig,
    'www.beautylane.com/at-de/magazin'  : beautylaneConfig,
    'www.jack-wolfskin.ch/magazin'      : jackWolfSkinConfig,
    'www.jack-wolfskin.at/magazin'      : jackWolfSkinConfig,

    'www.juniqe.ch/highlights'          : juniqeConfig,
    'www.juniqe.com/highlights'         : juniqeConfig,
    'www.juniqe.fr/highlights'          : juniqeConfig,
    'www.juniqe.nl/highlights'          : juniqeConfig,
    'www.juniqe.se/highlights'          : juniqeConfig,
    //'www.walbusch.de/magazin'           : WalbuschConfig,
  //  'www.walbusch.at/magazin'           : WalbuschConfig,
  //  'www.walbusch.ch/magazin'           : WalbuschConfig,

};
