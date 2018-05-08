import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrderByPipe } from 'app/pipes/order-by.pipe';
// import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TruncatePipe } from 'app/pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    NguiDatetimePickerModule
  ],
  declarations: [
    OrderByPipe,
    TruncatePipe
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NguiAutoCompleteModule,
    NguiDatetimePickerModule,
    OrderByPipe,
    TruncatePipe
  ]
})
export class SharedModule { }
