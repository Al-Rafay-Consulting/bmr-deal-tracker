import { RBAC_Users_Groups } from './rbac-users-groups';

export class RbacUsers{

    ID: number = 0;
    FirstName: string = null;
    LastName: string = null;    
    UserId: number = null;
    Inactive: boolean = false;
    CreatedBy: number = null;
    CreatedDate: Date = null;
    ModifiedBy: number = null;
    ModifiedDate: Date = null;
    IsDeleted:boolean=null;
    IsSystemGenerated:boolean=null;
    Password:string=null;
    RBAC_Users_Groups: RBAC_Users_Groups[] = [];
}

