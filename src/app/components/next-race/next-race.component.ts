import { Component, OnInit, Input } from '@angular/core';
import { NextRaceModel } from './models';

@Component({
  selector: 'next-race',
  templateUrl: './next-race.component.html',
  styleUrls: ['./next-race.component.scss']
})
export class NextRaceComponent implements OnInit {

@Input()
data:NextRaceModel

  constructor() { }

  ngOnInit() {
  }

}
