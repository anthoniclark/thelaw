import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CaseExpenseService } from '../case-expense.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';
import { Page, Sorting, FilterModel } from 'app/models/page';
import swal from 'sweetalert2';

@Component({
  selector: 'app-case-expense-list',
  templateUrl: './case-expense-list.component.html'
})
export class CaseExpenseListComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  page: Page = new Page();
  @ViewChild('grid') grid: ElementRef;
  sorting: Sorting = new Sorting();
  allRows = [];
  filterModel: FilterModel[] = [{
    columnName: 'ExpenseName',
    value: ''
  },
  {
    columnName: 'CategoryName',
    value: ''
  },
  ];
  constructor(private caseExpenseService: CaseExpenseService, private router: Router, private _notify: NotificationService) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    this.sorting = { columnName: "Id", dir: true }
    this.setPage({ offset: 0 });
  }


  setPage(pageInfo) {
    this.loadingIndicator = true;
    this.page.pageNumber = pageInfo.offset;
    this.getDataSource();
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

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.caseExpenseService.getCaseExpensesPageData(this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
      this.loadingIndicator = false;
      this.page.totalElements = pagedData.TotalNumberOfRecords;
      this.page.totalPages = pagedData.TotalNumberOfPages;
      this.page.pageNumber = pagedData.PageNumber;
      this.allRows = pagedData.Results;
      this.rows = pagedData.Results;
    });
  }

  editClick(id) {
    this.router.navigateByUrl('/case-expense/' + id);
  }

  deleteClick(id) {
    swal({
      title: 'Delete Case Expense',
      text: "Are you sure want to delete this Case Expense?",
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
        this.caseExpenseService.deleteCaseExpense(id).subscribe(
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
              title: 'Case Expense deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
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
}
