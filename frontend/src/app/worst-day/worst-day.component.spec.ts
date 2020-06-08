import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstDayComponent } from './worst-day.component';

describe('WorstDayComponent', () => {
  let component: WorstDayComponent;
  let fixture: ComponentFixture<WorstDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorstDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
