import { SubMarket } from './submarket.model';
import { Market } from 'src/app/modules/admin/market/market.model';
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
import { Autocomplete } from 'src/app/Base/Autocomplete'

@Component({
  selector: 'app-submarket',
  templateUrl: './submarket.component.html',
  styleUrls: ['./submarket.component.scss']
})
export class SubmarketComponent extends SpBLBase<SubMarket> implements OnInit {
  AutoCompMarket: Autocomplete<Market> = new Autocomplete<Market>("Title", "ID");
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
    this.formTitle = "Sub-Market";

    //Defined SP List Title
    this.addListTitle("SubMarket", "SubMarket");
    this.query = {
      select: 'ID, Title,MarketId, Modified, Editor/Title,Inactive',
      expand: 'Editor'

    }

  }


  public Initializeobject() {
    this.formData = new SubMarket();

  }

  ngOnInit(): void {
    // BLBase NgOnInit
    super.ngOnInit();

  }
  AfterInit() {
    Promise.all(
      [
        this.getMarkets()
      ]
    ).then(res => {
      this.HideSpinner();
    })
  }
  AfterDisplay(){
    this.getMarkets();
  }
  onCreate(form: NgForm) {
    this.router.navigate(['/admin/Submarket/form'], { replaceUrl: true });
    //BLBase function
    this.Create();
  }

  // This form function
  onSubmit(form: NgForm) {
    //BLBase function
    var objSubMarket = new SubMarket();
    objSubMarket.ID = this.formData.ID;
    objSubMarket.Title = this.formData.Title;
    objSubMarket.Inactive = this.formData.Inactive;
    objSubMarket.MarketId = this.formData.MarketId;
    this.insertRecord(objSubMarket);
  }
  getMarkets() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };

    this.service.readItems("Market", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompMarket.data = res['d'].results as Market[];
      this.AutoCompMarket.resultObserve();
      this.HideSpinner();
    }, error => {
      this.HideSpinner();
      this.ShowToast(error.message, ToastType.Error);
    });

  }
  AfterInsert(jsonObject: any) {
    this.router.navigate(['/admin/Submarket/list']);
  }

  // This is BLBase function. Here we override it.
  AfterUpdate(jsonObject: any) {
    this.router.navigate(['/admin/Submarket/list']);
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
    this.router.navigate(['/admin/Submarket/list']);
  }
  // This form function.
  onEdit() {
    //BLBase function
    this.Edit();
  }

}



