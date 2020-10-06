import {browser} from "protractor";

export class GamePage {
    isCurrentPage() {
        return browser.getCurrentUrl().then((url) => {
            return /\/game\?language=[a-z]{2}$/.test(url);
        })
    }
}
