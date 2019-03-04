import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutesModule} from './app-routes.module';

import {AppComponent} from './app.component';
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {HomeComponent} from "./pages/home/home.component";
import {PresentationComponent} from "./presentation/presentation.component";

import {SocketService} from "./services/socket.service";


@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        HomeComponent,
        PresentationComponent,
    ],
    imports: [
        AppRoutesModule,
        BrowserModule
    ],
    providers: [SocketService,],
    bootstrap: [AppComponent]
})
export class AppModule {
}
