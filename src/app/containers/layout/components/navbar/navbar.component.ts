import { Component, OnInit } from '@angular/core';
import { smoothlyMenu } from 'app/app.helpers';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';

declare var jQuery: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  constructor(private router: Router, private authService: AuthService) { }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  logout() {
    this.authService.setAuhToken('');
    this.router.navigate(['/login']);
  }

}
