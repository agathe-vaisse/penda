import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {WordService} from './word.service';
import {Word} from './word';
import {ActivatedRoute, Params} from '@angular/router';
import {GameService} from './game.service';
import {GameState} from './game-state';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

describe('GameComponent', () => {
    let component: GameComponent;
    let fixture: ComponentFixture<GameComponent>;
    let dom;
    let gameServiceSpy;
    let wordServiceSpy;
    const wordToGuess = {value: 'panda'} as Word;

    const submitGameForm = (attempt: string) => {
        const attemptInput = dom.querySelector('#letter');
        attemptInput.value = attempt;
        attemptInput.dispatchEvent(new Event('input'));
        dom.querySelector('#try').click();
    };

    beforeEach(async () => {
        gameServiceSpy = jasmine.createSpyObj<GameService>(['init']);
        gameServiceSpy.init.and.returnValue(of(new GameState(wordToGuess)));
        wordServiceSpy = jasmine.createSpyObj<WordService>(['findOneRandomly']);
        wordServiceSpy.findOneRandomly.and.returnValue(of(wordToGuess));
        const routeSpy = {queryParams: of({language: 'fr'} as Params)};
        await TestBed.configureTestingModule({
            declarations: [GameComponent],
            providers: [
                {provide: GameService, useValue: gameServiceSpy},
                {provide: WordService, useValue: wordServiceSpy},
                {provide: ActivatedRoute, useValue: routeSpy},
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dom = fixture.nativeElement;
    });

    it('should update game state after attempt', (done: DoneFn) => {
        const attempt = 'c';

        component.inputs.asObservable().subscribe((char) => {
            expect(char).toEqual(attempt);
            done();
        });

        submitGameForm(attempt);
        fixture.detectChanges();
    });

    it('should clear input after each attempt', () => {
        submitGameForm('c');
        fixture.detectChanges();

        expect(dom.querySelector('#letter').value).toEqual('');
    });

    // TODO: find out why subscription is already closed
    xit('destroys subscriptions on destroy', () => {
        expect(component.queryParamSubscription.closed).toBeFalse();

        component.ngOnDestroy();

        expect(component.queryParamSubscription.closed).toBeTrue();
    });
});
