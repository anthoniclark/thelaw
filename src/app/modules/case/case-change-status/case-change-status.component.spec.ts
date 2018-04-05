import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseChangeStatusComponent } from './case-change-status.component';

describe('CaseChangeStatusComponent', () => {
  let component: CaseChangeStatusComponent;
  let fixture: ComponentFixture<CaseChangeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseChangeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
