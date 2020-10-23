import {browser, promise} from 'protractor';

export class GamePage {
    isCurrentPage(): promise.Promise<boolean> {
        return browser.getCurrentUrl()
            .then((url) => {
                return /\/game\?language=[a-z]{2}$/.test(url);
            });
    }
}
