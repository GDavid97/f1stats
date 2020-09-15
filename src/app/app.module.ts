import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { StandingComponent } from './components/standing/standing.component';
import { TeamTileComponent } from './components/team-tile/team-tile.component';
import { RaceDataComponent } from './components/race-data/race-data.component';
import { MultiLineChartComponent } from './charts/multi-line-chart/multi-line-chart.component';
import { ChartsModule } from 'ng2-charts';
import { AccordionComponent } from './components/accordion/accordion.component';
import { CircuitComponent } from './components/circuit/circuit.component';
import { GrandPrixPageComponent } from './pages/grand-prix-page/grand-prix-page.component';
import { DriverDetailPageComponent } from './pages/driver-detail-page/driver-detail-page.component';
import { CounterComponent } from './components/counter/counter.component';

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
    DriverTileComponent,
    StandingComponent,
    TeamTileComponent,
    RaceDataComponent,
    MultiLineChartComponent,
    AccordionComponent,
    CircuitComponent,
    GrandPrixPageComponent,
    DriverDetailPageComponent,
    CounterComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
