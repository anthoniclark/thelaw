import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../events.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { overlayConfigFactory, } from 'ngx-modialog';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { EventsDetailComponent } from '../events-detail/events-detail.component';
import { deepValueGetter } from '@swimlane/ngx-datatable/release/utils';
import { OverlayPanel } from 'primeng/overlaypanel';
import swal from 'sweetalert2';
@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.css']
})
export class EventsDashboardComponent implements OnInit {
  events: any[] = [];
  headerConfig: any;
  selectedEvent: any;
  calanderData = [];
  constructor(private route: ActivatedRoute, private router: Router,
    private eventServices: EventsService, private _notify: NotificationService,
    private modal: Modal) {
  }
  ngOnInit() {
    this.headerConfig = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    this.getAllEvents();
  }

  getAllEvents() {
    this.eventServices.getAllEvents().subscribe((res: any) => {
      this.calanderData = res;
      this.events = res.map((element) => {
        const startTime = element.StartTime.split(':');
        const startDate = new Date(element.FromDateTime);
        startDate.setHours(startTime[0]);
        startDate.setMinutes(startTime[1]);

        const endTime = element.EndTime.split(':');
        const endDate = new Date(element.ToDateTime);
        let color = element.EventType.Color;
        if (endDate < new Date()) {
          color = 'Gray';
        }
        endDate.setHours(endTime[0]);
        endDate.setMinutes(endTime[1]);
        return {
          id: element.Id,
          title: element.EventTitle,
          start: startDate,
          end: endDate,
          color
        };
      });
    }, error => {
      this._notify.error(error.ErrorMessage);
    });
  }

  addNewEvent(id: string = 'new') {
    const eventsModel = this.modal.open(EventsDetailComponent, overlayConfigFactory({ id }, BSModalContext));
    eventsModel.result.then(res => {
      if (res) {
        this.getAllEvents();
      }
    }).catch(() => {
      // this._notify.error();
    });
  }
  openEventDetail(op3: OverlayPanel) {
    op3.hide();
    this.addNewEvent(this.selectedEvent.Id);
  }

  eventClicked(event, op: OverlayPanel) {
    this.selectedEvent = this.calanderData.find(x => x.Id === event.calEvent.id);
    op.toggle((event.jsEvent));
  }
  deleteEvent(op: OverlayPanel) {
    swal({
      title: 'Delete Event',
      text: 'Are you sure want to delete this Event?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
      reverseButtons: false,
    }).then((result) => {
      if (result.value) {
        return this.eventServices.deleteEventById(this.selectedEvent.Id).subscribe(res => {
          this.events = this.events.filter(x => x.id !== this.selectedEvent.Id);
          setTimeout(() => {
            this._notify.success(`Event deleted successfully`);
          }, 300);
        }, error => {
        });
      }
    }).catch(() => { });
  }
}
