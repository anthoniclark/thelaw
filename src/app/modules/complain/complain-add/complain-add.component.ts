import { Component, OnInit } from '@angular/core';
import { ComplainService } from '../complain.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ContactService } from '../../contact/contact.service';
import { Complain } from '../../../models/complain';
import { DropDownModel } from 'app/models/dropDownModel';
import { ComplainStatus } from 'app/shared/constants';

import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-complain-add',
  templateUrl: './complain-add.component.html'
})
export class ComplainAddComponent implements OnInit {
  public paramId: any;
  model: Complain = new Complain();
  ComplainStatusDropDown: Array<DropDownModel> = ComplainStatus;
  ComplainById; ComplainOfId;
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute,
    private complainService: ComplainService,
    private _notify: NotificationService,
    private contactService: ContactService,
    private _sanitizer: DomSanitizer,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param['id']);
    this.model.IsActive = true;

    if (this.paramId.toString() !== 'new') {
      this.complainService.getComplainById(this.paramId).subscribe(
        response => {
          this.model = <Complain>response;
          this.ComplainById = response.ComplainByName;
          this.ComplainOfId = response.ComplainOfName;
        }, err => {
          this._notify.error(err.Result);
        });
    } else {
      this.model.ComplainStatus = ComplainStatus[0].Id;
    }
  }

  autocompleListFormatter = (data: any) => {
    const html = `<span>${data.Name} - ${data.ContactType ? data.ContactType : ''} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  contactSearch(term: string): Observable<any[]> {
    return this.contactService.contactSearch(term);
  }

  onSelectComplainBy(item: any) {
    if (item) {
      this.model.ComplainBy = item.Id;
    } else {
      this.model.ComplainBy = undefined;
    }
  }

  onSelectComplainOf(item: any) {
    if (item) {
      this.model.ComplainOf = item.Id;
    } else {
      this.model.ComplainOf = undefined;
    }
  }

  save() {
    this.isLoading = true;
    this.complainService.addOrUpdate(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new') {
            this._notify.success('Complain added successfully.');
          } else {
            this._notify.success('Complain updated successfully.');
          }

          setTimeout(() => {
            this.router.navigate(['/complain']);
          });
        }
      }, err => {
        this._notify.error(err.Result);
      });
  }

  onCancelClick() {
    this.router.navigate(['/complain']);
  }
}
