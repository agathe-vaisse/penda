import {TestBed} from '@angular/core/testing';

import {GameService} from './game.service';
import {Word} from "./word";
import {of, Subject} from "rxjs";
import {GameState} from "./game-state";

describe('GameService', () => {
    let service: GameService;
    const word = {value: 'panda'} as Word;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit initial game state', (done: DoneFn) => {

        const gameState$ = service.init(word, of<string>());

        gameState$.subscribe((gameState) => {
            expect(gameState.failedAttempts.size).toEqual(0);
            expect(gameState.leftAttempts).toEqual(gameState.maxAttempts);
            done();
        });
    })

    it('should emit new game states on new keystrokes', (done) => {
        const keystrokes = new Subject<string>();
        const gameState$ = service.init(word, keystrokes.asObservable());
        const keystroke = 'c';
        const expectedState = new GameState(word);
        expectedState.failedAttempts = new Set(keystroke);
        expectedState.leftAttempts = expectedState.maxAttempts - 1;

        let i = 0;
        gameState$.subscribe((state: GameState) => {
            if (i === 1) {
                expect(state).toEqual(expectedState);
                done();
            }
            i++;
        })
        keystrokes.next(keystroke);
    })
});
