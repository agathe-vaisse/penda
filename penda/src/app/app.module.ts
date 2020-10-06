import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {LanguageSelectionComponent} from './language-selection/language-selection.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from './game/game.component';
import {AppComponent} from './app.component';

const routes: Routes = [
    {path: 'game', component: GameComponent},
    {path: '', component: LanguageSelectionComponent},
];

@NgModule({
    declarations: [
        LanguageSelectionComponent,
        GameComponent,
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
