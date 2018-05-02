import { Component, OnInit } from '@angular/core';
import { detectBody } from 'app/app.helpers';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class LayoutComponent implements OnInit {

  layoutMenu: any;
  constructor() { }
  public ngOnInit(): any {
    detectBody();
  }

  public onResize() {
    detectBody();
  }
}
