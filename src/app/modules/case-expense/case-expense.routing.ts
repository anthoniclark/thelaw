import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseExpenseListComponent } from './case-expense-list/case-expense-list.component';
import { CaseExpenseDetailComponent } from './case-expense-detail/case-expense-detail.component';

const routes: Routes = [
    { path: '', component: CaseExpenseListComponent },
    { path: ':id', component: CaseExpenseDetailComponent }
];

export const caseExpenseRouting: ModuleWithProviders = RouterModule.forChild(routes);
