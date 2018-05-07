import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseExpenseListComponent } from './case-expense-list/case-expense-list.component';
import { CaseExpenseDetailComponent } from './case-expense-detail/case-expense-detail.component';
import { caseExpenseRouting } from 'app/modules/case-expense/case-expense.routing';
import { SharedModule } from 'app/shared/shared.module';
import { CaseExpenseService } from './case-expense.service';
import { CaseService } from '../case/case.service';
import { ContactService } from '../contact/contact.service';
import { DataTableModule } from 'primeng/datatable';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    caseExpenseRouting,
    DataTableModule,
    FileUploadModule
  ],
  declarations: [
    CaseExpenseListComponent,
    CaseExpenseDetailComponent
  ],
  providers: [
    CaseExpenseService,
    CaseService,
    ContactService
  ]
})
export class CaseExpenseModule { }
