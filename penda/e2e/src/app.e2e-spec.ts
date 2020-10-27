import {LanguageSelectionPage} from './language-selection.po';
import {browser, logging} from 'protractor';
import {GamePage} from './game.po';

describe('workspace-project App', () => {
    let languageSelectionPage: LanguageSelectionPage;
    let gamePage: GamePage;

    beforeEach(() => {
        languageSelectionPage = new LanguageSelectionPage();
        gamePage = new GamePage();
        languageSelectionPage.navigateTo();
    });

    it('should display welcome message', () => {
        expect(languageSelectionPage.getTitleText()).toEqual('🐾 Penda');
    });

    it('should start game after language selection', () => {
        languageSelectionPage.selectLanguage('French');
        expect(gamePage.isCurrentPage()).toBe(true);
    });

    it('should display failed attempts in sorted order', () => {
        languageSelectionPage.selectLanguage('French');
        gamePage.guess('é');
        gamePage.guess('b');

        expect(gamePage.getFailedAttempts()).toEqual(['b', 'é']);
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
