import { Component, OnInit } from '@angular/core';
import { ContactService } from 'app/modules/contact/contact.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { contactDashboardTab } from 'app/shared/constants';
import { Router } from '@angular/router';
import { Page, FilterModel, Sorting } from '../../../models/page';

@Component({
  selector: 'app-contact-dashboard',
  templateUrl: './contact-dashboard.component.html'
})
export class ContactDashboardComponent implements OnInit {

  dashboardData: any = {};
  rows = [];
  newlyAddedData = [];
  public page: Page = new Page();
  filterModel: FilterModel[] = [{
    columnName: 'Title',
    value: ''
  },];
  loadingIndicator: boolean = false;
  contactType: string = contactDashboardTab[0];
  sorting: Sorting = new Sorting();

  constructor(private contactService: ContactService, private _notify: NotificationService, private router: Router) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.contactService.getDashboardData().subscribe(res => {
      this.dashboardData = res;
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

  onFilter($event) {
    let filter = this.filterModel.filter(x => x.value.length >= 2);
    if (this.contactType === contactDashboardTab[0]) {
      return false;
    }
    const target = event.target;
    if (filter.length) {
      let filterColumnString = 'columnName=';
      let searchValue = '&searchValue='
      filter.forEach((model) => {
        filterColumnString += model.columnName + ",";
        searchValue += model.value + ",";
      });
      filterColumnString += "FirstName,"
      filterColumnString += "LastName"
      searchValue += filter[0].value + ",";
      searchValue += filter[0].value;
      this.getDataSource(filterColumnString, searchValue);
    } else {
      this.getDataSource();
    }
  }


  onSort(sort: any) {
    if (sort && sort.sorts[0]) {
      this.sorting = {
        columnName: sort.sorts[0].prop,
        dir: sort.sorts[0].dir === 'asc'
      };
    }
    return this.getDataSource();
  }

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.loadingIndicator = true;
    if (this.contactType === contactDashboardTab[0]) {
      this.page.pageNumber = 0;
      this.page.size = 10;
      this.getNewlyAddedData();
    } else {
      this.contactService.getContactPageData(this.contactType, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
        this.page.totalElements = pagedData.TotalNumberOfRecords;
        this.page.totalPages = pagedData.TotalNumberOfPages;
        this.page.pageNumber = pagedData.PageNumber;
        this.rows = pagedData.Results;
        this.loadingIndicator = false;
      });
    }
  }

  getNewlyAddedData() {
    this.rows = [];
    this.contactType = contactDashboardTab[0];
    this.page.size = 10;
    this.page.totalElements = 10;
    this.page.totalPages = 1;
    this.page.pageNumber = 0;
    this.contactService.getNewlyAddedContacts().subscribe(res => {
      this.newlyAddedData = Object.assign([], res);
      this.rows = res;
      this.loadingIndicator = false;
    }, err => {
      this._notify.error(err.Result);
    });
  }

  tabSelect(event) {
    this.rows = [];
    this.page.pageNumber = 0;
    this.page.size = 5;
    this.sorting = { columnName: "Id", dir: true };
    this.contactType = contactDashboardTab[event];
    this.setPage({ offset: 0 });
  }

}
