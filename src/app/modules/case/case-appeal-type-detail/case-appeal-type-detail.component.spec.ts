import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAppealTypeDetailComponent } from './case-appeal-type-detail.component';

describe('CaseAppealTypeDetailComponent', () => {
  let component: CaseAppealTypeDetailComponent;
  let fixture: ComponentFixture<CaseAppealTypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseAppealTypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseAppealTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
