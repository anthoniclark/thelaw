import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseListComponent } from './case-list/case-list.component';
import { CaseDetailComponent } from './case-detail/case-detail.component';
import { SharedModule } from 'app/shared/shared.module';
import { CaseService } from './case.service';
import { caseRouting } from 'app/modules/case/case.routing';
import { CaseAddComponent } from './case-add/case-add.component';
import { ContactService } from '../contact/contact.service';
import { CaseChangeStatusComponent } from './case-change-status/case-change-status.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { BootstrapModalModule, Modal } from 'ngx-modialog/plugins/bootstrap';
import { CommunicationListComponent } from './case-communication/communication-list/communication-list.component';
import { CommunicationDetailComponent } from './case-communication/communication-detail/communication-detail.component';
import { TimeTrackingListComponent } from './time-tracking/time-tracking-list/time-tracking-list.component';
import { TimeTrackingDetailComponent } from './time-tracking/time-tracking-detail/time-tracking-detail.component';
import { NoteListComponent } from './case-note/note-list/note-list.component';
import { NoteDetailComponent } from './case-note/note-detail/note-detail.component';
import { CommunicationDashboardComponent } from './case-communication/communication-dashboard/communication-dashboard.component';
import { DocumentListComponent } from './case-document/document-list/document-list.component';
import { DocumentDetailComponent } from './case-document/document-detail/document-detail.component';
import { PopoverModule } from "ngx-popover";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    caseRouting,
    AngularMultiSelectModule,
    BootstrapModalModule,
    PopoverModule
  ],
  declarations: [
    CaseListComponent,
    CaseDetailComponent,
    CaseAddComponent,
    CaseChangeStatusComponent,
    CommunicationListComponent,
    CommunicationDetailComponent,
    TimeTrackingDetailComponent,
    TimeTrackingListComponent,
    NoteListComponent,
    NoteDetailComponent,
    CommunicationDashboardComponent,
    DocumentListComponent,
    DocumentDetailComponent
  ],
  providers: [
    CaseService,
    ContactService,
    Modal
  ],
  entryComponents: [CaseChangeStatusComponent]
})
export class CaseModule { }
