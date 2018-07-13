import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { CaseChangeStatusComponent } from '../case-change-status/case-change-status.component';
import { overlayConfigFactory } from 'ngx-modialog';
import { Page, Sorting, FilterModel } from 'app/models/page';
import swal from 'sweetalert2';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { PageSize } from '../../../shared/constants';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html'
})
export class CaseListComponent implements OnInit {
  rows = [];
  pageSize: number = PageSize;
  dashboardData: any = {};
  public page: Page = new Page();
  loadingIndicator: boolean = false;
  sorting: Sorting = new Sorting();
  reorderable: boolean = true;
  advanceSearch: string;
  searchApplied: boolean = false;
  filterModel: FilterModel[] = [{
    columnName: 'CaseNo',
    value: ''
  }, {
    columnName: 'Client',
    value: ''
  }, {
    columnName: 'CaseType',
    value: ''
  }, {
    columnName: 'CaseStatus',
    value: ''
  }];
  contactId: any;
  constructor(private caseService: CaseService, public router: Router, private route: ActivatedRoute, private _notify: NotificationService,
    private modal: Modal, private authService: AuthService) {
    this.page.pageNumber = 0;
    this.page.size = PageSize;
  }
  

  ngOnInit() {
    this.route.params.subscribe((data) => {
      this.contactId = data.contactId;
    })
    this.sorting = { columnName: "Id", dir: true };
    // this.setPage({ offset: 0 });
    this.caseService.getAllDashboardData().subscribe(res => {
      this.dashboardData = res;
    }, err => {
      this._notify.error(err.Result);
    });
  }

  setPage(event: LazyLoadEvent) {
    if (event.sortField) {
      this.sorting = { columnName: event.sortField, dir: event.sortOrder === 1 };
    } else {
      this.sorting = { columnName: "Id", dir: true };
    }
    if (event.globalFilter) {
      return this.advanceFilter(event.globalFilter);
    }

    let filterColumnString = "";
    let searchValue = ""
    if (event.filters) {
      filterColumnString = 'columnName=';
      searchValue = '&searchValue=';
      this.page.pageNumber = 0;

      Object.keys(event.filters).forEach(key => {
        filterColumnString += `${key},`;
        searchValue += `${event.filters[key].value},`;
      });
      filterColumnString = filterColumnString.slice(0, -1);
      searchValue = searchValue.slice(0, -1);
    }
    setTimeout(() => this.getDataSource(filterColumnString, searchValue), 0);

  }

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.loadingIndicator = true;
    this.caseService.getCasePageData(this.contactId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
      this.loadingIndicator = false;
      this.page.totalElements = pagedData.TotalNumberOfRecords;
      this.page.totalPages = pagedData.TotalNumberOfPages;
      this.page.pageNumber = pagedData.PageNumber;
      this.rows = pagedData.Results;
    });
  }

  onSort(sort: any) {
    this.loadingIndicator = true;
    if (sort && sort.sorts[0]) {
      this.sorting = {
        columnName: sort.sorts[0].prop,
        dir: sort.sorts[0].dir === 'asc'
      };
    }
    return this.getDataSource();
  }

  filterData(event) {
    const target = event.target;
    let filter = this.filterModel.filter(x => x.value.length >= 2);
    if (filter.length) {
      let filterColumnString = 'columnName=';
      let searchValue = '&searchValue='
      filter.forEach((model) => {
        filterColumnString += model.columnName + ",";
        searchValue += model.value + ",";
      });
      filterColumnString = filterColumnString.substring(0, filterColumnString.length - 1);
      searchValue = searchValue.substring(0, searchValue.length - 1);
      this.getDataSource(filterColumnString, searchValue);
    } else {
      this.getDataSource();
    }
  }

  editClick(id) {
    this.router.navigate(['../../case/edit/', id], { relativeTo: this.route });
  }

  deleteClick(id) {
    swal({
      title: 'Delete Case',
      text: "Are you sure want to delete this Case?",
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
        this.caseService.deleteCase(id).subscribe(
          response => {
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Case deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
            const pageNumber = (this.rows.length === 1 ? this.page.pageNumber - 1 : this.page.pageNumber);
            if (this.rows.length === 1 && this.page.pageNumber === 0) {
              this.rows = this.rows.filter(x => x.Id !== id);
              this.loadingIndicator = false;
              this.page.totalElements = 0;
            } else {
              this.setPage({});
            }
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
  }

  changeStatus(rowData: any) {
    this.modal.open(CaseChangeStatusComponent, overlayConfigFactory({ caseRow: rowData }, BSModalContext));
  }

  showCommunication(id: any) {
    this.router.navigate([`../../case/${id}/communication/dashboard`], { relativeTo: this.route });
    //this.router.navigateByUrl('/case/' + id + '/communication/dashboard');
  }
  ShowTimeTracker(id: any) {
    this.router.navigate([`../../case/${id}/time-tracking`], { relativeTo: this.route });
    //this.router.navigateByUrl();
  }
  ShowNotes(id: any) {
    this.router.navigate([`../../case/${id}/note`], { relativeTo: this.route });
    //this.router.navigateByUrl();
  }
  ShowCommunications(id: any) {
    this.router.navigate([`../../case/${id}/communication`], { relativeTo: this.route });
    //this.router.navigateByUrl();
  }
  ShowEvidence(id: any) {
    this.router.navigate([`../../case/${id}/evidence`], { relativeTo: this.route });
    //this.router.navigateByUrl();
  }

  ShowDocuments(id: any) {
    this.router.navigate([`../../case/${id}/document`], { relativeTo: this.route });
    //this.router.navigateByUrl();
  }

  paginate(event) {
    this.page.size = event.rows;
    if (!event.first) {
      this.page.pageNumber = 0;
    } else {
      this.page.pageNumber = event.first / this.page.size;
    }
  }

  advanceFilter(searchTerm) {
    debugger;
    this.searchApplied = true;
    this.loadingIndicator = true;
    this.caseService.caseFullTextSearch(searchTerm, this.contactId, this.page, this.sorting).subscribe(res => {
      this.loadingIndicator = false;
      this.page.totalElements = res.TotalNumberOfRecords;
      this.page.totalPages = res.TotalNumberOfPages;
      this.page.pageNumber = res.PageNumber;
      this.rows = res.Results;
    }, error => {
      this._notify.error(error.detail);
    });
  }

  filterStartDate(event, dt, col) {
    const date = new Date(event);
    const filterDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    dt.filter(filterDate, col.field, col.filterMatchMode);
  }
  removeadvanceFilter() {
    this.searchApplied = false;
    this.advanceSearch = "";
    // this.setPage(this.page);
  }

  viewDetail(id) {
    this.router.navigate(['../../case/view/', id], { relativeTo: this.route });
  }

  viewClientDetail(id) {
    this.router.navigate(['../../contact/view/', id], { relativeTo: this.route });
  }

  markImportant(data) {
    this.caseService.markCaseAsImportant(data.Id, this.authService.getTenent()).subscribe(res => {
      if (res) {
        data.IsImportant = data.IsImportant ? false : true;
      }
    }, error => {
      this._notify.error('Something went wrong, Please try again');
    });
  }

  exportCase() {
    this.caseService.exportCase();
  }

  showHistory(id) {
    // this.router.navigate([`/${id}/history`]);
    this.router.navigate([`../../case/${id}/history`], { relativeTo: this.route });
    // this.caseService.getCaseHistory(id).subscribe(res => {
    //   if (res) {
    //     debugger
    //   }
    // }, error => {
    //   this._notify.error('Something went wrong, Please try again');
    // });
  }

}

