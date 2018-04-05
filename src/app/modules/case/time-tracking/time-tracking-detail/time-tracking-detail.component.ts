import { Component, OnInit } from '@angular/core';
import { TimeTracking, Case } from 'app/models/case';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskCategory, Associates } from 'app/shared/constants';
import { DropDownModel } from 'app/models/dropDownModel';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-time-tracking-detail',
  templateUrl: './time-tracking-detail.component.html'
})
export class TimeTrackingDetailComponent implements OnInit {
  model: TimeTracking = new TimeTracking();
  isLoading: boolean = false;
  paramId: string;
  caseDetail: Case = new Case();
  AssociatesDropDown: Array<DropDownModel> = Associates;
  constructor(private route: ActivatedRoute, private _notify: NotificationService, private caseService: CaseService,
    private router: Router, private _sanitizer: DomSanitizer) { }
  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.Name} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param['id']);
    this.route.params.subscribe(param => this.model.CaseId = param['caseId']);
    this.caseService.getCaseById(this.model.CaseId).subscribe(response => {
      this.caseDetail = response;
    }, error => {
      this._notify.error(error.Result);
    });
    if (this.paramId.toString() !== 'new') {
      this.caseService.getTaskTrackerById(+this.paramId).subscribe(
        response => {
          this.model = <TimeTracking>response;
        }, err => {
          this._notify.error(err.Result);
        });
    } else {
      // this.model.AssociateId = +Associates[0].Id;
    }
  }

  taskCategorySearch(term) {
    return Observable.of(TaskCategory.filter(x => x.Name.indexOf(term) > -1));
  }

  onSelectTaskCategory(taskCategory: any) {
    if (taskCategory) {
      this.model.TaskCategory = taskCategory.Id;
      this.model.TaskCategoryName = taskCategory.Name;
    } else {
      this.model.TaskCategory = undefined;
      this.model.TaskCategoryName = undefined;
    }
  }

  associateNameSearch(term: string) {
    return this.caseService.searchAssociateName(term);
  }

  onSelectAssociateName(associate: DropDownModel) {
    if (associate) {
      this.model.TaskCategory = +associate.Id;
      this.model.TaskCategoryName = associate.Name;
    } else {
      this.model.TaskCategory = undefined;
      this.model.TaskCategoryName = undefined;
    }
  }

  save() {
    this.isLoading = true;
    this.caseService.addOrUpdateTimeTracker(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new') {
            this._notify.success('Time added successfully.');
          } else {
            this._notify.success('Time updated successfully.');
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
    this.router.navigate(['/case/' + this.model.CaseId + '/time-tracking']);
  }
}
