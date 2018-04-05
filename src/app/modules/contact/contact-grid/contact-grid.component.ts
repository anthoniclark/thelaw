import { Component, OnInit, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { ContactService } from 'app/modules/contact/contact.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Router } from '@angular/router';
import { Page, Sorting, FilterModel } from '../../../models/page';
import { Overlay } from 'ngx-modialog';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import swal from 'sweetalert2'
import { contactDashboardTab } from 'app/shared/constants';
@Component({
  selector: 'app-contact-grid',
  templateUrl: './contact-grid.component.html'
})
export class ContactGridComponent implements OnInit {
  @Input() data: any[];
  @Input() showAction: boolean;
  @Input() page: Page;
  @Input() filterModel: FilterModel[];
  @Input() cType: string;
  @Input() loadingIndicator: boolean;
  @Output() getPageData: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSortChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilter: EventEmitter<any> = new EventEmitter<any>();
  _data: any[];

  constructor(private contactService: ContactService, private router: Router, private _notify: NotificationService,
    private modalDialog: Modal) { }

  ngOnChanges(changes: SimpleChanges) {
    const data: SimpleChange = changes.data;
    this._data = data ? data.currentValue : [];
  }

  onSort(event) {
    if (this.cType === contactDashboardTab[0]) {
      event.sorts[0].dir = undefined;
      return false;
    }
    // event.sorts[0].prop === "ContactType" &&
    this.onSortChange.emit(event);
  }

  filterData(event) {
    this.onFilter.emit(event);
  }

  setPage(event) {
    this.getPageData.emit(event);
  }

  ngOnInit() {
  }

  editClick(id) {
    this.router.navigateByUrl('/contact/' + id);
  }

  deleteClick(id) {
    swal({
      title: 'Delete Contact',
      text: "Are you sure want to delete this Contact?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
      reverseButtons: false,
    }).then((result) => {
      if (result.value) {
        this.loadingIndicator = true;
        this.contactService.deleteContact(id).subscribe(
          response => {
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Contact deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
            const pageNumber = (this._data.length === 1 ? this.page.pageNumber - 1 : this.page.pageNumber);
            if (this._data.length === 1 && this.page.pageNumber === 0) {
              this._data = this._data.filter(x => x.Id !== id);
              this.loadingIndicator = false;
              this.page.totalElements = 0;
            } else {
              this.getPageData.emit({ offset: pageNumber });
            }
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
  }
  toggleImportant(row) {
    this.loadingIndicator = true;
    this.contactService.toggleImportant(row.Id).subscribe(response => {
      row.IsImportant = !row.IsImportant;
      this.loadingIndicator = false;
    }, error => {
      this.loadingIndicator = false;
      this._notify.error(error.detail);
    });
  }

}
