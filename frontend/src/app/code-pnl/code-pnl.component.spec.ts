import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodePnlComponent } from './code-pnl.component';

describe('CodePnlComponent', () => {
  let component: CodePnlComponent;
  let fixture: ComponentFixture<CodePnlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodePnlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodePnlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
