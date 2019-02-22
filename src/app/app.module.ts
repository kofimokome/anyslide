import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {HomeComponent} from "./pages/home/home.component";

import {AppRoutesModule} from './app-routes.module';


@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HomeComponent
  ],
  imports: [
    AppRoutesModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
