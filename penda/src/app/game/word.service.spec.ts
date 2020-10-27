import {TestBed} from '@angular/core/testing';
import {Word} from './word';
import {LanguageCode} from '../language-selection/language';
import {WordService} from './word.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';


describe('WordService', () => {
    let service: WordService;
    let httpMock: HttpTestingController;
    const panda = {
        value: 'panda'
    } as Word;
    const french = {
        code: 'fr'
    } as LanguageCode;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [WordService]
        });

        httpMock = TestBed.inject(HttpTestingController);
        service = TestBed.inject(WordService);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should find one random word', (done) => {
        service.findOneRandomly(french).subscribe((word: Word) => {
            expect(word).toEqual(panda);
            done();
        });

        const req = httpMock.expectOne(`/api/words?language=fr`);
        expect(req.request.method).toBe('POST');
        req.flush(panda);
    });
});
