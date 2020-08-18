import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitsPageComponent } from './circuits-page.component';

describe('CircuitsPageComponent', () => {
  let component: CircuitsPageComponent;
  let fixture: ComponentFixture<CircuitsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircuitsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircuitsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
