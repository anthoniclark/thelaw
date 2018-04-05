import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesDetailComponent } from './companies-detail/companies-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ModalModule } from 'ngx-modialog';


@NgModule({
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    SharedModule,
    AngularMultiSelectModule,
    ModalModule.forRoot()
  ],
  declarations: [CompaniesListComponent, CompaniesDetailComponent]
})
export class CompaniesModule { }
