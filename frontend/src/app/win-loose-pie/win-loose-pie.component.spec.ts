import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinLoosePieComponent } from './win-loose-pie.component';

describe('WinLoosePieComponent', () => {
  let component: WinLoosePieComponent;
  let fixture: ComponentFixture<WinLoosePieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinLoosePieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinLoosePieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
