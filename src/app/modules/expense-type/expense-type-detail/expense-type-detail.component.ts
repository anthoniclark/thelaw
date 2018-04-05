import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseTypeService } from '../expense-type.service';
import { ExpenseType } from '../../../models/expense-type';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-expense-type-detail',
  templateUrl: './expense-type-detail.component.html',
  styleUrls: ['./expense-type-detail.component.css']
})
export class ExpenseTypeDetailComponent implements OnInit {
  paramId: any;
  isLoading: boolean = false;
  model: ExpenseType = new ExpenseType();
  constructor(private route: ActivatedRoute, private expenseTypeService: ExpenseTypeService,
    private _notify: NotificationService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param["id"]);
    if (this.paramId.toString() != "new") {
      this.expenseTypeService.getExpenseById(this.paramId).subscribe(
        response => {
          this.model = <ExpenseType>response;
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }


  onCancelClick() {
    this.isLoading = true;
    this.router.navigate(['/expense-type']);
  }

  save() {
    this.expenseTypeService.addOrUpdateExpenseType(this.model).subscribe(response => {
      this.isLoading = false;
      if (this.paramId === 'new') {
        this._notify.success("Expense Type added successfully.");
      } else {
        this._notify.success("Expense Type updated successfully.");
      }
      setTimeout(() => {
        this.router.navigate(['/expense-type']);
      });
    }, error => {
      this._notify.error(error.Result);
    });
  }

}
