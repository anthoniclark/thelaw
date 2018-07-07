import { Component, ViewContainerRef, OnInit, Inject } from '@angular/core';
import { HttpClientService } from 'app/lib/http/http-client.service';
import { DOCUMENT } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, @Inject(DOCUMENT) private document: Document,
    private authService: AuthService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
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
