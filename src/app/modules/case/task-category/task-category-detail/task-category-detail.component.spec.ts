import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCategoryDetailComponent } from './task-category-detail.component';

describe('TaskCategoryDetailComponent', () => {
  let component: TaskCategoryDetailComponent;
  let fixture: ComponentFixture<TaskCategoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCategoryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
