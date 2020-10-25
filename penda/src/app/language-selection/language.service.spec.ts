import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';
import { Language } from './language';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LanguageService', () => {
  let service: LanguageService;
  let httpMock: HttpTestingController;
  const english = {
    code: 'en',
    description: 'English'
  } as Language;
  const french = {
    code: 'fr',
    description: 'French'
  } as Language;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LanguageService]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list all languages', (done) => {
    service.findAll().subscribe((languages: Language[]) => {
      expect(languages).toEqual([english, french]);
      done();
    });

    const req = httpMock.expectOne(`/api/languages`);
    expect(req.request.method).toBe('GET');
    req.flush([
      french, english
    ]);
  });
});
