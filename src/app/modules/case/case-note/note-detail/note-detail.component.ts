import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { ContactService } from 'app/modules/contact/contact.service';
import { CaseNote } from 'app/models/case';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html'
})
export class NoteDetailComponent implements OnInit {
  public paramId: any;
  model: CaseNote = new CaseNote();
  NotesById;
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private _notify: NotificationService,
    private _sanitizer: DomSanitizer, private router: Router, private caseService: CaseService,
    private contactService: ContactService) { }

  ngOnInit() {
    this.model.IsImportant = false;
    this.route.params.subscribe(param => this.paramId = param['id']);
    this.route.params.subscribe(param => this.model.CaseId = param['caseId']);
    if (this.paramId.toString() !== 'new') {
      this.caseService.getCommunicationById(this.paramId).subscribe(
        response => {
          this.model = <CaseNote>response;
          this.NotesById = response.CommunicateToName;
        }, err => {
          this._notify.error(err.Result);
        });
    }
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
    } else {
      this.model.NotesBy = undefined;
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
            this.router.navigate(['/case/' + this.model.CaseId]);
          });
        }
      }, err => {
        this.isLoading = false;
        this._notify.error(err.Result);
      });
  }

  onCancelClick() {
    this.router.navigate(['/case/' + this.model.CaseId]);
  }

}
