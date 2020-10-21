import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

    selectLanguage(language: string) {
        return element(by.cssContainingText('#languages option', new RegExp("^" + language + "$")))
            .click()
            .then(() => {
                return element(by.id('language-submit')).click();
            })
    }
}
