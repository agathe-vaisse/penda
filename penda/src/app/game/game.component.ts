import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {WordService} from './word.service';
import {LanguageCode} from '../language-selection/language';
import {GameService} from './game.service';
import {GameState} from './game-state';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

    gameState$: Observable<GameState>;
    private languageCode: LanguageCode;
    // visible for testing
    queryParamSubscription: Subscription;
    gameForm: FormGroup;
    // visible for testing
    inputs: Subject<string>;
    private queryParams$: Observable<Params>;
    // visible for testing
    wordSubscription: Subscription;

    constructor(route: ActivatedRoute,
                formBuilder: FormBuilder,
                private wordService: WordService,
                private gameService: GameService,
                private location: Location) {

        this.gameForm = formBuilder.group({
            attempt: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(1)
            ]]
        });
        this.queryParams$ = route.queryParams;
    }

    get attempt(): AbstractControl {
        return this.gameForm.get('attempt');
    }

    ngOnInit(): void {
        this.queryParamSubscription = this.queryParams$.subscribe((params) => {
            this.languageCode = {code: params.language} as LanguageCode;
            const word$ = this.wordService.findOneRandomly(this.languageCode);
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

    attemptsRatio(gameState: GameState): string {
        return `${gameState.leftAttempts} / ${gameState.maxAttempts}`;
    }

    onSubmit(value: any): void {
        if (this.gameForm.valid) {
            this.inputs.next(value.attempt as string);
            this.gameForm.reset();
        }
    }

    failedAttempts(gameState: GameState): string[] {
        return Array.from(gameState.failedAttempts)
            .sort((s1, s2) => s1.localeCompare(s2, this.languageCode.code));
    }

    playAgain(): void {
        this.location.back();
    }
}
