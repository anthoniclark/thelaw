import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseEvidenceDetailComponent } from './case-evidence-detail.component';

describe('CaseEvidenceDetailComponent', () => {
  let component: CaseEvidenceDetailComponent;
  let fixture: ComponentFixture<CaseEvidenceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseEvidenceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseEvidenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
