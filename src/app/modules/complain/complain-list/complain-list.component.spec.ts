import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
import { ComplainListComponent } from './complain-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastModule, ToastsManager, ToastOptions } from 'ng2-toastr';
import { NotificationService } from '../../../shared/services/notification.service';
import { ComplainService } from '../complain.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BaseRequestOptions, Response, ResponseOptions, Http } from "@angular/http";
import { HttpClientService } from '../../../lib/http/http-client.service';
import { ComplainServiceMock } from '../complain.service.mock';
fdescribe('ComplainListComponent', () => {
  let component: ComplainListComponent;
  let fixture: ComponentFixture<ComplainListComponent>;
  let service: ComplainService;
  let backend: MockBackend;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComplainListComponent],
      imports: [RouterTestingModule, ToastModule.forRoot(), NgxDatatableModule, HttpModule, HttpClientModule],
      providers: [NotificationService, ToastOptions, { provide: ComplainService, useClass: ComplainServiceMock }, HttpClientService,
        MockBackend
      ]

    })
      .compileComponents();
    // Get the MockBackend
    backend = TestBed.get(MockBackend);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', (done) => {
    expect(component).toBeTruthy();
    expect(component.rows.length).toBe(0);
    done();
  });

});
