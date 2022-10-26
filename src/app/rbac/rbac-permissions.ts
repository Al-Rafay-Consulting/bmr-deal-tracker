import { RBAC_Permissions_Module } from '../rbac/rbac-permissions-module';

export class RBACPermissions {
    ID: number = 0;   
    GroupId: number = null;
    CreatedDate: Date = null;
    CreatedBy: number = null;
    ModifiedDate: Date = null;
    ModifiedBy: number = null;
    RBAC_Permissions_Module:RBAC_Permissions_Module[] = [];
}
