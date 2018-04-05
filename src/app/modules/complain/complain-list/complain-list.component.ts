import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/shared/services/notification.service';
import { Router } from '@angular/router';
import { ComplainService } from 'app/modules/complain/complain.service';
import { FilterModel, Page, Sorting } from 'app/models/page';
import swal from 'sweetalert2';

@Component({
  selector: 'app-complain-list',
  templateUrl: './complain-list.component.html'
})
export class ComplainListComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  public page: Page = new Page();
  sorting: Sorting = new Sorting();
  filterModel: FilterModel[] = [{
    columnName: 'ComplainByName',
    value: ''
  }, {
    columnName: 'ComplainOfName',
    value: ''
  }, {
    columnName: 'ComplainStatus',
    value: ''
  }];

  constructor(private complainService: ComplainService,
    private router: Router,
    private _notify: NotificationService) {
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
    this.complainService.getCompainPageData(this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
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
    this.router.navigateByUrl('/complain/' + id);
  }

  deleteClick(id) {
    swal({
      title: 'Delete Complain',
      text: "Are you sure want to delete this Complain?",
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
        this.complainService.deleteComplain(id).subscribe(
          response => {
            const pageNumber = (this.rows.length === 1 ? this.page.pageNumber - 1 : this.page.pageNumber);
            if (this.rows.length === 1 && this.page.pageNumber === 0) {
              this.rows = this.rows.filter(x => x.Id !== id);
              this.loadingIndicator = false;
              this.page.totalElements = 0;
            } else {
              this.setPage({ offset: pageNumber });
            }
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Complain deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
  }
}
