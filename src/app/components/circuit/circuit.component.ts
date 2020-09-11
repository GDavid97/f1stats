import { Component, OnInit, Input } from '@angular/core';
import { RaceEvent } from 'src/app/models/RaceEvent.model';

@Component({
  selector: 'circuit',
  templateUrl: './circuit.component.html',
  styleUrls: ['./circuit.component.scss']
})
export class CircuitComponent implements OnInit {

  @Input()
  data:RaceEvent;

  constructor() { }

  ngOnInit(): void {
  }

}
