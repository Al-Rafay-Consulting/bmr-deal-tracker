import { ConfFilters } from './conf-filters.model'
import { LoginUser } from '../Base/User/login-user';


export class FilterBL{

    private sectionName:string = null;
    obj_confFilters:ConfFilters[] = [];
    oldObj_confFilters:ConfFilters[] = [];

    constructor(_sectionName:string){
        this.sectionName = _sectionName;
    }

    addFilterObject(fieldName:string, defaultValues:any){
        var obj = new ConfFilters();        
        obj.SectionName = this.sectionName;
        obj.FieldName = fieldName;
        obj.DefaultValues = defaultValues;
        obj.ID = this.getObjectID(fieldName);
        obj.UserID = LoginUser.loggedinUser.UserID;
        this.obj_confFilters.push(obj);
    }

    addFilterObjectArray(fieldName:string, defaultValues:any[]){
        var obj = new ConfFilters();        
        obj.SectionName = this.sectionName;
        obj.FieldName = fieldName;        
        obj.DefaultValues = '';
        defaultValues.forEach(element => obj.DefaultValues += element.toString() + ';') 
        if(String(obj.DefaultValues).length > 0)
            obj.DefaultValues = String(obj.DefaultValues).substring(0, String(obj.DefaultValues).length - 1)

        obj.ID = this.getObjectID(fieldName);       
        obj.UserID = LoginUser.loggedinUser.UserID;       
        this.obj_confFilters.push(obj);
    }
   
    getObjectID(fieldName:string):number{
        if(this.oldObj_confFilters.length > 0)
        {
            var ObjExists = this.oldObj_confFilters.filter(x => x.FieldName == fieldName);
            if (ObjExists.length > 0)
                return ObjExists[0].ID;
            else
                return 0;
        }

        return 0;
    }
}