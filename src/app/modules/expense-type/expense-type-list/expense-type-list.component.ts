import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseTypeService } from '../expense-type.service';
import { NotificationService } from '../../../shared/services/notification.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-expense-type-list',
  templateUrl: './expense-type-list.component.html',
  styleUrls: ['./expense-type-list.component.css']
})
export class ExpenseTypeListComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  constructor(private route: ActivatedRoute, private expenseTypeService: ExpenseTypeService,
    private router: Router, private _notify: NotificationService) { }

  ngOnInit() {
    this.expenseTypeService.getAllExpenseTypes().subscribe(response => {
      this.rows = response;
      setTimeout(() => { this.loadingIndicator = false; });
    }, error => {
      this._notify.error(error.Result);
    });
  }


  editClick(id) {
    this.router.navigateByUrl(`/expense-type/${id}`);
  }

  deleteClick(id) {
    swal({
      title: 'Delete Expense Type',
      text: "Are you sure want to delete this Expense Type?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
      reverseButtons: false,
    }).then((result) => {
      if (result.value) {
        this.loadingIndicator = true;
        this.expenseTypeService.deleteExpenseType(id).subscribe(
          response => {
            this.rows = this.rows.filter(row => {
              return row.Id !== id;
            });
            this.loadingIndicator = false;
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Expense Type deleted successfully',
              showConfirmButton: false,
              timer: 3000
            });
          }, err => {
            this._notify.error(err.Result);
          });
      }
    });
  }

}
