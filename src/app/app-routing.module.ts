import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SeasonPageComponent } from './pages/season-page/season-page.component';
import { CircuitsPageComponent } from './pages/circuits-page/circuits-page.component';
import { DriversPageComponent } from './pages/drivers-page/drivers-page.component';
import { TeamsPageComponent } from './pages/teams-page/teams-page.component';
import { GrandPrixPageComponent } from './pages/grand-prix-page/grand-prix-page.component';

const routes: Routes = [
  { path: 'seasons', component: SeasonPageComponent },
  { path: 'teams', component: TeamsPageComponent },
  { path: 'drivers', component: DriversPageComponent },
  { path: 'circuits', component: CircuitsPageComponent },
  { path: 'gp', component: GrandPrixPageComponent },
  { path: '', component: MainPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
