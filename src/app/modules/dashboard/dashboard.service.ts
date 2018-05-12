import { Injectable } from '@angular/core';
import { HttpClientService } from '../../lib/http/http-client.service';

@Injectable()
export class DashboardService {

  constructor(private httpService: HttpClientService) { }
  
  getAllDashboardData() {
    return this.httpService.get('Dashboard/GetDashboardValues').map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      throw 'We are facing some issue with server, Plesae try after some time.';
    }).catch((err: any) => {
      throw err;
    })
  }

}
