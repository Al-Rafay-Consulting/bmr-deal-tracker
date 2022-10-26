import { Component, OnInit,ViewChild } from '@angular/core';
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
import { CommonService } from '../../../Base/Common.service';

@Component({
  selector: 'app-rbac-users',
  templateUrl: './rbac-users.component.html',
  styleUrls: ['./rbac-users.component.scss']
})
export class RbacUsersComponent extends BLBase<RbacUsers> implements OnInit {


  public rbacusers:RbacUsers[]= [];
  public rbacGroups:RBACGroups_This[]= [];
  public IsAdmin :boolean = false;

  constructor(
    public service: GenericService, 
    public router: Router, 
    public route: ActivatedRoute, 
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog:ConfirmDialogeService,
    public sp:SPOperationsService,
    public messageDialog:MessageDialogeService,
    public genService:GeneralService,
    public common:CommonService
    ) {   
    
    super(service, router, route, spinner, toast, dialog, messageDialog);    
    this.formTitle = "User";    
    this.addControllerName("RBAC_Users");
    this.filterOnGet = "?$select=*&$expand=RBAC_Users_Groups";
    this.IsUserform = true;

    }

  public Initializeobject() {
    this.formData = new RbacUsers();
  }

  ngOnInit(): void {
    
    super.ngOnInit();    
    this.GetAllSPUsers();

    if (this.primaryKey == 0)
      this.GetGroups();

  }

  async GetGroups(){
    
   await this.genService.GetDataByQuery("RBAC_Groups").then(res => {
      var rbacGrps = res['value'] as RBACGroups[];

      rbacGrps.forEach(element => {
        var rbac = new RBACGroups_This();
        rbac.ID = element.ID;
        rbac.GroupName = element.GroupName;
        rbac.IsAdmin = element.IsAdmin;
        rbac.IsSystemGenerated = element.IsSystemGenerated;
        rbac.CreatedBy = element.CreatedBy;
        rbac.CreatedDate = element.CreatedDate;
        rbac.ModifiedBy = element.ModifiedBy;
        rbac.ModifiedDate = element.ModifiedDate;
        this.rbacGroups.push(rbac);
      });

    })
  }

   AfterDisplay(){

     this.GetGroups().then(res => {
      
       this.formData.RBAC_Users_Groups.forEach(element => {

         var user_group = this.rbacGroups.filter(function (x) {
           return x.ID == element.GroupId
         })

         if (user_group.length > 0) {
           user_group[0].rbacUserGroupID = element.ID;
           user_group[0].IsSelected = true;           
          }

       })

      var IsAdminSelected = this.rbacGroups.filter(function (x) {
        return x.IsAdmin == true && x.IsSelected;
      })

      if(IsAdminSelected.length > 0)
      {
        this.onGroupClick(IsAdminSelected[0]);
      }


     }, error => {

    });

      this.HideSpinner();

  }


  GetAllSPUsers(){
    this.ShowSpinner();
    this.sp.getAllUsers().then(res=>{
      console.log(res);
      
      var spUsers = res['d']['results'] as any[];
      spUsers.forEach(element => {
        var user =  new RbacUsers();
        user.ID = element['Id'];
        user.UserId = element['Id'];
        user.Password = element['Email'];

        var title = String(element['Title']).split(' ');
        var FirstName ="";
        if(title.length > 0)
        {
          FirstName = title[0]
        }

        var LastName = "";
        if(title.length > 1){
          for (let index = 0; index < title.length; index++) {
            const element = title[index];
            if(index == 0)
              continue;

              LastName += title[index];

            if (index == title.length - 1) {

            }
            else
              LastName += " ";
          }           
        }
                
        user.FirstName = FirstName;
        user.LastName = LastName;
        this.rbacusers.push(user);
      });      
   })
  }

  OnUserChange(){
     var ID =  this.formData.ID;
     var selectedUser = this.rbacusers.filter(function(x){
       return x.ID == ID;
     })

     if(selectedUser.length > 0 )
     {
       this.formData.UserId = selectedUser[0].UserId; 
       this.formData.FirstName = selectedUser[0].FirstName; 
       this.formData.LastName = selectedUser[0].LastName;   
       this.formData.Password = selectedUser[0].Password;   
     }
  }
 
  
  onCreate(form:NgForm){        
    this.router.navigate(['/rbac/rbacusers/form'], {replaceUrl:true});   
    this.Create();
    
  }

  BeforeUpsert(form:NgForm){  
    
    var userGroupList: RBAC_Users_Groups[] = [];

    this.rbacGroups.forEach(element => {
      
      if(element.IsSelected == true)
      {
        var rbac = new RBAC_Users_Groups();
        rbac.ID = element.rbacUserGroupID;
        rbac.GroupId = element.ID;
        rbac.UserId = this.formData.UserId;                
        userGroupList.push(rbac);
      }

    });

    form.value.RBAC_Users_Groups = userGroupList;

    // Getting email
    var ID =  this.formData.ID;
     var selectedUser = this.rbacusers.filter(function(x){
       return x.ID == ID;
     })

    form.value.Password = selectedUser[0].Password;
    form.value.FirstName = selectedUser[0].FirstName;
    form.value.LastName = selectedUser[0].LastName;

  }


  onSubmit(form: NgForm) {

    this.ShowSpinner();

    if (this.primaryKey == 0)
    {
      this.service.getDataByQuery(this.controllerName,"?$filter= ID eq " + this.formData.ID).then(res=>{
        
        if(res.length == 0)
        {
          this.insertRecord(form);    
        }
        else
        {
           this.HideSpinner();
            this.messageDialog.openMessageDialog("This user is already exists.");
            return;
        }

      })
    }
    else{
      form.value.ID = this.primaryKey;
      this.insertRecord(form);    
    }

    
  }


  AfterInsert(){
    this.router.navigate(['/rbac/rbacuser/list']);
  }

  
  AfterUpdate() {
    this.router.navigate(['/rbac/rbacuser/list']);
  }

  
  onReload(form: NgForm){
    //this.Reload(form);
    this.navigate('/rbac/rbacusers/form', this.primaryKey);

  }

  onDelete(ID:number){   
    this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe( res =>{
      if(res)
      {
        this.deleteRecord(ID);
      }    
    })
  }

  AfterDelete() {
    this.router.navigate(['/rbac/rbacuser/list']);
  }
 
  onEdit(){
    this.Edit();
  }

  onGroupClick(element:RBACGroups_This){
    if (element.IsAdmin == true) {
      if (element.IsSelected == true) {
        this.rbacGroups.forEach(element => {
          if(element.IsAdmin != true)
              element.IsSelected = false;
        });

        this.IsAdmin = true;
      }
      else
      {
        // this.rbacGroups.forEach(element => {
        //   element.IsSelected = false;
        // });
        this.IsAdmin = false;
      }
    }
  }

}

export class RBACGroups_This {
  ID : number = 0;
  GroupName : string = null;
  IsAdmin : boolean = null;
  CreatedBy : number = null;
  CreatedDate : Date = null;
  ModifiedBy : number = null;
  ModifiedDate : Date = null;
  IsSystemGenerated : boolean = null;
  IsSelected : boolean = null;
  rbacUserGroupID :number = 0;
}

