import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RaceResult } from 'src/app/models/RaceResult.model';

@Component({
  selector: 'race-data',
  templateUrl: './race-data.component.html',
  styleUrls: ['./race-data.component.scss']
})
export class RaceDataComponent implements OnInit {

  @Input()
  data: RaceResult;

  @Output()
  onDriverClicked: EventEmitter<string> = new EventEmitter<string>();


  constructor() { }

  ngOnInit(): void {
  }

}
