import { Injectable } from '@angular/core';
import { AuthService } from 'app/shared/services/auth.service';
import { HttpClientService } from 'app/lib/http/http-client.service';

@Injectable()
export class NonAuthService {

  constructor(private authService: AuthService, private httpService: HttpClientService) { }

  forgotPassword(email: string) {
    return this.httpService.post('/UserLogins/ForgotPassword?email=' + email, {}).map((res: any) => {
      if (res.Result) {
        return res.Result;
      }
    });
  }
}
