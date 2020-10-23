import {Word} from './word';

interface WordState {
    [letter: string]: boolean;
}

interface GameState {
    word: Word;
    wordState: WordState;
    maxAttempts: number;
    failedAttempts: Set<string>;
}

export {WordState, GameState};
