import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web/web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LineChartData } from 'src/app/models/LineChartData.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-season-page',
  templateUrl: './season-page.component.html',
  styleUrls: ['./season-page.component.scss']
})
export class SeasonPageComponent implements OnInit {

  driversPointsForChart: LineChartData[];
  season: number = new Date().getFullYear();
  nextButtonDisabled: boolean = true;
  prevButtonDisabled: boolean = true;
  driverResultsSubscription: Subscription;

  constructor(private webService: WebService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.season) {
        if (params.season >= 1950 && params.season <= new Date().getFullYear()) {
          this.season = params.season;
        }
        else {
          this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: new Date().getFullYear() } });
        }

      }
      else {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season } });
      }

    });
  }

  ngOnInit() {
    this.setDefaultNavButtons(this.season);
    this.getDriverResults();
  }

  setDefaultNavButtons(season: number) {
    if (season == new Date().getFullYear()) {
      this.prevButtonDisabled = false;
      this.nextButtonDisabled = true;
    }
    else if (season == 1950) {
      this.prevButtonDisabled = true;
      this.nextButtonDisabled = false;
    }
    else {
      this.prevButtonDisabled = false;
      this.nextButtonDisabled = false;
    }
  }

  prevSeason() {
    if (this.season > 1950) {
      this.season--;

      this.nextButtonDisabled = false;
      this.prevButtonDisabled = false;
      if (this.season == 1950) {
        this.prevButtonDisabled = true;

      }
      else {
        this.nextButtonDisabled = false;
        this.prevButtonDisabled = false;
      }
    }

    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season } });


  }

  nextSeason() {
    const currentYear = new Date().getFullYear();
    if (this.season < currentYear) {
      this.season++;

      if (this.season == currentYear) {
        this.nextButtonDisabled = true;
      }
      else {

        this.nextButtonDisabled = false;
        this.prevButtonDisabled = false;
      }

    }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season } });
  }

  getDriverResults() {
    this.driverResultsSubscription?.unsubscribe();
    let pointResult: LineChartData[] = [];

    this.driverResultsSubscription = this.webService.getDriverResults(this.season.toString()).subscribe(res => {

      //fill all drivers who participated in the season
      for (let race of res) {
        for (let result of race.Results) {
          let lineChartData = pointResult.find(e => e.id == result.Driver.driverId);
          if (!lineChartData) {
            pointResult.push({
              id: result.Driver.driverId,
              text: `${result.Driver.givenName} ${result.Driver.familyName}`,
              values: null
            });
          }
        }
      }

      for (let race of res) {
        
        for (let result of race.Results) {
          let lineChartData = pointResult.find(e => e.id == result.Driver.driverId);
          if (!lineChartData.values) {
            let valueMap = new Map<string, number>();
            valueMap.set(race.raceName, parseInt(result.points));
            lineChartData.values=valueMap;            
          }
          else {
            let points: number = parseInt(result.points);
            const getLastValueInMap = (map) => [...map][map.size - 1][1];
            let newPoints: number = points + getLastValueInMap(lineChartData.values);           
    
            lineChartData.values.set(race.raceName, newPoints);
            
          }
        }
      }




      this.driversPointsForChart = pointResult;
      console.log(this.driversPointsForChart);
    })
  }

  ngOnDestroy() {
    this.driverResultsSubscription.unsubscribe();
  }

}
