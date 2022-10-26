// application-pipes.module.ts
// other imports
//import { CommonModule } from '@angular/common';
import { MDBSpinningPreloader, MDBBootstrapModulesPro, AutoCompleterModule, InputsModule, MdbSelectModule, StickyHeaderModule, NavbarModule  } from 'ng-uikit-pro-standard';
import { SortPipe } from './SortPipe';
import { FilterPipe } from './FilterPipe';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatInputCommifiedDirective } from './mat-input-commified.directive';
import { MatInputCurrencyDirective } from './mat-input-currency.directive';
import { PhoneMaskDirective } from './phone-mask.directive';
import { MobileMaskDirective } from './mobile-mask.directive';
import { NumberDirective } from './number.directive';
import { ExportComponent } from 'src/app/Base/Export/export.component';

import { TableBottomAreaComponent } from 'src/app/modules/shared/table-bottom-area/table-bottom-area.component';
//import { ClientNotesListComponent } from 'src/app/modules/shared/client-notes-list/client-notes-list.component';
//import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // dep modules    
    //CommonModule    
    AutoCompleterModule, InputsModule.forRoot(),   
    MDBBootstrapModulesPro.forRoot(), 
  ],
  declarations: [ 
    ExportComponent,
    TableBottomAreaComponent,
    MatInputCommifiedDirective,
    MatInputCurrencyDirective,
    FilterPipe,
    SortPipe,
    PhoneMaskDirective,
    MobileMaskDirective,
    NumberDirective
  ],
  exports: [
    ExportComponent,
    TableBottomAreaComponent,
    FilterPipe,
    SortPipe,
    MatInputCommifiedDirective,
    MatInputCurrencyDirective,
    PhoneMaskDirective,
    MobileMaskDirective,
    NumberDirective,
    //CommonModule,
    //FormsModule
    
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ApplicationPipesModule {}