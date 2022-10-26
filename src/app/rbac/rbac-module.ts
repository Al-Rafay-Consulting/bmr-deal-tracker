import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
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
import { RBACRoutingModule } from './rbac-routing.module';
import { CommonModule } from '@angular/common';

//Components
import { RbacUsersComponent } from './rbacUser/rbac-users/rbac-users.component';
import { RbacUsersListComponent } from './rbacUser/rbac-users-list/rbac-users-list.component';
import { RbacGroupComponent } from './rbacGroup/rbac-group/rbac-group.component';
import { RbacGroupListComponent } from './rbacGroup/rbac-group-list/rbac-group-list.component';
import { RbacUserGroupComponent } from './rbacUserGroup/rbac-user-group/rbac-user-group.component';
import { RbacUserGroupListComponent } from './rbacUserGroup/rbac-user-group-list/rbac-user-group-list.component';
import { RbacPermissionComponent } from './rbacPermission/rbac-permission/rbac-permission.component';
import { RBACPermissionListComponent } from './rbacPermission/rbacpermission-list/rbacpermission-list.component';





@NgModule({
  declarations: [
    RbacUsersComponent,    
    RbacUsersListComponent,
    RbacGroupComponent,
    RbacGroupListComponent,
    RbacUserGroupComponent,
    RbacUserGroupListComponent,
    RbacPermissionComponent,
    RBACPermissionListComponent
    ],
  imports: [
    CommonModule,
    RBACRoutingModule,       
    ReactiveFormsModule,
    MaterialModule,
    MatButtonModule,   
    FormsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxMaterialTimepickerModule,        
    MdbSelectModule,    
    AutoCompleterModule, InputsModule.forRoot(),   
    MDBBootstrapModulesPro.forRoot(),
    StickyHeaderModule, NavbarModule ,        
    AgmCoreModule.forRoot({
      apiKey: 'Your_api_key'
    }),
    DataTablesModule,
    NgxMaskModule.forRoot()
  ]

})
export class RBACModule { }
