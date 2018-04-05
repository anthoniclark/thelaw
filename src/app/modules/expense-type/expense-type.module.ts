import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';
import { expenseRouting } from './expense-type.routing';
import { SharedModule } from '../../shared/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { BootstrapModalModule, Modal } from 'ngx-modialog/plugins/bootstrap';
import { ExpenseTypeDetailComponent } from './expense-type-detail/expense-type-detail.component';
import { ExpenseTypeService } from './expense-type.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    expenseRouting,
    AngularMultiSelectModule,
    BootstrapModalModule
  ],
  declarations: [ExpenseTypeListComponent, ExpenseTypeDetailComponent],
  providers: [Modal, ExpenseTypeService]
})
export class ExpenseTypeModule { }
