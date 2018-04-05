import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeTrackingDetailComponent } from 'app/modules/case/time-tracking/time-tracking-detail/time-tracking-detail.component';



describe('TimeTrackingComponent', () => {
  let component: TimeTrackingDetailComponent;
  let fixture: ComponentFixture<TimeTrackingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimeTrackingDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
