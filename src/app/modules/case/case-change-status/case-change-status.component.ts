import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';

import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CaseStatus } from 'app/models/case';
import { CaseService } from '../case.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-case-change-status',
  templateUrl: './case-change-status.component.html'
})
export class CaseChangeStatusComponent implements OnInit, OnDestroy, CloseGuard, ModalComponent<BSModalContext> {
  context: BSModalContext;

  stages: any[] = [];
  courts: any[] = [];
  isLoading: boolean = false;
  dialogContext: any;

  constructor(public dialog: DialogRef<BSModalContext>, private caseService: CaseService,
    private _notify: NotificationService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;

  }
  model: CaseStatus = new CaseStatus();

  ngOnInit() {
    this.model.CaseId = this.dialogContext.caseRow.Id;
    this.caseService.getStages().subscribe(res => {
      this.stages = res;
    });
    this.caseService.getCourtsDD().subscribe(res => {
      this.courts = res;
    });
  }

  beforeDismiss(): boolean {
    return false;
  }

  beforeClose(): boolean {
    return false;
  }

  changeStatus() {
    if (new Date(this.model.NextDate) < new Date()) {
      this._notify.error('Next should be greater then today');
    }
    this.caseService.addOrUpdateStatus(this.model).subscribe(res => {
      this.closeClick();
    }, err => {
      this._notify.error(err.Result);
    });
  }

  closeClick = () => {
    this.dialog.close(true);
  }

  ngOnDestroy(): void {
    // this.subscriptions.forEach(s => s.unsubscribe());
  }
}
