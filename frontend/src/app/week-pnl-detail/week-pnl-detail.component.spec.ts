import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekPnlDetailComponent } from './week-pnl-detail.component';

describe('WeekPnlDetailComponent', () => {
  let component: WeekPnlDetailComponent;
  let fixture: ComponentFixture<WeekPnlDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekPnlDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekPnlDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
