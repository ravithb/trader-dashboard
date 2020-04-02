import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayPnlComponent } from './today-pnl.component';

describe('TodayPnlComponent', () => {
  let component: TodayPnlComponent;
  let fixture: ComponentFixture<TodayPnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayPnlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayPnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
