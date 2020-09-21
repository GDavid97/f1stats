import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebService } from 'src/app/services/web/web.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/models/Team.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent implements OnInit, OnDestroy {

  teams: Team[];

  isTeamGridLoading = true;
  season: number = new Date().getFullYear();
  nextButtonDisabled = true;
  prevButtonDisabled = true;

  private teamsSubscription: Subscription;

  constructor(private webService: WebService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.season) {
        if (params.season >= 1950 && params.season <= new Date().getFullYear()) {
          this.season = params.season;
        } else {
          this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: new Date().getFullYear() } });
        }

      } else {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season } });
      }
      this.getData(this.season.toString());
    });
  }

  ngOnInit() {
    this.setDefaultNavButtons(this.season);
  }
  setDefaultNavButtons(season: number) {
    if (season == new Date().getFullYear()) {
      this.prevButtonDisabled = false;
      this.nextButtonDisabled = true;
    } else if (season == 1950) {
      this.prevButtonDisabled = true;
      this.nextButtonDisabled = false;
    } else {
      this.prevButtonDisabled = false;
      this.nextButtonDisabled = false;
    }
  }

  getData(season: string) {
    this.teams = [];
    this.isTeamGridLoading = true;
    this.teamsSubscription?.unsubscribe();
    this.teamsSubscription = this.webService.getTeams(season).subscribe(res => {
      this.isTeamGridLoading = false;
      this.teams = res;

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

      } else {
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
      } else {

        this.nextButtonDisabled = false;
        this.prevButtonDisabled = false;
      }

    }
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { season: this.season } });
  }

  ngOnDestroy() {
    this.teamsSubscription?.unsubscribe();
  }

}

