import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutesModule} from './app-routes.module';
import {FormsModule} from "@angular/forms";

import {AppComponent} from './app.component';
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {HomeComponent} from "./pages/home/home.component";
import {PresentationComponent} from "./presentation/view/presentation.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {HttpClientModule} from "@angular/common/http";
import {EditorModule} from "@tinymce/tinymce-angular";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


import {SocketService} from "./services/socket.service";
import {UserService} from "./services/user.service";
import {HttpModule} from "@angular/http";
import {EditComponent} from "./presentation/edit/edit.component";
import {NavbarComponent} from "./partials/navbar/navbar.component";
import {FooterComponent} from "./partials/footer/footer.component";



@NgModule({
    declarations: [
        AppComponent,
        NotfoundComponent,
        HomeComponent,
        PresentationComponent,
        DashboardComponent,
        EditComponent,
        NavbarComponent,
        FooterComponent,
    ],
    imports: [
        AppRoutesModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        EditorModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
    ],
    providers: [SocketService,UserService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
