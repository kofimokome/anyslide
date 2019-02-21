import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

// importing the components
import {AppComponent} from "./app.component";

// Setting the routes
const routes: Routes = [
  {path: '', component: AppComponent},
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
