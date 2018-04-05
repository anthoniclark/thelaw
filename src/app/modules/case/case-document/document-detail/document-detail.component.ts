import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownModel } from 'app/models/dropDownModel';
import { DocumentCategory } from '../../../../shared/constants';
import { Document } from '../../../../models/case';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html'
})
export class DocumentDetailComponent implements OnInit {
  public paramId: any;
  public caseId: any;
  model: Document = new Document();
  CategoryDropDown: Array<DropDownModel> = DocumentCategory;
  url: string;
  isLoading: boolean = false;
  fileToUpload: File = null;

  constructor(private route: ActivatedRoute, private _notify: NotificationService,
    private caseService: CaseService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param["id"]);
    this.route.params.subscribe(param => this.caseId = param["caseId"]);
    this.model.CaseId = this.caseId;
    if (this.paramId.toString() != "new") {
      this.caseService.getCaseDocumentById(this.paramId).subscribe(
        response => {
          this.model = <Document>response;
          if (this.model.FileName) {
            this.caseService.getCaseDocument(this.model.Id).subscribe(res => {
              if (res && res !== "No Data Found") {
                this.url = res;
              }
            }, error => {
              this._notify.error(error.result);
            })
          }
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

  save() {
    this.isLoading = true;
    this.caseService.addOrUpdateCaseDocument(this.model).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new' && this.fileToUpload && this.fileToUpload.name) {
            const formData = new FormData();
            formData.append("Document", this.fileToUpload);
            return this.caseService.uploadCaseDocument(response.Id, this.caseId, formData).subscribe(res => {
              this._notify.success(`Case Document  ${this.paramId === 'new' ? 'added' : 'updated'} successfully.`);
              if (this.paramId !== "new") {
                setTimeout(() => {
                  this.router.navigate(['/case/' + this.caseId]);
                });
              }
            }, error => {
              this._notify.error(error.Result);
            });
          } else if (this.paramId === 'new') {
            this._notify.success("Case Document added successfully.");
          }
          else {
            this._notify.success("Case Document updated successfully.");
          }
          setTimeout(() => {
            this.router.navigate(['/case/' + this.caseId]);
          });
        }
      }, err => {
        this._notify.error(err.Result);
      });
  }

  onFileChange(event: any) {
    const target = event.target || event.srcElement;
    const files: FileList = target.files;
    if (files.length > 0) {
      let fileType: string = files[0].type.toString();
      if (fileType.toString() !== "application/msword" && fileType.toString() !== "application/pdf"
        && fileType.toString() !== "image/jpg" && fileType.toString() !== "image/jpeg" && fileType.toString() !== "image/png") {
        return false;
      }

      this.fileToUpload = files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      if (this.paramId !== "new") {
        const formData = new FormData();
        formData.append("Document", this.fileToUpload);
        this.caseService.uploadCaseDocument(this.paramId, this.caseId, formData).subscribe(response => {
          if (response) {
            this._notify.success("Case Document uploaded successfully");
          }
        }, error => { this._notify.error(error.result); })
      }
    }
  }

  onCancelClick() {
    this.router.navigate(['/case/' + this.caseId]);
  }

  showDocument() {
    var win = window.open();
    win.document.write('<iframe src="' + this.url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
  }

}
