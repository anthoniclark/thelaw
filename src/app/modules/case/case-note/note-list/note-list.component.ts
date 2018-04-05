import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html'
})
export class NoteListComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  CaseId: number;

  constructor(private route: ActivatedRoute, private caseService: CaseService,
    private router: Router,
    private _notify: NotificationService) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.CaseId = param['caseId']);
    this.caseService.getNoteByCaseId(this.CaseId).subscribe(
      response => {
        this.rows = response;
        setTimeout(() => { this.loadingIndicator = false; });
      }, err => {
        this._notify.error(err.Result);
      });
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
