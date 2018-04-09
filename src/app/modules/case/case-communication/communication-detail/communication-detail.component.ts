import { Component, OnInit } from '@angular/core';
import { CaseCommunication, Case } from '../../../../models/case';
import { DropDownModel } from 'app/models/dropDownModel';
import { CommunicationType } from '../../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CaseService } from '../../case.service';
import { ContactService } from 'app/modules/contact/contact.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-communication-detail',
  templateUrl: './communication-detail.component.html'
})
export class CommunicationDetailComponent implements OnInit {
  public paramId: any;
  model: CaseCommunication = new CaseCommunication();
  CommunicationTypeDropDown: Array<DropDownModel> = CommunicationType;
  CommunicateFromId; CommunicateToId;
  isLoading: boolean = false;
  caseDetail: Case = new Case();
  selectedClient = {};
  constructor(private route: ActivatedRoute, private _notify: NotificationService,
    private _sanitizer: DomSanitizer, private router: Router, private caseService: CaseService,
    private contactService: ContactService) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param['id']);
    this.route.params.subscribe(param => this.model.CaseId = param['caseId']);
    this.caseService.getCaseById(this.model.CaseId).subscribe(res => {
      this.caseDetail = res;
      this.contactService.getContactById(res.ClientId).subscribe(result => {
        this.selectedClient = result;
      }, err => {

      });
    }, error => {
      this._notify.error(error.detail);
    });
    if (this.paramId.toString() !== 'new') {
      this.caseService.getCommunicationById(this.paramId).subscribe(
        response => {
          this.model = <CaseCommunication>response;
          this.CommunicateToId = response.CommunicateToName;
          this.CommunicateFromId = response.CommunicateFromName;
        }, err => {
          this._notify.error(err.Result);
        });
    } else {
      this.model.CommunicationType = CommunicationType[0].Id;
    }
  }

  autocompleListFormatter = (data: any) => {
    const html = `<span>${data.Name} - ${data.ContactType ? data.ContactType : ''} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  contactSearch(term: string): Observable<any[]> {
    return this.contactService.contactSearch(term);
  }

  onSelectCommunicateTo(item: any) {
    if (item) {
      this.model.CommunicateTo = item.Id;
    } else {
      this.model.CommunicateTo = undefined;
    }
  }

  onSelectCommunicateFrom(item: any) {
    if (item) {
      this.model.CommunicateFrom = item.Id;
    } else {
      this.model.CommunicateFrom = undefined;
    }
  }

  save() {
    this.isLoading = true;
    this.caseService.addOrUpdateCommunication(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new') {
            this._notify.success('Communication added successfully.');
          } else {
            this._notify.success('Communication updated successfully.');
          }

          setTimeout(() => {
            this.router.navigateByUrl(`/case/${this.model.CaseId}/communication/dashboard`);
          });
        }
      }, err => {
        this.isLoading = false;
        this._notify.error(err.Result);
      });
  }

  communicationDateChanged(event) {
    if (new Date(event) < new Date(this.caseDetail.OpenDate)) {
      this._notify.error("Communication Date should be greater than case start date");
      this.model.CommunicateDate = null;
    }
  }

  onCancelClick() {
    this.router.navigateByUrl(`/case/${this.model.CaseId}/communication/dashboard`);
    // this.router.navigate(['/case/' + this.model.CaseId]);
  }
}
