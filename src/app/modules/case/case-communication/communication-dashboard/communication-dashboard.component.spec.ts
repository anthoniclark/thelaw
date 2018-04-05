import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationDashboardComponent } from './communication-dashboard.component';

describe('CommunicationDashboardComponent', () => {
  let component: CommunicationDashboardComponent;
  let fixture: ComponentFixture<CommunicationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
