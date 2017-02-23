/**
 * Created by Elias Liedholm on 03/12/2015.
 * Makes sure a snippet configured as a widget will display stories in the widget format.
 */
 describe('A widget snippet ', function() {
     var utils = require('../helper/utils.js');

     it('should render inside the target div', function() {
         browser.driver.get(browser.baseUrl);

         expect($(".styla-widget__target #styla-widget").isPresent()).toBe(true);
     });

     it('should render 5 stories', function() {
         expect($$(".styla-widget__story").count()).toBe(5);
     });

     it('should render base styling', function() {
         expect($(".styla-widget__base-styling").isPresent()).toBe(true);
     });

     it('should render client theme styling', function() {
         expect($(".styla-widget__theme-styling").isPresent()).toBe(true);
     });
 });
