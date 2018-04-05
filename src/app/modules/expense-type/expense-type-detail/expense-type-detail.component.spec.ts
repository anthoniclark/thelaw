import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeDetailComponent } from './expense-type-detail.component';

describe('ExpenseTypeDetailComponent', () => {
  let component: ExpenseTypeDetailComponent;
  let fixture: ComponentFixture<ExpenseTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
