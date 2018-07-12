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

  advanceSearch: string;
  searchApplied: boolean = false;

  constructor(private contactService: ContactService, public router: Router, private _notify: NotificationService,
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
    if (event.globalFilter) {
      return this.advanceFilter(event.globalFilter);
    }
  }

  advanceFilter(searchTerm) {
    debugger;
    this.searchApplied = true;
    this.loadingIndicator = true;
    let sorting: Sorting = new Sorting();
    sorting = { columnName: "Id", dir: true };
    this.contactService.contactFullTextSearch(searchTerm, this.page, sorting).subscribe(res => {
      this.loadingIndicator = false;
      this.page.totalElements = res.TotalNumberOfRecords;
      this.page.totalPages = res.TotalNumberOfPages;
      this.page.pageNumber = res.PageNumber;
      this._data = res.Results;
    }, error => {
      this._notify.error(error.detail);
    });
  }

  removeadvanceFilter() {
    this.searchApplied = false;
    this.advanceSearch = "";
    // this.setPage(this.page);
  }

  ngOnInit() {
    // this.loadingIndicator = true;
    // this.contactService.getContacts().subscribe(
    //   response => {
    //     debugger;
    //     this.loadingIndicator = false;
    //     this._data = response;
    //   }, err => {
    //     this.loadingIndicator = false;
    //     this._notify.error(err.Result);
    //   });
  }

  deleteClick(id, dt) {
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
              this.contactService.sendDeleteNotification();
              this.loadingIndicator = false;
              this.page.totalElements = 0;
            } else {
              let deletedRecord = this._data.filter(x => x.Id !== id)[0];
              this.page.pageNumber = pageNumber;
              this.contactService.sendDeleteNotification();
              if (deletedRecord.IsImportant) {
                this.contactService.sendImpNotification(false);
              }
              // this.getPageData.emit({ offset: pageNumber });
              dt.filter();
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
      this.contactService.sendImpNotification(row.IsImportant);
      this.loadingIndicator = false;
    }, error => {
      this.loadingIndicator = false;
      this._notify.error(error.detail);
    });
  }

  paginate(event) {
    this.page.size = event.rows;
    if (!event.first) {
      this.page.pageNumber = 0;
    } else {
      this.page.pageNumber = event.first / this.page.size;
    }
  }

}
