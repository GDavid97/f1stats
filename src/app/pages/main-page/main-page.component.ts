import { Component, OnInit } from '@angular/core';
import { BubbleChartModel } from 'src/app/charts/bubble-chart/models';
import { DataService } from 'src/app/services/data/data.service';
import { WebService } from 'src/app/services/web/web.service';
import { NextRaceModel } from 'src/app/components/next-race/models';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  bubbleChartData:BubbleChartModel[]=[];
  nextRaceData:NextRaceModel=new NextRaceModel();

  areBubblesLoading=true;
  isNextRaceLoading=true;

  constructor(private dataService:DataService, private webService:WebService) { }

  ngOnInit() {
    this.getWinnersForBubbleChart();
    this.getNextRace();
    this.webService.getAllDrivers('').subscribe(res=>{console.log(res)})
  }

  getWinnersForBubbleChart(){
    let results:Map<string,number>=new Map<string,number>();
    this.areBubblesLoading=true;
    this.webService.getAllWins().subscribe(res=>{      
        this.fetchBubbleData(res.MRData.RaceTable.Races,results);

        this.webService.getAllWins(1000,1000).subscribe(res=>{
          this.fetchBubbleData(res.MRData.RaceTable.Races,results);

          for (const [key, value] of results.entries()) {
            this.bubbleChartData.push({
            name:key,
            value:value,
            group:(Math.floor(value/10)+1).toString()
            });
          }
          this.bubbleChartData=[...this.bubbleChartData];
        });
      
     
      this.areBubblesLoading=false;
    });
    
  }

  private fetchBubbleData(races:any[],results:Map<string,number>){
    for(let race of races){
      let driver=race.Results[0].Driver;
      let name =driver.givenName[0]+'. '+driver.familyName;
 
        if(results.has(name)){
          results.set(name,results.get(name)+1);
        }
        else{
          results.set(name,1);
        }
    }
    
 
  }

  getNextRace(){
    let nextRaceData:NextRaceModel=new NextRaceModel();
    this.webService.getNextRace().subscribe(res=>{
      let data=res.MRData.RaceTable.Races[0];
      nextRaceData.raceName=data.raceName;
      nextRaceData.date=data.date;
      nextRaceData.time=data.time;
      nextRaceData.season=data.season;
      nextRaceData.round=data.round;
      nextRaceData.country=data.Circuit.Location.country;
      nextRaceData.circuitName=data.Circuit.circuitName;
      this.nextRaceData=nextRaceData;
      this.isNextRaceLoading=false;
    });
  }

}
