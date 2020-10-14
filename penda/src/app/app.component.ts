import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LanguageService} from './language.service';
import {Observable} from 'rxjs';
import {Language} from './language';
import {Router} from "@angular/router";

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
              private formBuilder: FormBuilder,
    private router: Router) {

      this.languageForm = this.formBuilder.group({
          language: ['', [
              Validators.required,
              Validators.pattern(/.*[\S].*/)
          ]]
      });
      this.languages$ = this.languageService.findAll();
  }

  onSubmit(value: any) {
      if(this.languageForm.valid) {
          this.router.navigate(['game'], {replaceUrl: true, queryParams: { language: this.languageForm.get('language').value }});
      }
  }

  get language() {
      return this.languageForm.get('language')
  }
}
