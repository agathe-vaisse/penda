import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LanguageService} from './language.service';
import {Observable} from 'rxjs';
import {Language} from './language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'penda';
  languages$: Observable<Language[]>;
  languageForm: FormGroup;

  constructor(private languageService: LanguageService,
              private formBuilder: FormBuilder) {

      this.languageForm = this.formBuilder.group({
          language: ['', [
              Validators.required,
              Validators.pattern(/.*[\S].*/)
          ]]
      });
      this.languages$ = this.languageService.findAll();
  }

  onSubmit(value: any) {
  }

  get language() {
      return this.languageForm.get('language')
  }
}
