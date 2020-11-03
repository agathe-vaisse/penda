import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import {Word} from "./word";
import {of} from "rxjs";

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit initial game state', (done: DoneFn) => {
      const word = {value: 'panda'} as Word;

      const gameState$ = service.init(word, of<string>());

      gameState$.subscribe((gameState) => {
         expect(gameState.failedAttempts.size).toEqual(0);
         expect(gameState.leftAttempts).toEqual(gameState.maxAttempts);
         done();
      });
  })
});
