import { Vendor } from './vendor.model';
import { GeneralService } from 'src/app/services/general.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BLBase } from 'src/app/Base/BLBase/BLBase.component';
import { NgxSpinnerService } from "ngx-spinner";
import { MDBModalRef, MDBModalService, ToastService } from 'ng-uikit-pro-standard'
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { SpBLBase } from 'src/app/Base/SpBLBase/SpBLBase.component';
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { Industry } from 'src/app/modules/admin/industry/industry.model';
import { Specialty } from 'src/app/modules/admin/speciality/specialty.model';
import { State } from 'src/app/modules/admin/state/state.model';
import { Client } from '../deal.model';
import { VendorNotes } from '../vendor-notes.model';
import { VendornotesComponent } from '../vendor-notes/vendor-notes.component'
import { VendorIndustry } from './vendor-industry.model'
import { VendorSpecialty } from './vendor-specialty.model'
import { VendorState } from './vendor-state.model'

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})

export class VendorComponent extends SpBLBase<Vendor> implements OnInit {
  public modalRef: MDBModalRef;
  public selectedIndustryID: number[] = [];
  public selectedSpecialtyID: number[] = [];
  public selectedStateID: number[] = [];
  AutoCompIndustry: Autocomplete<Industry> = new Autocomplete<Industry>("Title", "ID");
  AutoCompSpecialty: Autocomplete<Specialty> = new Autocomplete<Specialty>("Title", "ID");
  AutoCompState: Autocomplete<State> = new Autocomplete<State>("Title", "ID");
  vendorNotesList: any[] = [];
  clientList: Client[] = [];
  public vendorNotesonCreate: VendorNotes[] = [];

  viewID:number = 0;
  parent:string = "";

  constructor(
    public service: SPOperationsService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public modalService: MDBModalService,
    public dialog: ConfirmDialogeService,
    public common: CommonService,
    public messageDialog?: MessageDialogeService
  ) {
    super(service, router, route, spinner, toast, dialog, messageDialog);

    // Form Heading will be shown in html
    this.formTitle = "Vendor";

    //Defined SP List Title
    this.addListTitle("Vendors", "Vendors");
    this.query = {
      select: 'ID, Title, IndustryId, SpecialtyId, StateId, Accrual, Modified, Editor/Title',
      expand: 'Editor'

    }
  }

  public Initializeobject() {
    this.formData = new Vendor();
  }

  ngOnInit(): void {
    // BLBase NgOnInit
    super.ngOnInit();

    this.route.queryParams
    .subscribe(params => {
        this.viewID = params['ViewID'] || 0;
        this.parent = params['parent'] || 0;
    });



    if (this.primaryKey > 0)
      this.getNotesData();
    else {

    }
  }

  AfterInit() {
    // Sameer : 06/18/2021
    /*
    this.getClientDocumentSpConfig().then(res=>{
      this.HideSpinner();
    })
    */

    Promise.all(
      [
        this.getIndustryData(),
        this.getSpecialtyData(),
        this.getStateData(),
      ]
    ).then(res => {
      this.HideSpinner();
      // this.formData.IndustryId = this.IndustryID;
      // this.formData.SpecialtyId = this.SpecialtyID;
      // this.formData.StateId = this.StateID;
    })

  }


  async BeforeGetData() {
   
  }

  AfterGetData(){

   
     
  }

  AfterDisplay(){
     // Sameer : 06/18/2021
    //await this.getClientDocumentSpConfig();

    if (this.formData.IndustryId) {
      var arr_IndustryId = this.formData.IndustryId.results as number[];
      arr_IndustryId.forEach(element => {
        this.selectedIndustryID.push(element);
      });
    }

    if (this.formData.SpecialtyId) {
      var arr_SpecialtyId = this.formData.SpecialtyId.results as number[];
      arr_SpecialtyId.forEach(element => {
        this.selectedSpecialtyID.push(element);
      });
    }

    if (this.formData.StateId) {
      var arr_StateId = this.formData.StateId.results as number[];
      arr_StateId.forEach(element => {
        this.selectedStateID.push(element);
      });
    }

   Promise.all(
    [
      this.getIndustryData(),
      this.getSpecialtyData(),
      this.getStateData(),
      this.getVendorIndustryData(),
      this.getVendorSpecialtyData(),
      this.getVendorStateData(),
    ]
  ).then(res => {
    this.HideSpinner();

   

    this.getContactData();
    // this.formData.IndustryId = this.IndustryID;
    // this.formData.SpecialtyId = this.SpecialtyID;
    // this.formData.StateId = this.StateID;
  })
  }

  onCreate(form: NgForm) {
    this.router.navigate(['/contact/vendor/form'] , { queryParams: { ViewID: this.viewID , parent: 'Views'}, replaceUrl: true  } );
    //BLBase function
    this.Create();
  }

  OpenClientNotesModal(ID: number) {

    this.modalRef = this.modalService.show(VendornotesComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-xl modal-content modal-dialog cascading-modal modal-top',
      containerClass: '',
      animated: true,
      styles: "overflow-y: auto",
      data: {
        ClientID: ID
      }
    });
  }

  onSubmit(form: NgForm) {
    //BLBase function
    var objVendor = new Vendor();
    objVendor.ID = this.formData.ID;
    objVendor.Title = this.formData.Title;
    //objVendor.IndustryId = this.formData.IndustryId;

    var objIndustry = {
      results: this.selectedIndustryID
    }

    var objSpecialty = {
      results: this.selectedSpecialtyID
    }

    var objState = {
      results: this.selectedStateID
    }

    objVendor.IndustryId = objIndustry;
    objVendor.SpecialtyId = objSpecialty;
    objVendor.StateId = objState;
    objVendor.Accrual = this.formData.Accrual;

    // objVendor.IndustryId2 = this.formData.IndustryId;
    //objVendor.SpecialtyId2 = this.formData.SpecialtyId;
    //objVendor.StateId2 = this.formData.StateId;
    this.insertRecord(objVendor);
  }

  AfterInsert(jsonObject: any) {
    this.saveNotes().then(res => {      
      this.saveVendorChildList().then(res=>{
        this.HideSpinner();
        this.openVendorList();
      })
      
    })

  }

  
  async saveNotes() {
    for (let index = 0; index < this.vendorNotesonCreate.length; index++) {
      const element = this.vendorNotesonCreate[index];
      element.DealID = this.primaryKey;
      element.Modified = null;
      var response = await this.service.createSPItem("Deal Tracker Notes", "Deal Tracker Notes", element).subscribe();
      console.log(response);
    }
  }

  // This is BLBase function. Here we override it.
  AfterUpdate(jsonObject: any) {
    this.DeleteAllChild().then(res => {
        this.saveVendorChildList().then(res=>{
          this.HideSpinner();
          this.openVendorList();
        })
    })    
  }

  async saveVendorChildList(){
    var postCalls = [];

      // Industry      
      for (let index = 0; index < this.selectedIndustryID.length; index++) {
        const element = this.selectedIndustryID[index];        
        var objVendorIndustry = new VendorIndustry();
        objVendorIndustry.IndustryId = element;
        objVendorIndustry.VendorID =  this.primaryKey;        
        postCalls.push(this.service.createSPItem("Vendor Industry", "Vendor Industry", objVendorIndustry).toPromise());        
      }

      // Specialty      
      for (let index = 0; index < this.selectedSpecialtyID.length; index++) {
        const element = this.selectedSpecialtyID[index];        
        var objVendorSpecialty = new VendorSpecialty();
        objVendorSpecialty.SpecialtyId = element;
        objVendorSpecialty.VendorID =  this.primaryKey;        
        postCalls.push(this.service.createSPItem("Vendor Specialty", "Vendor Specialty", objVendorSpecialty).toPromise());        
      }

      // State
      for (let index = 0; index < this.selectedStateID.length; index++) {
        const element = this.selectedStateID[index];        
        var objVendorState = new VendorState();
        objVendorState.StateId = element;
        objVendorState.VendorID =  this.primaryKey;        
        postCalls.push(this.service.createSPItem("Vendor State", "Vendor State", objVendorState).toPromise());        
      }

      return await Promise.all(postCalls)
  }

  SpinnerAfterUpsert(){  
  }

  async DeleteAllChild() {
    var postCalls = [];

    // Industry      
    for (let index = 0; index < this.vendorIndustryData.length; index++) {
      const element = this.vendorIndustryData[index];
      postCalls.push(this.service.deleteItemPromise("Vendor Industry", element.ID).toPromise());
    }

    // Specialty      
    for (let index = 0; index < this.vendorSpecialtyData.length; index++) {
      const element = this.vendorSpecialtyData[index];
      postCalls.push(this.service.deleteItemPromise("Vendor Specialty", element.ID).toPromise());
    }

    // State
    for (let index = 0; index < this.vendorStateData.length; index++) {
      const element = this.vendorStateData[index];
      postCalls.push(this.service.deleteItemPromise("Vendor State", element.ID).toPromise());
    }

    return await Promise.all(postCalls)
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
    this.openVendorList();
  }

  openVendorList(){
    this.router.navigate(['/contact/vendor/list'], { queryParams: { ViewID: this.viewID , parent: 'Views'}});
  }

  // This form function.
  onEdit() {
    //BLBase function
    this.Edit();
  }

  async getIndustryData() {

    const query = {
      select: 'ID, Title',
      orderby: 'Title asc'
    };

    await this.service.readItems("Industry", query).then(res => {
      this.AutoCompIndustry.data = null;
      this.AutoCompIndustry.data = res['d'].results;
      this.AutoCompIndustry.resultObserve();

    });

  }

  vendorIndustryData: VendorIndustry[] = [];
  async getVendorIndustryData() {
    const query = {
      select: 'ID',
      filter: 'VendorID eq '  + this.primaryKey
    };
    await this.service.readItems("Vendor Industry", query).then(res => {
      this.vendorIndustryData = res['d'].results;
      console.log('Vendor Industry uploaded');
      console.log(this.vendorIndustryData);
    });
  }

  vendorSpecialtyData: VendorSpecialty[] = [];
  async getVendorSpecialtyData() {
    const query = {
      select: 'ID',
      filter: 'VendorID eq '  + this.primaryKey
      
    };
    await this.service.readItems("Vendor Specialty", query).then(res => {
      this.vendorSpecialtyData = res['d'].results;
      console.log('Vendor Specialty uploaded');
      console.log(this.vendorSpecialtyData);
    });
  }

  vendorStateData: VendorState[] = [];
  async getVendorStateData() {
    const query = {
      select: 'ID',
      filter: 'VendorID eq '  + this.primaryKey
    };
    await this.service.readItems("Vendor State", query).then(res => {
      this.vendorStateData = res['d'].results;
      console.log('Vendor State uploaded');
      console.log(this.vendorStateData);
    });
  }



  async getSpecialtyData() {

    const query = {
      select: 'ID, Title',
      orderby: 'Title asc'
    };

    await this.service.readItems("Specialty", query).then(res => {
      this.AutoCompSpecialty.data = null;
      this.AutoCompSpecialty.data = res['d'].results;
      this.AutoCompSpecialty.resultObserve();

    });

  }

  async getStateData() {

    const query = {
      select: 'ID, Title',
      orderby: 'Title asc'
    };

    await this.service.readItems("State", query).then(res => {
      this.AutoCompState.data = null;
      this.AutoCompState.data = res['d'].results;
      this.AutoCompState.resultObserve();

    });

  }

  async getNotesData() {

    const query = {
      select: 'ID, Notes, Modified, Editor/Title',
      filter: 'DealID eq ' + this.primaryKey,
      expand: 'Editor',
      orderby: " Id desc"
    };

    await this.service.readItems("Vendor Notes", query).then(res => {
      this.vendorNotesList = res['d'].results;
    });

  }

  getContactData() {
    const query = {
      //select: 'CategoryId, ID, Title, LastName, Company0, JobTitle, Address, Email, Contact, Website, Modified, Editor/Title, Category/Title, Author/ID, Region/Title',     
      select: 'VendorId, ID, Title, LastName, JobTitle, Email, Contact, Vendor/Title',// ,Industry/ID, Industry/Title, Specialty/ID, Specialty/Title, State/ID, State/Title',     
      expand: 'Vendor',//, Industry, Specialty, State',
      filter: "VendorId eq " + this.primaryKey,
      orderby: 'JobTitle,Title asc'

    };



    this.service.readItems("Contacts", query).then(res => {
      this.common.HideSpinner()
      this.clientList = res['d'].results as Client[];
    });
  }

  onNotesAdded(clientNote: VendorNotes) {
    this.vendorNotesonCreate.push(clientNote);

  }
  
  openContactForm() {
    this.router.navigate(['/contact/form/edit'], { queryParams: { vendorID: this.primaryKey, parent: "vendorForm", ViewID: this.viewID } })
  }

  onContactEdit(gen: Client) {
    this.router.navigate(['/contact/form'], { queryParams: { ID: gen.ID, vendorID: this.primaryKey, parent: "vendorForm", ViewID: this.viewID } })
  }


  validateMultiFilters():boolean{    
  
    if(this.selectedIndustryID.length == 0)
      return true;

    if(this.selectedSpecialtyID.length == 0)
      return true;
    
    if(this.selectedStateID.length == 0)
      return true;            

    return false;
  }


}


