import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/shared/services/notification.service';
import { Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { CaseChangeStatusComponent } from '../case-change-status/case-change-status.component';
import { overlayConfigFactory } from 'ngx-modialog';
import { Page, Sorting, FilterModel } from 'app/models/page';
import swal from 'sweetalert2';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html'
})
export class CaseListComponent implements OnInit {
  rows = [];
  public page: Page = new Page();
  loadingIndicator: boolean = false;
  sorting: Sorting = new Sorting();
  reorderable: boolean = true;
  filterModel: FilterModel[] = [{
    columnName: 'CaseNo',
    value: ''
  }, {
    columnName: 'CaseType',
    value: ''
  }, {
    columnName: 'RefferenceNumber',
    value: ''
  }, {
    columnName: 'CaseStatus',
    value: ''
  }];
  constructor(private caseService: CaseService, private router: Router, private _notify: NotificationService,
    private modal: Modal) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    this.sorting = { columnName: "Id", dir: true };
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getDataSource();
  }

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.loadingIndicator = true;
    this.caseService.getCasePageData(this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
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
    this.router.navigateByUrl('/case/' + id);
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
              this.setPage({ offset: pageNumber });
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

  showCommunication(rowData: any) {
    this.router.navigateByUrl('/case/' + rowData.Id + '/communication/dashboard');
  }
  ShowTimeTracker(rowData: any) {
    this.router.navigateByUrl(`/case/${rowData.Id}/time-tracking`);
  }
  ShowNotes(rowData: any) {
    this.router.navigateByUrl(`/case/${rowData.Id}/note`);
  }
  ShowCommunications(rowData: any) {
    this.router.navigateByUrl(`/case/${rowData.Id}/communication`);
  }
}
