class GameState {
    failedAttempts: Set<string> = new Set<string>();
    maxAttempts = 7;
    leftAttempts: number = this.maxAttempts;


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
}

export {GameState};
