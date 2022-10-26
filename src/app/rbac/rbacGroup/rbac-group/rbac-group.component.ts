import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BLBase } from 'src/app/Base/BLBase/BLBase.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { RBACGroups } from '../../rbac-groups';
import { CommonService } from '../../../Base/Common.service';



@Component({
  selector: 'app-rbac-group',
  templateUrl: './rbac-group.component.html'
})
export class RbacGroupComponent extends BLBase<RBACGroups> implements OnInit {

  constructor(
    public service: GenericService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,
    public sp: SPOperationsService,
    public messageDialog: MessageDialogeService,
    public common:CommonService    

  ) {

    super(service, router, route, spinner, toast, dialog, messageDialog);
    this.formTitle = "Group";
    this.addControllerName("RBAC_Groups");    

  }

  public Initializeobject() {
    this.formData = new RBACGroups();
  }

  ngOnInit(): void {
    super.ngOnInit();

  }

  AfterDisplay(){
    this.getUsers();
  }

  usersList:any[] = [];
  getUsers() {
    if (this.primaryKey > 0) {
      this.service.getDataByID(this.primaryKey,"RBAC_Groups", "?$expand=RBAC_Users_Groups($expand=RBAC_Users)").then(res => {
        this.usersList = res as any[];
    });
  }
}


  onCreate(form: NgForm) {
    this.router.navigate(['/rbac/rbacgroup/form'], { replaceUrl: true });
  }

  ValidateBeforeSave():boolean{
    
    if(this.formData.IsSystemGenerated == true)
    {
      this.ErrorMessage("Cannot edit. This record is system generated.")
      return false;
    }

   return true;
}

  onSubmit(form: NgForm) {
    this.insertRecord(form);
  }

  AfterInsert() {
    this.router.navigate(['/rbac/rbacgroup/list']);
  }

  AfterUpdate() {
    this.router.navigate(['/rbac/rbacgroup/list']);
  }

  onReload(form: NgForm) {
    this.Reload(form);
  }


  onDelete(ID: number) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe(res => {
      if (res) {
        this.deleteRecord(ID);
      }
    })
  }

  AfterDelete() {
    this.router.navigate(['/rbac/rbacgroup/list']);
  }

  onEdit() {
    this.Edit();
  }


}
