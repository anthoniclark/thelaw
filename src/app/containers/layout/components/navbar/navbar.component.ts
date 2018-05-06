import { Component, OnInit } from '@angular/core';
import { smoothlyMenu } from 'app/app.helpers';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var jQuery: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  imgBase64: any;

  ngOnInit(): void {
    this.commonService.getTenentLogo(5).subscribe(res => {
      debugger;
      this.imgBase64 = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + res);

    });
  }
  constructor(private router: Router, private authService: AuthService,
    private commonService: CommonService, private _sanitizer: DomSanitizer) { }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  logout() {
    this.authService.setAuhToken('');
    this.router.navigate(['/login']);
  }

}
