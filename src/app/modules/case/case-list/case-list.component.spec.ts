import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
import { CaseListComponent } from './case-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastModule, ToastsManager, ToastOptions } from 'ng2-toastr';
import { NotificationService } from '../../../shared/services/notification.service';
import { CaseService } from '../case.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BaseRequestOptions, Response, ResponseOptions, Http } from "@angular/http";
import { HttpClientService } from '../../../lib/http/http-client.service';
import { CaseServiceMock } from '../case.service.mock';
fdescribe('CaseListComponent', () => {
  let component: CaseListComponent;
  let fixture: ComponentFixture<CaseListComponent>;
  let service: CaseService;
  let backend: MockBackend;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaseListComponent],
      imports: [RouterTestingModule, ToastModule.forRoot(), NgxDatatableModule, HttpModule, HttpClientModule],
      providers: [NotificationService, ToastOptions, { provide: CaseService, useClass: CaseServiceMock }, HttpClientService,
        MockBackend
      ]

    })
      .compileComponents();
    // Get the MockBackend
    backend = TestBed.get(MockBackend);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', (done) => {
    expect(component).toBeTruthy();
    expect(component.rows.length).toBe(0);
    done();
  });

});