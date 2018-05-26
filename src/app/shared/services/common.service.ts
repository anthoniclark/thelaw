import { Injectable } from '@angular/core';
import { HttpClientService } from 'app/lib/http/http-client.service';
import { Subject } from 'rxjs';

@Injectable()
export class CommonService {

  private tenent_name: string;
  hourSpend: Subject<string> = new Subject<string>();

  constructor(private httpService: HttpClientService) {
    console.log('in Common Services')
   }

  sendSuggestion(suggestionModel: any) {
    return this.httpService.post('Utility/SendSuggestion', suggestionModel).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      else {
        throw 'We are facing some issue with server, Plesae try after some time.';
      }
    }).catch((err: any) => {
      throw err;
    });
  }

  getTenentLogo(tenent: any) {
    return this.httpService.get(`Tenants/GetLogo?tenentId=${tenent}`).map((res: any) => {
      if (res.Success) {
        return res.Result;
      }
      else {
        throw 'We are facing some issue with server, Plesae try after some time.';
      }
    }).catch((err: any) => {
      throw err;
    });
  }

  getTenentName() {
    return this.tenent_name;
  }

  setTenentName(name: string) {
    this.tenent_name = name;
  }
}
