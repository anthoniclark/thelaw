import { Component, OnInit, ViewChild } from '@angular/core';
import { CompaniesService } from '../companies.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { Page, Sorting, FilterModel } from '../../../models/page';
import swal from 'sweetalert2';
import { PageSize } from 'app/shared/constants';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html'
})
export class CompaniesListComponent implements OnInit {
  public rows: any[];
  public page: Page = new Page();
  loadingIndicator: boolean = false;
  sorting: Sorting = new Sorting();

  filterModel: FilterModel[] = [{
    columnName: 'CompanyName',
    value: ''
  }, {
    columnName: 'InsdustrySection',
    value: ''
  }, {
    columnName: 'Category',
    value: ''
  }, {
    columnName: 'Website',
    value: ''
  }, {
    columnName: 'CompanySize',
    value: ''
  }];

  pageSize: number = PageSize;


  fileToUpload: File = null;
  validFileSize: boolean = true;
  validFileType: boolean = true;
  @ViewChild('billDocument') billDocument: any;
  fileName: string;

  constructor(private companiesService: CompaniesService, public router: Router, private _notify: NotificationService) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
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
    this.companiesService.companiesPageData(this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
      this.loadingIndicator = false;
      this.page.totalElements = pagedData.TotalNumberOfRecords;
      this.page.totalPages = pagedData.TotalNumberOfPages;
      this.page.pageNumber = pagedData.PageNumber;
      this.rows = pagedData.Results;
    });
  }

  editClick(id) {
    this.router.navigateByUrl('/companies/' + id);
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

  deleteClick(id, dt) {
    swal({
      title: 'Delete Company',
      text: "Are you sure want to delete this Company?",
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
        this.companiesService.deleteCompany(id).subscribe(
          response => {
            const pageNumber = (this.rows.length === 1 ? this.page.pageNumber - 1 : this.page.pageNumber);
            if (this.rows.length === 1 && this.page.pageNumber === 0) {
              this.rows = this.rows.filter(x => x.Id !== id);
              this.loadingIndicator = false;
              this.page.totalElements = 0;
            } else {
              this.page.pageNumber = pageNumber;
              dt.filter();
            }
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Company deleted successfully',
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

  paginate(event) {
    if (!event.first) {
      this.page.pageNumber = 0;
    } else {
      this.page.pageNumber = event.first / this.pageSize;
    }
  }

  onFileChange(event: any) {
    //const target = event.target || event.srcElement;
    const files: FileList = event.files;
    if (files.length > 0) {
      let fileType: string = files[0].type.toString();
      const type = files[0].name.substr(files[0].name.lastIndexOf(".") + 1);
      if (type.toString() !== "xls" && type.toString() !== "xlsx") {
        this.fileName = null;
        this.validFileType = false;
        this.billDocument.clear();
        return false;
      } else if (files[0].size > 3145728) {
        this.fileName = null;
        this.validFileSize = false;
        this.billDocument.clear();
        return false;
      }
      this.validFileType = this.validFileSize = true;
      this.fileToUpload = files[0];
      this.fileName = this.fileToUpload.name;
      var reader = new FileReader();
      // reader.onload = (event: any) => {
      //   this.url = event.target.result;
      // }
      reader.readAsDataURL(files[0]);
      const formData = new FormData();
      formData.append("Document", this.fileToUpload);
      this.companiesService.importDocument(formData).subscribe(response => {
        if (response) {
          this.getDataSource();
          this._notify.success("Case Document uploaded successfully");
        }
      }, error => { this._notify.error(error.result); })
    }
  }

  deleteDocument() {
    this.fileToUpload = null;
    this.fileName = null;
  }

  exportCompany() {
    this.companiesService.exportCompanies();
  }

}
