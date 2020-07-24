import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './pages/user-list/user-list.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '', component: UserListComponent
      },
      {
        path: 'new', component: UserDetailsComponent
      },
      {
        path: ':id', component: UserDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
