import { Injectable } from '@angular/core';
import { HttpClientService } from '../../lib/http/http-client.service';

@Injectable()
export class EventsService {

  constructor(private httpService: HttpClientService) { }

  getAllEvents() {
    return this.httpService.get("Events/GetAll").map((res: any) => {
      return res.Result;
    }, error => {
      throw error;
    });
  }

  getAllEventTypes() {
    return this.httpService.get("EventType/GetAll").map((res: any) => {
      return res.Result;
    }, error => {
      throw error;
    });
  }

  getAllCase() {
    return this.httpService.get("Case/GetAll").map((res: any) => {
      return res.Result;
    }, error => {
      throw error;
    });
  }


  addOrUpdateEvent(model) {
    return this.httpService.post("Case/Create", model).map((res: any) => {
      debugger
      return res.Result;
    }, error => {
      throw error;
    });
  }
}
