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
  }, {
    columnName: 'Designation',
    value: ''
  }];
  loadingIndicator: boolean = false;
  contactType: string = contactDashboardTab[0];
  sorting: Sorting = new Sorting();

  constructor(private contactService: ContactService, private _notify: NotificationService, private router: Router) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.contactService.deleteNotification.subscribe(res => {
      if (this.contactType === 'Client') {
        this.dashboardData['TotalClient'] = this.dashboardData['TotalClient'] - 1;
        this.dashboardData['TotalContact'] = this.dashboardData['TotalContact'] - 1;
      } else if (this.contactType === 'Advocate') {
        this.dashboardData['TotalAdvocate'] = this.dashboardData['TotalAdvocate'] - 1;
        this.dashboardData['TotalContact'] = this.dashboardData['TotalContact'] - 1;
      } else if (this.contactType === 'LawFirm') {
        this.dashboardData['TotalLawFirm'] = this.dashboardData['TotalLawFirm'] - 1;
        this.dashboardData['TotalContact'] = this.dashboardData['TotalContact'] - 1;
      } else if (this.contactType === 'Other') {
        this.dashboardData['TotalOther'] = this.dashboardData['TotalOther'] - 1;
        this.dashboardData['TotalContact'] = this.dashboardData['TotalContact'] - 1;
      } else if (this.contactType === 'Importants') {
        this.dashboardData['TotalImportants'] = this.dashboardData['TotalImportants'] - 1;
        this.dashboardData['TotalContact'] = this.dashboardData['TotalContact'] - 1;
      }
    });
    this.contactService.getDashboardData().subscribe(res => {
      this.dashboardData = res;
    }, err => {
      this._notify.error(err.Result);
    });
    this.sorting = { columnName: "Id", dir: true };
    // this.setPage({ offset: 0 });
    this.getNewlyAddedData();
  }


  setPage(event) {
    if (event.sortField) {
      this.sorting = { columnName: event.sortField, dir: event.sortOrder === 1 };
    } else {
      this.sorting = { columnName: "No", dir: false };
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
        if (key.toLocaleLowerCase() === "title") {
          filterColumnString += `FirstName,LastName`;
          searchValue += `${event.filters[key].value},${event.filters[key].value}`;
        }
      });
      filterColumnString = filterColumnString.slice(0, -1);
      searchValue = searchValue.slice(0, -1);
    }
    if (this.contactType === contactDashboardTab[0] && this.sorting.columnName !== "Id") {
      const columnName = this.sorting.columnName.toLocaleLowerCase() === "title" ? "FirstName" : this.sorting.columnName;
      let data = this.rows.sort((a, b) => {
        if (this.sorting.dir === true)
          return +(a[columnName] > b[columnName]);
        else
          return +(a[columnName] < b[columnName]);
      });
      this.rows = [];
      setTimeout(() => {
        this.rows = data;
      }, 0);
    }
    else {
      setTimeout(() => this.getDataSource(filterColumnString, searchValue), 0);
    }
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
        if (model.columnName === "Title") {
          filterColumnString += "FirstName,"
          filterColumnString += "LastName"
          searchValue += model.value + ",";
          searchValue += model.value + ",";
        }
      });
      filterColumnString = filterColumnString.substring(0, filterColumnString.length - 1);
      searchValue = searchValue.substring(0, searchValue.length - 1);
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
    setTimeout(() => {
      this.setPage({ offset: 0 });
    }, 300);
  }

}
