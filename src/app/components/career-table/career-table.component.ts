import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ResultsTableRow, ResultsTableColumn } from 'src/app/models/ResultsTable.model';
import { SeasonRound } from 'src/app/models/SeasonRound.model';

@Component({
  selector: 'career-table',
  templateUrl: './career-table.component.html',
  styleUrls: ['./career-table.component.scss']
})
export class CareerTableComponent implements OnInit, OnChanges{

  @Input()
  data:ResultsTableRow[];

  @Output()
  onOpenRaceDetails:EventEmitter<SeasonRound>=new EventEmitter<SeasonRound>();

  @Output()
  onOpenSeason:EventEmitter<string>=new EventEmitter<string>();

  maxCols=0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.data && changes.data.currentValue?.length>0){
      this.data.forEach(e=>{
        if(e.results.length>this.maxCols){
          this.maxCols=e.results.length;
        }
      })
    }
  }

  getColumnData(row:ResultsTableRow):ResultsTableRow{
    let result=Object.assign({},row);
    result.results=[...row.results];
    let firstIndex=parseInt(result.results[0].round)-1;
    for(let i=0;i<firstIndex;i++){
      result.results.unshift({points:null,position:'',raceName:'',round:(i+1).toString()})
    }
  
    for(let i=1;i<result.results.length; i++){
      if(parseInt(result.results[i].round)-parseInt(result.results[i-1].round)>1){
        result.results.splice(i, 0, {points:null,position:'',raceName:'',round:(i+1).toString()});
      }
    }
    for(let i=result.results.length-1; i<this.maxCols;i++){
      result.results.push({points:null,position:'',raceName:'',round:(i+1).toString()})
    }
    return result;
  }

  getTooltipText(row:ResultsTableRow,column:ResultsTableColumn):string{
    let result=`Season ${row.season}: ${column.raceName} `;

    return result;
  }

  openRaceDetails(season:string,round:string){
    this.onOpenRaceDetails.emit({season:season,round:round});
  }

  openSeason(season:string){
    this.onOpenSeason.emit(season);
  }

}
