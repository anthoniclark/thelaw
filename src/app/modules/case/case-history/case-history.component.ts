import { Component, OnInit } from '@angular/core';
import { Page, Sorting } from '../../../models/page';
import { PageSize } from '../../../shared/constants';
import { CaseService } from '../case.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-history',
  templateUrl: './case-history.component.html',
  styleUrls: ['./case-history.component.css']
})
export class CaseHistoryComponent implements OnInit {
  rows = [];
  loadingIndicator = false;
  pageSize: number = PageSize;
  public page: Page = new Page();
  sorting: Sorting = new Sorting();
  reorderable = true;
  advanceSearch: string;
  caseId: string;
  constructor(private caseService: CaseService, private _notify: NotificationService, private route: ActivatedRoute) {
    this.page.pageNumber = 0;
    this.page.size = this.pageSize;
  }

  setPage(event: LazyLoadEvent) {
    if (event.sortField) {
      this.sorting = { columnName: event.sortField, dir: event.sortOrder === 1 };
    } else {
      this.sorting = {
        columnName: 'Id', dir: true
      };
    }

    let filterColumnString = '';
    let searchValue = '';
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
    this.caseService.getCaseHistory(this.caseId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
      this.loadingIndicator = false;
      this.page.totalElements = pagedData.TotalNumberOfRecords;
      this.page.totalPages = pagedData.TotalNumberOfPages;
      this.page.pageNumber = pagedData.PageNumber;
      this.rows = pagedData.Results;
    });
  }


  paginate(event) {
    if (!event.first) {
      this.page.pageNumber = 0;
    } else {
      this.page.pageNumber = event.first / 5;
    }
  }
  ngOnInit() {
    this.route.params.subscribe(param => {
      this.caseId = param['caseId']
    });
  }

  goToCase() {

  }
}
