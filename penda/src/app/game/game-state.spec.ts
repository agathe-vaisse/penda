import {GameState} from './game-state';

describe('GameState', () => {

    let state: GameState;

    beforeEach(() => {
        state = GameState.createInitialGameState({value: 'bonjour'});
    });


    it('should emit initial game state', () => {
        expect(state.leftAttempts).toEqual(GameState.MAX_ATTEMPTS);
        expect(state.displayableChars('?'))
            .toEqual(['?', '?', '?', '?', '?', '?', '?']);
        expect(state.isCompleted()).toBeFalse();
        expect(state.isWon()).toBeFalse();
        expect(state.isLost()).toBeFalse();
    });

    it('should compute new game state after a successful attempt', () => {
        const newState = state.computeNextState('b');

        expect(newState.failedAttempts).toEqual(new Set());
        expect(newState.leftAttempts).toEqual(GameState.MAX_ATTEMPTS);
        expect(newState.displayableChars('?'))
            .toEqual(['b', '?', '?', '?', '?', '?', '?']);
        expect(newState.isCompleted()).toBeFalse();
        expect(newState.isWon()).toBeFalse();
        expect(newState.isLost()).toBeFalse();
    });

    it('should compute new game state after a failed attempt', () => {
        const newState = state.computeNextState('c');

        expect(newState.failedAttempts).toEqual(new Set(['c']));
        expect(newState.leftAttempts).toEqual(GameState.MAX_ATTEMPTS - 1);
        expect(newState.displayableChars('?'))
            .toEqual(['?', '?', '?', '?', '?', '?', '?']);
        expect(newState.isCompleted()).toBeFalse();
        expect(newState.isWon()).toBeFalse();
        expect(newState.isLost()).toBeFalse();
    });

    it('should compute same game state after an already-tried failed attempt', () => {
        const newState = state
            .computeNextState('t')
            .computeNextState('t');

        expect(newState.failedAttempts).toEqual(new Set(['t']));
        expect(newState.leftAttempts).toEqual(GameState.MAX_ATTEMPTS - 1);
        expect(newState.displayableChars('?'))
            .toEqual(['?', '?', '?', '?', '?', '?', '?']);
        expect(newState.isCompleted()).toBeFalse();
        expect(newState.isWon()).toBeFalse();
        expect(newState.isLost()).toBeFalse();
    });

    it('should compute same game state after an already-tried successful attempt', () => {
        const newState = state
            .computeNextState('n')
            .computeNextState('n');

        expect(newState.failedAttempts).toEqual(new Set());
        expect(newState.leftAttempts).toEqual(GameState.MAX_ATTEMPTS);
        expect(newState.displayableChars('?'))
            .toEqual(['?', '?', 'n', '?', '?', '?', '?']);
        expect(newState.isCompleted()).toBeFalse();
        expect(newState.isWon()).toBeFalse();
        expect(newState.isLost()).toBeFalse();

    });

    it('should ignore failed attempts when game is won', () => {
        const newState = state
            .computeNextState('b')
            .computeNextState('o')
            .computeNextState('n')
            .computeNextState('j')
            .computeNextState('u')
            .computeNextState('r')
            .computeNextState('z');

        expect(newState.failedAttempts).toEqual(new Set());
        expect(newState.leftAttempts).toEqual(GameState.MAX_ATTEMPTS);
        expect(newState.displayableChars('?'))
            .toEqual(['b', 'o', 'n', 'j', 'o', 'u', 'r']);
        expect(newState.isCompleted()).toBeTrue();
        expect(newState.isWon()).toBeTrue();
        expect(newState.isLost()).toBeFalse();
    });

    it('should ignore failed attempts reveal word when game is lost', () => {
        const newState = state
            .computeNextState('z')
            .computeNextState('y')
            .computeNextState('x')
            .computeNextState('w')
            .computeNextState('v')
            .computeNextState('t')
            .computeNextState('s')
            .computeNextState('a');

        expect(newState.failedAttempts).toEqual(new Set([
            'z', 'y', 'x', 'w', 'v', 't', 's'
        ]));
        expect(newState.leftAttempts).toEqual(0);
        expect(newState.displayableChars('?'))
            .toEqual(['b', 'o', 'n', 'j', 'o', 'u', 'r']);
        expect(newState.isCompleted()).toBeTrue();
        expect(newState.isWon()).toBeFalse();
        expect(newState.isLost()).toBeTrue();
    });
});
