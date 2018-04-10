import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactQuickAddComponent } from './contact-quick-add.component';

describe('ContactQuickAddComponent', () => {
  let component: ContactQuickAddComponent;
  let fixture: ComponentFixture<ContactQuickAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactQuickAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactQuickAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
