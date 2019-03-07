import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutesModule} from './app-routes.module';
import {FormsModule} from "@angular/forms";

import {AppComponent} from './app.component';
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {HomeComponent} from "./pages/home/home.component";
import {PresentationComponent} from "./presentation/presentation.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {HttpClientModule} from "@angular/common/http";

import {SocketService} from "./services/socket.service";
import {UserService} from "./services/user.service";
import {HttpModule} from "@angular/http";


@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        HomeComponent,
        PresentationComponent,
        DashboardComponent
    ],
    imports: [
        AppRoutesModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        HttpClientModule
    ],
    providers: [SocketService,UserService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
