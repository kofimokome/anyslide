import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

// importing the components
import {AppComponent} from "./app.component";
import {NotfoundComponent} from "./pages/notfound/notfound.component";
import {HomeComponent} from "./pages/home/home.component";
import {PresentationComponent} from "./presentation/view/presentation.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {EditComponent} from "./presentation/edit/edit.component";

// Setting the routes
const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'presentation/:id', component: PresentationComponent, data: {type: 'presenter', notguest: true}},
    {path: 'presentation/controller', component: PresentationComponent},
    {path: 'presentation/view/:id', component: PresentationComponent, data: {notguest: false}},
    {path: 'presentation/edit/:id', component: EditComponent},
    {path: 'dashboard', component: DashboardComponent},
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
