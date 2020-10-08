import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import { LanguageService } from './language.service';
import { Observable } from 'rxjs';
import { Language } from './language';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'penda';
  languages$: Observable<Language[]>;
  languageForm: FormGroup;

  constructor(private languageService: LanguageService,
              private formBuilder: FormBuilder) {

  }

  static notBlank(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.trim().length > 0) {
      return null;
    }
    return {notblank: value};
  }

  ngOnInit(): void {
    this.languages$ = this.languageService.findAll();
    this.languageForm = this.formBuilder.group({
      language: ['', [
        Validators.required, 
        Validators.pattern(/.*[\S].*/)]]
    })
  }

  onSubmit(value:any) {
    console.log('value:', value)
    console.log(this.languageForm.valid)
  }
}
