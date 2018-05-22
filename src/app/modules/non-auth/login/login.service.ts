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

    return this.httpService.post('UserLogins/Login', model).map((res: any) => {
      if (res.Result) {
        this.authService.setAuhToken('156109970ff0481ebd2e4a3cb211456d');
        return true;
      }
    });
  }
}
