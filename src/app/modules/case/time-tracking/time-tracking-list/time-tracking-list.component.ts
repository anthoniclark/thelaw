import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-time-tracking-list',
  templateUrl: './time-tracking-list.component.html'
})
export class TimeTrackingListComponent implements OnInit {

  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  CaseId: number;

  constructor(private route: ActivatedRoute, private caseService: CaseService,
    private router: Router,
    private _notify: NotificationService) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);
    this.caseService.getTimeTrackingByCaseId(this.CaseId).subscribe(
      response => {
        this.rows = response;
        setTimeout(() => { this.loadingIndicator = false; });
      }, err => {
        this._notify.error(err.Result);
      });
  }

  editClick(id) {
    this.router.navigateByUrl(`/case/${this.CaseId}/time-tracking/${id}`);
  }

  deleteClick(id) {
    swal({
      title: 'Delete Time Tracker',
      text: "Are you sure want to delete this Time Tracker?",
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
        this.loadingIndicator = true;
        this.caseService.deleteTaskTimeTracking(id).subscribe(
          response => {
            this.rows = this.rows.filter(row => {
              return row.Id !== id;
            });
            this.loadingIndicator = false;
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Time Tracker deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
  }

  createNewTimeTracking() {
    this.router.navigate([`/case/${this.CaseId}/time-tracking/new`]);
  }
}
