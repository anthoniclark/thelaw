import { Component, OnInit } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-blank-layout',
  templateUrl: './blank-layout.component.html'
})
export class BlankLayoutComponent {

  ngAfterViewInit() {
    jQuery('body').addClass('gray-bg');
  }

  ngOnDestroy() {
    jQuery('body').removeClass('gray-bg');
  }

}
