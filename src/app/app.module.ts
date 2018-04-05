import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ResponseInterceptor } from 'app/lib/http/response-interceptor';
import { routing } from 'app/app.routing';

// Service imports
import { CommonService } from 'app/shared/services/common.service';
import { AuthService } from 'app/shared/services/auth.service';
import { HttpClientService } from 'app/lib/http/http-client.service';
import { NotificationService } from './shared/services/notification.service';

// Modal popup
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule, Modal } from 'ngx-modialog/plugins/bootstrap';

// toastr module
import { ToastModule } from 'ng2-toastr/ng2-toastr';

// datatable module
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// perfect scroll module
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// Guard imports
import { SkipLoginGuard } from 'app/guards/skip-login.guard';
import { AuthGuard } from 'app/guards/auth.guard';

// Module imports
import { SharedModule } from 'app/shared/shared.module';

// Component imports
import { AppComponent } from './app.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BlankLayoutComponent } from './containers/blank-layout/blank-layout.component';


import { SidebarComponent } from './containers/layout/components/sidebar/sidebar.component';
import { NavbarComponent } from './containers/layout/components/navbar/navbar.component';
import { FooterComponent } from 'app/containers/layout/components/footer/footer.component';
import { HeaderComponent } from 'app/containers/layout/components/header/header.component';
import { SuggestionComponent } from './components/suggestion/suggestion.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    NotFoundComponent,
    BlankLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    SuggestionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    routing,
    FormsModule,
    ToastModule.forRoot(),
    PerfectScrollbarModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  providers: [
    CommonService,
    AuthService,
    HttpClientService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    SkipLoginGuard,
    AuthGuard,
    NotificationService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    Modal
  ],
  entryComponents: [SuggestionComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
