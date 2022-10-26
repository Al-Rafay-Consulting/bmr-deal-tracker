import { RBAC_SectionRights } from '../rbac/rbac-section-rights.model';

export class RBAC_Sections {
    ID: number = 0;
    ModuleId: number = null;
    SectionName: string = null;
    RBAC_SectionRights:RBAC_SectionRights[] = [];
}