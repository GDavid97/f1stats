import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebService } from 'src/app/services/web/web.service';
import { Observable, Subscription } from 'rxjs';
import { Driver } from 'src/app/models/Driver.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'drivers-page',
  templateUrl: './drivers-page.component.html',
  styleUrls: ['./drivers-page.component.scss']
})
export class DriversPageComponent implements OnInit, OnDestroy {

  drivers: Driver[];
  isDriverGridLoading: boolean = true;
  season: number = new Date().getFullYear();
  nextButtonDisabled: boolean = true;
  prevButtonDisabled: boolean = true;

  private driversSubscription: Subscription;

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
    this.getData(this.season.toString());
    this.setDefaultNavButtons(this.season);
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

  getData(season: string) {
    this.drivers = [];
    this.isDriverGridLoading = true;
    this.driversSubscription?.unsubscribe();

    this.driversSubscription = this.webService.getDrivers(season).subscribe(res => {
      this.isDriverGridLoading = false;
      this.drivers = res;
    });
  }

  prevSeason() {
    if (this.season > 1950) {
      this.season--;
      this.getData(this.season.toString());
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
      this.getData(this.season.toString());

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

  ngOnDestroy() {
    this.driversSubscription?.unsubscribe();
  }

}
