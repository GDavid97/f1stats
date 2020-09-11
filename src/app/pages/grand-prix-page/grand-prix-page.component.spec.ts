import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandPrixPageComponent } from './grand-prix-page.component';

describe('GrandPrixPageComponent', () => {
  let component: GrandPrixPageComponent;
  let fixture: ComponentFixture<GrandPrixPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrandPrixPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrandPrixPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
