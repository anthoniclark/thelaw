import { Injectable } from '@angular/core';
import { HttpClientService } from 'app/lib/http/http-client.service';

@Injectable()
export class CommonService {

  constructor(private httpService: HttpClientService) { }

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
}
