import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RbacUsersComponent } from './rbacUser/rbac-users/rbac-users.component';
import { RbacUsersListComponent } from './rbacUser/rbac-users-list/rbac-users-list.component';
import { RbacGroupComponent } from './rbacGroup/rbac-group/rbac-group.component';
import { RbacGroupListComponent } from './rbacGroup/rbac-group-list/rbac-group-list.component';
import { RbacUserGroupComponent } from './rbacUserGroup/rbac-user-group/rbac-user-group.component';
import { RbacUserGroupListComponent } from './rbacUserGroup/rbac-user-group-list/rbac-user-group-list.component';
import { RbacPermissionComponent } from './rbacPermission/rbac-permission/rbac-permission.component';
import { RBACPermissionListComponent } from './rbacPermission/rbacpermission-list/rbacpermission-list.component';


const routes: Routes = [  
    { 
      path: 'rbacusers/form', component: RbacUsersComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Users"} 
    },
    { 
      path: 'rbacuser/list', component: RbacUsersListComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Users"} 
    },
    { 
      path: 'rbacgroup/form', component: RbacGroupComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Group"} 
    },
    { 
      path: 'rbacgroup/list', component: RbacGroupListComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Group"} 
    },
    // { 
    //   path: 'rbacusergroup/form', component: RbacUserGroupComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Client"} 
    // },
    // { 
    //   path: 'rbacusergroup/list', component: RbacUserGroupListComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Client"} 
    // },
    { 
      path: 'rbacpermission/form', component: RbacPermissionComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Permission"} 
    },
    { 
      path: 'rbacpermission/list', component: RBACPermissionListComponent, runGuardsAndResolvers: 'always' , data: {sectionName: "Permission"} 
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RBACRoutingModule { }