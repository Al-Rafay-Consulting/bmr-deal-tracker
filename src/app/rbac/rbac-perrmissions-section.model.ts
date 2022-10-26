import { RBAC_Permissions_Details } from '../rbac/rbac-permissions-details';

export class RBAC_Permissions_Section {
    ID:number = 0;
    PermissionModuleID:number = null;
    SectionID:number = null;
    IsVisible:boolean = null;
    CreatedBy:number = null;
    CreatedDate :Date= null;
    ModifiedBy :number = null;
    ModifiedDate :Date= null;
    RBAC_Permissions_Details:RBAC_Permissions_Details[]=[];
}

