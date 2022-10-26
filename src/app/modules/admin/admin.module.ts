import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS  } from '@angular-material-components/color-picker'
//Components

import { ViewsComponent } from './views/views.component';
import { ApplicationPipesModule } from 'src/app/Base/AppPipesModule';
import { MarketComponent } from './market/market.component';
import { MarketlistComponent } from './market/marketlist/marketlist.component';

import { SubmarketComponent } from './submarket/submarket.component';
import { SubmarketlistComponent } from './submarket/submarketlist/submarketlist.component';

import { StatusComponent } from './status/status.component';
import { StatuslistComponent } from './status/statuslist/statuslist.component';

import { DealtypeComponent } from './dealtype/dealtype.component';
import { DealtypelistComponent } from './dealtype/dealtypelist/dealtypelist.component';

import { ProjecttypeComponent } from './projecttype/projecttype.component';
import { ProjecttypelistComponent } from './projecttype/projecttypelist/projecttypelist.component';

import { DealgroupComponent } from './dealgroup/dealgroup.component';
import { DealgrouplistComponent } from './dealgroup/dealgrouplist/dealgrouplist.component';

import { BrokerageComponent } from './brokerage/brokerage.component';
import { BrokeragelistComponent } from './brokerage/brokeragelist/brokeragelist.component';

import { ManagementprocessComponent } from './managementprocess/managementprocess.component';
import { ManagementprocesslistComponent } from './managementprocess/managementprocesslist/managementprocesslist.component';
import { BrokerComponent } from './broker/broker.component';
import { BrokerlistComponent } from './broker/brokerlist/brokerlist.component';

import { StateComponent } from './state/state.component';
import { StatelistComponent } from './state/statelist/statelist.component';

import { FootnotesComponent } from './footnotes/footnotes.component';
import { FootnoteslistsComponent } from './footnotes/footnoteslists/footnoteslists.component';

import { ResposiblepartyComponent } from './resposibleparty/resposibleparty.component';
import { ResposiblepartylistComponent } from './resposibleparty/resposiblepartylist/resposiblepartylist.component';
import { CategorizationComponent } from './categorization/categorization.component';
import { CategorizationlistComponent } from './categorization/categorizationlist/categorizationlist.component';




@NgModule({
  declarations: [
    ViewsComponent, MarketComponent, SubmarketComponent, StatusComponent, 
    DealtypeComponent, ProjecttypeComponent, DealgroupComponent, DealgrouplistComponent, 
    DealtypelistComponent, MarketlistComponent, ProjecttypelistComponent, 
    StatuslistComponent, 
    SubmarketlistComponent, 
    BrokerageComponent, 
    BrokeragelistComponent, 
    ManagementprocessComponent, 
    ManagementprocesslistComponent, 
    BrokerComponent, 
    BrokerlistComponent, 
    StateComponent, StatelistComponent, 
    FootnotesComponent, 
    FootnoteslistsComponent, 
    ResposiblepartyComponent, 
    ResposiblepartylistComponent, CategorizationComponent, CategorizationlistComponent
    ],
  imports: [
    CommonModule,
    AdminRoutingModule,       
    ReactiveFormsModule,
    MaterialModule,
    MatButtonModule,   
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,        
    MdbSelectModule,    
    AutoCompleterModule, 
    InputsModule.forRoot(),   
    MDBBootstrapModulesPro.forRoot(),
    //StickyHeaderModule, NavbarModule ,        
    AgmCoreModule.forRoot({
      apiKey: 'Your_api_key'
    }),
    DataTablesModule,
    NgxMaskModule.forRoot(),
    NgxMatColorPickerModule,
    ApplicationPipesModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
   ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    
  ],
})
export class AdminModule { }
