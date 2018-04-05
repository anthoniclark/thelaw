import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainAddComponent } from './complain-add.component';

describe('ComplainAddComponent', () => {
  let component: ComplainAddComponent;
  let fixture: ComponentFixture<ComplainAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
