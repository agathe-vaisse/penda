import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {WordService} from "./word.service";
import {Word} from "./word";
import {LanguageCode} from "../language-selection/language";

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

    private queryParams$: Observable<Params>;

    word$: Observable<Word>;

    queryParamSubscription: Subscription;

    constructor(route: ActivatedRoute,
                private wordService: WordService) {

        this.queryParams$ = route.queryParams;
    }

    ngOnInit(): void {
        this.queryParamSubscription = this.queryParams$.subscribe((params) => {
            const language = params['language'];
            this.word$ = this.wordService.findOneRandomly(<LanguageCode>{code: language});
        })
    }

    ngOnDestroy(): void {
        this.queryParamSubscription.unsubscribe();
    }

}
