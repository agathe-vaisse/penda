import { Injectable } from '@angular/core';
import {Word} from "./word";
import {BehaviorSubject, Observable, of} from "rxjs";
import {GameState} from "./game-state";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

    init(word: Word, stringObservable: Observable<string>): Observable<GameState> {
      const currentState = new GameState();
        return new BehaviorSubject(currentState).asObservable();
    }
}
