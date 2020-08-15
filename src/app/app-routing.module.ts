import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SeasonPageComponent } from './pages/season-page/season-page.component';

const routes: Routes = [
  { path: 'seasons', component: SeasonPageComponent },
  { path: '', component: MainPageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
