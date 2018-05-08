import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';
import { ExpenseTypeDetailComponent } from './expense-type-detail/expense-type-detail.component';

const routes: Routes = [
    { path: '', component: ExpenseTypeListComponent },
    { path: ':id', component: ExpenseTypeDetailComponent }
];

export const expenseRouting: ModuleWithProviders = RouterModule.forChild(routes);
