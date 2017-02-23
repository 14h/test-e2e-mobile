"use strict";

var EC = require('protractor').ExpectedConditions;

/**
 * The Editor page object
 * @browser reference to protractor's global browser object
 * @url (optional) sets a different that the default URL for the editor
 */
function Editor(browser, url) {
    this.browser = browser;
    this.url = url || browser.baseUrl + '/editor';

    // debounce timer after edits is 250ms
    // frontend/scripts/app/editor/view/editor/description/editorRichText.coffee
    this.debounceTimerMs = 400;

    this.divEditor = this.browser.$('.Editor');

    this.tblMenuBar = this.browser.$('.MenuBar');
    this.btnSaveDraft = this.tblMenuBar.$('.jsSaveDraft');

    // was: this.lblDraftSaved = this.tblMenuBar.$('.draftSaved');
    // but this throwed StaleReferenceError
    // because this item is later dynamically added
    this.lblDraftSaved = this.browser.$('.MenuBar .draftSaved');

    this.txtHeadline = this.divEditor.$('.Headline h1');
    this.txtDescription = this.divEditor.$('.Description .RichText');
}

Editor.prototype.go = function go() {
    this.browser.driver.get(this.url);
    // workaround for pending 'render' requests in the frontend
    this.browser.driver.sleep(1000);
}

Editor.prototype.saveDraft = function saveDraft() {
    this.btnSaveDraft.click();
    this.browser.driver.wait(EC.presenceOf(this.lblDraftSaved), 5000);
    // saveDraft creates a new URL for this draft
    return this.browser.driver.getCurrentUrl();
}

Editor.prototype.setHeadline = function setHeadline(headlineText) {
    this.txtHeadline.clear();
    this.txtHeadline.sendKeys(headlineText);
    this.browser.driver.sleep(this.debounceTimerMs);
}

Editor.prototype.getHeadline = function getHeadline() {
    return this.txtHeadline.getText();
}

Editor.prototype.setDescription = function setDescription(descriptionText) {
    this.txtDescription.clear();
    this.txtDescription.sendKeys(descriptionText);
    this.browser.driver.sleep(this.debounceTimerMs);
}

Editor.prototype.getDescription = function getDescription() {
    return this.txtDescription.getText();
}


module.exports = Editor;
