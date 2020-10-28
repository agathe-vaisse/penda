import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';
import {BehaviorSubject, of} from 'rxjs';
import {WordService} from './word.service';
import {Word} from './word';
import {ActivatedRoute, Params} from '@angular/router';
import {GameService} from './game.service';
import {GameState, WordState} from './game-state';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('GameComponent', () => {
    let component: GameComponent;
    let fixture: ComponentFixture<GameComponent>;
    let dom;
    let gameServiceSpy;
    let wordServiceSpy;
    const wordToGuess = {value: 'panda'} as Word;
    const initialGameState = GameState.createInitialGameState(wordToGuess);
    let gameStateSubject;

    const submitGameForm = (attempt: string) => {
        const attemptInput = dom.querySelector('#letter');
        attemptInput.value = attempt;
        attemptInput.dispatchEvent(new Event('input'));
        dom.querySelector('#try').click();
    };

    beforeEach(async () => {
        gameServiceSpy = jasmine.createSpyObj<GameService>(['init']);
        gameStateSubject = new BehaviorSubject<GameState>(initialGameState);
        gameServiceSpy.init.and.returnValue(gameStateSubject.asObservable());
        wordServiceSpy = jasmine.createSpyObj<WordService>(['findOneRandomly']);
        wordServiceSpy.findOneRandomly.and.returnValue(of(wordToGuess));
        const routeSpy = {queryParams: of({language: 'fr'} as Params)};
        await TestBed.configureTestingModule({
            declarations: [GameComponent],
            providers: [
                {provide: GameService, useValue: gameServiceSpy},
                {provide: WordService, useValue: wordServiceSpy},
                {provide: ActivatedRoute, useValue: routeSpy}
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
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

    it('should display current game state', () => {
        expect(dom.querySelector('#attempts').textContent).toEqual(`${initialGameState.maxAttempts} / ${initialGameState.maxAttempts}`);
        expect(dom.querySelector('input#letter').getAttribute('maxlength')).toEqual('1');
        const placeholders = Array.from(dom.querySelectorAll('.placeholder'))
            .map((e: any) => e.textContent);
        expect(placeholders).toEqual(['?', '?', '?', '?', '?']);
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

    it('should stop game and show message when the game is won', () => {
        gameStateSubject.next(initialGameState
            .computeNextState('p')
            .computeNextState('a')
            .computeNextState('n')
            .computeNextState('d')
        );
        fixture.detectChanges();

        expect(dom.querySelector('#game-over.alert-success').textContent.trim()).toEqual('🥳 Congratulations!');
        expect(dom.querySelector('#letter[readonly]')).toBeTruthy();
        expect(dom.querySelector('#try[disabled]')).toBeTruthy();
    });

    it('should stop game and show message when the game is lost', () => {
        gameStateSubject.next(initialGameState
            .computeNextState('b')
            .computeNextState('c')
            .computeNextState('e')
            .computeNextState('f')
            .computeNextState('g')
            .computeNextState('h')
            .computeNextState('i')
            .computeNextState('j')
        );
        fixture.detectChanges();

        expect(dom.querySelector('#game-over.alert-danger').textContent.trim()).toEqual('🙃 Better luck next time?');
        expect(dom.querySelector('#letter[readonly]')).toBeTruthy();
        expect(dom.querySelector('#try[disabled]')).toBeTruthy();
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
