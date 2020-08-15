import { Component, OnInit } from '@angular/core';
import { BubbleChartModel } from 'src/app/charts/bubble-chart/models';
import { DataService } from 'src/app/services/data/data.service';
import { WebService } from 'src/app/services/web/web.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  bubbleChartData:BubbleChartModel[]=[];

  areBubblesLoading=true;

  constructor(private dataService:DataService, private webService:WebService) { }

  ngOnInit() {
    this.getWinnersForBubbleChart();
  }

  getWinnersForBubbleChart(){
    let results:Map<string,number>=new Map<string,number>();
    this.areBubblesLoading=true;
    this.webService.getAllWins().subscribe(res=>{
      for(let race of res.MRData.RaceTable.Races){
        let driver=race.Results[0].Driver;
        let name =driver.givenName[0]+'. '+driver.familyName;
   
          if(results.has(name)){
            results.set(name,results.get(name)+1);
          }
          else{
            results.set(name,1);
          }
      }
      
      for (const [key, value] of results.entries()) {
        this.bubbleChartData.push({
        name:key,
        value:value,
        group:(Math.floor(value/10)+1).toString()
        });
      }
      this.bubbleChartData=[...this.bubbleChartData];
      this.areBubblesLoading=false;
    });
    
  }

}
