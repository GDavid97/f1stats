import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomableCircleChartComponent } from './zoomable-circle-chart.component';

describe('ZoomableCircleChartComponent', () => {
  let component: ZoomableCircleChartComponent;
  let fixture: ComponentFixture<ZoomableCircleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomableCircleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomableCircleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
