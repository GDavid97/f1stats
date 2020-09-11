import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RaceEvent } from 'src/app/models/RaceEvent.model';

@Component({
  selector: 'circuit',
  templateUrl: './circuit.component.html',
  styleUrls: ['./circuit.component.scss']
})
export class CircuitComponent implements OnInit {

  @Input()
  data:RaceEvent;

  @Input()
  enableClick:boolean;

  @Output()
  onClick:EventEmitter<void>=new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
