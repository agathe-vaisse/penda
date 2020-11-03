import {Injectable} from '@angular/core';
import {Word} from "./word";
import {BehaviorSubject, Observable} from "rxjs";
import {GameState} from "./game-state";

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor() {
    }

    init(word: Word, keystrokes$: Observable<string>): Observable<GameState> {
        const currentState = new GameState(word);
        const subject = new BehaviorSubject(currentState);
        keystrokes$.subscribe((keystroke) => {
            subject.next(currentState.computeNextState(keystroke));
        });
        return subject.asObservable();
    }
}
