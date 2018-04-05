import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { AuthService } from 'app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @Output()
  toggleSidebarClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  isSidebarOpen: boolean;
  @Input() layoutMenu: any;
  constructor(private router: Router, private authService: AuthService) {
    this.isSidebarOpen = false;
  }

  ngOnInit() {
  }

  toggleSidebar() {
    this.toggleSidebarClick.emit(!this.isSidebarOpen);
  }

  toggleMenu() {
    this.layoutMenu.classList.toggle("offscreen");
    this.layoutMenu.classList.toggle("move-left");
  }

  logout() {
    this.authService.setAuhToken('');
    this.router.navigate(['/login']);
  }
}
