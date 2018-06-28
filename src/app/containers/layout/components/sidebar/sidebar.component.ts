import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import 'jquery-slimscroll';
import { AuthService } from 'app/shared/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { overlayConfigFactory } from 'ngx-modialog';
import { ChangeThemeComponent } from '../../../../components/change-theme/change-theme.component';
import { CommonService } from '../../../../shared/services/common.service';

declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, AfterViewInit {

  imgBase64: any;

  @Input() layoutMenu: any;
  userName: string;
  constructor(public router: Router, private authService: AuthService,
    private _sanitizer: DomSanitizer, private modal: Modal, private commonService: CommonService) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.commonService.getTenentLogo(5).subscribe(res => {
      this.imgBase64 = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + res);
    });
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery('body').hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      });
    }
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  goToHome() {
    const tenent = this.authService.getTenent();
    this.router.navigateByUrl(`/${tenent}`);
  }

  logout() {
    const tenent = this.authService.getTenent();
    this.authService.setAuhToken('');
    this.router.navigateByUrl(`/${tenent}/login`);
  }

  changeTheme() {
    const resul = this.modal.open(ChangeThemeComponent, overlayConfigFactory({}, BSModalContext));
    resul.result.then(res => {
      if (res) {
      }
    });
  }

  editProfile() {
    const contectId = this.authService.getUserId();
    const tenent = this.authService.getTenent();
    this.router.navigateByUrl(`/${tenent}/contact/${contectId}`);
  }
}
