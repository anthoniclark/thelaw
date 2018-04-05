import { TestBed, inject } from '@angular/core/testing';

import { CaseService } from './case.service';
import { HttpModule } from '@angular/http';
import { HttpClientService } from '../../lib/http/http-client.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

fdescribe('CaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientModule],
      providers: [CaseService, HttpClientService]
    });
  });

  fit('should be created', inject([CaseService, HttpClientService], (service: CaseService, httpService: HttpClientService) => {
    expect(service).toBeTruthy();
  }));
});
