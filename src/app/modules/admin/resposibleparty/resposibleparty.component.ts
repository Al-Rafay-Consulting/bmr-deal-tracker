import { Component, OnInit } from '@angular/core';
import { ResponsibleParty } from './responsibleparty.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { SpBLBase } from 'src/app/Base/SpBLBase/SpBLBase.component';
@Component({
  selector: 'app-resposibleparty',
  templateUrl: './resposibleparty.component.html',
  styleUrls: ['./resposibleparty.component.scss']
})
export class ResposiblepartyComponent extends SpBLBase<ResponsibleParty> implements OnInit  {

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
      this.formTitle = "Responsible Party";
  
      //Defined SP List Title
      this.addListTitle("ResponsibleParty", "ResponsibleParty");
      this.query = {
        select: 'ID, Title, Modified, Editor/Title,Inactive',
        expand: 'Editor'
  
      }}


      public Initializeobject() {
        this.formData = new ResponsibleParty();
      }
    
      ngOnInit(): void {
        // BLBase NgOnInit
        super.ngOnInit();
      }

      onCreate(form: NgForm) {
        this.router.navigate(['/admin/ResponsibleParty/form'], { replaceUrl: true });
        //BLBase function
        this.Create();
      }

        // This form function
  onSubmit(form: NgForm) {
    //BLBase function
    var objResposibleParty =  new ResponsibleParty();
    objResposibleParty.ID = this.formData.ID;
    objResposibleParty.Title = this.formData.Title;
    objResposibleParty.Inactive = this.formData.Inactive;
    this.insertRecord(objResposibleParty);
  }

  AfterInsert(jsonObject: any) {
    this.router.navigate(['/admin/ResponsibleParty/list']);
  }

  // This is BLBase function. Here we override it.
  AfterUpdate(jsonObject: any) {
    this.router.navigate(['/admin/ResponsibleParty/list']);
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
    this.router.navigate(['/admin/ResponsibleParty/list']);
  }
  // This form function.
  onEdit() {
    //BLBase function
    this.Edit();
  }

}

