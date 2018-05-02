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
  constructor(private route: ActivatedRoute, private router: Router,
    private eventServices: EventsService, private _notify: NotificationService,
    private modal: Modal) {

  }

  ngOnInit() {
    this.eventServices.getAllEvents().subscribe((res: any) => {
      this.events = res.map((element) => {
        return {
          id: element.EventTypeId,
          title: element.EventTitle,
          start: element.FromDateTime,
          end: element.ToDateTime || null
        }
      });;
    }, error => {
      this._notify.error(error.ErrorMessage);
    });
  }

  addNewEvent() {
    const eventsModel = this.modal.open(EventsDetailComponent, overlayConfigFactory({}, BSModalContext));
    eventsModel.result.then(res => {
      debugger
    }).catch(() => {
      this._notify.error();
    })
  }
}
