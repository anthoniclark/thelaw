import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { overlayConfigFactory } from 'ngx-modialog';
import { TimeTracking, Case } from 'app/models/case';
import { TaskCategory, Associates } from 'app/shared/constants';
import { DropDownModel } from 'app/models/dropDownModel';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { TaskCategoryDetailComponent } from 'app/modules/case/task-category/task-category-detail/task-category-detail.component';

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
  taskCategoryList: Array<DropDownModel> = [];
  addCase: boolean = false;
  billedHours: Date;
  HoursSpend: string;

  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  running: boolean = false;
  interval: any;

  constructor(private route: ActivatedRoute, private _notify: NotificationService, private caseService: CaseService,
    private router: Router, private _sanitizer: DomSanitizer, private modal: Modal) { }
  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.Name} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param['id']);
    this.route.params.subscribe(param => this.model.CaseId = param['caseId']);
    this.caseService.getAllTaskCategories().subscribe(response => {
      this.taskCategoryList = [];
      response.forEach(data => {
        this.taskCategoryList.push({ Id: data.Id, Name: data.TaskCategoryName });
      });
    }, err => {
      this._notify.error(err.detail);
    });
    if (this.model.CaseId.toString() !== "undefined") {
      this.caseService.getCaseById(this.model.CaseId).subscribe(response => {
        this.caseDetail = response;
      }, error => {
        this._notify.error(error.Result);
      });
    } else {
      this.model.CaseId = undefined;
      this.addCase = true;
    }
    if (this.paramId.toString() !== 'new') {
      this.caseService.getTaskTrackerById(+this.paramId).subscribe(
        response => {
          this.model = <TimeTracking>response;
          let time = (this.model.BilledHours / 60).toString();
          this.billedHours = new Date();
          let arrTime = time.split(".");
          this.billedHours.setHours(+arrTime[0]);
          this.billedHours.setMinutes(+arrTime[1]);
          time = (this.model.WorkedHours / 60).toString();
          arrTime = time.split(".");
          // this.hoursSpend = new Date();
          // this.hoursSpend.setHours(+arrTime[0]);
          // this.hoursSpend.setMinutes(+arrTime[1]);
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
  caseNameSearch(term: string) {
    return this.caseService.searchCase(term);
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

  onSelectCaseName(caseName: DropDownModel) {
    if (caseName.Id) {
      this.model.CaseId = +caseName.Id;
      this.caseDetail.Id = +caseName.Id;
      this.caseDetail.CaseNo = caseName.Name;
    }
    else {
      this.model.CaseId = undefined;
      this.caseDetail.Id = undefined;
      this.caseDetail.CaseNo = undefined;
      return false;
    }
  }

  save() {
    this.isLoading = true;
    const date = new Date(this.billedHours);
    this.model.AssociateId = this.model.AssociateId["Id"];
    this.model.BilledHours = (+date.getHours() * 60) + date.getMinutes();
    //const WorkedHours = new Date(this.hoursSpend);
    this.model.CaseId = this.caseDetail.Id;
    //this.model.WorkedHours = (+WorkedHours.getHours() * 60) + WorkedHours.getMinutes();
    this.model.TaskCategoryName = this.taskCategoryList.find(x => x.Id.toString() === this.model.TaskCategory.toString()).Name;
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
            this.router.navigate(['/case/' + this.model.CaseId + '/time-tracking']);
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

  preventInput($event) {
    return false;
  }

  appTaskCategory() {
    const resul = this.modal.open(TaskCategoryDetailComponent, overlayConfigFactory({ caseModel: this.model }, BSModalContext));
    resul.result.then(res => {
      if (res) {
        this.caseService.getAllTaskCategories().subscribe(res => {
          this._notify.success("New Task Category created successfully!");
          this.taskCategoryList = res;
        });
      }
    });
  }

  toggleTimer() {
    this.running = !this.running;
    if (this.running) {
      this.interval = setInterval(() => {
        this.updateTime();
      }, 1000);
    } else {
      clearInterval(this.interval);
    }
  }

  updateTime() {
    this.seconds++;
    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
      if (this.minutes === 60) {
        this.minutes = 0;
        this.hours++;
      }
    }
    this.updateWatch();
  }

  updateWatch() {
    setTimeout(() => {
      const hours = ((this.hours * 60) + this.minutes + (this.seconds / 60)) / 60;
      this.HoursSpend = Math.round(hours * 100) / 100 + 'h';
    });
  }

  changeHourSpend() {
    debugger;
  }

  convertTextToDecimal(text) {
    var whatsLeft = text;
    var hours = 0;
    var minutes = 0;
    if (whatsLeft.indexOf("h") > 0) {
      var arrHours = whatsLeft.split("h");
      hours = parseFloat(arrHours[0]);
      if (arrHours[1] != null) {
        whatsLeft = arrHours[1];
      }
      else {
        whatsLeft = "";
      }
    }
    if (whatsLeft.indexOf("m") > 0) {
      var arrMinutes = whatsLeft.split("m");
      minutes = parseFloat(arrMinutes[0]);
    }

    if (whatsLeft.indexOf(":") > 0) {
      var arrClock = whatsLeft.split(":");
      hours = parseFloat(arrClock[0]);
      minutes = parseFloat(arrClock[1]);
    }

    if (hours + minutes == 0 && parseFloat(whatsLeft) == NaN) {
      hours = parseFloat(whatsLeft);
    }

    if (hours + minutes == 0 && parseFloat(whatsLeft) != NaN) {
      hours = parseFloat(whatsLeft);
    }

    if (hours + minutes == 0) {
      // $("#TimeEntry_Hours_TimeString").addClass("input-validation-error");
      // $("#TimeEntry_Hours").val(null);
    }
    else {
      //$("#TimeEntry_Hours_TimeString").removeClass("input-validation-error");
    }

    var value = { hours: hours, minutes: minutes, decimal: (hours + (minutes / 60)) };

    return value;
  }
}
