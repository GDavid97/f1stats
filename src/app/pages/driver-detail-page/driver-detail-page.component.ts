import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverPosition } from 'src/app/models/DriverPosition.model';
import { DriverResult } from 'src/app/models/RaceResult.model';
import { DrivenInTeam } from 'src/app/models/Team.model';
import { WebService } from 'src/app/services/web/web.service';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { NameValue } from 'src/app/models/NameValue.model';
import { ResultsTableRow } from 'src/app/models/ResultsTable.model';
import { SeasonRound } from 'src/app/models/SeasonRound.model';

@Component({
  selector: 'driver-detail-page',
  templateUrl: './driver-detail-page.component.html',
  styleUrls: ['./driver-detail-page.component.scss']
})
export class DriverDetailPageComponent implements OnInit, OnDestroy {

  results: DriverResult[];

  isLoading: boolean = true;
  isChampionshipResultLoading: boolean = true;

  racesCount: number;
  points: number = 0;
  championshipsCount: number;
  winsCount: number;
  podiumsCount: number;
  polesCount: number;
  teams: DrivenInTeam[];
  championshipResults: DriverPosition[] = [];
  racesForTeamsChartData: NameValue[] = [];
  positionsChartData: NameValue[] = [];
  resultTableData:ResultsTableRow[]=[];
  driverPhotoId="noimage";

  championshipResultSubscription: Subscription;
  driverRaceResultSubscription: Subscription;
  driverTitlesSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
     private webService: WebService,
     private router:Router) {
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.getData(params.id);
        this.getDriverPositions(params.id);
      }
    });
  }

  ngOnInit(): void {
  }

  openRaceDetails(race:SeasonRound){
    this.router.navigate(['gp'], { queryParams: { season: race.season, round: race.round } });
  }

  openSeason(season:string){
    this.router.navigate(['seasons'], { queryParams: { season: season} });
  }

  private getData(driverId: string) {
    this.isLoading = true;
    this.driverPhotoId="noimage";

    this.driverRaceResultSubscription?.unsubscribe();
    this.driverRaceResultSubscription = this.webService.getDriverRaceResults(driverId).subscribe(res => {

      this.results = res;
      this.racesCount = res.length;
      this.winsCount = res.filter(e => e.position == "1").length;
      this.podiumsCount = res.filter(e => (e.position == "1" || e.position == "2" || e.position == "3")).length;
      this.polesCount = res.filter(e => e.grid == "1").length;
      this.racesForTeamsChartData = this.fillRacesForTeamsData(res);
      this.positionsChartData = this.fillPositionsData(res);
      this.testDriverImage(`assets/drivers/${this.results[0].driverId}.jpg`)

      this.teams = [];
      let currentTeamId, startSeason, currentTeamName, endSeason, tableData:ResultsTableRow[]=[];
      res.forEach(e => {
        this.points += parseInt(e.points);

        let resultRow=tableData.find(d=>d.season===e.season);
        if(resultRow){
          resultRow.points+=parseInt(e.points);
          resultRow.team=e.team;
          resultRow.results.push({
            position:e.positionText,
            points:parseInt(e.points),
            raceName:e.raceName,
            round:e.round
          });
        }
        else{
          resultRow=new ResultsTableRow();
          resultRow.points=parseInt(e.points);
          resultRow.team=e.team;
          resultRow.season=e.season;
          resultRow.results=[{
            position:e.positionText,
            points:parseInt(e.points),
            raceName:e.raceName,
            round:e.round
          }];
          tableData.push(resultRow);
        }

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

      this.resultTableData=tableData;

      this.teams.push({
        constructorId: currentTeamId,
        name: currentTeamName,
        startSeason: startSeason,
        endSeason: endSeason,
        photo: `${startSeason}/${currentTeamId}`,
      });
      this.driverTitlesSubscription?.unsubscribe();
      this.driverTitlesSubscription = this.webService.getDriverTitles(driverId).subscribe(res => {
        this.championshipsCount = res;
        this.isLoading = false;
      });
    });
  }
  

  private getDriverPositions(driverId: string) {
    this.isChampionshipResultLoading = true;
    this.championshipResultSubscription?.unsubscribe();
    this.championshipResultSubscription = this.webService.getDriverChampionshipPositions(driverId).subscribe(res => {
      this.championshipResults = res;
      this.isChampionshipResultLoading = false;
    })
  }

  private fillRacesForTeamsData(driverResult: DriverResult[]): NameValue[] {
    let res: NameValue[] = [];
    for (let result of driverResult) {
      let item = res.find(e => e.name === result.team);
      if (!item) {
        res.push({ name: result.team, value: 1 });
      }
      else {
        item.value = item.value + 1;
      }
    }
    return res;
  }

  private fillPositionsData(driverResult: DriverResult[]): NameValue[] {
    let res: NameValue[] = [];
    for (let result of driverResult) {
      if (result.positionText!='R' && parseInt(result.positionText) <= 10) {
        let item = res.find(e => e.name === result.positionText + '.');
        if (!item) {
          res.push({ name: result.positionText + '.', value: 1 });
        }
        else {
          item.value = item.value + 1;
        }
      }
    }
    return res;
  }

  private testDriverImage(URL: string) {
    var tester = new Image();
    tester.onload = () => {
      this.driverPhotoId = `${this.results[0].driverId}`;
    };

    tester.src = URL;
  }

  ngOnDestroy() {
    this.driverRaceResultSubscription?.unsubscribe();
    this.championshipResultSubscription?.unsubscribe();
    this.driverTitlesSubscription?.unsubscribe();
  }


}
