import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseEvidenceListComponent } from './case-evidence-list.component';

describe('CaseEvidenceListComponent', () => {
  let component: CaseEvidenceListComponent;
  let fixture: ComponentFixture<CaseEvidenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseEvidenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseEvidenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
