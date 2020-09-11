import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map, takeUntil } from 'rxjs/operators';
import { Driver } from '../../models/Driver.model';
import { Standing } from 'src/app/models/Standing.model';
import { Team } from 'src/app/models/Team.model';
import { RaceResult, DriverResult } from 'src/app/models/RaceResult.model';
import {  RaceEvent } from 'src/app/models/RaceEvent.model';

const proxy = "https://cors-anywhere.herokuapp.com/";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};
const httpOptionsWithToken = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem("ingatlantoken")
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




  getDriverStanding(season: string='current', round:string='last', limit: number = 1000, offset: number = 0): Observable<Standing[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/${round}/driverStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let stArr: Standing[] = [];
      if(!res.MRData.StandingsTable.StandingsLists[0]){
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

  getTeamStanding(season: string='current', round:string='last', limit: number = 1000, offset: number = 0): Observable<Standing[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/${round}/constructorStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let stArr: Standing[] = [];
      let year = season == 'current' ? res.MRData.StandingsTable.season : season;
      if(!res.MRData.StandingsTable.StandingsLists[0]){
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

  getRaceResult(season:string,round:string,limit: number = Number.MAX_SAFE_INTEGER, offset: number = 0): Observable<RaceResult> {
    return this.http.get<any>(
      proxy + `http://ergast.com/api/f1/${season}/${round}/results.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {
      let raceResult: RaceResult
      let e = res.MRData.RaceTable.Races[0];
      if(e){
        raceResult= {
        circuit: e.Circuit.circuitName,
        season: e.season,
        date: `${e.date} ${e.time}`,
        raceName: e.raceName,
        round: e.round,
        drivers: e.Results.map(driverResult => {
          let newDr: DriverResult=driverResult.Driver    
          newDr.grid=driverResult.grid;
          newDr.laps=driverResult.laps;
          newDr.points=driverResult.points;
          newDr.position=driverResult.position;
          newDr.positionText=driverResult.positionText;
          newDr.status=driverResult.status;
          newDr.team = driverResult.Constructor.name;
          newDr.teamId = driverResult.Constructor.constructorId;
          newDr.season = e.season;
          newDr.fastestLap=driverResult.FastestLap?.rank==1;
          return newDr;
        })
      };
    }

      return raceResult;
    }))
  }

  getDriverResults(season:string,limit: number = 1000, offset: number = 0): Observable<any[]> {   
    return this.http.get<any>(
      proxy + `http://ergast.com/api/f1/${season}/results.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res=>{
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

  getCircuits(season:string,limit: number = 1000, offset: number = 0):Observable<RaceEvent[]>{
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res => {     
      let result:RaceEvent[]=[];
      for(let race of res.MRData.RaceTable.Races){
        let circuit=race.Circuit;
        result.push({
          raceName:race.raceName,
          circuitId:circuit.circuitId,
          circuitName:circuit.circuitName,
          circuitUrl:circuit.url,
          country:circuit.Location.country,
          date:new Date(race.date).toString()
        })
      }
      return result;
      }
      ));   
  }

}
