import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';
import swal from 'sweetalert2';
import { Case } from 'app/models/case';
import { Sorting, Page, FilterModel } from 'app/models/page';
import { DropDownModel } from 'app/models/dropDownModel';
import { PageSize } from 'app/shared/constants';
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
  pageSize: number = PageSize;
  constructor(private route: ActivatedRoute, private caseService: CaseService,
    public router: Router,
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


  }

  setPage(event) {
    if (event.sortField) {
      this.sorting = { columnName: event.sortField, dir: event.sortOrder === 1 };
    } else {
      this.sorting = { columnName: "Id", dir: true };
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
    this.caseService.getTimeTrackerPageDate(this.CaseId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
      this.loadingIndicator = false;
      this.page.totalElements = pagedData.TotalNumberOfRecords;
      this.page.totalPages = pagedData.TotalNumberOfPages;
      this.page.pageNumber = pagedData.PageNumber;

      pagedData.Results.forEach(element => {
        if (element.BilledHours) {
          const billedHours = parseFloat(element.BilledHours);
          element.BilledHours = (billedHours / 60).toString().split(".")[0].toString() + ":";
          element.BilledHours += (billedHours / 60).toString().split(".")[1] ? (billedHours / 60).toString().split(".")[1].substr(0, 2) : "00";

          const WorkedHours = parseFloat(element.WorkedHours);
          element.WorkedHours = (WorkedHours / 60).toString().split(".")[0].toString() + ":";
          element.WorkedHours += (WorkedHours / 60).toString().split(".")[1] ? (WorkedHours / 60).toString().split(".")[1].substr(0, 2) : "00";
        }
      });
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
    this.router.navigate([`../../case/${this.CaseId}/time-tracking/${id}`], { relativeTo: this.route });
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
    this.router.navigate([`../../case/${this.CaseId}/time-tracking/new`], { relativeTo: this.route });
  }


  paginate(event) {
    if (!event.first) {
      this.page.pageNumber = 0;
    } else {
      this.page.pageNumber = event.first / this.pageSize;
    }
  }
}
