import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverTileComponent } from './driver-tile.component';

describe('DriverTileComponent', () => {
  let component: DriverTileComponent;
  let fixture: ComponentFixture<DriverTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
