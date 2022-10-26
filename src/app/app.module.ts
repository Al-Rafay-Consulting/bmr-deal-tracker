import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material/material.module'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule, RoutingComponent, EntryComponent } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AppComponent, UserProviderFactory } from './app.component';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, ToastModule, AutoCompleterModule, InputsModule, MdbSelectModule, StickyHeaderModule, NavbarModule  } from 'ng-uikit-pro-standard';
import { GeneralService } from './services/general.service';
import { GenericService } from './services/generic.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ConfirmDialogeComponent } from './confirm-dialoge/confirm-dialoge.component';

import { CommonService } from './Base/Common.service';
import { MatButtonModule } from '@angular/material/button';
import { MessageDialogeComponent } from './message-dialoge/message-dialoge.component';
import { SptermsetService } from './services/sptermset.service';
import { SortPipe } from './Base/SortPipe';
import { UserService } from './Base/User/user.service';
import { RBACModuleAccessDirective } from './base/rbacmodule-access.directive';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ApplicationPipesModule } from './Base/AppPipesModule';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AuthGuardServiceService } from './Base/AuthGuard/auth-guard-service.service';
import { PageNotFoundComponent } from './Base/AuthGuard/page-not-found/page-not-found.component';
import { NoPageAccessComponent } from './Base/AuthGuard/no-page-access/no-page-access.component';
import {MatStepperModule} from '@angular/material/stepper';
import {CanlendarAvailComponent} from 'src/app/canlendar-avail/canlendar-avail.component';
import { MyCalendarComponent } from './sharedComponent/my-calendar/my-calendar.component'
import { SharedModule } from './sharedComponent/shared.module';
import { GooglePlaceDirective } from './google-place.directive';

//import { MdbWysiwygModule } from 'mdb-wysiwyg'
//import { AngularEditorModule } from '@kolkov/angular-editor';



import { StimulsoftViewerModule } from 'stimulsoft-viewer-angular';


//import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;



@NgModule({
  declarations: [
    AppComponent,
    RoutingComponent,
    ConfirmDialogeComponent,
    MessageDialogeComponent,
    RBACModuleAccessDirective,
    PageNotFoundComponent,
    NoPageAccessComponent,
    CanlendarAvailComponent
    //ExportComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MaterialModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    MatStepperModule,
   CalendarModule.forRoot({
     provide: DateAdapter,
     useFactory: adapterFactory,
   }),
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,
    HttpClientModule,
    ToastModule.forRoot(),
    MdbSelectModule,
    AutoCompleterModule, InputsModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    StickyHeaderModule, NavbarModule ,
    DataTablesModule,
    //MdbWysiwygModule,
   //AngularEditorModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2xuUVZ8yNmaUzm0wNNTmft9VGTWCZuNo'
    }),
    NgxMaskModule.forRoot(),
    ApplicationPipesModule,
    AppRoutingModule,
    SharedModule,

    StimulsoftViewerModule 
    //NgxMatColorPickerModule
  ],

  entryComponents: [EntryComponent],
  providers: [
    MDBSpinningPreloader,
    GeneralService,
    GenericService,
    CommonService,
    SptermsetService,
    UserService,
    SortPipe,
    { provide: APP_INITIALIZER, useFactory: UserProviderFactory, deps: [UserService], multi: true, },
    AuthGuardServiceService,

    // {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }

// "baseUrl":"http://localhost:8100"
// "baseUrl":"https://alrafayconsulting.sharepoint.com"
