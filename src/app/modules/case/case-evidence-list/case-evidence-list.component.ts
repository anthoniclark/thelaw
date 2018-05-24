import { Component, OnInit } from '@angular/core';
import { Page, Sorting, FilterModel } from 'app/models/page';
import { CaseService } from 'app/modules/case/case.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';
import swal from 'sweetalert2';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { Case } from 'app/models/case';
import { PageSize } from 'app/shared/constants';

@Component({
  selector: 'app-case-evidence-list',
  templateUrl: './case-evidence-list.component.html',
  styleUrls: ['./case-evidence-list.component.css']
})
export class CaseEvidenceListComponent implements OnInit {
  rows = [];
  caseId: number;
  public page: Page = new Page();
  loadingIndicator: boolean = false;
  sorting: Sorting = new Sorting();
  reorderable: boolean = true;
  caseDetail: Case = new Case();
  filterModel: FilterModel[] = [{
    columnName: 'EvidenceName',
    value: ''
  }];
  pageSize: number = PageSize;
  constructor(private caseService: CaseService, public router: Router, private _notify: NotificationService,
    private modal: Modal, private route: ActivatedRoute) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    this.route.params.subscribe(param => this.caseId = +param["caseId"]);
    this.sorting = { columnName: "Id", dir: true };
    this.caseService.getCaseById(this.caseId).subscribe(res => {
      this.caseDetail = res;
    }, error => {
      this._notify.error(error.detail);
    });
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
    this.caseService.getCaseEvidencePageData(this.caseId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
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
    this.router.navigate([`../../case/${this.caseId}/evidence/${id}`], { relativeTo: this.route });
  }

  deleteClick(id, dt) {
    swal({
      title: 'Delete Case Evidence',
      text: "Are you sure want to delete this Case Evidence?",
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
        this.caseService.deleteCaseEvidence(id).subscribe(
          response => {
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Case Evidence deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
            const pageNumber = (this.rows.length === 1 ? this.page.pageNumber - 1 : this.page.pageNumber);
            if (this.rows.length === 1 && this.page.pageNumber === 0) {
              this.rows = this.rows.filter(x => x.Id !== id);
              this.loadingIndicator = false;
              this.page.totalElements = 0;
            } else {
              this.page.pageNumber = pageNumber;
              dt.filter();
            }
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
  }

  createNewEvidence() {
    this.router.navigate([`../../case/${this.caseId}/evidence/new`], { relativeTo: this.route });
  }

  paginate(event) {
    if (!event.first) {
      this.page.pageNumber = 0;
    } else {
      this.page.pageNumber = event.first / this.pageSize;
    }
  }


  downloadEvidence(id) {
    this.caseService.downloadCaseEvidenceFile(id);
  }

}
