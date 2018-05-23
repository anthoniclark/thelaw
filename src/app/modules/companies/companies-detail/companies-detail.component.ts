import { Component, OnInit } from '@angular/core';
import { Company, Contacts } from '../../../models/companies';
import { CompaniesService } from '../companies.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NoImagePath } from '../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'ngx-modialog/plugins/bootstrap';
import { ContactService } from '../../contact/contact.service';
import { Mobile, Email, Address } from 'app/models/contact';

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
  emailSet = [{ Id: undefined, EmailId: '', IsPrimary: true, IsDeleted: false, IsActive: true }];
  mobileSet = [{ Id: undefined, MobileNumber: '', IsPrimary: true, IsDeleted: false, isDisabled: false, tempId: 1, MobileType: "home", IsActive: true }];
  addressSet = [{ Id: undefined, Address1: '', State: undefined, City: undefined, PostCode: '', Country: undefined, IsPrimary: true, IsDeleted: false, AddressType: "Home", ContactId: undefined, IsActive: true }];
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
        if (response.MobileNumbers.length) {
          this.mobileSet = [];
          response.MobileNumbers.forEach((element, index) => {
            this.mobileSet.push({
              Id: element.Id, IsDeleted: false, isDisabled: !element.IsPrimary, MobileNumber: element.MobileNumber, MobileType:
                element.MobileType, IsPrimary: element.IsPrimary, tempId: index + 1, IsActive: true
            });
          });
        }

        if (response.EmailAddress.length) {
          this.emailSet = [];
          response.EmailAddress.forEach((element, index) => {
            this.emailSet.push({
              Id: element.Id, IsDeleted: false, IsPrimary: element.IsPrimary,
              EmailId: element.EmailId, IsActive: true
            });
          });
        }
        if (response.Address.length) {
          this.addressSet = [];
          response.Address.forEach((element, index) => {
            this.addressSet.push({
              Id: element.Id,
              Address1: element.Address1,
              IsPrimary: element.IsPrimary,
              State: element.State,
              AddressType: element.AddressType,
              PostCode: element.PostCode,
              ContactId: element.ContactId,
              IsDeleted: false,
              Country: element.CountryId,
              City: element.CityId,
              IsActive: true
            });
          });
        }
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
    if (!this.validateEmail() || !this.validateMobile() || !this.validateAddress()) {
      return false;
    }
    this.model.MobileNumbers = [];
    this.model.EmailAddress = [];
    this.model.Address = [];
    this.mobileSet.forEach(mobileset => {
      if (mobileset.IsDeleted) {
        if (mobileset.Id)
          this.contactService.deleteMobile(mobileset.Id).subscribe(res => { });
      } else {
        const mobileModel: Mobile = {
          Id: mobileset.Id,
          MobileNumber: mobileset.MobileNumber,
          IsPrimary: mobileset.IsPrimary,
          MobileType: mobileset.MobileType,
          ContactId: this.paramId === 'new' ? undefined : +this.paramId,
          CompanyId: this.paramId === 'new' ? undefined : +this.paramId,
          IsActive: true
        }
        if (mobileModel.MobileNumber) {
          this.model.MobileNumbers.push(mobileModel);
        }
      }
    });

    this.emailSet.forEach(email => {
      if (email.IsDeleted) {
        if (email.Id)
          this.contactService.deleteEmail(email.Id).subscribe(res => { });
      } else {
        const emailModel: Email = {
          Id: email.Id,
          EmailId: email.EmailId,
          IsPrimary: email.IsPrimary,
          ContactId: this.paramId === 'new' ? undefined : +this.paramId,
          IsActive: true
        }
        if (emailModel.EmailId) {
          this.model.EmailAddress.push(emailModel);
        }
      }
    });

    this.addressSet.forEach(address => {
      if (address.IsDeleted) {
        if (address.Id)
          this.contactService.deleteAddress(address.Id).subscribe(res => { });
      } else {
        const addressModel: Address = {
          Id: address.Id,
          Address1: address.Address1,
          IsPrimary: address.IsPrimary,
          State: address.State,
          AddressType: address.AddressType,
          CityId: address.City,
          CountryId: address.Country,
          PostCode: address.PostCode,
          ContactId: this.paramId === 'new' ? undefined : +this.paramId,
          IsActive: true
        }
        this.model.Address.push(addressModel);
      }
    });

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
      if (error.status == 400) {
        this._notify.error(error.error.ErrorMessage[0]);
        return;
      }
      this._notify.error(error);
    });
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
    if (this.validateEmail()) {
      this.emailSet.push({ Id: undefined, EmailId: '', IsPrimary: false, IsDeleted: false, IsActive: true });
    }
  }

  validateEmail() {
    const emailAddress = this.emailSet.filter(x => !x.IsDeleted);
    if (emailAddress.some(x => !x.EmailId.length)) {
      this._notify.error('Please fill all email address');
      return false;
    }
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
    if (emailAddress.some(x => !email.test(x.EmailId))) {
      this._notify.error('Please fill all valid email address');
      return false;
    }
    return true;
  }

  addMobile() {
    if (this.validateMobile) {
      const isPrimary = this.mobileSet.some(x => x.IsPrimary === true);
      this.mobileSet.push({
        Id: undefined, MobileNumber: '', IsPrimary: false, IsDeleted: false, isDisabled: isPrimary, tempId: this.mobileSet.length + 1,
        MobileType: "home", IsActive: true
      });
    }
  }

  validateMobile() {
    const mobileSet = this.mobileSet.filter(x => !x.IsDeleted);
    if (mobileSet.some(x => !x.MobileNumber.length || x.MobileNumber.length < 10)) {
      this._notify.error('Please fill all valid mobile numbers');
      return false;
    }
    const mobile = /^\d+$/;
    if (mobileSet.some(x => !mobile.test(x.MobileNumber))) {
      this._notify.error('Please fill all valid mobile number');
      return false;
    }
    return true;
  }

  addAddress() {
    if (this.validateAddress()) {
      this.addressSet.push({
        Id: undefined, Address1: '', State: undefined, City: undefined, PostCode: '',
        Country: undefined, IsPrimary: false, IsDeleted: false, AddressType: "Home", ContactId: undefined, IsActive: true
      });
    } else {

    }
  }

  validateAddress() {
    let isEmpty = false;
    const addressSet = this.addressSet.filter(x => !x.IsDeleted);
    addressSet.forEach(element => {
      if (!element.Address1 || !element.State || !element.City) {
        isEmpty = true;
      }
    });
    if (isEmpty) {
      this._notify.error('Please fill all added address details');
      return false;
    }
    return true;
  }

  CountryChanges(countryId: number) {
    this.contactService.getStates(countryId).subscribe(res => {
      this.states = res;
    });
  }

  StateChanges(stateId: number) {
    this.contactService.getCities(stateId).subscribe(res => {
      this.cities = res;
    });
  }

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  changeIsPrimary(data: any) {
    if (!data.IsPrimary) {
      this.mobileSet.forEach(x => x.isDisabled = false);
    } else {
      this.mobileSet.filter(x => x.tempId !== data.tempId).forEach(y => y.isDisabled = true);
    }
  }

}
