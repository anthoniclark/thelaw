import { Component, OnInit } from '@angular/core';
import { NonAuthService } from '../non-auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  email: string;
  error: string;
  isLoading: boolean;

  constructor(private nonAuthService: NonAuthService, private _notify: NotificationService) { }

  ngOnInit() {
  }

  forgotPassword() {
    this.isLoading = true;
    this.nonAuthService.forgotPassword(this.email).subscribe(res => {
      this.isLoading = false;
      if (res !== 'Success') {
        this._notify.error(res);
      } else {
        this._notify.success('Password sent to your email.');
      }
    }, err => {
      this.isLoading = false;
      this._notify.error(err.Result);
    });
  }

}
