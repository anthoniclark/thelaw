import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../events.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { overlayConfigFactory, } from 'ngx-modialog';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { EventsDetailComponent } from '../events-detail/events-detail.component';
@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.css']
})
export class EventsDashboardComponent implements OnInit {
  events: any[] = [];
  headerConfig: any;
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
      this.events = res.map((element) => {
        return {
          id: element.Id,
          title: element.EventTitle,
          start: element.FromDateTime,
          end: element.ToDateTime || null,
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

  eventClicked(event) {
    this.addNewEvent(event.calEvent.id);
  }
}
