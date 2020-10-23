import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Word} from './word';
import {GameState, WordState} from './game-state';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    init(wordToGuess: Word, input: Observable<string>): Observable<GameState> {
        let currentState = GameService.initialState(wordToGuess);
        const subject = new BehaviorSubject<GameState>(currentState);
        input.subscribe((attempt: string) => {
            currentState = GameService.update(currentState, attempt);
            subject.next(currentState);
        });
        return subject.asObservable();
    }

    private static initialState(wordToGuess: Word): GameState {
        return {
            word: wordToGuess,
            wordState: GameService.initialWordState(wordToGuess),
            maxAttempts: 8,
            failedAttempts: new Set<string>()
        } as GameState;
    }

    private static initialWordState(word: Word): WordState {
        const result = {};
        for (const char of word.value) {
            result[char] = false;
        }
        return result;
    }

    private static update(currentState: GameState, attempt: string): GameState {
        const {wordState, failedAttempts} = GameService.updateState(currentState, attempt);
        return {
            maxAttempts: currentState.maxAttempts,
            word: currentState.word,
            wordState,
            failedAttempts
        } as GameState;
    }

    private static updateState(currentState: GameState, attempt: string): { wordState: WordState; failedAttempts: Set<string> } {
        if (GameService.isWon(currentState) || GameService.isLost(currentState)) {
            return currentState;
        }
        const wordState = currentState.wordState;
        const failedAttempts = currentState.failedAttempts;
        if (!(attempt in wordState)) {
            const newFailedAttempts = new Set<string>([...failedAttempts, attempt]);
            return {wordState, failedAttempts: newFailedAttempts};
        }
        const newWordState = Object.assign({}, wordState);
        newWordState[attempt] = true;
        return {wordState: newWordState, failedAttempts};
    }

    private static isWon(currentState: GameState): boolean {
        return Object.values(currentState.wordState).reduce((acc, current) => acc && current);
    }

    private static isLost(currentState: GameState): boolean {
        return currentState.failedAttempts.size === currentState.maxAttempts;
    }
}
