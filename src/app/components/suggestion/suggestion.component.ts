import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CommonService } from 'app/shared/services/common.service';


@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html'
})
export class SuggestionComponent implements OnInit, OnDestroy, CloseGuard, ModalComponent<BSModalContext> {
  context: BSModalContext;
  isLoading: boolean = false;
  model: any = {};

  constructor(public dialog: DialogRef<BSModalContext>, private commonServeice: CommonService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
  }

  ngOnInit() {
  }

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  beforeDismiss(): boolean {
    return false;
  }

  beforeClose(): boolean {
    return false;
  }

  changeStatus() {
    this.commonServeice.sendSuggestion(this.model).subscribe(res => {
      this.closeClick();
    }, err => {

    });
  }

  closeClick = () => {
    this.dialog.close(true);
  }

  ngOnDestroy(): void {
    // this.subscriptions.forEach(s => s.unsubscribe());
  }
}
