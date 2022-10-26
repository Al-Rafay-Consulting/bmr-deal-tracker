import { CurrentUser } from './user.model';
import { VWRBACGetUserPermissions } from '../../rbac/vw-rbac-get-user-permissions';
import { UserModuleAccess } from '../models/user-module-access';

export class LoginUser {
    public static loggedinUser: CurrentUser =  new CurrentUser();
    public static IsAdmin:boolean = false;    
    public static getModulesAccess: any[] =[];
    public static getSectionAccess: any[] =[];
    public static getActionAccess: any[] =[];
    public static UserPermissions:VWRBACGetUserPermissions[] = [];
    public static userRole:string = "";
    constructor(){
                        
    }
}
