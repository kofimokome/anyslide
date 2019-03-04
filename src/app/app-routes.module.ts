import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

// importing the components
import {AppComponent} from "./app.component";
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {HomeComponent} from "./pages/home/home.component";
import {PresentationComponent} from "./presentation/presentation.component";

// Setting the routes
const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'presentation', component: PresentationComponent, data: {type: 'presenter', notguest: true}},
    {path: 'presentation/controller', component: PresentationComponent},
    {path: 'view/presentation', component: PresentationComponent, data: {notguest: false}},
    {path: '404', component: NotfoundComponent},
    {path: '**', redirectTo: '/404', pathMatch: 'full'},
    // {path: '', redirectTo: '/login', pathMatch: 'full'},
    // {path: 'chat/:name', component: ChatComponent}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutesModule {
}
