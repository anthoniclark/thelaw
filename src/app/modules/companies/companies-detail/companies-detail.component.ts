import { Component, OnInit } from '@angular/core';
import { Company, Contacts } from '../../../models/companies';
import { CompaniesService } from '../companies.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NoImagePath } from '../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'ngx-modialog/plugins/bootstrap';

@Component({
  selector: 'app-companies-detail',
  templateUrl: './companies-detail.component.html',
  styleUrls: ['./companies-detail.component.css']
})
export class CompaniesDetailComponent implements OnInit {
  model: Company = new Company();
  isLoading: boolean = false;
  public paramId: any;
  public contacts: any[] = [];
  fileToUpload: File;
  validFileType: boolean = true;
  url: string = NoImagePath;
  selectedContacts: any[] = [];
  settings = { enableSearchFilter: true };
  constructor(private conmapiesService: CompaniesService, private _notify: NotificationService,
    private activatedRoute: ActivatedRoute, private router: Router, private modalDialog: Modal) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.paramId = params["id"]);
    this.conmapiesService.getAllContacts().subscribe((response) => {
      response.forEach((element) => {
        this.contacts.push({ id: element.Id, itemName: element.FirstName + " " + element.LastName });
      });
    }, error => {
      this._notify.error(error);
    });
    if (this.paramId !== 'new') {
      this.conmapiesService.getCompanyById(this.paramId).subscribe(response => {
        this.model = response;
        this.selectedContacts = [];
        response.Contacts.forEach(element => {
          this.selectedContacts.push({ id: element.Id, itemName: element.Name });
        });
      }, error => {
      });
      this.conmapiesService.getCompanyLogo(this.paramId).subscribe(
        response => {
          if (response) {
            this.url = "data:image/png;base64," + response;
          }
        }, error => {
          this._notify.error(error.result);
        });
    }
  }

  save() {
    this.isLoading = true;
    this.model.ContactIds = [];
    this.selectedContacts.forEach(data => {
      this.model.ContactIds.push(data.id);
    });
    this.conmapiesService.addOrUpdateCompany(this.model).subscribe((response: any) => {
      if (this.paramId === 'new' && this.fileToUpload && this.fileToUpload.size) {
        const formData = new FormData();
        formData.append("logo", this.fileToUpload);
        this.conmapiesService.uploadFileWithData(response.Id, formData).subscribe(res => {
          this._notify.success(`Company ${this.paramId ? 'updated' : 'added'} successfully`);
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/companies']);
          }, 0);
        }, err => {
          this._notify.error(err);
        });
      } else {
        setTimeout(() => {
          this.isLoading = false;
          this._notify.success(`Company ${this.paramId ? 'updated' : 'added'} successfully`);
          this.router.navigate(['/companies']);
        }, 0);
      }
    }, error => {
      this.isLoading = false;
      this._notify.error(error);
    });
  }

  onCancleClick() {
    this.router.navigate(['/companies']);
  }

  onFileChange(event: any) {
    const target = event.target || event.srcElement;
    const files: FileList = target.files;
    if (files.length > 0) {
      if (files[0].type == "image/jpg" || files[0].type == "image/jpeg" || files[0].type == "image/png") {
        this.validFileType = true;
        this.fileToUpload = files[0];
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        if (this.paramId !== "new") {
          const formData = new FormData();
          formData.append("logo", this.fileToUpload);
          this.conmapiesService.uploadFileWithData(this.paramId, formData).subscribe(response => {
            if (response) {
              this._notify.success("Company Logo uploaded successfully");
            }
          }, error => {
            this._notify.error(error.result);
          });
        }
      } else {
        this.validFileType = false;
      }
    }
  }

  deleteLogo() {
    if (this.paramId !== "new") {
      let x = this.modalDialog.confirm()
        .size('sm')
        .title('Delete Contact Photo')
        .body(`Are you sure want to delete Company Logo?`)
        .open().result.then(result => {
          if (result === true) {
            this.conmapiesService.deleteCompanyLogo(this.paramId).subscribe(response => {
              if (response) {
                this._notify.success("Company Logo deleted successfullyodal")
                this.url = NoImagePath;
                this.fileToUpload = null;
              }
            }, error => {
              this._notify.error(error.result);
            });
          }
        });
    } else {
      this.url = NoImagePath;
      this.fileToUpload = null;
    }
  }
}
