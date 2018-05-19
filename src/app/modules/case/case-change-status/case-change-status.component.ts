import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';

import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { overlayConfigFactory } from 'ngx-modialog';

import { CaseStatus } from 'app/models/case';
import { CaseService } from '../case.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { StageDetailComponent } from '../stage/stage-detail/stage-detail.component';

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
    private _notify: NotificationService, private modal: Modal) {
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
      this._notify.error('Next date should be greater then today');
    }
    this.caseService.addOrUpdateStatus(this.model).subscribe(res => {
      this.closeClick();
    }, err => {
      this._notify.error(err.Result);
    });
  }

  addStage() {
    const resul = this.modal.open(StageDetailComponent, overlayConfigFactory({ caseModel: this.model }, BSModalContext));
    resul.result.then(res => {
      if (res) {
        this.caseService.getStages().subscribe(res => {
          this._notify.success("New Task Category created successfully!");
          this.stages = res;
        });
      }
    });
  }

  closeClick = () => {
    this.dialog.close(true);
  }

  ngOnDestroy(): void {
    // this.subscriptions.forEach(s => s.unsubscribe());
  }
}
