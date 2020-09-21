import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/models/Team.model';

@Component({
  selector: 'team-tile',
  templateUrl: './team-tile.component.html',
  styleUrls: ['./team-tile.component.scss']
})
export class TeamTileComponent implements OnInit {

  @Input()
  team: Team;

  constructor() { }

  ngOnInit(): void {
  }

}
