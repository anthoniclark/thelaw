import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Login } from 'app/models/login';
import { AuthService } from 'app/shared/services/auth.service';
import { HttpClientService } from '../../../lib/http/http-client.service';

@Injectable()
export class LoginService {

  constructor(private authService: AuthService, private httpService: HttpClientService) { }

  login(loginModel: Login) {
    const model = {
      Username: loginModel.username,
      Password: loginModel.password
    };
    //const tenentName = this.authService.getTenent();
    return this.httpService.post('/UserLogins/Login', model).map((res: any) => {
      if (res.Result) {
        if (res.Result.sessionId) {
          this.authService.setAuhToken(res.Result.sessionId);
          this.authService.setUserName(res.Result.Name);
          this.authService.setUserId(res.Result.ContactId);
          this.authService.setThemeId(res.Result.ThemeId);
        }
        return true;
      }
    });
  }
}
