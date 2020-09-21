import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Driver } from 'src/app/models/Driver.model';

@Component({
  selector: 'driver-tile',
  templateUrl: './driver-tile.component.html',
  styleUrls: ['./driver-tile.component.scss']
})
export class DriverTileComponent implements OnInit, OnChanges {

  @Input()
  driver: Driver;

  @Input()
  backgroundColor = 'white';

  @Input()
  fastestLap: boolean;

  teamPhotoId = 'noimage';
  driverPhotoId = 'noimage';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.driver && changes.driver.currentValue) {
      this.testDriverImage(`assets/drivers/${this.driver.driverId}.jpg`);
      this.testTeamImage(`assets/teams/${this.driver.season}/${this.driver.teamId}.jpg`);
    }
  }

  testDriverImage(URL: string) {
    const tester = new Image();
    tester.onload = () => {
      this.driverPhotoId = `${this.driver.driverId}`;
    };

    tester.src = URL;
  }

  testTeamImage(URL: string) {
    const tester = new Image();
    tester.onload = () => {
      this.teamPhotoId = `${this.driver.season}/${this.driver.teamId}`;
    };

    tester.src = URL;
  }

}
