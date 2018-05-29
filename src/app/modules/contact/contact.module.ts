import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactService } from './contact.service';
import { contactRouting } from './contact.routing';
import { SharedModule } from 'app/shared/shared.module';
import { ContactDashboardComponent } from './contact-dashboard/contact-dashboard.component';

import { ContactGridComponent } from './contact-grid/contact-grid.component';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { DataTableModule } from 'primeng/datatable';
import { FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    contactRouting,
    ModalModule.forRoot(),
    BootstrapModalModule,
    DataTableModule,
    FileUploadModule,
    AccordionModule
  ],
  declarations: [
    ContactListComponent,
    ContactDetailComponent,
    ContactDashboardComponent,
    ContactGridComponent
  ],
  providers: [ContactService]
})
export class ContactModule { }
