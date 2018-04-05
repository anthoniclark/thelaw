import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseExpenseDetailComponent } from './case-expense-detail.component';

describe('CaseExpenseDetailComponent', () => {
  let component: CaseExpenseDetailComponent;
  let fixture: ComponentFixture<CaseExpenseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseExpenseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseExpenseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
