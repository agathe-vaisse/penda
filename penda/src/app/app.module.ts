import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule, Routes} from "@angular/router";
import {GameComponent} from "./game/game.component";

const routes: Routes = [
    {path: '', component: AppComponent},
    {path: 'game', component: GameComponent},
];

@NgModule({
  declarations: [
    AppComponent,
      GameComponent
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
export class AppModule { }
