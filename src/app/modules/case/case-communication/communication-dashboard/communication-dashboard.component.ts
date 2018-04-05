import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { ContactService } from '../../../contact/contact.service';
import { NoImagePath } from 'app/shared/constants';

@Component({
  selector: 'app-communication-dashboard',
  templateUrl: './communication-dashboard.component.html'
})
export class CommunicationDashboardComponent implements OnInit {
  CaseId: number;
  caseDetails: any = {};
  caseCommunications: any[] = [];
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
    this.router.navigate([`case/${this.CaseId}/communication/${id}`]);
  }

  goTOListClick(){
    this.router.navigate([`case/${this.CaseId}/communication`]);
  }

  addClick() {
    this.router.navigate([`case/${this.CaseId}/communication/new`]);    
  }
}
