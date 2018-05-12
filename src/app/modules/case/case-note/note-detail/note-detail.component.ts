import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { ContactService } from 'app/modules/contact/contact.service';
import { CaseNote, Case } from 'app/models/case';
import { Observable } from 'rxjs/Observable';
import { DropDownModel } from '../../../../models/dropDownModel';


@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html'
})
export class NoteDetailComponent implements OnInit {
  public paramId: any;
  model: CaseNote = new CaseNote();
  NotesByName;
  isLoading: boolean = false;
  caseModel: Case = new Case();
  addCase: boolean = false;
  constructor(private route: ActivatedRoute, private _notify: NotificationService,
    private _sanitizer: DomSanitizer, private router: Router, private caseService: CaseService,
    private contactService: ContactService) { }

  ngOnInit() {
    this.model.IsImportant = false;
    this.route.params.subscribe(param => this.paramId = param['id']);
    this.route.params.subscribe(param => this.model.CaseId = param['caseId']);
    if (this.model.CaseId.toString() !== "undefined") {
      this.caseService.getCaseById(this.model.CaseId).subscribe(
        response => {
          this.caseModel = <Case>response;
        }, err => {
          this._notify.error(err.Result);
        });
    }
    else {
      this.model.CaseId = undefined;
      this.addCase = true;
    }
    if (this.paramId.toString() !== 'new') {
      this.caseService.getNoteById(this.paramId).subscribe(
        response => {
          this.model = <CaseNote>response;
          this.NotesByName = response.NotesByName;
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

  caseNameSearch(term: string) {
    return this.caseService.searchCase(term);
  }

  onSelectCaseName(caseName: DropDownModel) {
    if (caseName.Id) {
      this.model.CaseId = +caseName.Id;
      this.caseModel.Id = +caseName.Id;
      this.caseModel.CaseNo = caseName.Name;
    }
    else {
      this.model.CaseId = undefined;
      this.caseModel.Id = undefined;
      this.caseModel.CaseNo = undefined;
      return false;
    }
  }

  caseAutocompleListFormatter = (data: any) => {
    const html = `<span>${data.Name} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  autocompleListFormatter = (data: any) => {
    const html = `<span>${data.Name} - ${data.ContactType ? data.ContactType : ''} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  contactSearch(term: string): Observable<any[]> {
    return this.contactService.contactSearch(term);
  }

  onSelectNotesBy(item: any) {
    if (item) {
      this.model.NotesBy = item.Id;
      this.NotesByName = item.Name;
    } else {
      this.model.NotesBy = undefined;
      this.NotesByName = undefined;
    }
  }

  toggleIsImportant() {
    this.model.IsImportant = !this.model.IsImportant;
  }

  save() {
    this.isLoading = true;
    this.caseService.addOrUpdateNote(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new') {
            this._notify.success('Note added successfully.');
          } else {
            this._notify.success('Note updated successfully.');
          }

          setTimeout(() => {
            this.router.navigate(['/case/' + this.model.CaseId+'/note']);
          });
        }
      }, err => {
        this.isLoading = false;
        this._notify.error(err.Result);
      });
  }

  onCancelClick() {
    this.router.navigate([`/case/${this.model.CaseId}/note`]);
  }

}
