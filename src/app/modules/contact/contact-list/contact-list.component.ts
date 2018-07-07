import { Component, OnInit } from '@angular/core';
import { ContactService } from 'app/modules/contact/contact.service';
import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html'
})
export class ContactListComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = false;
  reorderable: boolean = true;

  constructor(private contactService: ContactService, public router: Router, private _notify: NotificationService) { }

  ngOnInit() {
    // this.contactService.getContacts().subscribe(
    //   response => {
    //     this.rows = response;
    //   }, err => {
    //     this._notify.error(err.Result);
    //   });
  }
}
