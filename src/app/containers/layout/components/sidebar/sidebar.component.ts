import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import 'jquery-slimscroll';
import { AuthService } from 'app/shared/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { overlayConfigFactory } from 'ngx-modialog';
import { ChangeThemeComponent } from '../../../../components/change-theme/change-theme.component';

declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements AfterViewInit {

  @Input() layoutMenu: any;
  constructor(public router: Router, private authService: AuthService,
    private _sanitizer: DomSanitizer, private modal: Modal) { }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery('body').hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
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
}
