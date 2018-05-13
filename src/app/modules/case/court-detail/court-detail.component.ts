import { Component, OnInit } from '@angular/core';
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { Court } from '../../../models/case';
import { DialogRef } from 'ngx-modialog';
import { CaseService } from '../case.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-court-detail',
  templateUrl: './court-detail.component.html',
  styleUrls: ['./court-detail.component.css']
})
export class CourtDetailComponent implements OnInit {

  ngOnInit(): void {
    this.caseService.getAllCities().subscribe(res => {
      this.cities = res;
    });

    this.caseService.getAllStates().subscribe(res => {
      this.states = res;
    });
  }
  context: BSModalContext;
  dialogContext: any;
  caseModel: any;
  courtModel: Court = new Court();
  isLoading: boolean = false;
  states: any[] = [];
  cities: any[] = [];
  constructor(public dialog: DialogRef<BSModalContext>, private caseService: CaseService,
    private _notify: NotificationService) {
    dialog.context.dialogClass = "modal-dialog modal-lg";
    this.dialogContext = dialog.context;
  }

  beforeDismiss(): boolean {
    return false;
  }

  beforeClose(): boolean {
    return false;
  }

  closeClick() {
    this.dialog.close(false);

  }

  closeModelPopupClick = () => {
    this.dialog.close(true);
  }

  createCourt() {
    this.caseService.saveCourt(this.courtModel).subscribe(res => {
      if (res) {
        this.closeModelPopupClick();
      }
    }, error => {
      this._notify.error(error.detail);
    });
  }

  StateChanges(stateName: number) {
    this.caseService.getCities(this.states.find(x => x.StateName === stateName).Id).subscribe(res => {
      this.cities = res;
    });
  }

}
