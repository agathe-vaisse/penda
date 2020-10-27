import {browser, by, element, promise} from 'protractor';

export class LanguageSelectionPage {
    navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl) as Promise<unknown>;
    }

    getTitleText(): Promise<string> {
        return element(by.css('h1')).getText() as Promise<string>;
    }

    selectLanguage(language: string): promise.Promise<void> {
        return element(by.cssContainingText('#languages option', new RegExp('^' + language + '$')))
            .click()
            .then(() => {
                return element(by.id('language-submit')).click();
            });
    }
}
