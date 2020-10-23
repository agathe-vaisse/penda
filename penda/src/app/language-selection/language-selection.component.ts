import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LanguageService} from './language.service';
import {Observable} from 'rxjs';
import {Language} from './language';
import {Router} from '@angular/router';

@Component({
    templateUrl: './language-selection.component.html',
    styleUrls: ['./language-selection.component.scss']
})
export class LanguageSelectionComponent {
    title = 'penda';
    languages$: Observable<Language[]>;
    languageForm: FormGroup;

    constructor(private languageService: LanguageService,
                formBuilder: FormBuilder,
                private router: Router) {

        this.languageForm = formBuilder.group({
            language: ['', [
                Validators.required,
                Validators.pattern(/^.*[\S]+.*$/)
            ]]
        });
        this.languages$ = this.languageService.findAll();
    }

    onSubmit(value: any): void {
        if (this.languageForm.valid) {
            this.router.navigate(['/game'], {
                replaceUrl: true,
                queryParams: {language: value.language}
            });
        }
    }

    get language(): AbstractControl {
        return this.languageForm.get('language');
    }
}
