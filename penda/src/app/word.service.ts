import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { LanguageCode } from './language';
import { Word } from './word';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  constructor(private http: HttpClient) { }

  public findOneRandomly(languageCode: LanguageCode): Observable<Word> {
    return this.http.post(`/api/word?language=${languageCode.code}`, null)
    .pipe(
      map((data:any) => data as Word)
    );
  }
}