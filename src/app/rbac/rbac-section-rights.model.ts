import { RBAC_Rights } from '../rbac/rbac-rights.model';

export class RBAC_SectionRights {
    ID: number = 0;
    SectionID: number = null;
    RightsID: number = null;
    RBAC_Rights:RBAC_Rights= new RBAC_Rights();
    
}