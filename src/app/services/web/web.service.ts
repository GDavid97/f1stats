import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Driver} from '../../models/Driver.model';
import { Standing } from 'src/app/models/Standing.model';

const proxy="https://cors-anywhere.herokuapp.com/";
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

  constructor(private http: HttpClient) { }

  getDrivers(season:string,limit:number=1000,offset:number=0): Observable<Driver[]> {
  
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/driverStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
      ).pipe(map(res=>res.MRData.StandingsTable.StandingsLists[0].DriverStandings
        .sort((a,b)=>{return a.position-b.position;})
        .map(e=>
        {       
       
          let driver:Driver=e.Driver;
          driver.team=e.Constructors[0].name;      
          driver.teamId=e.Constructors[0].constructorId;  
          driver.season=res.MRData.StandingsTable.StandingsLists[0].season;    
          return driver;          
        }        
        )));
  }

  
  getDriverStanding(season:string,limit:number=1000,offset:number=0): Observable<Standing[]> {
    return this.http.get<any>(
      `${proxy}http://ergast.com/api/f1/${season}/driverStandings.json?limit=${limit}&offset=${offset}`,
      httpOptions
    ).pipe(map(res=>{
      let stArr:Standing[]=[];
      for(let item of res.MRData.StandingsTable.StandingsLists[0].DriverStandings){
        stArr.push({
          name:`${item.Driver.givenName} ${item.Driver.familyName}`,
          photo:`${item.Driver.driverId}.jpg`,
          points:item.points,
          team:item.Constructors[item.Constructors.length-1].name,
        })
      }
      return  stArr;
    }));
  }


  getDriverWins(driverId:string,limit:number=Number.MAX_SAFE_INTEGER,offset:number=0):Observable<any>{
    return this.http.get<any>(
      proxy+'http://ergast.com/api/f1/drivers/'+driverId+'/results/1.json?limit='+limit+'&offset='+offset,
      httpOptions
    )
  }

  getAllWins(limit:number=1000,offset:number=0):Observable<any>{
    return this.http.get<any>(
      proxy+'http://ergast.com/api/f1/results/1.json?limit='+limit+'&offset='+offset,
      httpOptions
    ) 
  }

  getNextRace():Observable<any>{
    return this.http.get<any>(
      proxy+'http://ergast.com/api/f1/current/next.json',
      httpOptions
    )  
  }

}
