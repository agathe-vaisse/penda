import {Injectable} from '@angular/core';
import {Language} from './language';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    constructor(private http: HttpClient) {
    }

    public findAll(): Observable<Language[]> {
        return this.http.get('/api/languages')
            .pipe(
                map((data: any) => {
                    const languages = data as Language[];
                    return languages.sort((language1, language2) => language1.code.localeCompare(language2.code, 'en'));
                })
            );
    }
}
