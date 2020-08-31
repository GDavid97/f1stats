import { Component, OnInit, Input } from '@angular/core';
import { Driver } from 'src/app/models/Driver.model';

@Component({
  selector: 'driver-tile',
  templateUrl: './driver-tile.component.html',
  styleUrls: ['./driver-tile.component.scss']
})
export class DriverTileComponent implements OnInit {

  @Input()
  driver:Driver;
  
  @Input()
  backgroundColor:string="white";

  @Input()
  fastestLap:boolean;

  constructor() { }

  ngOnInit() {
  }

}
