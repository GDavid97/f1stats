import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Driver } from '../../models/Driver.model';
import { Standing } from 'src/app/models/Standing.model';
import { Team } from 'src/app/models/Team.model';
import { RaceResult, DriverResult } from 'src/app/models/RaceResult.model';
import { RaceEvent } from 'src/app/models/RaceEvent.model';
import { DriverPosition } from 'src/app/models/DriverPosition.model';

const proxy = "https://cors-anywhere.herokuapp.com/" //"https://cors-anywhere.herokuapp.com/"; //"https://thingproxy.freeboard.io/fetch/"
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};
@Injectable({
  providedIn: 'root'
})
export class WebService {

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private http: HttpClient) { }

  getDrivers(season: string, limit: number = 1000, offset: number = 0): Observable<Driver[]> {

    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/driverStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => res.MRData.StandingsTable.StandingsLists[0].DriverStandings
      .sort((a, b) => { return a.position - b.position; })
      .map(e => {
        let driver: Driver = e.Driver;
        driver.team = e.Constructors[0].name;
        driver.teamId = e.Constructors[0].constructorId;
        driver.season = res.MRData.StandingsTable.StandingsLists[0].season;
        return driver;
      }
      )));
  }
  getTeams(season: string, limit: number = 1000, offset: number = 0): Observable<Team[]> {

    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/constructorStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => res.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
      .sort((a, b) => { return a.position - b.position; })
      .map(e => {
        let team: Team = new Team();
        team.name = e.Constructor.name;
        team.constructorId = e.Constructor.constructorId
        team.nationality = e.Constructor.nationality;
        team.url = e.Constructor.url;
        team.photo = `${res.MRData.StandingsTable.StandingsLists[0].season}/${team.constructorId}`;

        return team;
      }
      )));
  }




  getDriverStanding(season: string = 'current', round: string = 'last', limit: number = 1000, offset: number = 0): Observable<Standing[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/${round}/driverStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let stArr: Standing[] = [];
      if (!res.MRData.StandingsTable.StandingsLists[0]) {
        return [];
      }
      for (let item of res.MRData.StandingsTable.StandingsLists[0].DriverStandings) {
        stArr.push({
          name: `${item.Driver.givenName} ${item.Driver.familyName}`,
          photo: `drivers/${item.Driver.driverId}.jpg`,
          points: item.points,
          team: item.Constructors[item.Constructors.length - 1].name,
        })
      }
      return stArr;
    }));
  }

  getTeamStanding(season: string = 'current', round: string = 'last', limit: number = 1000, offset: number = 0): Observable<Standing[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/${round}/constructorStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let stArr: Standing[] = [];
      let year = season == 'current' ? res.MRData.StandingsTable.season : season;
      if (!res.MRData.StandingsTable.StandingsLists[0]) {
        return [];
      }
      for (let item of res.MRData.StandingsTable.StandingsLists[0].ConstructorStandings) {
        stArr.push({
          name: item.Constructor.name,
          photo: `teams/${year}/${item.Constructor.constructorId}.jpg`,
          points: item.points,
          team: '',
        })
      }
      return stArr;
    }));
  }


  getDriverWins(driverId: string, limit: number = Number.MAX_SAFE_INTEGER, offset: number = 0): Observable<any> {
    return this.http.get<any>(
      proxy + 'http://ergast.com/api/f1/drivers/' + driverId + '/results/1.json?limit=' + limit + '&offset=' + offset,
      httpOptions
    )
  }

  getRaceResult(season: string, round: string, limit: number = Number.MAX_SAFE_INTEGER, offset: number = 0): Observable<RaceResult> {
    return this.http.get<any>(
      proxy + `http://ergast.com/api/f1/${season}/${round}/results.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let raceResult: RaceResult
      let e = res.MRData.RaceTable.Races[0];
      if (e) {
        raceResult = {
          circuit: e.Circuit.circuitName,
          season: e.season,
          date: `${e.date} ${e.time}`,
          raceName: e.raceName,
          round: e.round,
          drivers: e.Results.map(driverResult => {
            let newDr: DriverResult = driverResult.Driver
            newDr.grid = driverResult.grid;
            newDr.laps = driverResult.laps;
            newDr.points = driverResult.points;
            newDr.position = driverResult.position;
            newDr.positionText = driverResult.positionText;
            newDr.status = driverResult.status;
            newDr.team = driverResult.Constructor.name;
            newDr.teamId = driverResult.Constructor.constructorId;
            newDr.season = e.season;
            newDr.fastestLap = driverResult.FastestLap?.rank == 1;
            return newDr;
          })
        };
      }

      return raceResult;
    }))
  }

  getDriverResults(season: string, limit: number = 1000, offset: number = 0): Observable<any[]> {
    return this.http.get<any>(
      proxy + `http://ergast.com/api/f1/${season}/results.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      return res.MRData.RaceTable.Races;
    }));
  }





  getAllWins(limit: number = 1000, offset: number = 0): Observable<any> {
    return this.http.get<any>(
      proxy + 'http://ergast.com/api/f1/results/1.json?limit=' + limit + '&offset=' + offset,
      httpOptions
    )
  }

  getNextRace(): Observable<any> {
    return this.http.get<any>(
      proxy + 'http://ergast.com/api/f1/current/next.json',
      httpOptions
    )
  }

  getCircuits(season: string, limit: number = 1000, offset: number = 0): Observable<RaceEvent[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let result: RaceEvent[] = [];
      for (let race of res.MRData.RaceTable.Races) {
        let circuit = race.Circuit;
        result.push({
          raceName: race.raceName,
          circuitId: circuit.circuitId,
          circuitName: circuit.circuitName,
          circuitUrl: circuit.url,
          country: circuit.Location.country,
          date: new Date(race.date).toString()
        })
      }
      return result;
    }
    ));
  }

  getDriverRaceResults(driverId: string, limit: number = 1000, offset: number = 0): Observable<DriverResult[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/drivers/${driverId}/results.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let result: DriverResult[] = [];
      
      for (let race of res.MRData.RaceTable.Races) {
        result.push({
          grid: race.Results[0].grid,
          laps: race.Results[0].laps,
          points: race.Results[0].points,
          position: race.Results[0].position,
          positionText: race.Results[0].positionText,
          status: race.Results[0].status,
          fastestLap: race.Results[0].FastestLap?.rank=="1",
          code: race.Results[0].Driver.code,
          dateOfBirth: new Date(race.Results[0].Driver.dateOfBirth),
          driverId: race.Results[0].Driver.driverId,
          familyName: race.Results[0].Driver.familyName,
          givenName: race.Results[0].Driver.givenName,
          nationality: race.Results[0].Driver.nationality,
          team: race.Results[0].Constructor.name,
          permanentNumber: race.Results[0].Driver.permanentNumber,
          season: race.season,
          teamId: race.Results[0].Constructor.constructorId,
          url: race.Results[0].Driver.url,
          circuit:race.Circuit.circuitName,
          date:race.date,
          raceName:race.raceName,
          round:race.round
        });
      }
      return result;
    })
    );
  }

  getDriverTitles(driverId: string, limit: number = 1000, offset: number = 0): Observable<number> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/drivers/${driverId}/driverStandings/1.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {     
      return res.MRData.StandingsTable.StandingsLists.length;
    })
    );
  }

  getDriverChampionshipPositions(driverId: string, limit: number = 1000, offset: number = 0): Observable<DriverPosition[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/drivers/${driverId}/driverStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {  
      let result:DriverPosition[]=[];
      for(let standing of res.MRData.StandingsTable.StandingsLists){
        result.push({
          position:standing.DriverStandings[0].position,
          points:standing.DriverStandings[0].points,
          season:standing.season,
        });
      }      
      return result;      
    })
    );
  }




}
