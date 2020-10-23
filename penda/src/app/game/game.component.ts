import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {WordService} from './word.service';
import {LanguageCode} from '../language-selection/language';
import {GameService} from './game.service';
import {GameState} from './game-state';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

    private queryParams$: Observable<Params>;

    gameState$: Observable<GameState>;

    // visible for testing
    queryParamSubscription: Subscription;

    private wordSubscription: Subscription;

    gameForm: FormGroup;

    // visible for testing
    inputs: Subject<string>;

    constructor(route: ActivatedRoute,
                formBuilder: FormBuilder,
                private wordService: WordService,
                private gameService: GameService) {

        this.gameForm = formBuilder.group({
            attempt: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]]
        });
        this.queryParams$ = route.queryParams;
    }

    ngOnInit(): void {
        this.queryParamSubscription = this.queryParams$.subscribe((params) => {
            const languageCode = {code: params.language} as LanguageCode;
            const word$ = this.wordService.findOneRandomly(languageCode);
            this.wordSubscription = word$.subscribe((word) => {
                this.inputs = new Subject<string>();
                this.gameState$ = this.gameService.init(word, this.inputs.asObservable());
            });
        });
    }

    ngOnDestroy(): void {
        [this.wordSubscription, this.queryParamSubscription].forEach((subscription: Subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    attemptsLeft(gameState: GameState): string {
        return `${gameState.maxAttempts - gameState.failedAttempts.size} / ${gameState.maxAttempts}`;
    }

    characters(gameState: GameState): string[] {
        return gameState.word.value.split('').map((letter) => {
            if (gameState.wordState[letter]) {
                return letter;
            }
            return '_';
        });
    }

    get attempt(): AbstractControl {
        return this.gameForm.get('attempt');
    }

    onSubmit(value: any): void {
        if (this.gameForm.valid) {
            this.inputs.next(value.attempt as string);
        }
    }

}
