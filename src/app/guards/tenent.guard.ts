import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'app/shared/services/auth.service';
import { HttpClientService } from '../lib/http/http-client.service';
import { environment } from 'environments/environment.prod';

@Injectable()
export class TenentGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private httpServices: HttpClientService) {
    console.log('in Tenant')
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (next.params.tenent_id) {
      const body = { Tenant: next.params.tenent_id };
      const url = environment.origin + next.params.tenent_id + '/UserLogins/CheckTenant';
      return this.httpServices.post(url, body).map((res: any) => {
        if (res.Result) {
          this.authService.setTenent(next.params.tenent_id);
          return true;
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  }
}
