import {TestBed} from '@angular/core/testing';

import {GameService} from './game.service';
import {Observable, Subject} from 'rxjs';
import {Word} from './word';
import {GameState, WordState} from './game-state';

describe('GameService', () => {
    let service: GameService;
    let gameStates$: Observable<GameState>;
    let attemptSubject: Subject<string>;
    const wordToGuess = {value: 'bonjour'} as Word;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameService);

        attemptSubject = new Subject<string>();
        gameStates$ = service.init(wordToGuess, attemptSubject.asObservable());
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit initial game state', (done: DoneFn) => {
        gameStates$.subscribe((state) => {
            expect(state).toEqual(GameState.createInitialGameState(wordToGuess));
            done();
        });
    });

    it('should emit new game states on new key strokes', (done: DoneFn) => {
        const initialState = GameState.createInitialGameState(wordToGuess);
        const expectedStates = [
            initialState,
            initialState.computeNextState('c')
        ];
        let i = 0;
        gameStates$.subscribe((state) => {
            expect(state).toEqual(expectedStates[i]);
            if (++i === expectedStates.length) {
                done();
            }
        });

        attemptSubject.next('c');
    });
});
