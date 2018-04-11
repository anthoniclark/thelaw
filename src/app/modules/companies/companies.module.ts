import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesDetailComponent } from './companies-detail/companies-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ModalModule } from 'ngx-modialog';
import { CompanyListComponent } from './company-list/company-list.component';
import { ContactService } from '../contact/contact.service';


@NgModule({
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    SharedModule,
    AngularMultiSelectModule,
    ModalModule.forRoot()
  ],
  providers: [ContactService],
  declarations: [CompaniesListComponent, CompaniesDetailComponent, CompanyListComponent]
})
export class CompaniesModule { }
