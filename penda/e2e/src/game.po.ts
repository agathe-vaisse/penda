import {browser, by, element, promise} from 'protractor';

export class GamePage {
    isCurrentPage(): promise.Promise<boolean> {
        return browser.getCurrentUrl()
            .then((url) => {
                return /\/game\?language=[a-z]{2}$/.test(url);
            });
    }

    guess(letter: string): promise.Promise<void> {
        const input = element(by.id('letter'));
        return input.sendKeys(letter)
            .then(() => element(by.id('try')).click());
    }

    getFailedAttempts(): promise.Promise<string[]> {
        return element.all(by.css('#failed-attempts span'))
            .map((el) => el.getText());
    }
}
