import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverPosition } from 'src/app/models/DriverPosition.model';
import { DriverResult } from 'src/app/models/RaceResult.model';
import { DrivenInTeam } from 'src/app/models/Team.model';
import { WebService } from 'src/app/services/web/web.service';

@Component({
  selector: 'driver-detail-page',
  templateUrl: './driver-detail-page.component.html',
  styleUrls: ['./driver-detail-page.component.scss']
})
export class DriverDetailPageComponent implements OnInit {

  results: DriverResult[];

  isLoading: boolean = true;

  racesCount: number;
  points: number = 0;
  championshipsCount: number;
  winsCount: number;
  podiumsCount: number;
  polesCount: number;
  teams: DrivenInTeam[];
  championshipResults:DriverPosition[]=[];

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
    this.webService.getDriverRaceResults(driverId).subscribe(res => {

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
            endSeason: res.filter(d=>d.teamId==currentTeamId).sort((a,b)=>{return Number(b.season)-Number(a.season)})[0].season,
            photo: `${startSeason}/${currentTeamId}`,
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
      this.webService.getDriverTitles(driverId).subscribe(res => {
        this.championshipsCount = res;
        this.isLoading = false;
      });


    });


  }

  private getDriverPositions(driverId:string){
    this.webService.getDriverChampionshipPositions(driverId).subscribe(res=>{
      console.log(res);
    })
  }

}
