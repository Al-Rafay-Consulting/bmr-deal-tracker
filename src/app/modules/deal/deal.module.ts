import { NgModule, APP_INITIALIZER, NO_ERRORS_SCHEMA } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/material/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, AutoCompleterModule, InputsModule, MdbSelectModule, StickyHeaderModule, NavbarModule  } from 'ng-uikit-pro-standard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule, IConfig } from 'ngx-mask';
//import { MdbWysiwygModule } from 'mdb-wysiwyg'
//import { AngularEditorModule } from '@kolkov/angular-editor';


import { DealRoutingModule } from './deal-routing.module';
import { CommonModule } from '@angular/common';
import { UserProviderFactory } from 'src/app/app.component';
import { DealComponent } from './deal/deal.component';
//import { ClientNotesComponent } from './client-notes/client-notes/client-notes.component';
import { ApplicationPipesModule } from 'src/app/Base/AppPipesModule';
//import { ExportComponent } from 'src/app/Base/Export/export.component';
import { DealslistComponent } from './dealslist/dealslist.component';
import { DealportalComponent } from './dealportal/dealportal.component';

import { VendornotesComponent } from './vendor-notes/vendor-notes.component';
import { VendorNotesListComponent} from './vendor-notes-list/vendor-notes-list.component'
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SharedModule } from 'src/app/sharedComponent/shared.module';
import { DealcommentsquestionsComponent } from './dealcommentsquestions/dealcommentsquestions.component';
import { BmrnotesquestionsComponent } from './bmrnotesquestions/bmrnotesquestions.component';
import { DealcommentsquestionsListComponent } from './dealcommentsquestions-list/dealcommentsquestions-list.component';
import { BmrnotesquestionsListComponent } from './bmrnotesquestions-list/bmrnotesquestions-list.component';
import { DealcommentsrepliesComponent } from './dealcommentsreplies/dealcommentsreplies.component';
import { BmrnotesrepliesComponent } from './bmrnotesreplies/bmrnotesreplies.component';
import { DealReplyBottomSheetComponent } from './dealcommentsreplies/deal-reply-bottom-sheet/deal-reply-bottom-sheet.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BmrReplyBottomSheetComponent } from './bmrnotesreplies/bmr-reply-bottom-sheet/bmr-reply-bottom-sheet.component';
import { PercentDirective } from 'src/app/percent.directive';
import { InputRestrictionDirective } from 'src/app/input-restriction.directive';
import { PercentageDirective } from 'src/app/base/percentage.directive';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { GooglePlaceDirective } from 'src/app/google-place.directive';


@NgModule({
  declarations: [
      DealComponent,
      DealslistComponent,
      DealportalComponent,
      VendornotesComponent,
      VendorNotesListComponent,
      DealcommentsquestionsComponent,
      DealcommentsquestionsListComponent,
      DealcommentsrepliesComponent,
      DealReplyBottomSheetComponent,
      BmrnotesquestionsComponent,
      BmrnotesquestionsListComponent,
      BmrnotesrepliesComponent,
      BmrReplyBottomSheetComponent,
      PercentDirective,
      PercentageDirective,
      GooglePlaceDirective,
    ],
  imports: [
    CommonModule,
    DealRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    MatButtonModule,
    FormsModule,
    GooglePlaceModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,
    MdbSelectModule,
    AutoCompleterModule, InputsModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    StickyHeaderModule, NavbarModule ,
    AngularEditorModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2xuUVZ8yNmaUzm0wNNTmft9VGTWCZuNo'
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DataTablesModule,
    NgxMaskModule.forRoot(),
    ApplicationPipesModule,
    SharedModule
    //MdbWysiwygModule,
  ],
  entryComponents: [
   // ClientNotesComponent,
   VendornotesComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]

})
export class DealModule { }

