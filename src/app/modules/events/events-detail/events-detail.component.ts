
import { Component, OnInit, OnDestroy, DebugElement } from '@angular/core';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { CaseStatus } from 'app/models/case';
import { NotificationService } from '../../../shared/services/notification.service';
import { EventsService } from '../events.service';
import { Events } from '../../../models/events';
import { overlayConfigFactory, } from 'ngx-modialog';
import swal from 'sweetalert2';
import { EventTypesDetailComponent } from '../event-types-detail/event-types-detail.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
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
  id: string = "new";
  caseDetail: any;
  constructor(public dialog: DialogRef<BSModalContext>, private eventsService: EventsService,
    private _notify: NotificationService, private _bsModal: Modal,
    private _sanitizer: DomSanitizer) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;
    this.id = this.dialogContext.id;
  }


  ngOnInit() {
    this.getAllEventTypes();
    if (this.id !== 'new') {
      this.eventsService.getEventById(this.id).subscribe(res => {
        this.model = res;
        this.eventsService.getCaseById(this.model.CaseId).subscribe(result => {
          this.caseDetail = {
            "Name": result.CaseNo, "Id": result.Id
          }
        }, error => {
          this._notify.error(error.ErrorMessage);
        })
      }, error => {
        this._notify.error(error.ErrorMessage);
      });
    }
  }

  getAllEventTypes() {
    this.eventsService.getAllEventTypes().subscribe(res => {
      this.eventTypes = res;
    }, error => {
      this._notify.error(error.ErrorMessage);
    });
  }

  closeDialoge(result) {
    this.dialog.close(result);

  }

  caseSearch(term: string): Observable<any[]> {
    return this.eventsService.caseSearch(term);
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.Name} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  save() {
    this.eventsService.addOrUpdateEvent(this.model).subscribe(res => {
      setTimeout(() => {
        this._notify.success(`Event ${this.id.toString() === 'new' ? 'added' : 'updated'} successfully`);
      }, 300);
      this.closeDialoge(true);
    }, error => {
    });
  }

  deleteEvent() {
    // swal({
    //   title: 'Delete Event',
    //   text: "Are you sure want to delete this Event?",
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'No',
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   buttonsStyling: true,
    //   reverseButtons: false,
    // }).then((result) => {
    //   if (result.value) {
    return this.eventsService.deleteEventById(this.id).subscribe(res => {
      setTimeout(() => {
        this._notify.success(`Event deleted successfully`);
      }, 300);
      this.closeDialoge(true);
    }, error => {
    });
    // });
  }

  createEventType() {
    const eventsModel = this._bsModal.open(EventTypesDetailComponent, overlayConfigFactory({}, BSModalContext));
    eventsModel.result.then(res => {
      this.getAllEventTypes();
    }).catch(() => {
    });
  }

  onSelectCase(event) {
    this.model.CaseId = event.Id;
  }
}