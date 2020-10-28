import {Word} from './word';

interface WordState {
    [letter: string]: boolean;
}

class GameState {

    public static readonly MAX_ATTEMPTS = 7;

    private constructor(private word: Word,
                        private wordState: WordState,
                        public maxAttempts: number,
                        public failedAttempts: Set<string>) {
    }

    public static createInitialGameState(word: Word): GameState {
        return new GameState(
            word,
            this.initialWordState(word),
            GameState.MAX_ATTEMPTS,
            new Set<string>()
        );
    }

    displayableChars(placeholder: string): string[] {
        const letters = this.word.value.split('');
        if (this.isCompleted()) {
            return letters;
        }
        return letters.map((letter) => !this.wordState[letter] ? placeholder : letter);
    }

    computeNextState(attempt: string): GameState {
        if (this.isCompleted()) {
            return this;
        }
        if (!(attempt in this.wordState)) {
            return new GameState(this.word, this.wordState, this.maxAttempts,
                new Set<string>([...this.failedAttempts, attempt]));
        }
        const wordState = Object.assign({}, this.wordState);
        wordState[attempt] = true;
        return new GameState(this.word, wordState, this.maxAttempts, this.failedAttempts);
    }

    isCompleted(): boolean {
        return this.isWon() || this.isLost();
    }

    isWon(): boolean {
        return Object.values(this.wordState).reduce((acc, current) => acc && current);
    }

    isLost(): boolean {
        return this.leftAttempts === 0;
    }

    get leftAttempts(): number {
        return this.maxAttempts - this.failedAttempts.size;
    }

    private static initialWordState(word: Word): WordState {
        const result = {};
        for (const char of word.value) {
            result[char] = false;
        }
        return result;
    }
}

export {WordState, GameState};
