import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import 'jquery-slimscroll';
import { AuthService } from 'app/shared/services/auth.service';

declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  @Input() layoutMenu: any;
  constructor(public router: Router, private authService: AuthService) { }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  goToHome() {
    debugger;
    const tenent = this.authService.getTenent();
    this.router.navigateByUrl(`/${tenent}`);
  }

  logout() {
    const tenent = this.authService.getTenent();
    this.authService.setAuhToken('');
    this.router.navigateByUrl(`/${tenent}/login`);
  }

}
