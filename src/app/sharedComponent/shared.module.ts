import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AutoCompleterModule, InputsModule, MDBBootstrapModulesPro, MdbSelectModule, NavbarModule, StickyHeaderModule, ToastModule } from 'ng-uikit-pro-standard';
import { AgmCoreModule } from '@agm/core';
import { NgxMaskModule } from 'ngx-mask';
import { ApplicationPipesModule } from '../Base/AppPipesModule';



@NgModule({
  declarations: [
    MyCalendarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatButtonModule,
    //BrowserAnimationsModule,
    FormsModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,
    HttpClientModule,
    //ToastModule.forRoot(),
    MdbSelectModule,    
    AutoCompleterModule, 
    InputsModule.forRoot(),   
    MDBBootstrapModulesPro.forRoot(),
    StickyHeaderModule, NavbarModule ,      
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2xuUVZ8yNmaUzm0wNNTmft9VGTWCZuNo'
    }),   
    NgxMaskModule.forRoot(),
    ApplicationPipesModule,
  ],
  exports:[
    MyCalendarComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule { }
