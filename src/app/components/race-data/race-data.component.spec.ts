import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDataComponent } from './race-data.component';

describe('RaceDataComponent', () => {
  let component: RaceDataComponent;
  let fixture: ComponentFixture<RaceDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
