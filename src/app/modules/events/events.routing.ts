import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';

const routes: Routes = [
  { path: '', component: EventsDashboardComponent }
];

export const eventsRouting: ModuleWithProviders = RouterModule.forChild(routes);
