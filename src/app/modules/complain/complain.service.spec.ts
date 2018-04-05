import { TestBed, inject } from '@angular/core/testing';

import { ComplainService } from './complain.service';
import { HttpModule } from '@angular/http';
import { HttpClientService } from '../../lib/http/http-client.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

fdescribe('ComplainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientModule],
      providers: [ComplainService, HttpClientService]
    });
  });

  fit('should be created', inject([ComplainService, HttpClientService], (service: ComplainService, httpService: HttpClientService) => {
    expect(service).toBeTruthy();
  }));
});
