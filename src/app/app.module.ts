import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SeasonPageComponent } from './pages/season-page/season-page.component';
import { BubbleChartComponent } from './charts/bubble-chart/bubble-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SeasonPageComponent,
    BubbleChartComponent
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
