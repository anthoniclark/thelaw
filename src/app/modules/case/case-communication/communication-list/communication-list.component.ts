import { Component, OnInit } from '@angular/core';
import { CaseService } from '../../case.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-communication-list',
  templateUrl: './communication-list.component.html'
})
export class CommunicationListComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  CaseId: number;

  constructor(private route: ActivatedRoute, private caseService: CaseService,
    private router: Router,
    private _notify: NotificationService) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);
    this.caseService.getCommunicationByCaseId(this.CaseId).subscribe(
      response => {
        this.rows = response;
        setTimeout(() => { this.loadingIndicator = false; });
      }, err => {
        this._notify.error(err.Result);
      });
  }

  addClick() {
    this.router.navigateByUrl(`/case/${this.CaseId}/communication/new`);
  }

  editClick(id) {
    this.router.navigateByUrl(`/case/${this.CaseId}/communication/${id}`);
  }

  deleteClick(id) {
    if (confirm('Are you sure you want to delete this communication?')) {
      this.caseService.deleteCommunication(id).subscribe(
        response => {
          this.rows = this.rows.filter(row => {
            return row.Id !== id;
          });
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

}
