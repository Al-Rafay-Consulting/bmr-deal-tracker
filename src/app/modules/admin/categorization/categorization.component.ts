import { Component, OnInit } from '@angular/core';
import { Categorization } from './categorization';
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
  selector: 'app-categorization',
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.scss']
})
export class CategorizationComponent extends SpBLBase<Categorization> implements OnInit {
  constructor(
    public service: SPOperationsService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,
    public common: CommonService,
    public messageDialog?: MessageDialogeService
  ) {
    super(service, router, route, spinner, toast, dialog, messageDialog);
        // Form Heading will be shown in html
        this.formTitle = "Categorization";

         //Defined SP List Title
    this.addListTitle("Categorization", "Categorization");
    this.query = {
      select: 'ID, Title, Modified, Editor/Title,Inactive',
      expand: 'Editor'

    }
  }
  public Initializeobject() {
    this.formData = new Categorization();
  }

  ngOnInit(): void {
    // BLBase NgOnInit
    super.ngOnInit();
  }

   onCreate(form: NgForm) {
     this.router.navigate(['/admin/Categorization/form'], { replaceUrl: true });
     //BLBase function
     this.Create();
   }
  // This form function
  onSubmit(form: NgForm) {
    //BLBase function
    var objMarket = new Categorization();
    objMarket.ID = this.formData.ID;
    objMarket.Title = this.formData.Title;
    objMarket.Inactive = this.formData.Inactive;
    this.insertRecord(objMarket);
  }

   AfterInsert(jsonObject: any) {
     this.router.navigate(['/admin/Categorization/list']);
   }

  // // This is BLBase function. Here we override it.
   AfterUpdate(jsonObject: any) {
     this.router.navigate(['/admin/Categorization/list']);
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
     this.router.navigate(['/admin/Categorization/list']);
   }
  // This form function.
   onEdit() {
     //BLBase function
     this.Edit();
   }

}
