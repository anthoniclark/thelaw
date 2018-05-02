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
import { EventsDetailComponent } from './events-detail/events-detail.component';
import { BootstrapModalModule, Modal } from 'ngx-modialog/plugins/bootstrap';
@NgModule({
  imports: [
    CommonModule,
    eventsRouting,
    SharedModule,
    AngularMultiSelectModule,
    ModalModule.forRoot(),
    DataTableModule,
    ScheduleModule,
    BootstrapModalModule
  ],
  providers: [EventsService, Modal],
  declarations: [EventsDashboardComponent, EventsDetailComponent],
  entryComponents: [EventsDetailComponent]
})

export class EventsModule { }
