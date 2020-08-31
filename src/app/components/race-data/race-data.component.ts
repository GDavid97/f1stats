import { Component, OnInit, Input } from '@angular/core';
import { RaceResult } from 'src/app/models/RaceResult.model';

@Component({
  selector: 'race-data',
  templateUrl: './race-data.component.html',
  styleUrls: ['./race-data.component.scss']
})
export class RaceDataComponent implements OnInit {

  @Input()
  data:RaceResult;

  constructor() { }

  ngOnInit(): void {
  }

}
