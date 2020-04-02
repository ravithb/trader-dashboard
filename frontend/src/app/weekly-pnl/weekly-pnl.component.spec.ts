import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPnlComponent } from './weekly-pnl.component';

describe('WeeklyPnlComponent', () => {
  let component: WeeklyPnlComponent;
  let fixture: ComponentFixture<WeeklyPnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyPnlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
