import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { DOCUMENT } from '@angular/platform-browser';
import { DashboardService } from '../dashboard.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = { TotalTrust: 0 };
  constructor(@Inject(DOCUMENT) private document: Document, public router: Router, private authService: AuthService,
    private dashboardService: DashboardService, private _notify: NotificationService) { }

  ngOnInit() {
    this.dashboardService.getAllDashboardData().subscribe(res => {
      this.dashboardData = res;
    }, error => {
      this._notify.error();
    });
    this.changeTheme(this.getThemeById(+this.authService.getThemeId()));
  }

  getThemeById(id: number) {
    switch (id) {
      case 1:
        return '';
      case 2:
        return 'skin-1';
      case 3:
        return 'skin-3';
    }
  }

  changeTheme(themeName) {
    this.document.body.classList.remove('skin-1');
    this.document.body.classList.remove('skin-3');
    this.document.body.classList.add(themeName);
  }
}
