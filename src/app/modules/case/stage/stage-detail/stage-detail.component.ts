import { Component, OnInit } from '@angular/core';
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { Stage } from 'app/models/case';

@Component({
  selector: 'app-stage-detail',
  templateUrl: './stage-detail.component.html'
})
export class StageDetailComponent implements OnInit {
  context: BSModalContext;
  dialogContext: any;
  caseModel: any;
  stageModel: Stage = new Stage();
  isLoading: boolean = false;

  constructor(public dialog: DialogRef<BSModalContext>, private caseService: CaseService,
    private _notify: NotificationService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;
  }

  ngOnInit() {
  }
  beforeDismiss(): boolean {
    return false;
  }

  beforeClose(): boolean {
    return false;
  }

  closeClick() {
    this.dialog.close(false);

  }

  closeModelPopupClick = () => {
    this.dialog.close(true);
  }

  createStage() {
    this.caseService.addStage(this.stageModel).subscribe(res => {
      if (res) {
        this.closeModelPopupClick();
      }
    }, error => {
      this._notify.error(error.error.ErrorMessage[1]);
    });
  }
}
