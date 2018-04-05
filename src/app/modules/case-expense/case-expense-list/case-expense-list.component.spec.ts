import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseExpenseListComponent } from './case-expense-list.component';

describe('CaseExpenseListComponent', () => {
  let component: CaseExpenseListComponent;
  let fixture: ComponentFixture<CaseExpenseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseExpenseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
