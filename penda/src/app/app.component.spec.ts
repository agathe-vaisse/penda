import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LanguageService } from './language.service';
import { Language } from './language';
import {of} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('AppComponent', () => {
  let fixture;
  let app;
  let dom;
  let languageServiceSpy;

  const english = {
    code: "en",
    description: "English"
  } as Language;
  const french = {
    code: "fr",
    description: "French"
  } as Language;

  beforeEach(async () => {
    languageServiceSpy = jasmine.createSpyObj<LanguageService>(['findAll']);
    languageServiceSpy.findAll.and.returnValue(of([english, french]))
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: LanguageService, useValue: languageServiceSpy}
      ]
    }).compileComponents();
  });

  beforeEach( () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    expect(app).toBeTruthy();
    dom = fixture.nativeElement;
  });

  it('should fetch languages', () => {
    expect(languageServiceSpy.findAll).toHaveBeenCalledTimes(1);
  })

  it('should render list of languages', () => {
    fixture.detectChanges();
    const languageOptions = Array.from(dom.querySelectorAll('form select option:not(:first-child)'));

    expect(languageOptions.map((e: any) => e.textContent))
        .toEqual([english.description, french.description]);
  });

  it('fails to submit a blank language', () => {
    fixture.detectChanges(); // needed by [formGroup] directive
    dom.querySelector('button[type=submit]').click();

    fixture.detectChanges();

    expect(Array.from(dom.querySelector('form select').classList)).toContain('ng-invalid');
  });
});
