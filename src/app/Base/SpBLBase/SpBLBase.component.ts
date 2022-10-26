import { OnInit, Component } from '@angular/core';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { RbacUsers } from '../../rbac/rbac-users.model';
import * as _moment from 'moment';
import moment from 'moment';
import { LoginUser } from '../User/login-user';
import { EnRights } from 'src/app/Enum/Enums';
import { ParentBase } from '../parent-base';

@Component({
  selector: 'app-spbase',
  templateUrl: './SpBLBase.component.html',
})

export class SpBLBase < T > extends ParentBase implements OnInit {
  // ====================== variables
  //#region
  public heading: string;
  public formTitle: string;
  public SubmitTitle: string;
  public alertMessage: string;
  public primaryKey: number;
  public isEdit: Boolean;
  public isView: Boolean;
  public isDeleted: Boolean = false;
  public isUpdated: Boolean = false;
  public isCreated: Boolean = false;
  public isShowAlert: Boolean = false;
  public message: string = "";
  public query = {};
  public navigationSubscription;
  public IsInvalidForm: boolean = false;
  public formID: string = "";
  public CanAdd: boolean = true;
  public CanEdit: boolean = true;
  public CanDelete: boolean = true;
  public CanView: boolean = true;
  public formData: T;
  public listTitle: string = "";
  public lisItemType: string = "";
  public sectionName: string = "";
  public isGetByPrimaryKey = true;
  public SavebuttonText = "";
  public IsUserform = false;
  //#endregion

  constructor(
    public service ? : SPOperationsService,
    public router ? : Router,
    public route ? : ActivatedRoute,
    public spinner ? : NgxSpinnerService,
    public toast ? : ToastService,
    public dialog ? : ConfirmDialogeService,
    public messageDialog ? : MessageDialogeService
  ) {
    super(router);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
    this.setSectionName();
  }

  ngOnInit() {
    this.heading = this.formTitle;
    this.ShowSpinner();
    this.BeforeOnInit();
    this.BeforeInit();
    this.OnInit();
    this.AfterOnInit();
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  OnInit() {
    if (this.isGetByPrimaryKey == true)
      window.scroll(0, 0);
    if (this.isGetByPrimaryKey == true) {
      this.route.queryParams
        .subscribe(params => {
          this.primaryKey = params['ID'] || 0;
          if (this.primaryKey == 0)
            this.SavebuttonText = "Submit";
          else
            this.SavebuttonText = "Update";
        });
    }
    this.GetDataByID().then(res => {
      this.AfterNewFormLoad();
    });
  }

  // get data by ID
  async GetDataByID() {
    if (this.primaryKey != 0 && this.isGetByPrimaryKey == true) {
      this.isView = true;
      this.AfterInitializePrimaryKey();
      this.BeforeGetData().then(res => {
        this.service.readItemById(this.listTitle, this.primaryKey, this.query).then(
          res => {
            this.GetAuditData(res['d']);
            this.BeforeFillInForm(res['d']);
            this.formData = res['d']
            this.isView = true;
            this.isEdit = false;
            this.isDeleted = false;
            this.isCreated = false;
            this.isUpdated = false;
            this.AfterGetData();
            this.AfterDisplay();
          },
          error => {
            this.HideSpinner();
            this.ShowToast(error.message, ToastType.Error);
          }
        );
      });
      this.formTitle = this.heading + " / View";
    } else {
      this.AfterInit();
    }
  }
  AfterDisplay() {
    this.HideSpinner();
  }

  public navigate(url: string, ID ? : number) {
    if (ID == null || ID == 0) {
      this.router.navigate([url]);
    } else {
      this.router.navigate([url], {
        queryParams: {
          ID: this.primaryKey
        }
      });
    }
  }
  public navigateParams(url: string, queryParams ? : NavigationExtras) {
    this.router.navigate([url], {
      queryParams: queryParams
    });
  }
  public resetForm() {
    this.Initializeobject();
    this.primaryKey = 0;
    this.isCreated = true;
    this.isEdit = false;
    this.isDeleted = false;
    this.isUpdated = false;
    this.isView = false;
    this.formTitle = this.heading + " / Add";
  }

  public Edit() {
    this.ShowSpinner();
    this.BeforeEdit();
    this.AfterEdit();
    this.formTitle = this.heading + " / Edit";
    this.SubmitTitle = "Update";
    this.isEdit = true;
    this.isCreated = false;
    this.isDeleted = false;
    this.isUpdated = false;
    this.isView = false;
    this.HideSpinner();
  }

  public BeforeInsert(jsonObject: any) {}
  public AfterInsert(jsonObject: any) {}
  public BeforeUpdate(jsonObject: any) {}
  public AfterUpdate(jsonObject: any) {}
  public BeforeUpsert(jsonObject: any) {}
  public AfterUpsert(jsonObject: any) {}
  ValidateBeforeSave(): boolean {
    return true;
  }
  ErrorMessage(msg: string) {
    this.message = msg;
  }
  // insert OR update record
  public insertRecord(jsonObject: any) {
    this.ShowSpinner();
    // validation
    if (this.ValidateBeforeSave() == false) {
      this.HideSpinner();
      if (this.message != "") {
        this.messageDialog.openMessageDialog(this.message);
      }
      // else {
      //     this.messageDialog.openMessageDialog("Invalid form.");
      // }
      return;
    }
    this.BeforeUpsert(jsonObject);
    // if items is for creation
    if (this.primaryKey == 0) {
      this.BeforeInsert(jsonObject);
      this.service.createSPItem(this.listTitle, this.lisItemType, jsonObject).subscribe(res => {
        // set is created flag to true
        this.isCreated = true;
        // set primary key
        this.primaryKey = res['d'].ID;
        this.AfterInsert(jsonObject);
        this.AfterUpsert(jsonObject);
        this.SpinnerAfterUpsert();
        // show toast message
        this.ShowToast("Successfully Created!", ToastType.Success)
      }, error => {
        this.HideSpinner();
        if (error.error.text) {
          if (String(error.error.text).indexOf("Error:") == 0) {
            this.messageDialog.openMessageDialog(error.error.text);
          } else {
            this.ShowToast(error.message, ToastType.Error);
          }
        } else {
          this.ShowToast(error.message, ToastType.Error);
          console.log(error);
        }
      });
    }
    // item is for update
    else {
      this.BeforeUpdate(jsonObject);
      this.service.updateItem(this.listTitle, this.lisItemType, this.primaryKey, jsonObject).then(res => {
        this.isUpdated = true;
        this.AfterUpdate(jsonObject);
        this.AfterUpsert(jsonObject);
        this.SpinnerAfterUpsert()
        this.ShowToast("Successfully Updated!", ToastType.Success)
      }, error => {
        this.HideSpinner();
        if (error.error.text) {
          if (String(error.error.text).indexOf("Error:") == 0) {
            this.messageDialog.openMessageDialog(error.error.text);
          } else {
            this.ShowToast(error.message, ToastType.Error);
          }
        } else
          this.ShowToast(error.message, ToastType.Error);
      })
    }
  }
  // delete record
  async deleteRecord(ID: number) {
    this.ShowSpinner();
    this.BeforeDelete();
    await this.service.deleteItem(this.listTitle, ID).then(res => {
      this.resetForm();
      this.isDeleted = true;
      this.AfterDelete();
      this.HideSpinner();
      this.ShowToast("Successfully Deleted!", ToastType.Success);
    }, error => {
      this.HideSpinner();
      if (error.error.text) {
        if (String(error.error.text).indexOf("Error:") == 0) {
          this.messageDialog.openMessageDialog(error.error.text);
        } else {
          this.ShowToast(error.message, ToastType.Error);
        }
      } else
        this.ShowToast(error.message, ToastType.Error);
    })
  }





  ShowToast(message: string, toasttype: ToastType) {
    const options = {
      opacity: 1,
      positionClass: 'md-toast-top-center',
      progressBar: true,
      closeButton: true,
      timeOut: 1000
    };
    const optionsOther = {
      opacity: 1,
      positionClass: 'md-toast-top-center',
      progressBar: true,
      closeButton: true,
      timeOut: 5000
    };
    if (toasttype == ToastType.Success) {
      this.toast.success(message, "Success", options);
    } else if (toasttype == ToastType.Error) {
      this.toast.error(message, "Error", optionsOther);
    } else if (toasttype == ToastType.Info) {
      this.toast.info(message, "Information", optionsOther);
    } else if (toasttype == ToastType.Warning) {
      this.toast.warning(message, "Warning", optionsOther);
    }
  }

  AddDetails: RbacUsers = new RbacUsers();
  UpdateDetails: RbacUsers = new RbacUsers();
  AuditDetails: string = "";
  public GetAuditData(jsonObject: any) {
    this.AuditDetails = " Last Modified at " + moment(jsonObject.Modified).format('MM/DD/YYYY hh:mm A') + " by " + jsonObject.Editor.Title;
    /*
    if (this.IsUserform == false) {
        if (this.primaryKey > 0) {
            this.ShowSpinner();
            this.service.getAnyDataByID(this.primaryKey, this.controllerName, "?$select=RBAC_USERS&$expand=RBAC_Users($select=ID,FirstName,LastName),RBAC_Users1($select=ID,FirstName,LastName)").then(res => {
                if (res['RBAC_Users'] != null)
                    this.AddDetails.FirstName = res['RBAC_Users'].FirstName + ' ' + res['RBAC_Users'].LastName;
                if (res['RBAC_Users1'] != null)
                    this.UpdateDetails.FirstName = res['RBAC_Users1'].FirstName + ' ' + res['RBAC_Users1'].LastName;
                this.AuditDetails = " Last Modified at " + moment(this.formData['ModifiedDate']).format('MM/DD/YYYY hh:mm A') + " by " + this.UpdateDetails.FirstName;
                this.HideSpinner();
            })
        }
    }
    else {
        if (this.primaryKey > 0) {
            this.ShowSpinner();
            this.service.getAnyDataByID(formData['ModifiedBy'], this.controllerName, "").then(res => {
                if (res != null) {
                    this.AddDetails.FirstName = res['FirstName'] + ' ' + res['LastName'];
                    this.UpdateDetails.FirstName = res['FirstName'] + ' ' + res['LastName'];
                }
                this.AuditDetails = " Last Modified at " + moment(this.formData['ModifiedDate']).format('MM/DD/YYYY hh:mm A') + " by " + this.UpdateDetails.FirstName;
                this.HideSpinner();
            })
        }
    }
    */
  }

  // ======================================== Common Functions ============================
  IsNullOrUndefined(value: any): boolean {
    if (value == null || value == undefined)
      return true;
    return false;
  }

  GetTotal(Arr: any, fieldName: string): number {
    var Total: number = 0;
    Arr.forEach(element => {
      if (element[fieldName] != null && element[fieldName] != "")
        Total += parseFloat(element[fieldName]);
    });
    return Total;
  }

  BLFormatDate(date: string): string {
    return date.split('-').join('/');
  }

  BeforeOnInit() {
    this.resetForm();
  }
  BeforeInit() {}
  AfterInit() {
    this.HideSpinner();
  }
  AfterOnInit() {}
  async BeforeGetData() {}
  AfterInitializePrimaryKey() {}
  AfterGetData() {}
  AfterNewFormLoad() {}
  BeforeFillInForm(formData: T) {}

  addListTitle(listName: string, lisItemType: string) {
    this.listTitle = listName;
    this.lisItemType = lisItemType;
  }
  setSectionName() {
    this.sectionName = this.route.data['value'].sectionName
  }
  initialiseInvites() {
    // Set default values and re-fetch any data you need.
  }

  BeforeReload() {
  }

  AfterReload() {
  }

  Reload(form: NgForm) {
    form.reset();
    this.OnInit();
  }

  BeforeDelete() {
  }

  AfterDelete() {
  }


  ShowSpinner() {
    this.spinner.show();
  }

  HideSpinner() {
    this.spinner.hide();
  }

  GetTotasOptions() {
  }

  public BeforeCreate() {
  }
  public AfterCreate() {
  }
  Create() {
    this.BeforeCreate();
    this.resetForm();
    this.AfterCreate();
  }
  public Initializeobject() {}
  public BeforeEdit() {
  }
  public AfterEdit() {
  }

  SpinnerAfterUpsert() {
    this.HideSpinner();
  }
}
