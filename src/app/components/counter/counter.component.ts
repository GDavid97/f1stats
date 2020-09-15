import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TimeInterval } from 'rxjs';

const speed=200;
@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit, OnChanges {

  @Input()
  text:string;

  @Input()
  value:number;

  valueToDisplay:number=0;
  interval:any;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.value){
      this.startTimer(this,Math.floor(this.value/100)+1);
    }
  }

  startTimer(comp,inc) {
    comp.interval = setInterval(() => {  
      if(comp.valueToDisplay < comp.value) {
        comp.valueToDisplay+=inc;
      }
      else{
        comp.valueToDisplay=comp.value;
        clearInterval(comp.interval);
      }
    },8)
  }

 
}
