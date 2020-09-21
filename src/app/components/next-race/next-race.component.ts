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
  data: NextRaceModel;

  remainingTime: string;
  localDate: Date;

  timerSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.timerSubscription = timer(0, 1000)
    .subscribe((val) => {
      if (this.localDate) {
        this.getCountdown(this.localDate);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.localDate = new Date(`${this.data.date} ${this.data.time}`);
    }
  }



  getCountdown(raceTime: Date) {
    const current = new Date();
    let diff = (raceTime.valueOf() - current.valueOf());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / (1000));
    this.remainingTime = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

}
