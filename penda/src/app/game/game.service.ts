import { Injectable } from '@angular/core';
import {Word} from "./word";
import {Observable, of} from "rxjs";
import {GameState} from "./game-state";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

    init(word: Word, stringObservable: Observable<string>): Observable<GameState> {
        return of()
    }
}
