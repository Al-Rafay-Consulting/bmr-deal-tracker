import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service'
import { RbacUsers } from '../../rbac-users.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BLBase } from 'src/app/Base/BLBase/BLBase.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { GeneralService } from 'src/app/services/general.service';
import { RBACGroups } from '../../rbac-groups';
import { RBAC_Users_Groups } from '../../rbac-users-groups';
import { RBACPermissions } from '../../rbac-permissions';
import { RBAC_Sections } from '../../rbac-sections.model';
import { ThemePalette } from '@angular/material/core';
import { RBAC_Permissions_Module } from '../../rbac-permissions-module';
import { RBAC_Permissions_Section } from '../../rbac-perrmissions-section.model';
import { RBAC_Permissions_Details } from '../../rbac-permissions-details';
import { RBACModules } from '../../rbac-modules';
import { CommonService } from '../../../Base/Common.service';
import { EnRights } from 'src/app/Enum/Enums';


@Component({
  selector: 'app-rbac-permission',
  templateUrl: './rbac-permission.component.html',
  styleUrls: ['./rbac-permission.component.scss']
})
export class RbacPermissionComponent extends BLBase<RBACPermissions> implements OnInit {


  public rbacgroups: RBACGroups[] = [];
  public vw_GetModuleAndSectionData: VW_GetModuleAndSectionData[] = [];
  public vw_Modules: VW_Modules[] = [];
  public IsAdmin: boolean = false;


  constructor(
    public service: GenericService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,
    public sp: SPOperationsService,
    public messageDialog: MessageDialogeService,
    public genService: GeneralService,
    public common:CommonService
  ) {

    super(service, router, route, spinner, toast, dialog, messageDialog);
    this.formTitle = "Permission";
    this.addControllerName("RBAC_Permissions");
    this.filterOnGet = "?$select=*&$expand=RBAC_Permissions_Module($expand=RBAC_Permissions_Section($expand=RBAC_Permissions_Details))";


  }

  public Initializeobject() {
    this.formData = new RBACPermissions();
  }

  ngOnInit(): void {

    super.ngOnInit();
    this.GetAllGroups();

    if (this.primaryKey == 0)
      this.GetModuleAndSectionData();

  }

  async GetModuleAndSectionData() {

    await this.genService.GetDataByQuery("RBAC_Modules?$expand=RBAC_Sections($expand=RBAC_SectionRights($expand=RBAC_Rights))").then(res => {
      //this.vw_GetModuleAndSectionData = res['value'] as VW_GetModuleAndSectionData[];
      //this.vw_Modules = res['value'] as VW_Modules[] ;

      var dataModules = res['value'] as RBACModules[];

      for (let index = 0; index < dataModules.length; index++) {

        const elementModule = dataModules[index];
        var new_VW_Modules = new VW_Modules();

        new_VW_Modules.ID = elementModule.ID;
        new_VW_Modules.ModuleName = elementModule.ModuleName;



        for (let index = 0; index < elementModule.RBAC_Sections.length; index++) {

          const elementSection = elementModule.RBAC_Sections[index];
          var rbac_Sections = new VW_RBAC_Sections();

          rbac_Sections.ID = elementSection.ID;
          rbac_Sections.SectionName = elementSection.SectionName;
          rbac_Sections.ModuleId = elementSection.ModuleId;


          for (let index = 0; index < elementSection.RBAC_SectionRights.length; index++) {

            const elementSectionRights = elementSection.RBAC_SectionRights[index];
            var new_vw_RBAC_SectionRight = new VW_RBAC_SectionRights();

            new_vw_RBAC_SectionRight.ID = elementSectionRights.ID;
            new_vw_RBAC_SectionRight.ModuleId = elementSection.ModuleId;
            new_vw_RBAC_SectionRight.RightsID = elementSectionRights.RightsID;
            new_vw_RBAC_SectionRight.SectionID = elementSectionRights.SectionID
            new_vw_RBAC_SectionRight.RBAC_Rights = elementSectionRights.RBAC_Rights;

            rbac_Sections.RBAC_SectionRights.push(new_vw_RBAC_SectionRight);
          }

          new_VW_Modules.RBAC_Sections.push(rbac_Sections);

        }

        this.vw_Modules.push(new_VW_Modules);
      }
    })
  }

  AfterDisplay() {

    this.GetModuleAndSectionData().then(res => {

      this.formData.RBAC_Permissions_Module.forEach(element => {

        var vwModule = this.vw_Modules.filter(function (x) {
          return x.ID == element.ModuleID
        })

        if (vwModule.length > 0) {

          vwModule[0].Module_PrimaryKey = element.ID;
          vwModule[0].HasAccess = element.IsVisible;
          vwModule[0].PermissionId = element.PermissionID


          for (let indexPS = 0; indexPS < element.RBAC_Permissions_Section.length; indexPS++) {
            const elementPS = element.RBAC_Permissions_Section[indexPS];

            if (vwModule[0].RBAC_Sections.length > 0) {
              var vwRbacSection = vwModule[0].RBAC_Sections.filter(function (x) {
                return x.ID == elementPS.SectionID;
              })

              if (vwRbacSection.length > 0) {
                vwRbacSection[0].completed = elementPS.IsVisible;
                vwRbacSection[0].Section_PrimaryKey = elementPS.ID;
                vwRbacSection[0].PermissionModuleID = elementPS.PermissionModuleID;

                for (let indexPD = 0; indexPD < elementPS.RBAC_Permissions_Details.length; indexPD++) {
                  const elementPD = elementPS.RBAC_Permissions_Details[indexPD];

                  var vwRights = vwRbacSection[0].RBAC_SectionRights.filter(function (z) {
                    return z.RightsID == elementPD.RightsID;
                  })
                  
                  if (vwRights.length > 0) {
                    vwRights[0].PermissionDetail_PrimaryKey = elementPD.ID;
                    vwRights[0].completed = elementPD.HasPermission;
                    vwRights[0].PermissionSectionID = elementPD.PermissionSectionID;
                  }

                }

              }

              this.updateAllComplete(vwRbacSection[0]);

            }
          }      
        }

      })

    }, error => {

    });

    this.HideSpinner();

  }


  GetAllGroups() {

    this.ShowSpinner();

    this.genService.GetDataByQuery("RBAC_Groups?$filter=IsAdmin ne true").then(res => {
      this.rbacgroups = res['value'] as RBACGroups[];
    })

  }

  OnUserChange() {
    //  var ID =  this.formData.ID;
    //  var selectedUser = this.rbacusers.filter(function(x){
    //    return x.ID == ID;
    //  })

    //  if(selectedUser.length > 0 )
    //  {
    //    this.formData.UserId = selectedUser[0].UserId; 
    //    this.formData.FirstName = selectedUser[0].FirstName; 
    //    this.formData.LastName = selectedUser[0].LastName;        
    //  }
  }


  onCreate(form: NgForm) {
    this.router.navigate(['/rbac/rbacpermission/form'], { replaceUrl: true });
    this.Create();

  }

  BeforeUpsert(form: NgForm) {

    // var rbac_Permissions_Module: RBAC_Permissions_Module[] = [];

    // for (let indexModule = 0; indexModule < this.vw_Modules.length; indexModule++) {
    //   const elementModule = this.vw_Modules[indexModule];

    //   var permissions_Module = new RBAC_Permissions_Module();

    //   permissions_Module.ID = elementModule.Module_PrimaryKey;
    //   permissions_Module.PermissionID = this.formData.ID;
    //   permissions_Module.ModuleID = elementModule.ID;
    //   permissions_Module.IsVisible = elementModule.HasAccess;



    //   for (let indexSection = 0; indexSection < elementModule.RBAC_Sections.length; indexSection++) {
    //     const elementSection = elementModule.RBAC_Sections[indexSection];

    //     var permisssion_Section = new RBAC_Permissions_Section();
    //     permisssion_Section.ID = elementSection.Section_PrimaryKey;
    //     permisssion_Section.IsVisible = elementSection.completed;
    //     permisssion_Section.SectionID = elementSection.ID;
    //     permisssion_Section.PermissionModuleID = elementModule.Module_PrimaryKey;


    //     const elementSectionRights = elementModule.RBAC_Sections[indexSection].RBAC_SectionRights;

    //     for (let index = 0; index < elementSectionRights.length; index++) {
    //       const elementSR = elementSectionRights[index];

    //       var permissions_Details = new RBAC_Permissions_Details();
    //       permissions_Details.ID = elementSR.PermissionDetail_PrimaryKey;
    //       permissions_Details.PermissionSectionID = elementSection.Section_PrimaryKey;
    //       permissions_Details.RightsID = elementSR.RightsID;
    //       permissions_Details.HasPermission = elementSR.completed;

    //       permisssion_Section.RBAC_Permissions_Details.push(permissions_Details);

    //     }

    //     permissions_Module.RBAC_Permissions_Section.push(permisssion_Section);

    //   }

    //   rbac_Permissions_Module.push(permissions_Module);
    // }


    // form.value.RBAC_Permissions_Module = rbac_Permissions_Module;

  }


  onSubmit(form: NgForm) {

    this.ShowSpinner();

    if (this.primaryKey == 0) {
      this.service.getDataByQuery(this.controllerName,"?$filter= GroupID eq " + this.formData.GroupId).then(res => {

        if (res.length == 0) {
          this.insertRecord(form);
        }
        else {
          this.HideSpinner();
          this.messageDialog.openMessageDialog("This group is already exists.");
          return;
        }

      })
    }
    else {
      
      //form.value.ID = this.primaryKey;
      this.insertRecord(form);
    }
  }


  BeforeUpsertSection(form: NgForm, vwModule:VW_Modules) {

    var rbac_Permissions_Module: RBAC_Permissions_Module[] = [];

    const elementModule = vwModule;

    var permissions_Module = new RBAC_Permissions_Module();

    permissions_Module.ID = elementModule.Module_PrimaryKey;
    permissions_Module.PermissionID = this.primaryKey;//this.formData.ID;
    permissions_Module.ModuleID = elementModule.ID;
    permissions_Module.IsVisible = elementModule.HasAccess;


    for (let indexSection = 0; indexSection < elementModule.RBAC_Sections.length; indexSection++) {
      const elementSection = elementModule.RBAC_Sections[indexSection];

      var permisssion_Section = new RBAC_Permissions_Section();
      permisssion_Section.ID = elementSection.Section_PrimaryKey;
      permisssion_Section.IsVisible = elementSection.completed;
      permisssion_Section.SectionID = elementSection.ID;
      permisssion_Section.PermissionModuleID = elementModule.Module_PrimaryKey;

      const elementSectionRights = elementModule.RBAC_Sections[indexSection].RBAC_SectionRights;

      for (let index = 0; index < elementSectionRights.length; index++) {
        
        this.OnRightChange(elementSection, elementSectionRights[index], true)

        const elementSR = elementSectionRights[index];

        var permissions_Details = new RBAC_Permissions_Details();
        permissions_Details.ID = elementSR.PermissionDetail_PrimaryKey;
        permissions_Details.PermissionSectionID = elementSection.Section_PrimaryKey;
        permissions_Details.RightsID = elementSR.RightsID;
        permissions_Details.HasPermission = elementSR.completed;

        permisssion_Section.RBAC_Permissions_Details.push(permissions_Details);

      }

      permissions_Module.RBAC_Permissions_Section.push(permisssion_Section);
    }

    rbac_Permissions_Module.push(permissions_Module);

    form.value.RBAC_Permissions_Module = rbac_Permissions_Module;

  }

  onSubmitSection(form: NgForm, vwModule:VW_Modules) {

    this.ShowSpinner();

    //if (this.primaryKey == 0) 
    {
      this.service.getDataByQuery(this.controllerName,"?$filter= GroupID eq " + this.formData.GroupId + " and ID ne " + this.primaryKey).then(res => {

        if (res.length == 0) {
          this.BeforeUpsertSection(form, vwModule);
          this.insertRecord(form);
        }
        else {
          this.HideSpinner();
          this.messageDialog.openMessageDialog("This group has already assigned permissions in other record.");
          return;
        }

      })
    }
    // else {     
    //   this.BeforeUpsertSection(form, vwModule);
    //   this.insertRecord(form);
    // }
  }

  AfterUpsert(form:NgForm)
  {  
    this.AfterDisplay_GetSingleModuleAndSectionData(form.value.RBAC_Permissions_Module[0].ModuleID)    
  }

  SpinnerAfterUpsert(){    

  }
 

  AfterDisplay_GetSingleModuleAndSectionData(moduleID:any) {

    this.genService.GetDataByQuery("RBAC_Permissions("+this.primaryKey+")?$select=*&$expand=RBAC_Permissions_Module($expand=RBAC_Permissions_Section($expand=RBAC_Permissions_Details)),RBAC_Permissions_Module($filter= ModuleID eq "+moduleID+")").then(res=>{
      var dataModules = res as any;

      dataModules.RBAC_Permissions_Module.forEach(element => {

        var vwModule = this.vw_Modules.filter(function (x) {
          return x.ID == element.ModuleID
        })

        if (vwModule.length > 0) {

          vwModule[0].Module_PrimaryKey = element.ID;
          vwModule[0].HasAccess = element.IsVisible;
          vwModule[0].PermissionId = element.PermissionID


          for (let indexPS = 0; indexPS < element.RBAC_Permissions_Section.length; indexPS++) {
            const elementPS = element.RBAC_Permissions_Section[indexPS];

            if (vwModule[0].RBAC_Sections.length > 0) {
              var vwRbacSection = vwModule[0].RBAC_Sections.filter(function (x) {
                return x.ID == elementPS.SectionID;
              })

              if (vwRbacSection.length > 0) {
                vwRbacSection[0].completed = elementPS.IsVisible;
                vwRbacSection[0].Section_PrimaryKey = elementPS.ID;
                vwRbacSection[0].PermissionModuleID = elementPS.PermissionModuleID;

                for (let indexPD = 0; indexPD < elementPS.RBAC_Permissions_Details.length; indexPD++) {
                  const elementPD = elementPS.RBAC_Permissions_Details[indexPD];

                  var vwRights = vwRbacSection[0].RBAC_SectionRights.filter(function (z) {
                    return z.RightsID == elementPD.RightsID;
                  })
                  
                  if (vwRights.length > 0) {
                    vwRights[0].PermissionDetail_PrimaryKey = elementPD.ID;
                    vwRights[0].completed = elementPD.HasPermission;
                    vwRights[0].PermissionSectionID = elementPD.PermissionSectionID;
                  }

                }

              }

              //this.updateAllComplete(vwRbacSection[0]);

            }
          }      
        }             
    })

    this.HideSpinner();

    }, error => {
        console.log(error);
    })
    

  }

  onReload(form: NgForm) {
    //this.Reload(form);
    this.navigate('/rbac/rbacpermission/form', this.primaryKey);
  }

  onDelete(ID: number) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe(res => {
      if (res) {
        this.deleteRecord(ID);
      }
    })
  }

  AfterDelete() {
    this.router.navigate(['/rbac/rbacpermission/list']);
  }

  onEdit() {
    this.Edit();
  }

  updateAllComplete(vw_rbacSections: VW_RBAC_Sections ) {

    // if(vw_rbacSectionRights.RightsID != EnRights.View)
    // {
    //   if(vw_rbacSectionRights.completed == true)
    //   {
    //     var ViewAction = vw_rbacSections.RBAC_SectionRights.filter(function(x){
    //       return x.RightsID == EnRights.View;
    //     })

    //     if(ViewAction.length > 0)
    //       ViewAction[0].completed = true;
    //   }
    // }


    vw_rbacSections.allComplete = vw_rbacSections.RBAC_SectionRights != null &&  vw_rbacSections.RBAC_SectionRights.length > 0 && vw_rbacSections.RBAC_SectionRights.every(t => t.completed == true);
    
    if(vw_rbacSections.RBAC_SectionRights.length > 0)
      vw_rbacSections.completed = vw_rbacSections.RBAC_SectionRights.filter(t => t.completed ).length > 0;

  }

  OnRightChange(vw_rbacSections: VW_RBAC_Sections, vw_rbacSectionRights:VW_RBAC_SectionRights, completed:boolean )
  {
    if(vw_rbacSectionRights.RightsID != EnRights.View)
    {
      if(vw_rbacSectionRights.completed == true)
      {
        var ViewAction = vw_rbacSections.RBAC_SectionRights.filter(function(x){
          return x.RightsID == EnRights.View;
        })

        if(ViewAction.length > 0)
          ViewAction[0].completed = true;
      }
    }

  }

  someComplete(vw_rbacSections: VW_RBAC_Sections): boolean {
    if (vw_rbacSections.RBAC_SectionRights == null) {
      return false;
    }

  

    return vw_rbacSections.RBAC_SectionRights.filter(t => t.completed).length > 0 && !vw_rbacSections.allComplete;
  }

  setAll(completed: boolean, vw_rbacSections: VW_RBAC_Sections) {
    vw_rbacSections.allComplete = completed;
    vw_rbacSections.completed = completed;
    if (vw_rbacSections.RBAC_SectionRights == null) {
      return;
    }
    vw_rbacSections.RBAC_SectionRights.forEach(t => t.completed = completed);
  }

  SelectAll(completed: boolean, vw_Modules: VW_Modules) {
    vw_Modules.RBAC_Sections.forEach(element => {
      element.completed = completed;
      this.setAll(completed, element);
    });
  }

  UnSelectAll(vw_Modules: VW_Modules) {
    vw_Modules.RBAC_Sections.forEach(element => {
      element.completed = false;
      this.setAll(false, element);
    });
    vw_Modules.SelectAll = false;
  }

}


export class VW_GetModuleAndSectionData {
  ModuleId: number = null;
  ModuleName: string = null;
  SectionID: number = null;
  SectionName: string = null;
  RightsID: number = null;
  RightName: string = null;

}

export class VW_Modules {
  ID: number = 0;
  ModuleName: string = null;
  PermissionId: number = 0;
  Module_PrimaryKey: number = 0;
  HasAccess: boolean = false;
  SelectAll: boolean = false;
  RBAC_Sections: VW_RBAC_Sections[] = [];
}

export class VW_RBAC_Sections {
  ID: number = 0;
  ModuleId: number = null;
  SectionName: string = null;
  PermissionModuleID : number = null;
  Section_PrimaryKey: number = 0;
  RBAC_SectionRights: VW_RBAC_SectionRights[] = [];
  allComplete: boolean = false;
  completed: boolean = false;
}

export class VW_RBAC_SectionRights {
  ID: number = 0;
  ModuleId: number = null;
  PermissionDetail_PrimaryKey: number = 0;
  SectionID: number = null;
  PermissionSectionID: number = null;
  RightsID: number = null;
  completed: boolean = null;
  RBAC_Rights: VW_RBAC_Rights = new VW_RBAC_Rights();

}

export class VW_RBAC_Rights {
  ID: number = 0;
  RightName: string = null;

}

