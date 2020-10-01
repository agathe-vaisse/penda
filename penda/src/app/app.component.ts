import { Component, OnInit } from '@angular/core';
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

  constructor(private languageService: LanguageService) {

  }

  ngOnInit(): void {
    this.languages$ = this.languageService.findAll();
  }
}
