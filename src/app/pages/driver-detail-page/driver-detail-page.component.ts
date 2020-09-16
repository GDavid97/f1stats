import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverPosition } from 'src/app/models/DriverPosition.model';
import { DriverResult } from 'src/app/models/RaceResult.model';
import { DrivenInTeam } from 'src/app/models/Team.model';
import { WebService } from 'src/app/services/web/web.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'driver-detail-page',
  templateUrl: './driver-detail-page.component.html',
  styleUrls: ['./driver-detail-page.component.scss']
})
export class DriverDetailPageComponent implements OnInit, OnDestroy {

  results: DriverResult[];

  isLoading: boolean = true;
  isChampionshipResultLoading:boolean=true;

  racesCount: number;
  points: number = 0;
  championshipsCount: number;
  winsCount: number;
  podiumsCount: number;
  polesCount: number;
  teams: DrivenInTeam[];
  championshipResults:DriverPosition[]=[];

  championshipResultSubscription:Subscription;
  driverRaceResultSubscription:Subscription;
  driverTitlesSubscription:Subscription;

  constructor(private route: ActivatedRoute, private webService: WebService) {
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.getData(params.id);
        this.getDriverPositions(params.id);
      }
    });
  }

  ngOnInit(): void {
  }

  private getData(driverId: string) {
    this.isLoading = true;

    this.driverRaceResultSubscription?.unsubscribe();
    this.driverRaceResultSubscription=this.webService.getDriverRaceResults(driverId).subscribe(res => {

      this.results = res;
      this.racesCount = res.length;
      this.winsCount = res.filter(e => e.position == "1").length;
      this.podiumsCount = res.filter(e => (e.position == "1" || e.position == "2" || e.position == "3")).length;
      this.polesCount = res.filter(e => e.grid == "1").length;

      this.teams = [];
      let currentTeamId, startSeason, currentTeamName, endSeason;
      res.forEach(e => {
        this.points += parseInt(e.points);

        if (!currentTeamId) {
          currentTeamId = e.teamId;
          currentTeamName = e.team;
          startSeason = e.season;
        }
        else if (e.teamId != currentTeamId) {
          this.teams.push({
            constructorId: currentTeamId,
            name: currentTeamName,
            startSeason: startSeason,
            endSeason: endSeason,
            photo: `${endSeason}/${currentTeamId}`,
          })
          currentTeamId = e.teamId;
          currentTeamName = e.team;
          startSeason = e.season;
        }
        endSeason = e.season;
      });
      this.teams.push({
        constructorId: currentTeamId,
        name: currentTeamName,
        startSeason: startSeason,
        endSeason: endSeason,
        photo: `${startSeason}/${currentTeamId}`,
      });
      this.driverTitlesSubscription?.unsubscribe();
      this.driverTitlesSubscription=this.webService.getDriverTitles(driverId).subscribe(res => {
        this.championshipsCount = res;
        this.isLoading = false;
      });
    });
  }

  private getDriverPositions(driverId:string){
    this.isChampionshipResultLoading=true;
  this.championshipResultSubscription?.unsubscribe();
    this.championshipResultSubscription=this.webService.getDriverChampionshipPositions(driverId).subscribe(res=>{
      this.championshipResults=res;
      this.isChampionshipResultLoading=false;
    })
  }

  ngOnDestroy(){
    this.driverRaceResultSubscription?.unsubscribe();
    this.championshipResultSubscription?.unsubscribe();
    this.driverTitlesSubscription?.unsubscribe();
  }


}
