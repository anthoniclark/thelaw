import { Component, OnInit } from '@angular/core';
import { CaseService } from 'app/modules/case/case.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';
import { Page, Sorting, FilterModel } from 'app/models/page';
import swal from 'sweetalert2';
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html'
})
export class DocumentListComponent implements OnInit {
  public rows: any[];
  public page: Page = new Page();
  loadingIndicator: boolean = false;
  sorting: Sorting = new Sorting();
  CaseId: number;

  filterModel: FilterModel[] = [{
    columnName: 'DocumentName',
    value: ''
  }, {
    columnName: 'DocumentCategory',
    value: ''
  }, {
    columnName: 'FileType',
    value: ''
  }];

  constructor(private route: ActivatedRoute, private caseService: CaseService, private router: Router,
    private _notify: NotificationService) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);
    this.sorting = { columnName: "Id", dir: true };
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getDataSource();
  }

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.loadingIndicator = true;
    this.caseService.getCaseDocumentsByCaseId(this.CaseId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
      this.loadingIndicator = false;
      this.page.totalElements = pagedData.TotalNumberOfRecords;
      this.page.totalPages = pagedData.TotalNumberOfPages;
      this.page.pageNumber = pagedData.PageNumber;
      this.rows = pagedData.Results;
    });
  }

  editClick(id) {
    this.router.navigateByUrl(`/case/${this.CaseId}/document/${id}`);
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
        this.caseService.deleteCaseDocument(id).subscribe(
          response => {
            this.caseService.deleteCaseDocumentFile(id).subscribe(res => { });
            this.rows = this.rows.filter(row => {
              return row.Id != id;
            });
          }, err => {
            this._notify.error(err.Result);
          });
        swal({
          position: 'top-end',
          type: 'success',
          title: 'Case Expense deleted successfully',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  createNewDocument() {
    this.router.navigate([`case/${this.CaseId}/document/new`]);
  }
}
