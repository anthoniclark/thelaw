import { Component, OnInit } from '@angular/core';
import { overlayConfigFactory } from 'ngx-modialog';
import { BSModalContext, Modal } from 'ngx-modialog/plugins/bootstrap';
import { SuggestionComponent } from 'app/components/suggestion/suggestion.component';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  constructor(private modal: Modal) { }

  ngOnInit() {
  }

  sendSuggestion() {
    this.modal.open(SuggestionComponent, overlayConfigFactory({}, BSModalContext));
  }
}
