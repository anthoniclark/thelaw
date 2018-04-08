import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';
import swal from 'sweetalert2';
import { Case } from 'app/models/case';
import { Sorting, Page, FilterModel } from 'app/models/page';
import { DropDownModel } from 'app/models/dropDownModel';
@Component({
  selector: 'app-time-tracking-list',
  templateUrl: './time-tracking-list.component.html'
})
export class TimeTrackingListComponent implements OnInit {

  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  CaseId: number;
  caseDetail: Case = new Case();
  public page: Page = new Page();
  sorting: Sorting = new Sorting();
  filterModel: FilterModel[] = [{
    columnName: 'ContactName',
    value: ''
  }, {
    columnName: 'TaskCategoryName',
    value: ''
  }, {
    columnName: 'WorkedHours',
    value: ''
  }, {
    columnName: 'BilledHours',
    value: ''
  }, {
    columnName: 'Rate',
    value: ''
  }];
  taskCategory: Array<DropDownModel> = [];

  constructor(private route: ActivatedRoute, private caseService: CaseService,
    private router: Router,
    private _notify: NotificationService) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);
    this.caseService.getCaseById(this.CaseId).subscribe(
      response => {
        this.caseDetail = response;
      }, err => {
        this._notify.error(err.Result);
      });
    this.sorting = { columnName: "Id", dir: true };
    this.setPage({ offset: 0 });

  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getDataSource();
  }

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.loadingIndicator = true;
    this.caseService.getTimeTrackerPageDate(this.CaseId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
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
    this.router.navigateByUrl(`/case/${this.CaseId}/time-tracking/${id}`);
  }

  deleteClick(id) {
    swal({
      title: 'Delete Time Tracker',
      text: "Are you sure want to delete this Time Tracker?",
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
        this.caseService.deleteTaskTimeTracking(id).subscribe(
          response => {
            this.rows = this.rows.filter(row => {
              return row.Id !== id;
            });
            this.loadingIndicator = false;
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Time Tracker deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
  }

  createNewTimeTracking() {
    this.router.navigate([`/case/${this.CaseId}/time-tracking/new`]);
  }
}
