import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationDetailComponent } from './communication-detail.component';

describe('CommunicationDetailComponent', () => {
  let component: CommunicationDetailComponent;
  let fixture: ComponentFixture<CommunicationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
