import {TestBed} from '@angular/core/testing';

import {GameService} from './game.service';
import {Observable, of, Subject} from 'rxjs';
import {Word} from './word';
import {GameState, WordState} from './game-state';

describe('GameService', () => {
    let service: GameService;
    let gameStates$: Observable<GameState>;
    let attemptSubject: Subject<string>;
    const wordToGuess = {value: 'bonjour'} as Word;

    const state = (word: Word, maxAttempts: number, failedAttempts: Set<string>, wordState: WordState) => {
        return { word, maxAttempts, failedAttempts, wordState } as GameState;
    };

    const foundLetters = (word: Word, attempts: string []) => {
        const uniqueLetters = new Set(word.value.split(''));
        const result = {};
        for (const letter of uniqueLetters) {
            result[letter] = attempts.includes(letter);
        }
        return result as WordState;
    };

    const initialState = state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, []));

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
        const states = [
            initialState
        ];

        gameStates$.subscribe(expectStates(states, done));
    });

    it('should emit new game state on new successful attempts', (done: DoneFn) => {
        const states = [
            initialState,
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b']))
        ];

        gameStates$.subscribe(expectStates(states, done));

        attemptSubject.next('b');
    });

    it('should emit new game state on new failed attempts', (done: DoneFn) => {
        const states = [
            initialState,
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t']), foundLetters(wordToGuess, ['t']))
        ];

        gameStates$.subscribe(expectStates(states, done));

        attemptSubject.next('t');
    });

    it('should emit new game state on new failed duplicate attempts', (done: DoneFn) => {
        const states = [
            initialState,
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t']), foundLetters(wordToGuess, ['t'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t']), foundLetters(wordToGuess, ['t']))
        ];

        gameStates$.subscribe(expectStates(states, done));

        attemptSubject.next('t');
        attemptSubject.next('t');
    });

    it('should emit new game state on new successful duplicate attempts', (done: DoneFn) => {
        const states = [
            initialState,
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['o'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['o']))
        ];

        gameStates$.subscribe(expectStates(states, done));

        attemptSubject.next('o');
        attemptSubject.next('o');
    });

    it('should ignore failed attempts when game is completed', (done: DoneFn) => {
        const states = [
            initialState,
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b', 'o'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b', 'o', 'n'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b', 'o', 'n', 'j'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b', 'o', 'n', 'j', 'u'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b', 'o', 'n', 'j', 'u', 'r'])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(), foundLetters(wordToGuess, ['b', 'o', 'n', 'j', 'u', 'r']))
        ];

        gameStates$.subscribe(expectStates(states, done));

        attemptSubject.next('b');
        attemptSubject.next('o');
        attemptSubject.next('n');
        attemptSubject.next('j');
        attemptSubject.next('u');
        attemptSubject.next('r');
        attemptSubject.next('z');
    });

    it('should ignore failed attempts when game is lost', (done: DoneFn) => {
        const states = [
            initialState,
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t']), foundLetters(wordToGuess, [])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t', 'y']), foundLetters(wordToGuess, [])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t', 'y', 'z']), foundLetters(wordToGuess, [])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t', 'y', 'z', 'a']), foundLetters(wordToGuess, [])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t', 'y', 'z', 'a', 'c']), foundLetters(wordToGuess, [])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t', 'y', 'z', 'a', 'c', 'w']), foundLetters(wordToGuess, [])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t', 'y', 'z', 'a', 'c', 'w', 'x']), foundLetters(wordToGuess, [])),
            state(wordToGuess, GameService.MAX_ATTEMPTS, new Set(['t', 'y', 'z', 'a', 'c', 'w', 'x']), foundLetters(wordToGuess, []))

        ];

        gameStates$.subscribe(expectStates(states, done));

        attemptSubject.next('t');
        attemptSubject.next('y');
        attemptSubject.next('z');
        attemptSubject.next('a');
        attemptSubject.next('c');
        attemptSubject.next('w');
        attemptSubject.next('x');
        attemptSubject.next('d');
    });

    const expectStates = (expectedStates: GameState[], done: DoneFn) => {
        let count = 0;
        return (gameState: GameState) => {
            expect(gameState).toEqual(expectedStates[count]);
            if (++count === expectedStates.length) {
                done();
            }
        };
    };
});
