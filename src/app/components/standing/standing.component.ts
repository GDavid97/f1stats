import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Standing } from 'src/app/models/Standing.model';

@Component({
  selector: 'standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.scss']
})
export class StandingComponent implements OnInit, OnChanges {

  @Input()
  data: Standing[];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue) {
      this.data.forEach(row => {
        this.testImage(row);
      });
    }
  }

  private testImage(row: Standing) {
    const tester = new Image();
    tester.onerror = () => {
      if (!row.team) {
        row.photo = `teams/noimage.jpg`;
      } else {
        row.photo = `drivers/noimage.jpg`;
      }

    };

    tester.src = `assets/${row.photo}`;
  }

}
