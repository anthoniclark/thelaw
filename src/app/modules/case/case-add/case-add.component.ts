import { Component, OnInit } from '@angular/core';
import { CaseService } from '../case.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ContactService } from '../../contact/contact.service';
import { Case } from 'app/models/case';
import { DropDownModel } from 'app/models/dropDownModel';
import { CaseType, CasePriority, WorkedAs, BillingFrequencies } from 'app/shared/constants';

import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-case-add',
  templateUrl: './case-add.component.html'
})
export class CaseAddComponent implements OnInit {
  public paramId: any;
  courts: any[] = [];
  judges: any[] = [];
  offices: any[] = [];
  selectedJudges: any[] = [];
  CaseAppealTypeDropDown: any[] = [];
  model: Case = new Case();
  CaseTypeDropDown: Array<DropDownModel> = CaseType;
  PriorityDropDown: Array<DropDownModel> = CasePriority;
  WorkedAsDropDown: Array<DropDownModel> = WorkedAs;
  BillingFrequencyDropDown: Array<DropDownModel> = BillingFrequencies;
  ClientId; OpponentContactId; OppnentAdvocateId; WitnessContactId; JugmentFavourId;
  isLoading: boolean = false;
  settings = {};
  taskTimeTrackingId: number;
  constructor(private route: ActivatedRoute, private caseService: CaseService, private _notify: NotificationService,
    private contactService: ContactService, private _sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.settings = {
      singleSelection: false,
      text: "Select Judges",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 3,
      enableSearchFilter: true,
    }
    this.route.params.subscribe(param => this.paramId = param["id"]);
    this.model.NotifyMe = true;

    this.caseService.getCaseAppealTypes().subscribe(res => {
      this.CaseAppealTypeDropDown = res;
    });
    this.caseService.getCourtsDD().subscribe(res => {
      this.courts = res;
    }, err => {
      this._notify.error(err.Result);
    });
    this.caseService.getJudgesDD().subscribe(res => {
      res.forEach(element => {
        this.judges.push({ id: element.Id, itemName: element.FirstName + ' ' + element.LastName });
      });

    }, err => {
      this._notify.error(err.Result);
    });
    if (this.paramId.toString() != "new") {
      this.caseService.getCaseById(this.paramId).subscribe(
        response => {
          this.model = <Case>response;
          this.OpponentContactId = response.OpponentContactName;
          this.OppnentAdvocateId = response.OppnentAdvocateName;
          this.WitnessContactId = response.WitnessContactName;
          this.JugmentFavourId = response.JugmentFavourToName;
          this.judges.forEach(element => {
            if (response.JudgeIds.indexOf(element.id) != -1) {
              this.selectedJudges.push(element);
            }
          });

          if (this.model.ClientId) {
            this.contactService.getContactById(this.model.ClientId).subscribe(res => {
              this.ClientId = res.FirstName + ' ' + res.LastName;
            })
          }
        }, err => {
          this._notify.error(err.Result);
        });
    }
    this.caseService.getTimeTrackingByCaseId(this.paramId).subscribe(response => {
      this.taskTimeTrackingId = response.length ? response[response.length - 1].Id : undefined;
    }, error => {
      this._notify.error(error.Result);
    })
  }

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.Name} - ${data.ContactType ? data.ContactType : ''} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  contactSearch(term: string): Observable<any[]> {
    return this.contactService.contactSearch(term);
  }

  advocateSearch(term: string) {
    return this.contactService.advocateSearch(term);
  }

  getOfficeAddresses() {
    this.contactService.getAddressByContactId(1).subscribe(res => {
      res.forEach(element => {
        if (element.AddressType === 'Office')
          this.offices.push(element);
      });
    }, err => {
      this._notify.error(err.Result);
    });
  }

  onSelectClient(item: any) {
    if (item) {
      this.model.ClientId = item.Id;
    } else {
      this.model.ClientId = undefined;
    }
  }

  onSelectOponent(item: any) {
    if (item) {
      this.model.OpponentContactId = item.Id;
    } else {
      this.model.OpponentContactId = undefined;
    }
  }

  onSelectOponentAdvocate(item: any) {
    if (item) {
      this.model.OppnentAdvocateId = item.Id;
    } else {
      this.model.OppnentAdvocateId = undefined;
    }
  }

  onSelectWitness(item: any) {
    if (item) {
      this.model.WitnessContactId = item.Id;
    } else {
      this.model.WitnessContactId = undefined;
    }
  }

  onSelectJugmentFavourTo(item: any) {
    if (item) {
      this.model.JugmentFavourTo = item.Id;
    } else {
      this.model.JugmentFavourTo = undefined;
    }
  }

  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  save() {
    this.isLoading = true;
    this.model.JudgeIds = [];
    this.selectedJudges.forEach(element => {
      this.model.JudgeIds.push(element.id);
    });
    this.caseService.addOrUpdate(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new') {
            this._notify.success("Case added successfully.");
          }
          else {
            this._notify.success("Case updated successfully.");
          }

          setTimeout(() => {
            this.router.navigate(['/case']);
          });
        }
      }, err => {
        this.isLoading = false;
        this._notify.error(err.Result);
      });
  }

  onCancelClick() {
    this.router.navigate(['/case']);
  }

  addCommunication() {
    this.router.navigate([`/case/${this.paramId}/communication/new`]);
  }

  addTimeTrackingDetails() {
    // this.router.navigate([`/case/${this.model.Id}/time-tracking/${this.taskTimeTrackingId || 'new'}`]);
    this.router.navigate([`/case/${this.paramId}/time-tracking/new`]);
  }

  addNote() {
    // this.router.navigate([`/case/${this.model.Id}/time-tracking/${this.taskTimeTrackingId || 'new'}`]);
    this.router.navigate([`/case/${this.paramId}/note/new`]);
  }

  addDocument() {
    this.router.navigate([`/case/${this.paramId}/document/new`]);
  }

}
