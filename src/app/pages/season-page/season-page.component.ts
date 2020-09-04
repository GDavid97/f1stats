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

  driversPointsForChart:LineChartData[];
  season: number = new Date().getFullYear();
  nextButtonDisabled: boolean = true;
  prevButtonDisabled: boolean = true;
  driverResultsSubscription: Subscription;

  constructor(private webService: WebService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.season) {
        if(params.season>=1950 && params.season<=new Date().getFullYear()){
          this.season = params.season;
        }
        else{
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

  getDriverResults(){   
    this.driverResultsSubscription?.unsubscribe();
  
    this.driverResultsSubscription=this.webService.getDriverResults(this.season.toString()).subscribe(res=>{
      console.log(res);
    })
  }

  ngOnDestroy(){
    this.driverResultsSubscription.unsubscribe();
  }

}
