import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { NotificationService } from '../../shared/services/notification.service';
import { CloseGuard, ModalComponent, DialogRef } from 'ngx-modialog';
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { CommonService } from '../../shared/services/common.service';
import { themes } from 'app/shared/constants';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-change-theme',
  templateUrl: './change-theme.component.html',
  styleUrls: ['./change-theme.component.css']
})
export class ChangeThemeComponent implements OnInit {


  context: BSModalContext;
  dialogContext: any;
  isLoading = false;

  constructor(@Inject(DOCUMENT) private document: Document,
    public router: Router, public dialog: DialogRef<BSModalContext>,
    private _notify: NotificationService, private commonService: CommonService,
    private authService: AuthService) {
    dialog.context.dialogClass = 'modal-dialog modal-lg';
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


  changeTheme(themeName) {
    this.document.body.classList.remove('skin-1');
    this.document.body.classList.remove('skin-3');
    this.document.body.classList.add(themeName);
    this.commonService.ChangeTheme(themes[themeName]).subscribe(res => {
      this.authService.setTheme(themeName);
    });
  }

}
