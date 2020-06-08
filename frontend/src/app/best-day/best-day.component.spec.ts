import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestDayComponent } from './best-day.component';

describe('BestDayComponent', () => {
  let component: BestDayComponent;
  let fixture: ComponentFixture<BestDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
