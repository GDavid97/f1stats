import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextRaceComponent } from './next-race.component';

describe('NextRaceComponent', () => {
  let component: NextRaceComponent;
  let fixture: ComponentFixture<NextRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
