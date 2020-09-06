import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { LineChartData } from 'src/app/models/LineChartData.model';

@Component({
  selector: 'multi-line-chart',
  templateUrl: './multi-line-chart.component.html',
  styleUrls: ['./multi-line-chart.component.scss']
})
export class MultiLineChartComponent implements OnInit, OnChanges {

  @Input()
  data:LineChartData[];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
   
    elements:{
      line:{
        fill: false,
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
       
      ]
    },
    annotation: {
      annotations: [
        
      ],
    },
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.data &&changes.data.currentValue){
   
      this.lineChartData=[];
      this.lineChartLabels=[];  
      let labels:Set<string>=new Set();
      this.data.forEach(element => {
        let vals:number[]=[];        
      
        for (const [key, value] of element.values.entries()) {
          vals.push(value);          
          labels.add(key);
        }        
          this.lineChartData.push( { data:vals, label: element.text, pointRadius:5, lineTension:0 });                 
        });

      this.lineChartLabels=[...labels];
    }
  }

 



}
