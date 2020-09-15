import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private webService: WebService) {
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.getData(params.id);
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
            endSeason: e.season,
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
      console.log(this.teams);
      this.webService.getDriverTitles(driverId).subscribe(res => {
        this.championshipsCount = res;
        this.isLoading = false;
      });


    });


  }

}
