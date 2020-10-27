import {TestBed} from '@angular/core/testing';
import {LanguageSelectionComponent} from './language-selection.component';
import {LanguageService} from './language.service';
import {Language} from './language';
import {of} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

describe('AppComponent', () => {
    let fixture;
    let app;
    let dom;
    let languageServiceSpy;
    let routerSpy: { navigate: jasmine.Spy };

    const english = {
        code: 'en',
        description: 'English'
    } as Language;
    const french = {
        code: 'fr',
        description: 'French'
    } as Language;

    beforeEach(async () => {
        routerSpy = {navigate: jasmine.createSpy('navigate')};
        languageServiceSpy = jasmine.createSpyObj<LanguageService>(['findAll']);
        languageServiceSpy.findAll.and.returnValue(of([english, french]));
        await TestBed.configureTestingModule({
            declarations: [
                LanguageSelectionComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
            ],
            providers: [
                {provide: LanguageService, useValue: languageServiceSpy},
                {provide: Router, useValue: routerSpy}
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageSelectionComponent);
        app = fixture.componentInstance;
        expect(app).toBeTruthy();
        dom = fixture.nativeElement;
    });

    it('should fetch languages', () => {
        expect(languageServiceSpy.findAll).toHaveBeenCalledTimes(1);
    });

    it('should render list of languages', () => {
        fixture.detectChanges();
        const languageOptions = Array.from(dom.querySelectorAll('form select option:not(:first-child)'));

        expect(languageOptions.map((e: any) => e.textContent))
            .toEqual([english.description, french.description]);
    });

    it('should fail to submit a blank language', () => {
        fixture.detectChanges(); // needed by [formGroup] directive
        dom.querySelector('button[type=submit]').click();

        fixture.detectChanges();

        expect(Array.from(dom.querySelector('form select').classList)).toContain('ng-invalid');
    });

    it('should redirect to game component', () => {
        const selectedLanguageCode = french.code;

        fixture.detectChanges(); // needed by [formGroup] directive
        const languageSelector = dom.querySelector('select');
        languageSelector.value = selectedLanguageCode;
        languageSelector.dispatchEvent(new Event('change'));
        dom.querySelector('button[type=submit]').click();

        expect(routerSpy.navigate)
            .toHaveBeenCalledWith(['/game'],
                {replaceUrl: true, queryParams: {language: selectedLanguageCode}});
    });
});
