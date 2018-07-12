import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { ContactService } from '../../../contact/contact.service';
import { NoImagePath } from 'app/shared/constants';
import swal from 'sweetalert2';
@Component({
  selector: 'app-communication-dashboard',
  templateUrl: './communication-dashboard.component.html'
})
export class CommunicationDashboardComponent implements OnInit {
  CaseId: number;
  caseDetails: any = {};
  caseCommunications: any[] = [];
  loadingIndicator: boolean = true;
  url: any = NoImagePath;

  constructor(private route: ActivatedRoute, private caseService: CaseService,
    private router: Router, private contactService: ContactService,
    private _notify: NotificationService) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);

    this.caseService.getCaseById(this.CaseId).subscribe(res => {
      this.caseDetails = res;
      this.contactService.getContactPhoto(this.caseDetails.ClientId).subscribe(photo => {
        this.url = "data:image/png;base64," + photo;
      });
    }, err => {
      this._notify.error(err.Result);
    });
    this.caseService.getCommunicationByCaseId(this.CaseId).subscribe(response => {
      this.caseCommunications = response;
    }, err => {
      this._notify.error(err.Result);
    });
  }
  editComment(id) {
    this.router.navigate([`../${id}`], { relativeTo: this.route });
  }

  goTOListClick() {
    this.router.navigate([`../`], { relativeTo: this.route });
  }

  addClick() {
    this.router.navigate([`../new`], { relativeTo: this.route });
  }

  deleteClick(id) {
    swal({
      title: 'Delete Case Communication',
      text: "Are you sure want to delete this Communication?",
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
        this.caseService.deleteCommunication(id).subscribe(
          response => {
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Communication deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });

  
  }
}
