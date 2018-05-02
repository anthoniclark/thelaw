
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CaseStatus } from 'app/models/case';
import { NotificationService } from '../../../shared/services/notification.service';
import { EventsService } from '../events.service';
import { Events } from '../../../models/events';
@Component({
  selector: 'app-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.css']
})
export class EventsDetailComponent implements OnInit {
  dialogContext: any;
  cases: any[] = [];
  eventTypes: any[] = [];
  model: Events = new Events();
  constructor(public dialog: DialogRef<BSModalContext>, private eventsService: EventsService,
    private _notify: NotificationService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;
  }


  ngOnInit() {
    this.eventsService.getAllCase().subscribe(res => {
      this.cases = res;
    }, error => {
      this._notify.error(error.ErrorMessage);
    });
    this.eventsService.getAllEventTypes().subscribe(res => {
      this.eventTypes = res;
    }, error => {
      this._notify.error(error.ErrorMessage);
    });
  }

  closeClick = () => {
    this.dialog.close(true);
  }

  save() {
    this.eventsService.addOrUpdateEvent(this.model).subscribe(res => {
      debugger
    }, error => {
      debugger
    })
  }
}
