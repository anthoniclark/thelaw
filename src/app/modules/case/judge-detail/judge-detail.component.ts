import { Component, OnInit } from '@angular/core';
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { AppealType } from 'app/models/case';

import { Judge } from 'app/models/case';

@Component({
  selector: 'app-judge-detail',
  templateUrl: './judge-detail.component.html',
  styleUrls: ['./judge-detail.component.css']
})
export class JudgeDetailComponent implements OnInit {
  context: BSModalContext;
  dialogContext: any;
  caseModel: any;
  judgeModel: Judge = new Judge();
  isLoading: boolean = false;
  constructor(public dialog: DialogRef<BSModalContext>, private caseService: CaseService,
    private _notify: NotificationService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;
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

  ngOnInit() {
  }

  createJudge() {
    this.caseService.addJudge(this.judgeModel).subscribe(res => {
      if (res) {
        this.closeModelPopupClick();
      }
    }, error => {
      this._notify.error(error.detail);
    });
  }

}
