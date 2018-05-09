import { Component, OnInit } from '@angular/core';
import { EventTypes } from '../../../models/events';
import { EventsService } from '../events.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
@Component({
  selector: 'app-event-types-detail',
  templateUrl: './event-types-detail.component.html',
  styleUrls: ['./event-types-detail.component.css']
})
export class EventTypesDetailComponent implements OnInit {
  color: string;
  model: EventTypes = new EventTypes();
  isLoading: boolean = false;
  constructor(public dialog: DialogRef<BSModalContext>, private eventServices: EventsService, private _notify: NotificationService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
  }

  ngOnInit() {
  }
  closeDialoge(result) {
    this.dialog.close(result);
  }

  save() {
    if (!this.model.Color) {
      return false;
    }
    this.isLoading = true;
    this.eventServices.createEventType(this.model).subscribe(res => {
      this.dialog.close(true);
      setTimeout(() => {
        this.isLoading = false;
        this._notify.success("Event Type created successfully");
      }, 300);
    }, error => {
      this.isLoading = false;
      this._notify.error();
    });
  }

}
