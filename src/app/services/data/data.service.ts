import { Injectable } from '@angular/core';
import { WebService } from '../web/web.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private webService:WebService) { }

    
  // getWinners():Observable<Map<string,number>> {
  //   let result:Map<string,number>=new Map<string,number>();
  //   this.webService.getDrivers().subscribe(driversResult=>{
  //     console.log("dr",driversResult);
  //     for(let driver of driversResult.MRData.DriverTable.Drivers){
    
  //       let name =driver.givenName[0]+' '+driver.familyName;
  //       this.webService.getDriverWins(driver.driverId).subscribe(res=>{
  //         if(res.MRData.Total>0){
  //           result.set(name,res.MRData.Total);
  //         }
  //       });
  //     }
  //     console.log(result);
  //   });
  // }
}
