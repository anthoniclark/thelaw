import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropDownModel } from 'app/models/dropDownModel';
import { DocumentCategory } from '../../../../shared/constants';
import { Document } from '../../../../models/case';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  validFileSize: boolean = true;
  validFileType: boolean = true;
  addCase: boolean = false;
  caseNo: string;
  @ViewChild('billDocument') billDocument: any;
  fileName: string;
  constructor(private route: ActivatedRoute, private _notify: NotificationService,
    private caseService: CaseService, private router: Router, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param["id"]);
    this.route.params.subscribe(param => this.caseId = param["caseId"]);
    if (this.caseId.toString() !== "undefined") {
      this.model.CaseId = this.caseId;
    } else {
      this.model.CaseId = undefined;
      this.addCase = true;
    }
    if (this.paramId.toString() != "new") {
      this.caseService.getCaseDocumentById(this.paramId).subscribe(
        response => {
          this.model = <Document>response;
          this.fileName = null;
          if (this.model.FileName && this.model.FileType) {
            this.fileName = this.model.DocumentName;
            this.url = this.caseService.getCaseDocument(this.paramId);
          }
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

  caseNameSearch(term: string) {
    return this.caseService.searchCase(term);
  }

  onSelectCaseName(caseName: DropDownModel) {
    if (caseName.Id) {
      this.model.CaseId = +caseName.Id;
      this.caseId = +caseName.Id;
      this.caseNo = caseName.Name;
    }
    else {
      this.model.CaseId = undefined;
      this.caseId = undefined;
      this.caseNo = undefined;
      return false;
    }
  }

  caseAutocompleListFormatter = (data: any) => {
    const html = `<span>${data.Name} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
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
                  this.router.navigate(['../'], { relativeTo: this.route });
                });
              }
            }, error => {
              this.isLoading = false;
              this._notify.error(error.Result);
            });
          } else if (this.paramId === 'new') {
            this._notify.success("Case Document added successfully.");
          }
          else {
            this._notify.success("Case Document updated successfully.");
          }
          setTimeout(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
          });
        }
      }, err => {
        this._notify.error(err.Result);
      });
  }

  onFileChange(event: any) {
    //const target = event.target || event.srcElement;
    const files: FileList = event.files;
    if (files.length > 0) {
      let fileType: string = files[0].type.toString();
      const type = files[0].name.substr(files[0].name.lastIndexOf(".") + 1);
      if (fileType.toString() !== "application/msword" && fileType.toString() !== "application/pdf"
        && fileType.toString() !== "image/jpg" && fileType.toString() !== "image/jpeg" && fileType.toString() !== "image/png"
        && type.toString() !== "xls" && type.toString() !== "xs" && type.toString() !== "txt" && type.toString() !== "rtf") {
        this.fileName = null;
        this.validFileType = false;
        this.billDocument.clear();
        return false;
      } else if (files[0].size > 3145728) {
        this.fileName = null;
        this.validFileSize = false;
        this.billDocument.clear();
        return false;
      }
      this.validFileType = this.validFileSize = true;
      this.fileToUpload = files[0];
      this.fileName = this.fileToUpload.name;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(files[0]);
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
    this.router.navigate([`../`], { relativeTo: this.route });
  }

  showDocument() {
    var win = window.open();
    win.document.write('<iframe src="' + this.url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
  }

  deleteDocument() {
    if (this.paramId !== 'new') {
      this.caseService.deleteDocumentFile(this.model.Id).subscribe(response => {
        this._notify.success("Document deleted successfully.");
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
}
