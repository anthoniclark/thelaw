import { Component, OnInit } from '@angular/core';
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';

import { Judge, ContactQuickAdd } from 'app/models/case';

@Component({
  selector: 'app-contact-quick-add',
  templateUrl: './contact-quick-add.component.html',
  styleUrls: ['./contact-quick-add.component.css']
})
export class ContactQuickAddComponent implements OnInit {
  context: BSModalContext;
  dialogContext: any;
  contactQuickAddModel: ContactQuickAdd = new ContactQuickAdd();
  isLoading: boolean = false;

  constructor(public dialog: DialogRef<BSModalContext>, private caseService: CaseService,
    private _notify: NotificationService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;
    this.contactQuickAddModel.ContactType = this.dialogContext.contactType;
   

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

  createContact() {
    this.caseService.createQuickContact(this.contactQuickAddModel).subscribe(res => {
      if (res) {
        this.closeModelPopupClick();
      }
    }, error => {
      this._notify.error(error.detail);
    });
  }

}
