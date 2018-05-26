
import { Component, OnInit, OnDestroy, DebugElement, AfterViewInit, ViewChildren } from '@angular/core';
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
import { Calendar } from 'primeng/components/calendar/calendar';
@Component({
  selector: 'app-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.css']
})
export class EventsDetailComponent implements OnInit, AfterViewInit {
  dialogContext: any;
  cases: any[] = [];
  eventTypes: any[] = [];
  model: Events = new Events();
  id: string = "new";
  settings: {} = {};
  caseDetail: any;
  selectedAttendees: any[] = [];
  attendeesData: any[] = [];
  isLoading: boolean = false;
  @ViewChildren(Calendar) public cals: Calendar[];
  constructor(public dialog: DialogRef<BSModalContext>, private eventsService: EventsService,
    private _notify: NotificationService, private _bsModal: Modal,
    private _sanitizer: DomSanitizer) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;
    this.id = this.dialogContext.id;
  }


  ngAfterViewInit() {
    // this.cals.forEach(calendar => {
    //   const elem = calendar.inputfieldViewChild.nativeElement;
    //   calendar.hourFormat = "12";
    // });
  }

  ngOnInit() {
    this.settings = {
      singleSelection: false,
      text: "Select Attendees",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 3,
      enableSearchFilter: true,
    }
    this.selectedAttendees = [];
    this.getAllEventTypes();
    this.model.Frquency = "Weekly";
    this.eventsService.getAllAttendees().subscribe(res => {
      this.attendeesData = [];
      res.forEach(element => {
        this.attendeesData.push({ id: element.Id, itemName: element.FirstName + ' ' + element.LastName });
      });

      if (this.id !== 'new') {
        this.eventsService.getEventById(this.id).subscribe(res => {
          this.model = res;
          this.selectedAttendees = [];
          res.EventAttendy.forEach(element => {
            const attendee = this.attendeesData.find(x => x.id === element.AttendyId);
            if (attendee) {
              this.selectedAttendees.push(attendee);
            }
          });
          let startTime = res.StartTime.split(":");
          let date = new Date();
          date.setHours(startTime[0]);
          date.setMinutes(startTime[1]);
          this.model.StartTime = <any>date;
          let endTime = res.EndTime.split(":");

          let endDate = new Date();
          endDate.setHours(endTime[0]);
          endDate.setMinutes(endTime[1]);
          this.model.EndTime = <any>endDate;
          this.eventsService.getCaseById(this.model.CaseId).subscribe(result => {
            this.getClient(result.ClientId);
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
    }, error => {
      this._notify.error(error.ErrorMessage);
    })
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
    const sDate = new Date(this.model.StartTime);
    const eDate = new Date(this.model.EndTime);
    const fromDate = new Date(this.model.FromDateTime).getDate();
    const toDate = new Date(this.model.ToDateTime).getDate();
    if (toDate < fromDate) {
      this._notify.error('start date should less then end date');
      return;
    } else if (toDate === fromDate) {
      if (eDate.getTime() < sDate.getTime()) {
        this._notify.error('start time should less then end time');
        return;
      }
    }
    this.model.StartTime = sDate.getHours() + ':' + sDate.getMinutes();
    this.model.EndTime = eDate.getHours() + ':' + eDate.getMinutes();
    this.model.FromDateTime = new Date(this.model.FromDateTime).toLocaleDateString();
    this.model.ToDateTime = new Date(this.model.ToDateTime).toLocaleDateString();
    this.model.AttendeesId = [];
    this.selectedAttendees.forEach(data => {
      this.model.AttendeesId.push(data.id);
    });
    this.isLoading = true;
    this.eventsService.addOrUpdateEvent(this.model).subscribe(res => {
      setTimeout(() => {
        this.isLoading = false;
        this._notify.success(`Event ${this.id.toString() === 'new' ? 'added' : 'updated'} successfully`);
      }, 300);
      this.closeDialoge(true);
    }, error => {
      this.isLoading = false;
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
    // return this.eventsService.deleteEventById(this.id).subscribe(res => {
    //   setTimeout(() => {
    //     this._notify.success(`Event deleted successfully`);
    //   }, 300);
    //   this.closeDialoge(true);
    // }, error => {
    // });
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
    this.eventsService.getCaseById(event.Id).subscribe(res => {
      this.getClient(res.ClientId)
    });
    this.model.CaseId = event.Id;
  }


  getClient(clientId) {
    this.eventsService.getClientById(clientId).subscribe(result => {
      this.model.Client = result.FirstName + " " + result.LastName;
    }, error => {
      this._notify.error();
    });
  }
}
