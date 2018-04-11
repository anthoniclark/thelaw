import { Component, OnInit } from '@angular/core';
import { Company, Contacts } from '../../../models/companies';
import { CompaniesService } from '../companies.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NoImagePath } from '../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { ContactService } from '../../contact/contact.service';

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
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  settings = { enableSearchFilter: true };
  emailSet = [{ Id: undefined, EmailId: '', IsPrimary: true, IsDeleted: false }];
  mobileSet = [{ Id: undefined, MobileNumber: '', IsPrimary: true, IsDeleted: false, isDisabled: false, tempId: 1, MobileType: "home" }];
  addressSet = [{ Id: undefined, Address1: '', State: undefined, City: undefined, PostCode: '', Country: undefined, IsPrimary: true, IsDeleted: false, AddressType: "Home" }];
  constructor(private conmapiesService: CompaniesService, private _notify: NotificationService,
    private activatedRoute: ActivatedRoute, private router: Router, private modalDialog: Modal, private contactService: ContactService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.paramId = params["id"]);
    this.conmapiesService.getAllContacts().subscribe((response) => {
      response.forEach((element) => {
        this.contacts.push({ id: element.Id, itemName: element.FirstName + " " + element.LastName });
      });
    }, error => {
      this._notify.error(error);
    });
    this.contactService.getCountries().subscribe(res => {
      this.countries = res;
    });
    this.contactService.getAllCities().subscribe(res => {
      this.cities = res;
    });

    this.contactService.getAllStates().subscribe(res => {
      this.states = res;
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

  addEmail() {
    const emailAddress = this.emailSet.filter(x => !x.IsDeleted);
    if (emailAddress.some(x => !x.EmailId.length)) {
      this._notify.error('Please fill all email address');
      return;
    }
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
    if (emailAddress.some(x => !email.test(x.EmailId))) {
      this._notify.error('Please fill all valid email address');
      return;
    }
    this.emailSet.push({ Id: undefined, EmailId: '', IsPrimary: false, IsDeleted: false });
  }

  addMobile() {
    const mobileSet = this.mobileSet.filter(x => !x.IsDeleted);
    if (mobileSet.some(x => !x.MobileNumber.length || x.MobileNumber.length < 10)) {
      this._notify.error('Please fill all valid mobile numbers');
      return;
    }
    const mobile = /^\d+$/;
    if (mobileSet.some(x => !mobile.test(x.MobileNumber))) {
      this._notify.error('Please fill all valid mobile number');
      return;
    }
    this.mobileSet.push({
      Id: undefined, MobileNumber: '', IsPrimary: false, IsDeleted: false, isDisabled: false, tempId: this.mobileSet.length + 1,
      MobileType: "home"
    });
  }

  addAddress() {
    let isEmpty = false;
    const addressSet = this.addressSet.filter(x => !x.IsDeleted);
    addressSet.forEach(element => {
      if (!element.Address1 || !element.State || !element.City) {
        isEmpty = true;
      }
    });
    if (!isEmpty) {
      this.addressSet.push({ Id: undefined, Address1: '', State: undefined, City: undefined, PostCode: '', Country: undefined, IsPrimary: false, IsDeleted: false, AddressType: "Home" });
    } else {
      this._notify.error('Please fill all added address details');
    }
  }
}
