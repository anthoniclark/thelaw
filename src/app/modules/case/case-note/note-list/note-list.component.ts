import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Case } from 'app/models/case';
import { FilterModel, Sorting, Page } from 'app/models/page';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html'
})
export class NoteListComponent implements OnInit {
  rows = [];
  public page: Page = new Page();
  loadingIndicator: boolean = false;
  sorting: Sorting = new Sorting();
  reorderable: boolean = true;
  filterModel: FilterModel[] = [{
    columnName: 'NotesBy',
    value: ''
  }, {
    columnName: 'Subject',
    value: ''
  }];

  CaseId: number;
  caseDetail: Case = new Case();
  constructor(private route: ActivatedRoute, private caseService: CaseService,
    private router: Router,
    private _notify: NotificationService) {
    this.page.pageNumber = 0;
    this.page.size = 5;
  }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);
    this.caseService.getCaseById(this.CaseId).subscribe(response => {
      this.caseDetail = response;
    }, error => {

    });
    // this.caseService.getNoteByCaseId(this.CaseId).subscribe(
    //   response => {
    //     this.rows = response;
    //     setTimeout(() => { this.loadingIndicator = false; });
    //   }, err => {
    //     this._notify.error(err.Result);
    //   });
    this.sorting = { columnName: "Id", dir: true };
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getDataSource();
  }

  getDataSource(filterColumn?: string, filterValue?: string) {
    this.loadingIndicator = true;
    this.caseService.getNotesByCaseIdPageData(this.CaseId, this.page, this.sorting, filterColumn, filterValue).subscribe(pagedData => {
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
    this.router.navigateByUrl(`/case/${this.CaseId}/note/${id}`);
  }

  deleteClick(id) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.caseService.deleteNote(id).subscribe(
        response => {
          this.rows = this.rows.filter(row => {
            return row.Id !== id;
          });
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

  createNewNote() {
    this.router.navigate([`/case/${this.CaseId}/note/new`]);
  }
}
