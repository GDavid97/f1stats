import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebService } from 'src/app/services/web/web.service';
import { Observable, Subscription } from 'rxjs';
import { Driver } from 'src/app/models/Driver.model';

@Component({
  selector: 'drivers-page',
  templateUrl: './drivers-page.component.html',
  styleUrls: ['./drivers-page.component.scss']
})
export class DriversPageComponent implements OnInit, OnDestroy{

  drivers:Driver[];
  isDriverGridLoading:boolean=true;
  season:number=new Date().getFullYear();
  nextButtonDisabled:boolean=true;
  prevButtonDisabled:boolean;

  private driverSubscription:Subscription;

  constructor(private webService:WebService) { }

  ngOnInit() {
    this.getData(this.season.toString());
  }

  getData(season:string){
    if(this.driverSubscription){
      this.driverSubscription.unsubscribe();
    }
    this.drivers=[];
    this.isDriverGridLoading=true;
    this.driverSubscription=this.webService.getDrivers(season).subscribe(res=>{
      console.log(res);
      this.isDriverGridLoading=false;
      this.drivers=res;
    });
  }

  prevSeason(){
    if(this.season>1950){
      this.season--;     
      this.getData(this.season.toString());
      this.nextButtonDisabled=false;
      this.prevButtonDisabled=false;
      if(this.season==1950){
        this.prevButtonDisabled=true;
        
      }
      else{
        this.nextButtonDisabled=false;
        this.prevButtonDisabled=false;
      }
    }
 
    
  }

  nextSeason(){
    const currentYear=new Date().getFullYear();
    if(this.season<currentYear){
      this.season++;
      this.getData(this.season.toString());

      if(this.season==currentYear){
        this.nextButtonDisabled=true;
      }
      else{
     
        this.nextButtonDisabled=false;
        this.prevButtonDisabled=false;
      }
    
    }
    
  }

  ngOnDestroy(){
    this.driverSubscription.unsubscribe();
  }

}
