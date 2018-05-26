import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';
import { CaseService } from 'app/modules/case/case.service';
import { CaseEvidence, Case } from 'app/models/case';
import { Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { DropDownModel } from '../../../models/dropDownModel';

@Component({
  selector: 'app-case-evidence-detail',
  templateUrl: './case-evidence-detail.component.html',
  styleUrls: ['./case-evidence-detail.component.css']
})
export class CaseEvidenceDetailComponent implements OnInit {

  url: string;
  isLoading: boolean = false;
  fileToUpload: File = null;
  fileName: string;
  validFileSize: boolean = true;
  validFileType: boolean = true;
  tagsList: string[] = [];
  @ViewChild('billDocument') billDocument: any;
  paramId: any;
  caseId: number;
  model: CaseEvidence = new CaseEvidence();
  caseModel: Case = new Case();
  addCase: boolean = false;
  constructor(
    private route: ActivatedRoute, private _notify: NotificationService, private caseService: CaseService,
    private router: Router, private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => this.paramId = param["id"]);
    this.route.params.subscribe(param => this.caseId = param["caseId"]);
    if (this.caseId.toString() != "0") {
      this.caseService.getCaseById(this.caseId).subscribe(
        response => {
          this.caseModel = <Case>response;
        }, err => {
          this._notify.error(err.Result);
        });
    } else {
      this.caseId = undefined;
      this.addCase = true;
    }
    if (this.paramId.toString() != "new") {
      this.caseService.getCaseEvidenceById(this.paramId).subscribe(
        response => {
          this.model = <CaseEvidence>response;
          this.tagsList = this.model.Tags ? this.model.Tags.split(",") : [];
          if (this.model.FileName) {
            this.fileName = this.model.FileName.toString();
          }
        }, err => {
          this._notify.error(err.Result);
        });
    }
  }

  caseAutocompleListFormatter = (data: any) => {
    const html = `<span>${data.Name} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  caseNameSearch(term: string) {
    return this.caseService.searchCase(term);
  }

  onSelectCaseName(caseName: DropDownModel) {
    if (caseName.Id) {
      this.caseId = +caseName.Id;
      this.caseModel.Id = +caseName.Id;
      this.caseModel.CaseNo = caseName.Name;
    }
    else {
      this.caseId = undefined;
      this.caseModel.Id = undefined;
      this.caseModel.CaseNo = undefined;
      return false;
    }
  }

  save() {
    this.isLoading = true;
    if (this.tagsList.length) {
      this.model.Tags = "";
      this.tagsList.forEach(element => {
        this.model.Tags += `${element},`;
      });
      if (this.model.Tags) {
        this.model.Tags = this.model.Tags.slice(0, -1)
      }
    }
    this.caseService.addOrUpdateCaseEvidence(this.model, this.caseId).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          if (this.paramId === 'new' && this.fileToUpload && this.fileToUpload.name) {
            const formData = new FormData();
            formData.append("file", this.fileToUpload);
            return this.caseService.uploadCaseEvidenceFile(response.Id, this.caseId, formData).subscribe(res => {
              this._notify.success(`Case Evidence  ${this.paramId === 'new' ? 'added' : 'updated'} successfully.`);
              setTimeout(() => {
                this.router.navigate([`../`], { relativeTo: this.route });
              });
            }, error => {
              this._notify.error(error.Result);
            });
          } else if (this.paramId === 'new') {
            this._notify.success("Case Evidence added successfully.");
          }
          else {
            this._notify.success("Case Evidence updated successfully.");
          }
          setTimeout(() => {
            this.router.navigate([`../`], { relativeTo: this.route });
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
        formData.append("file", this.fileToUpload);
        this.caseService.uploadCaseEvidenceFile(this.paramId, this.caseId, formData).subscribe(response => {
          if (response) {
            this._notify.success("Case Evidence uploaded successfully");
          }
        }, error => { this._notify.error(error.result); })
      }
    }
  }

  onCancelClick() {
    this.router.navigate([`../`], { relativeTo: this.route });
  }

  downloadDocument() {
    if (this.paramId !== 'new') {
      this.caseService.downloadCaseEvidenceFile(this.paramId);
    }
  }

  deleteDocument() {
    if (this.paramId !== 'new') {
      this.caseService.deleteCaseEvidenceFile(this.paramId).subscribe(response => {
        this._notify.success("Case Evidence deleted successfully.");
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