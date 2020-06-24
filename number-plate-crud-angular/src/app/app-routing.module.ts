import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatesComponent } from './plates/plates.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'plates',
    pathMatch: 'full'
  },

  {
    path: 'plates',
    component: PlatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
