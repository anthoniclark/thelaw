import { Component, OnInit, ViewChild } from '@angular/core';
import { CaseExpense } from '../../../models/case-expense';
import { DropDownModel } from 'app/models/dropDownModel';
import { ExpenseCategory } from '../../../shared/constants';
import { Observable } from 'rxjs';
import { ContactService } from 'app/modules/contact/contact.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseExpenseService } from '../case-expense.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from '../../case/case.service';

@Component({
  selector: 'app-case-expense-detail',
  templateUrl: './case-expense-detail.component.html'
})
export class CaseExpenseDetailComponent implements OnInit {
  public paramId: any;
  model: CaseExpense = new CaseExpense();
  cases: any[] = [];
  CategoryDropDown: any[] = [];
  url: string;
  isLoading: boolean = false;
  fileToUpload: File = null;
  AssociateContactId;
  fileName: string;
  validFileSize: boolean = true;
  validFileType: boolean = true;
  max_date = new Date();
  @ViewChild('billDocument') billDocument: any;
  constructor(private route: ActivatedRoute, private caseExpenseService: CaseExpenseService, private _notify: NotificationService,
    private _sanitizer: DomSanitizer, private contactService: ContactService, private caseService: CaseService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param["id"]);
    this.caseService.getCases().subscribe(res => {
      this.cases = res;
    }, err => {
      this._notify.error(err.Result);
    });
    this.caseExpenseService.getCaseExpenseCategories().subscribe(res => {
      this.CategoryDropDown = res;
    });
    if (this.paramId.toString() != "new") {
      this.caseExpenseService.getCaseExpenseById(this.paramId).subscribe(
        response => {
          this.model = <CaseExpense>response;
          this.setMaxDate();
          this.AssociateContactId = response.AssociateContactName;
          if (this.model.BillDocument) {
            this.fileName = this.model.BillDocument.toString();
          }
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

  autocompleListFormatter = (data: any) => {
    let html = `<span>${data.Name} - ${data.ContactType} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  contactSearch(term: string): Observable<any[]> {
    return this.contactService.contactSearch(term);
  }

  onSelectContact(item: any) {
    if (item) {
      this.model.AssociateContactId = item.Id;
    } else {
      this.model.AssociateContactId = undefined;
    }
  }

  save() {
    this.isLoading = true;
    this.caseExpenseService.addOrUpdate(this.model).subscribe(
      response => {
        this.isLoading = false;

        if (response) {
          if (this.paramId === 'new' && this.fileToUpload && this.fileToUpload.name) {
            const formData = new FormData();
            formData.append("Caseexpense", this.fileToUpload);
            return this.caseExpenseService.uploadFileWithData(response.Id, this.model.CaseId, formData).subscribe(res => {
              this._notify.success(`Case Expense  ${this.paramId === 'new' ? 'added' : 'updated'} successfully.`);
              if (this.paramId !== "new") {
                setTimeout(() => {
                  this.router.navigate(['/case-expense']);
                });
              }
            }, error => {
              this._notify.error(error.Result);
            });
          } else if (this.paramId === 'new') {
            this._notify.success("Case Expense added successfully.");
          }
          else {
            this._notify.success("Case Expense updated successfully.");
          }
          setTimeout(() => {
            this.router.navigate(['/case-expense']);
          });
        }
      }, err => {
        this.isLoading = false;
        this._notify.error(err.Result);
      });
  }

  onFileChange(event: any) {
    //const target = event.target || event.srcElement;
    const files: FileList = event.files;
    if (files.length > 0) {
      let fileType: string = files[0].type.toString();
      if (fileType.toString() !== "application/msword" && fileType.toString() !== "application/pdf"
        && fileType.toString() !== "image/jpg" && fileType.toString() !== "image/jpeg" && fileType.toString() !== "image/png") {
        this.validFileType = false;
        this.billDocument.clear();
        return false;
      } else if (files[0].size > 2097152) {
        this.validFileSize = false;
        this.billDocument.clear();
        return false;
      }

      this.validFileSize = true;
      this.validFileType = true;

      this.fileToUpload = files[0];
      this.fileName = this.fileToUpload.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(files[0]);
      if (this.paramId !== "new") {
        const formData = new FormData();
        formData.append("Caseexpense", this.fileToUpload);
        this.caseExpenseService.uploadFileWithData(this.paramId, this.model.CaseId, formData).subscribe(response => {
          if (response) {
            this._notify.success("Bill Document uploaded successfully");
          }
        }, error => { this._notify.error(error.result); })
      }
    }
  }

  onCancelClick() {
    this.router.navigate(['/case-expense']);
  }

  showDocument() {
    var win = window.open();
    win.document.write('<iframe src="' + this.url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
  }

  downloadDocument() {
    if (this.paramId !== 'new') {
      this.caseExpenseService.downloadDocument(this.paramId);
    }
  }

  deleteDocument() {
    if (this.paramId !== 'new') {
      this.caseExpenseService.deleteDocument(this.paramId).subscribe(response => {
        this._notify.success("Bill Document deleted successfully.");
        this.fileToUpload = null;
        this.fileName = null;
      }, error => {
        this._notify.error(error);
      });
    } else {
      this.fileToUpload = null;
      this.fileName = null;
    }
  }
  caseSelectionChange() {
    this.model.ExpenseDate = null;
    this.setMaxDate();
  }
  setMaxDate() {
    const selected_case: any = this.cases.find(x => x.Id === +this.model.CaseId)
    this.max_date = new Date(selected_case.OpenDate);
  }
}
