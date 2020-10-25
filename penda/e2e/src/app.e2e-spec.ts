import { LanguageSelectionPage } from './language-selection.po';
import { browser, logging } from 'protractor';
import {GamePage} from './game.po';

describe('workspace-project App', () => {
  let languageSelectionPage: LanguageSelectionPage;
  let gamePage: GamePage;

  beforeEach(() => {
    languageSelectionPage = new LanguageSelectionPage();
    languageSelectionPage.navigateTo();
  });

  it('should display welcome message', () => {
    expect(languageSelectionPage.getTitleText()).toEqual('Penda');
  });

  it('should start game after language selection', () => {
      languageSelectionPage.selectLanguage('French');
      gamePage = new GamePage();
      expect(gamePage.isCurrentPage()).toBe(true);
    });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
