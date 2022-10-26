import { RBAC_Permissions_Section } from '../rbac/rbac-perrmissions-section.model';

export class RBAC_Permissions_Module {
    ID:number = 0;
    PermissionID:number = null;
    ModuleID:number = null;
    IsVisible:boolean = null;
    CreatedBy:number = null;
    CreatedDate :Date= null;
    ModifiedBy :number = null;
    ModifiedDate :Date= null;
    RBAC_Permissions_Section:RBAC_Permissions_Section[]=[];
}



 