import { Component, OnInit } from '@angular/core';
import { Case } from 'app/models/case';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from 'app/modules/case/case.service';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html'
})
export class CaseDetailComponent implements OnInit {
  model: Case = new Case();
  isLoading: boolean = false;
  public paramId: any;
  date: any = { date: { year: 2018, month: 10, day: 9 } };;

  constructor(private route: ActivatedRoute, private caseService: CaseService, private router: Router,
    private _notify: NotificationService) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param["id"]);
    if (this.paramId.toString() != "new") {
      this.caseService.getCaseById(this.paramId).subscribe(
        response => {
          this.model = <Case>response.Result;
        });
    }
  }

  save() {
    this.isLoading = true;
    this.caseService.addOrUpdate(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response.Result) {
          if (this.paramId === 'new') {
            this._notify.success("Case added successfully.");
          }
          else {
            this._notify.success("Case updated successfully.");
          }

          setTimeout(() => {
            this.router.navigate(['/case']);
          }, 1500);
        }
      });
  }

  onCancleClick() {
    this.router.navigate(['/case']);
  }

}
