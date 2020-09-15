import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { Driver } from 'src/app/models/Driver.model';
import { DriverResult } from 'src/app/models/RaceResult.model';
import { WebService } from 'src/app/services/web/web.service';

@Component({
  selector: 'driver-detail-page',
  templateUrl: './driver-detail-page.component.html',
  styleUrls: ['./driver-detail-page.component.scss']
})
export class DriverDetailPageComponent implements OnInit {

  results:DriverResult[];

  isLoading:boolean=true;

  racesCount:number;  
  points:number=0;  
  winsCount:number;
  podiumsCount:number;
  polesCount:number;

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
    this.isLoading=true;
    this.webService.getDriverRaceResults(driverId).subscribe(res => {
      this.isLoading=false;  
      this.results=res;
      this.racesCount=res.length;
      this.winsCount=res.filter(e=>e.position=="1").length;
      this.podiumsCount=res.filter(e=>(e.position=="1" || e.position=="2" || e.position=="3")).length;
      this.polesCount=res.filter(e=>e.grid=="1").length;
      res.forEach(e=>{
        this.points+=parseInt(e.points);
      })
    });
  }

}
