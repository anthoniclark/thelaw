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
    let url = "Events/Create";
    if (model.Id && model.Id !== 'new') {
      url = "Events/Update";
      return this.httpService.put(url, model).map((res: any) => {
        return res.Result;
      }, error => {
        throw error;
      });
    } else {
      return this.httpService.post(url, model).map((res: any) => {
        return res.Result;
      }, error => {
        throw error;
      });
    }

  }

  getEventById(id) {
    return this.httpService.get(`Events/GetEventsById/${id}`).map((res: any) => {
      return res.Result;
    }, error => {
      throw error;
    });
  }

  deleteEventById(id) {
    return this.httpService.delete(`Events/Delete/${id}`).map((res: any) => {
      return res.Result;
    }, error => {
      throw error;
    });
  }

  createEventType(model) {
    return this.httpService.post(`EventType/Create`, model).map((res: any) => {
      return res.Result;
    }, error => {
      throw error;
    });
  }
}
