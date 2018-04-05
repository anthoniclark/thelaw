import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompaniesListComponent } from './companies-list/companies-list.component';
import { CompaniesService } from './companies.service';
import { CompaniesDetailComponent } from './companies-detail/companies-detail.component';

const routes: Routes = [
  { path: '', component: CompaniesListComponent },
  { path: ':id', component: CompaniesDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CompaniesService]
})
export class CompaniesRoutingModule { }
