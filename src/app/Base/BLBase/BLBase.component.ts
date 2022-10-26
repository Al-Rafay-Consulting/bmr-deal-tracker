import { OnInit, Component } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
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
    selector: 'app-base',
    templateUrl: './BLBase.component.html',
})

export class BLBase<T> extends ParentBase implements OnInit {

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
    public message: string ="";
    public filterOnGet = "";
    public navigationSubscription;
    public IsInvalidForm: boolean = false;
    public formID: string = "";
    public CanAdd: boolean = true;
    public CanEdit: boolean = true;
    public CanDelete: boolean = true;
    public CanView: boolean = true;

    public formData: T;
    public controllerName: string = "";
    public sectionName:string = "";
    public isGetByPrimaryKey = true;

    public SavebuttonText = "";
    public IsUserform = false;
    


    constructor(        
        public service?: GenericService,
        public router?: Router,
        public route?: ActivatedRoute,
        public spinner?: NgxSpinnerService,
        public toast?: ToastService,
        public dialog?: ConfirmDialogeService,
        public messageDialog?: MessageDialogeService
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

    addControllerName(controller: string) {
        this.controllerName = controller;
    }

    setSectionName() {
        this.sectionName = this.route.data['value'].sectionName
    }

    initialiseInvites() {
        // Set default values and re-fetch any data you need.
    }

    ngOnDestroy() {
        // avoid memory leaks here by cleaning up after ourselves. If we  
        // don't then we will continue to run our initialiseInvites()   
        // method on every navigationEnd event.
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    BeforeOnInit() {
        this.resetForm();
    }

    BeforeInit() {
        
    }

    AfterInit() {
        this.HideSpinner();
    }

    AfterOnInit() {

    }

    GetUserRights() {
        if (this.formID != "") {

            var sectionName = this.formID;
            var userPermission = LoginUser.UserPermissions.filter(function (x) {
                return x.SectionName == sectionName
            })

            for (let index = 0; index < userPermission.length; index++) {
                const element = userPermission[index];

                if (element.RightsID == EnRights.View)
                    this.CanView = element.HasPermission;
                else if (element.RightsID == EnRights.Add)
                    this.CanAdd = element.HasPermission;
                else if (element.RightsID == EnRights.Edit)
                    this.CanEdit = element.HasPermission;
                else if (element.RightsID == EnRights.Delete)
                    this.CanDelete = element.HasPermission;
            }

            if (this.CanView == false) {
                this.CanAdd = false;
                this.CanEdit = false;
                this.CanDelete = false;
            }
        }
    }

    OnInit() {
        if(this.isGetByPrimaryKey == true)
            window.scroll(0, 0);
        /*this.GetUserRights();
        if (this.CanView == true) {
            this.route.queryParams
                .subscribe(params => {
                    this.primaryKey = params['ID'] || 0;
                });

            this.GetDataByID();
        }
        else
        {
            this.isView = true;
            this.isEdit = false;
            this.isDeleted = false;
            this.isCreated = false;
            this.isUpdated = false;
            this.HideSpinner();
           
        }
        */

        
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

    async BeforeGetData() {

    }

    AfterInitializePrimaryKey(){
              
    } 

    AfterGetData() {

    }

    AfterNewFormLoad() {

    }

    BeforeFillInForm(formData: T) {

    }

    async GetDataByID() {
        if (this.primaryKey != 0 && this.isGetByPrimaryKey == true) {
            this.isView = true;
            this.AfterInitializePrimaryKey();
            this.BeforeGetData().then(res => {

                this.service.getDataByID(this.primaryKey, this.controllerName, this.filterOnGet).then(
                    res => {
                        this.GetAuditData(res);
                        this.BeforeFillInForm(res);
                        this.formData = res
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


        }
        else {
            this.AfterInit();
        }
    }



    AfterDisplay() {
        this.HideSpinner();
    }


    ngOnInit() {
        this.heading = this.formTitle;
        this.ShowSpinner();
        this.BeforeOnInit();
        this.BeforeInit();
        this.OnInit();        
        this.AfterOnInit();
    }

    public navigate(url: string, ID?: number) {
        if (ID == null || ID == 0)
            this.router.navigate([url]);
        else
            this.router.navigate([url], { queryParams: { ID: this.primaryKey } });
    }

    public navigateParams(url: string, queryParams?: NavigationExtras) {
        this.router.navigate([url], { queryParams: queryParams });
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

    public BeforeCreate() {

    }

    public AfterCreate() {

    }

    Create() {
        this.BeforeCreate();
        this.resetForm();
        this.AfterCreate();
    }

    public Initializeobject() {
    }

    public BeforeEdit() {

    }

    public AfterEdit() {

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

    public BeforeInsert(form: NgForm) {
    }

    public AfterInsert(form: NgForm) {
    }

    public BeforeUpdate(form: NgForm) {
    }

    public AfterUpdate(form: NgForm) {
    }

    public BeforeUpsert(form: NgForm) {
    }

    public AfterUpsert(form: NgForm) {
    }




    ValidateBeforeSave(): boolean {
        return true;
    }

    ErrorMessage(msg: string) {
        this.message = msg;
    }

    public insertRecord(form: NgForm) {
        this.ShowSpinner();

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

        this.BeforeUpsert(form);



        if (this.primaryKey == 0) {
            this.BeforeInsert(form);
            this.service.postData(form.value, this.controllerName, this.sectionName).subscribe(res => {
                this.isCreated = true;
                this.primaryKey = res["ID"];
                this.AfterInsert(form);
                this.AfterUpsert(form);
                //this.HideSpinner();
                this.SpinnerAfterUpsert()
                this.ShowToast("Successfully Created!", ToastType.Success)
            }, error => {
                this.HideSpinner();
                //this.ShowToast(error.message, ToastType.Error);

                if (error.error.text) {
                    if (String(error.error.text).indexOf("Error:") == 0) {
                        this.messageDialog.openMessageDialog(error.error.text);
                    }
                    else {
                        this.ShowToast(error.message, ToastType.Error);
                    }
                }
                else
                    this.ShowToast(error.message, ToastType.Error);


                //this.messageDialog.openMessageDialog(error.error.error.innererror);
            });
        }
        else {
            this.BeforeUpdate(form);

            this.service.updateData(this.primaryKey, form.value, this.formData["CreatedBy"], this.formData["CreatedDate"], this.controllerName, this.sectionName).subscribe(res => {
                this.isUpdated = true;
                this.AfterUpdate(form);
                this.AfterUpsert(form);
                //this.HideSpinner();
                this.SpinnerAfterUpsert()
                this.ShowToast("Successfully Updated!", ToastType.Success)
            }, error => {
                this.HideSpinner();
                //this.ShowToast(error.message, ToastType.Error);


                if (error.error.text) {
                    if (String(error.error.text).indexOf("Error:") == 0) {
                        this.messageDialog.openMessageDialog(error.error.text);
                    }
                    else {
                        this.ShowToast(error.message, ToastType.Error);
                    }
                }
                else
                    this.ShowToast(error.message, ToastType.Error);

                //this.messageDialog.openMessageDialog(error.error.error.innererror);
            })
        }
    }

    SpinnerAfterUpsert(){
        this.HideSpinner();
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

   async deleteRecord(ID: number) {
        this.ShowSpinner();
        this.BeforeDelete();
        
      await  this.service.removeData(ID, this.controllerName, this.sectionName).subscribe(res => {
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
                }
                else {
                    this.ShowToast(error.message, ToastType.Error);
                }
            }
            else
                this.ShowToast(error.message, ToastType.Error);

            //this.ShowToast(error.message, ToastType.Error) ;
        })
    }


    ShowSpinner() {
        this.spinner.show();
    }

    HideSpinner() {
        this.spinner.hide();
    }

    GetTotasOptions() {

    }

    ShowToast(message: string, toasttype: ToastType) {
        const options = { opacity: 1, positionClass: 'md-toast-top-center', progressBar: true, closeButton: true, timeOut: 1000 };
        const optionsOther = { opacity: 1, positionClass: 'md-toast-top-center', progressBar: true, closeButton: true, timeOut: 5000 };
        if (toasttype == ToastType.Success)
            this.toast.success(message, "Success", options);
        else if (toasttype == ToastType.Error)
            this.toast.error(message, "Error", optionsOther);
        else if (toasttype == ToastType.Info)
            this.toast.info(message, "Information", optionsOther);
        else if (toasttype == ToastType.Warning)
            this.toast.warning(message, "Warning", optionsOther);
    }


    AddDetails: RbacUsers = new RbacUsers();
    UpdateDetails: RbacUsers = new RbacUsers();
    AuditDetails: string = "";
    public GetAuditData(formData: T) {
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
    }

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
        //return date.replace('-', '/');
        return date.split('-').join('/');
    }

}

