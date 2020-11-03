import {Word} from "./word";

class GameState {
    failedAttempts: Set<string> = new Set<string>();

    maxAttempts = 7;
    leftAttempts: number = this.maxAttempts;

    constructor(private word: Word) {

    }


    displayableChars(placeholder: string): string[] {
        return Array(5).fill(placeholder);
    }

    isCompleted(): boolean {
        return false;
    }

    isWon(): boolean {
        return false;
    }

    isLost(): boolean {
        return false;
    }

    computeNextState(keystroke: string): GameState {
        const letters = this.word.value.split('');
        if (letters.indexOf(keystroke) >= 0) {
            return this;
        }
        this.failedAttempts.add(keystroke);
        this.leftAttempts--;
        return this;
    }
}

export {GameState};
