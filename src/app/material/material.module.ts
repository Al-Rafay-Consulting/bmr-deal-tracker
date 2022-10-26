
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper'
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
//import {MatListModule} from '@angular/material/list';
//import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatRadioModule} from '@angular/material/radio';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search'
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    //MatMomentDateModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatExpansionModule,        
    MatStepperModule,
    CdkTreeModule,
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    MatRadioModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatBottomSheetModule,
    MatCardModule
    //MatListModule
  ],
  exports:[
    CommonModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatStepperModule,
    CdkTreeModule,
    MatCheckboxModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    MatRadioModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatBottomSheetModule,
    MatCardModule
    //MatListModule
  ]
})
export class MaterialModule { }
