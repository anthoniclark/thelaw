import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplainListComponent } from './complain-list/complain-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { ComplainService } from './complain.service';
import { complainRouting } from 'app/modules/complain/complain.routing';
import { ComplainAddComponent } from './complain-add/complain-add.component';
import { ContactService } from '../contact/contact.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    complainRouting,
    AngularMultiSelectModule
  ],
  declarations: [
    ComplainListComponent,
    ComplainAddComponent
  ],
  providers: [
    ComplainService,
    ContactService
  ]
})
export class ComplainModule { }
