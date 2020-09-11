import { Component, OnInit } from '@angular/core';
import { WebService } from 'src/app/services/web/web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LineChartData } from 'src/app/models/LineChartData.model';
import { Subscription } from 'rxjs';
import { RaceEvent } from 'src/app/models/RaceEvent.model';
import { Standing } from 'src/app/models/Standing.model';

@Component({
  selector: 'app-season-page',
  templateUrl: './season-page.component.html',
  styleUrls: ['./season-page.component.scss']
})
export class SeasonPageComponent implements OnInit {

  driversPointsForChart: LineChartData[];
  circuits: RaceEvent[];
  driverStanding: Standing[];
  teamStanding: Standing[];

  season: number = new Date().getFullYear();
  nextButtonDisabled: boolean = true;
  prevButtonDisabled: boolean = true;
  
  driverResultsSubscription: Subscription;
  circuitSubscription: Subscription;
  driverStandingSubscription:Subscription;
  teamStandingSubscription:Subscription;

  isDriverPointsLoading: boolean = true;
  isCircuitsLoading: boolean = true;
  isDriverStandingLoading:boolean=true;
  isTeamStandingLoading:boolean=true;
 


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
    this.getData(this.season.toString());    
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
    this.getData(this.season.toString());

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
    this.getData(this.season.toString());
  }

  private getDriverResults(season: string) {
    this.driverResultsSubscription?.unsubscribe();
    let pointResult: LineChartData[] = [];
    this.isDriverPointsLoading = true;
    this.driverResultsSubscription = this.webService.getDriverResults(season).subscribe(res => {

      //fill all drivers who participated in the season
      for (let race of res) {
        for (let result of race.Results) {
          let lineChartData = pointResult.find(e => e.id == result.Driver.driverId);
          if (!lineChartData) {
            pointResult.push({
              id: result.Driver.driverId,
              text: `${result.Driver.givenName} ${result.Driver.familyName}`,
              values: new Map<string, number>()
            });
          }
        }
      }
      for (let race of res) {
        for (let driver of pointResult) {
          let result = race.Results.find(element => element.Driver.driverId == driver.id);
          if (result) {

            let points: number = parseInt(result.points);
            const getLastValueInMap = (map) => [...map][map.size - 1][1];
            if (driver.values.size > 0) {
              let newPoints: number = points + getLastValueInMap(driver.values);
              driver.values.set(race.raceName, newPoints);
            }
            else {
              driver.values.set(race.raceName, parseInt(result.points));
            }

          }
          else {
            let points: number = 0;
            const getLastValueInMap = (map) => [...map][map.size - 1][1];
            if (driver.values.size > 0) {
              let newPoints: number = points + getLastValueInMap(driver.values);
              driver.values.set(race.raceName, newPoints);
            }
            else {
              driver.values.set(race.raceName, 0);
            }
          }
        }
      }

      this.driversPointsForChart = pointResult;
      this.isDriverPointsLoading = false;
    });
  }

  private getCircuits(season: string) {
    this.circuitSubscription?.unsubscribe();
    this.circuits = [];
    this.isCircuitsLoading = true;
    this.webService.getCircuits(season).subscribe(res => {
      this.isCircuitsLoading = false;
      this.circuits = res;
      console.log(res);
    });
  }

  private getDriversStanding(season:string){
    this.driverStandingSubscription?.unsubscribe();
    this.driverStanding = [];
    this.isDriverStandingLoading = true;
    this.driverStandingSubscription=this.webService.getDriverStanding(season).subscribe(res => {
      this.isDriverStandingLoading = false;
      this.driverStanding = res;
    });
  }

  private getTeamStanding(season:string) {  
    this.teamStandingSubscription?.unsubscribe();
 
    this.isTeamStandingLoading = true;
    this.teamStandingSubscription=this.webService.getTeamStanding(season).subscribe(res => {
      this.isTeamStandingLoading = false;
      this.teamStanding = res;
    });
  }

  private getData(season:string){
    this.getDriverResults(season);
    this.getCircuits(season);
    this.getDriversStanding(season);
    this.getTeamStanding(season);
  }

  ngOnDestroy() {
    this.driverResultsSubscription.unsubscribe();
    this.circuitSubscription.unsubscribe();
    this.driverStandingSubscription.unsubscribe();
  }

}
