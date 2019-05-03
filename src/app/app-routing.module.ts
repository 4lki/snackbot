import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { ItemOverviewComponent } from './item-overview/item-overview.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [

  {path:'drinks', component:ItemOverviewComponent, data: {collection : 'Drinks'}},
  {path:'snacks', component:ItemOverviewComponent, data: {collection : 'Snacks'}},
  {path:'users', component:UserOverviewComponent, canActivate: [AuthGuard]},
  {path:'**', component:ItemOverviewComponent, data: {collection : 'Drinks'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
