import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ComplainDetailComponent } from 'app/modules/complain/complain-detail/complain-detail.component';
import { ComplainListComponent } from 'app/modules/complain/complain-list/complain-list.component';
import { ComplainAddComponent } from './complain-add/complain-add.component';


const routes: Routes = [
    { path: '', component: ComplainListComponent },
    { path: ':id', component: ComplainAddComponent }
];

export const complainRouting: ModuleWithProviders = RouterModule.forChild(routes);
