import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  @Input() layoutMenu: any;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleMenu() {
    this.layoutMenu.classList.toggle("layout-small-menu");
  }

}
