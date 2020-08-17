import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { NextRaceModel } from './models';
import { Subscription, Observable, timer } from 'rxjs';

@Component({
  selector: 'next-race',
  templateUrl: './next-race.component.html',
  styleUrls: ['./next-race.component.scss']
})
export class NextRaceComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  data: NextRaceModel

  remainingTime: string;

  timerSubscription:Subscription;

  constructor() { }

  ngOnInit() { 
    this.timerSubscription = timer(0,1000)
    .subscribe((val) => {
      if(this.data && this.data.date && this.data.time){
        this.getCountdown(this.data.date,this.data.time);
      }     
    });   
  }

  ngOnChanges(changes:SimpleChanges){  
  }



  getCountdown(date: string, time: string) {
    let raceTime = new Date(`${date} ${time}`);
    let current = new Date();
    let eventEndTime = new Date(raceTime);
    let diff = (eventEndTime.valueOf() - current.valueOf());
    let days=Math.floor(diff/(1000*60*60*24));
    diff-=days*(1000*60*60*24);
    let hours=Math.floor(diff/(1000*60*60));
    diff-=hours*(1000*60*60);
    let minutes=Math.floor(diff/(1000*60));
    diff-=minutes*(1000*60);
    let seconds=Math.floor(diff/(1000));   
    this.remainingTime=`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;  
  }

  ngOnDestroy(){
    if(this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }
  }

}
