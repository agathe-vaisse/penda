import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Word} from './word';
import {GameState, WordState} from './game-state';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    init(wordToGuess: Word, input: Observable<string>): Observable<GameState> {
        let currentState = GameState.createInitialGameState(wordToGuess);
        const subject = new BehaviorSubject<GameState>(currentState);
        input.subscribe((attempt: string) => {
            currentState = currentState.computeNextState(attempt);
            subject.next(currentState);
        });
        return subject.asObservable();
    }
}
