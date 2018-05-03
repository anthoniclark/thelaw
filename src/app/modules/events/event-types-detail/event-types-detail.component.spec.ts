import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypesDetailComponent } from './event-types-detail.component';

describe('EventTypesDetailComponent', () => {
  let component: EventTypesDetailComponent;
  let fixture: ComponentFixture<EventTypesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventTypesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTypesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
