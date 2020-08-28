import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SeasonPageComponent } from './pages/season-page/season-page.component';
import { BubbleChartComponent } from './charts/bubble-chart/bubble-chart.component';
import { NextRaceComponent } from './components/next-race/next-race.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CircuitsPageComponent } from './pages/circuits-page/circuits-page.component';
import { TeamsPageComponent } from './pages/teams-page/teams-page.component';
import { DriversPageComponent } from './pages/drivers-page/drivers-page.component';
import { DriverTileComponent } from './components/driver-tile/driver-tile.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SeasonPageComponent,
    BubbleChartComponent,
    NextRaceComponent,
    NavbarComponent,
    CircuitsPageComponent,
    TeamsPageComponent,
    DriversPageComponent,
    DriverTileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
