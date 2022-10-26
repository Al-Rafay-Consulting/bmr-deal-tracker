import { Managementprocess } from './managementprocess.model';
import { GeneralService } from 'src/app/services/general.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BLBase } from 'src/app/Base/BLBase/BLBase.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { SpBLBase } from 'src/app/Base/SpBLBase/SpBLBase.component';

@Component({
  selector: 'app-managementprocess',
  templateUrl: './managementprocess.component.html',
  styles: []
})
export class ManagementprocessComponent extends SpBLBase<Managementprocess> implements OnInit  {

  constructor(
    public service: SPOperationsService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,
    public common:CommonService,
    public messageDialog?: MessageDialogeService
    ) { 
      super(service, router, route, spinner, toast, dialog, messageDialog);

      // Form Heading will be shown in html
      this.formTitle = "Marketing Process";
  
      //Defined SP List Title
      this.addListTitle("MarketingProcess", "MarketingProcess");
      this.query = {
        select: 'ID, Title, Modified, Editor/Title,Inactive',
        expand: 'Editor'
  
      }}


      public Initializeobject() {
        this.formData = new Managementprocess();
      }
    
      ngOnInit(): void {
        // BLBase NgOnInit
        super.ngOnInit();
      }

      onCreate(form: NgForm) {
        this.router.navigate(['/admin/Marketingprocess/form'], { replaceUrl: true });
        //BLBase function
        this.Create();
      }

        // This form function
  onSubmit(form: NgForm) {
    //BLBase function
    var objMarket =  new Managementprocess();
    objMarket.ID = this.formData.ID;
    objMarket.Title = this.formData.Title;
    objMarket.Inactive = this.formData.Inactive;
    this.insertRecord(objMarket);
  }

  AfterInsert(jsonObject: any) {
    this.router.navigate(['/admin/Marketingprocess/list']);
  }

  // This is BLBase function. Here we override it.
  AfterUpdate(jsonObject: any) {
    this.router.navigate(['/admin/Marketingprocess/list']);
  }

   // This form function
   onReload(form: NgForm) {
    //BLBase function
    this.Reload(form);
  }


  onDelete(ID: number) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe(res => {
      if (res) {
        //BLBase function
        this.deleteRecord(ID);
      }
    })
  }

  
  // This is BLBase function. Here we override it.
  AfterDelete() {
    this.router.navigate(['/admin/Marketingprocess/list']);
  }
  // This form function.
  onEdit() {
    //BLBase function
    this.Edit();
  }

}
