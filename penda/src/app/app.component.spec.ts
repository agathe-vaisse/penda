import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LanguageService } from './language.service';
import { Language } from './language';
import {of} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('AppComponent', () => {
  let fixture;
  let app;
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
  });

  it('should call fetch languages', () => {
    fixture.detectChanges();
    expect(languageServiceSpy.findAll).toHaveBeenCalledTimes(1);
  })

  it('should render list of languages', () => {
    languageServiceSpy.findAll.and.returnValue(of([english, french]))
    fixture.detectChanges();
    const dom = fixture.nativeElement;
    expect(Array.from(dom.querySelectorAll('form select option:not(:first-child)')).map((e: any) => e.textContent)).toEqual([english.description, french.description]);
  });

  it('fails to submit a language', () => {
    const dom = fixture.nativeElement;
    dom.querySelector('button[type=submit]').click();
    fixture.detectChanges();
    expect(Array.from(dom.querySelector('form select').classList)).toContain('ng-invalid');
  });
});
