import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { eventsRouting } from './events.routing';
import { SharedModule } from '../../shared/shared.module';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ModalModule } from 'ngx-modialog';
import { DataTableModule } from 'primeng/datatable';
import { EventsService } from './events.service';
import { EventsDashboardComponent } from './events-dashboard/events-dashboard.component';
import { ScheduleModule } from 'primeng/schedule';
@NgModule({
  imports: [
    CommonModule,
    eventsRouting,
    SharedModule,
    AngularMultiSelectModule,
    ModalModule.forRoot(),
    DataTableModule,
    ScheduleModule
  ],
  providers: [EventsService],
  declarations: [EventsDashboardComponent]
})

export class EventsModule { }
