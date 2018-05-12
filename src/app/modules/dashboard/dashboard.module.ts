import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { dashboardRouting } from 'app/modules/dashboard/dashboard.routing';
import { DashboardService } from './dashboard.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    dashboardRouting,
    SharedModule,
    CommonModule
  ],
  providers:[DashboardService],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
