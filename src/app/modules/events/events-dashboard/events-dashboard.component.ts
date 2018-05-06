import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../events.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { overlayConfigFactory, } from 'ngx-modialog';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { EventsDetailComponent } from '../events-detail/events-detail.component';
import { deepValueGetter } from '@swimlane/ngx-datatable/release/utils';
import { OverlayPanel } from 'primeng/overlaypanel';
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
        let startTime = element.StartTime.split(":");
        let startDate = new Date(element.FromDateTime);
        startDate.setHours(startTime[0]);
        startDate.setMinutes(startTime[1]);

        let endTime = element.EndTime.split(":");
        let endDate = new Date(element.ToDateTime);
        endDate.setHours(endTime[0]);
        endDate.setMinutes(endTime[1]);

        return {
          id: element.Id,
          title: element.EventTitle,
          start: startDate,
          end: endDate,
          color: element.EventType.Color
        }
      });
    }, error => {
      this._notify.error(error.ErrorMessage);
    });
  }

  addNewEvent(id: string = "new") {
    const eventsModel = this.modal.open(EventsDetailComponent, overlayConfigFactory({ id }, BSModalContext));
    eventsModel.result.then(res => {
      if (res) {
        this.getAllEvents();
      }
    }).catch(() => {
      //this._notify.error();
    });
  }
  openEventDetail(op3: OverlayPanel) {
    op3.hide();
    this.addNewEvent(this.selectedEvent.Id);
  }

  eventClicked(event, op: OverlayPanel) {
    // this.addNewEvent(event.calEvent.id);
    this.selectedEvent = this.calanderData.find(x => x.Id === event.calEvent.id);
    op.toggle((event.jsEvent));
  }
  // onViewRender($event) {
  //   $event.element.bind("dblclick", (data) => {
  //     debugger
  //   });
  // }
}
