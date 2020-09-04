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
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'black',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
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
      this.data.forEach(element => {
          this.lineChartData.push( { data:element.values, label: element.text });          
      });
      //this.lineChartLabels
    }
  }

 



}
