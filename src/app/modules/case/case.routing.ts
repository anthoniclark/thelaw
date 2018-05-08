import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseListComponent } from 'app/modules/case/case-list/case-list.component';
import { CaseAddComponent } from './case-add/case-add.component';
import { CommunicationListComponent } from './case-communication/communication-list/communication-list.component';
import { CommunicationDetailComponent } from './case-communication/communication-detail/communication-detail.component';
import { TimeTrackingListComponent } from './time-tracking/time-tracking-list/time-tracking-list.component';
import { TimeTrackingDetailComponent } from 'app/modules/case/time-tracking/time-tracking-detail/time-tracking-detail.component';
import { NoteListComponent } from './case-note/note-list/note-list.component';
import { NoteDetailComponent } from './case-note/note-detail/note-detail.component';
import { CommunicationDashboardComponent } from './case-communication/communication-dashboard/communication-dashboard.component';
import { DocumentListComponent } from './case-document/document-list/document-list.component';
import { DocumentDetailComponent } from './case-document/document-detail/document-detail.component';
import { CaseEvidenceListComponent } from 'app/modules/case/case-evidence-list/case-evidence-list.component';
import { CaseEvidenceDetailComponent } from 'app/modules/case/case-evidence-detail/case-evidence-detail.component';


const routes: Routes = [
    { path: '', component: CaseListComponent },
    { path: ':id', component: CaseAddComponent },
    { path: 'view/:id', component: CaseAddComponent },
    { path: 'contact/:contactId', component: CaseListComponent },
    { path: ':caseId/communication', component: CommunicationListComponent },
    { path: ':caseId/communication/dashboard', component: CommunicationDashboardComponent },
    { path: ':caseId/communication/:id', component: CommunicationDetailComponent },
    { path: ':caseId/time-tracking', component: TimeTrackingListComponent },
    { path: ':caseId/time-tracking/:id', component: TimeTrackingDetailComponent },
    { path: ':caseId/note', component: NoteListComponent },
    { path: ':caseId/note/:id', component: NoteDetailComponent },
    { path: ':caseId/document', component: DocumentListComponent },
    { path: ':caseId/document/:id', component: DocumentDetailComponent },
    { path: ':caseId/evidence', component: CaseEvidenceListComponent },
    { path: ':caseId/evidence/:id', component: CaseEvidenceDetailComponent },
    { path: ':caseId/evidence/:id', component: CaseEvidenceDetailComponent },


];

export const caseRouting: ModuleWithProviders = RouterModule.forChild(routes);
