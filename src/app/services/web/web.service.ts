import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';


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

  
  getData(): Observable<any> {
  
    return this.http.get<any>(
      'https://cors-anywhere.herokuapp.com/http://ergast.com/api/f1/2008.json',
      httpOptions
    )
  }

  getDrivers(limit:number=1000,offset:number=0): Observable<any> {
  
    return this.http.get<any>(
      'https://cors-anywhere.herokuapp.com/http://ergast.com/api/f1/drivers.json?limit='+limit+'&offset='+offset,
      httpOptions
    )
  }


  getDriverWins(driverId:string,limit:number=Number.MAX_SAFE_INTEGER,offset:number=0):Observable<any>{
    return this.http.get<any>(
      'https://cors-anywhere.herokuapp.com/http://ergast.com/api/f1/drivers/'+driverId+'/results/1.json?limit='+limit+'&offset='+offset,
      httpOptions
    )
  }

  getAllWins(limit:number=1000,offset:number=0):Observable<any>{
    return this.http.get<any>(
      'https://cors-anywhere.herokuapp.com/http://ergast.com/api/f1/results/1.json?limit='+limit+'&offset='+offset,
      httpOptions
    ) 
  }

  getNextRace():Observable<any>{
    return this.http.get<any>(
      'https://cors-anywhere.herokuapp.com/http://ergast.com/api/f1/current/next.json',
      httpOptions
    )  
  }
}
