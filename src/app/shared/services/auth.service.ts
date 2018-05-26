import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {

  constructor() { }

  getAuthToken() {
    return localStorage.getItem('auth-token') || null;
  }

  setAuhToken(token: string) {
    localStorage.setItem('auth-token', token);
  }

  setUserName(username: string) {
    localStorage.setItem('userName', username);
  }

  setThemeId(themeId: number) {
    localStorage.setItem('themeId', themeId.toString());
  }


  getUserName() {
    return localStorage.getItem('userName');
  }

  getThemeId() {
    return localStorage.getItem('themeId');
  }

  getTenent() {
    return localStorage.getItem('tenent_name') || null;
  }

  setTenent(tenent_name: string) {
    localStorage.setItem('tenent_name', tenent_name);
  }

  setTheme(theme_name) {
    localStorage.setItem('theme_name', theme_name);
  }

  getTheme() {
    return localStorage.getItem('theme_name') || "";
  }

  refreshToken(): Observable<string> {
    /*
        The call that goes in here will use the existing refresh token to call
        a method on the oAuth server (usually called refreshToken) to get a new
        authorization token for the API calls.
    */

    return Observable.of('new-token-string').delay(200);
  }
}
