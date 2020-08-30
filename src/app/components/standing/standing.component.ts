import { Component, OnInit, Input } from '@angular/core';
import { Standing } from 'src/app/models/Standing.model';

@Component({
  selector: 'standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.scss']
})
export class StandingComponent implements OnInit {

  @Input()
  data:Standing[];

  constructor() { }

  ngOnInit() {
  }

}
