import { State } from './../../admin/state/state.model';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { Deal } from '../deal.model';
import { DealMaster } from '../dealmaster.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MDBModalRef, MDBModalService, ToastService } from 'ng-uikit-pro-standard'
import { Contactperson } from '../contactperson.model';
import { SpBLBase } from 'src/app/Base/SpBLBase/SpBLBase.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { CommonService } from '../../../Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { SharePointConfigService } from 'src/app/Base/SharePoint/share-point-config.service';
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { Projecttype } from 'src/app/modules/admin/projecttype/projecttype.model';
import { Dealgroup } from 'src/app/modules/admin/dealgroup/dealgroup.model';
import { Market } from 'src/app/modules/admin/market/market.model';
import { Broker } from 'src/app/modules/admin/broker/broker.model';
import { EventList } from 'src/app/modules/deal/Eventlist.model';
import { Brokerage } from 'src/app/modules/admin/brokerage/brokerage.model';
import { Categorization } from 'src/app/modules/admin/categorization/categorization';
import { SubMarket } from 'src/app/modules/admin/submarket/submarket.model';
import { Status } from 'src/app/modules/admin/status/status.model';
import { ResponsibleParty } from 'src/app/modules/admin/resposibleparty/responsibleparty.model'
import { Vendor } from '../vendor/vendor.model';
import { InvestmentSummary } from '../investmentsummary.model';
import { DealCommentsQuestions } from '../dealcommentsquestions/dealcommentsquestions.model';
import { DealCommentsReplies } from '../dealcommentsreplies/dealcommentsreplies.model';
import { BMRNotesQuestions } from '../bmrnotesquestions/bmrnotesquestions.model';
import { BMRNotesReplies } from '../bmrnotesreplies/bmrnotesreplies.model';
import { unescapeLeadingUnderscores } from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Seller } from '../seller.model';
import { QuickLinks } from '../quicklinks.model';
import { KeyUpcomingDates } from '../keyupcomingdates.model';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LoginUser } from 'src/app/Base/User/login-user';
import { GooglePlaceDirective } from 'src/app/google-place.directive';
import { Address } from 'cluster';
declare var google: any;


@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})

export class DealComponent extends SpBLBase<DealMaster> implements OnInit {
  public modalRef: MDBModalRef;
  primaryKey: number;
  datemask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  AutoCompVendor: Autocomplete<Vendor> = new Autocomplete<Vendor>("Title", "ID");

  AutoCompProjectType: Autocomplete<Projecttype> = new Autocomplete<Projecttype>("Title", "ID");
  AutoCompMarket: Autocomplete<Market> = new Autocomplete<Market>("Title", "ID");
  AutoCompBrokerage: Autocomplete<Brokerage> = new Autocomplete<Brokerage>("Title", "ID");
  AutoCompBroker: Autocomplete<Broker> = new Autocomplete<Broker>("Title", "ID");
  AutoCompCategorization: Autocomplete<Categorization> = new Autocomplete<Categorization>("Title", "ID");
  AutoCompSubMarket: Autocomplete<SubMarket> = new Autocomplete<SubMarket>("Title", "ID");
  AutoCompStatus: Autocomplete<Status> = new Autocomplete<Status>("Title", "ID");
  AutoCompState: Autocomplete<State> = new Autocomplete<State>("Title", "ID");
  AutoCompFunds: Autocomplete<Dealgroup> = new Autocomplete<Dealgroup>("Title", "ID");
  AutoCompResponsibleParty: Autocomplete<ResponsibleParty> = new Autocomplete<ResponsibleParty>("Title", "ID");
  AutoBMRDealTeam: Autocomplete<any> = new Autocomplete<any>("Title", "Id");
  public selectedBMRDealTeam: number[] = [];

  public selectedBrokerage: number[] = [];
  public selectedBrokers: number[] = [];
  public selectedFunds: number[] = [];
  public selectedResponsibleParty: number[] = [];

  ID: number = 0;
  DEALID: number = 0;
  KeyUpcomingrepeating: any[] = [{
    UpcomingDate: '',
    Description: '',
  }];
  Categorization: any[] = ['Tier 1', 'Tier 2', 'Tier 3'
  ]
  Sellerrepeating: any[] = [{
    Title: ''
  }];
  QuickLinks: any[] = [{
    Title: '',
    DocLink: '',
  }];
  EventArray: any[] = [];
  @ViewChild('BMRDealTeam') BMRDealTeam: MatSelect;
  @ViewChild('Brokerage') Brokerage: MatSelect;
  @ViewChild('Brokers') Brokers: MatSelect;
  @ViewChild('ResponsibleParty') ResponsibleParty: MatSelect;
  objInvestmentSummary: InvestmentSummary;
  objDealCommentsQuestions: DealCommentsQuestions;
  dealCommentsReplies: DealCommentsReplies = new DealCommentsReplies();
  bmrNotesReplies: BMRNotesReplies = new BMRNotesReplies();
  objBMRNotesQuestions: BMRNotesQuestions;
  objSeller: Seller;
  objQuickLinks: QuickLinks;
  objKeyUpcomingDates: KeyUpcomingDates;

  constructor(
    public service: SPOperationsService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,
    public modalService: MDBModalService,
    public messageDialoge: MessageDialogeService,
    public common: CommonService,
    public spConfigService: SharePointConfigService
  ) {
    super(service, router, route, spinner, toast, dialog, messageDialoge);
    this.formTitle = "Deal Master";
    this.addListTitle("DealMaster", "DealMaster");
    this.query = {
      select: "ID, Title,DateEntered,Address", //Need to add all Master list columns
    }
  }
  public Initializeobject() {
    this.formData = new DealMaster();
    this.objInvestmentSummary = new InvestmentSummary();
    this.objDealCommentsQuestions = new DealCommentsQuestions();
    this.objBMRNotesQuestions = new BMRNotesQuestions();
    this.objSeller = new Seller();
    this.objKeyUpcomingDates = new KeyUpcomingDates();
    this.objQuickLinks = new QuickLinks();
  }
  ngOnInit(): void {
    super.ngOnInit();
    if (LoginUser.userRole == 'visitor') {
      this.router.navigate(['/home']);
    } else {
      this.getMarkets();
      this.getDealTeamUsers();
      this.getCategorization();
      this.getProjectTypes();
      this.getBrokerage();
      this.getBroker();
      this.getStatus();
      this.getFunds();
      this.getResponsibleParty();
      this.getState();
      this.getEvents();
      this.modalService.closed.subscribe(() => {
        console.log('closed')
      });
      this.route.queryParams
        .subscribe(params => {
          this.ID = params['ID'] || 0;
        });
    }

  }
  isPurchasePriceEnabled: boolean = true;
  isPurchasePricePSFEnabled: boolean = true;
  AfterInit() {
    this.formData.ID = Number(this.ID);
  }
  selectionMarket(value: any) {
    if (value.value != undefined) {
      this.getSubMarket(value);
    } else {
      this.AutoCompSubMarket.data = [];
      this.AutoCompSubMarket.resultObserve();
    }
  }

  getBrokerage() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    this.service.readItems("Brokerage", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompBrokerage.data = res['d'].results as Brokerage[];
      this.AutoCompBrokerage.resultObserve();
    });
  }
  getBroker() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    this.service.readItems("Brokers", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompBroker.data = res['d'].results as Broker[];
      this.AutoCompBroker.resultObserve();
    });
  }
  getResponsibleParty() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    this.service.readItems("ResponsibleParty", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompResponsibleParty.data = res['d'].results as ResponsibleParty[];
      this.AutoCompResponsibleParty.resultObserve();
    });
  }
  getFunds() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    this.service.readItems("Funds", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompFunds.data = res['d'].results as Dealgroup[];
      this.AutoCompFunds.resultObserve();
    });
  }

  // ====================================================== Save =====================================
  //#region
  onSubmit(form: NgForm) {
    //BLBase function
    let objDeal = new DealMaster();
    objDeal.ID = this.formData.ID;
    objDeal.Title = this.formData.Title;
    objDeal.DateEntered = this.formData.DateEntered;
    objDeal.Address = this.formData.Address;
    objDeal.City = this.formData.City;
    objDeal.ZipCode = this.formData.ZipCode;
    objDeal.Longitude = this.formData.Longitude;
    objDeal.Latitude = this.formData.Latitude;
    objDeal.Description = this.formData.Description;
    objDeal.MarketId = this.formData.MarketId;
    objDeal.SubMarketId = this.formData.SubMarketId;

    objDeal.ProjectTypeId = this.formData.ProjectTypeId;
    objDeal.StatusId = this.formData.StatusId;
    objDeal.StateId = this.formData.StateId;
    objDeal.ReportOutput = this.formData.ReportOutput;
    objDeal.CategorizationId = this.formData.CategorizationId;

    // create array of IDs for Brokerage e.g - [1,2]
    var objBrokerage = {
      results: this.selectedBrokerage
    }
    objDeal.BrokerageId = objBrokerage;
    // create array of IDs for Brokers e.g - [1,2]
    var objBrokers = {
      results: this.selectedBrokers
    }
    objDeal.BrokersId = objBrokers;
    // create array of IDs for DealTeam e.g - [1,2]
    var objDealTeam = {
      results: this.selectedBMRDealTeam
    }
    objDeal.BMRDealTeamId = objDealTeam;

    // create array of IDs for Responsible Party e.g - [1,2]
    var objResponsibleParty = {
      results: this.selectedResponsibleParty
    }
    objDeal.ResponsiblePartyId = objResponsibleParty;

    delete objDeal.FootnotesId;
    this.insertRecord(objDeal);
  }

  // it runs after item creation
  AfterInsert(jsonObject: any) {
    this.ShowSpinner();
    this.SaveInvestmentSummary().then(res => {
      Promise.all(
        [
          //this.SaveCreateDeleteInfo(),
          this.createImageFolder(),
          this.SaveKeyUpcoming(),
          this.SaveSeller(),
          this.SaveQuickLinks(),
          //this.SaveBMRNotes(),
          //this.SaveDealComments(),
        ]).then(res => {
          setTimeout(() => {
            this.router.navigate(['/portal/deals/list'], {
              queryParams: {
                status: 'All'
              }
            });
          }, 1000);
        })
    })


  }

  // AfterInsert(jsonObject: any) {
  //   this.ShowSpinner();
  //   Promise.all(
  //     [
  //       this.SaveInvestmentSummary()

  //     ]).then(res => {
  //       //this.SaveCreateDeleteInfo(),
  //       this.createImageFolder(),
  //         this.SaveKeyUpcoming(),
  //         this.SaveSeller(),
  //         this.SaveQuickLinks(),
  //       //this.SaveBMRNotes(),
  //       //this.SaveDealComments(),
  //       this.common.HideSpinner();
  //       setTimeout(() => {
  //         this.router.navigate(['/portal/deals/list'], {
  //           queryParams: {
  //             status: 'All'
  //           }
  //         });
  //       }, 1000);


  //     })
  // }

  createImageFolder() {
    this.service.createFolder('DealImages', 'Deal_' + this.primaryKey).then(res => {
      // console.log("folder created ... !");
    }, error => {
      console.log(error);
    });
  }
  async SaveInvestmentSummary() {
    let objIS = new InvestmentSummary();
    objIS.DealId = this.primaryKey;
    objIS.ID = this.objInvestmentSummary.ID;
    objIS.AnalysisStartDate = this.objInvestmentSummary.AnalysisStartDate;
    objIS.EstCompletionDate = this.objInvestmentSummary.EstCompletionDate;
    objIS.InPlaceRSF = this.objInvestmentSummary.InPlaceRSF;
    objIS.StabilizedRSF = this.objInvestmentSummary.StabilizedRSF;
    objIS.PurchasePrice = this.objInvestmentSummary.PurchasePrice;
    objIS.PurchasePricePSF = this.objInvestmentSummary.PurchasePricePSF;
    objIS.StabilizedBasis = this.objInvestmentSummary.StabilizedBasis;
    objIS.StabilizedBasisPSF = this.objInvestmentSummary.StabilizedBasisPSF;
    objIS.LabMarketRentPSFAnn = this.objInvestmentSummary.LabMarketRentPSFAnn;
    objIS.LabMarketRentPSFMon = this.objInvestmentSummary.LabMarketRentPSFMon;
    objIS.HardCostsPSF = this.objInvestmentSummary.HardCostsPSF;
    objIS.TenantImprovementsPSF = this.objInvestmentSummary.TenantImprovementsPSF;
    objIS.ConversionCostPSF = this.objInvestmentSummary.ConversionCostPSF;
    objIS.UntrendedYoC = this.objInvestmentSummary.UntrendedYoC;
    // create array of IDs for Funds e.g - [1,2]
    var objFunds = {
      results: this.selectedFunds
    }
    objIS.FundsId = objFunds;
    delete objIS.Funds;
    await this.service.createSPItem("InvestmentSummary", "InvestmentSummary", objIS).toPromise().then(res => {
      console.log(res);
    })
  }

  async SaveBMRNotes() {
    if (this.objBMRNotesQuestions.Title != null || this.objBMRNotesQuestions.Title != undefined) {
      var objBN = new BMRNotesQuestions();
      objBN.DealId = this.primaryKey;
      objBN.ID = this.objBMRNotesQuestions.ID;
      objBN.Title = this.objBMRNotesQuestions.Title;
      // create array of IDs for Brokers e.g - [1,2]

      var objBMRNotes = {
        results: this.selectedBMRDealTeam
      }
      objBN.ReceipentsId = objBMRNotes;


      await this.service.createSPItem("BMR Notes Discussion Questions", "BMR Notes Discussion Questions", objBN).subscribe(res => {
        this.SaveBMRNotesReplies(res);
      })
    }
  }
  async SaveBMRNotesReplies(data) {
    console.log(data);
    if (this.objBMRNotesQuestions.Title != null || this.objBMRNotesQuestions.Title != undefined) {
      this.bmrNotesReplies.DealId = this.primaryKey;
      this.bmrNotesReplies.intDealID = this.primaryKey;
      this.bmrNotesReplies.QuestionId = data.d.ID;
      this.bmrNotesReplies.intQuestionID = data.d.ID;
      this.bmrNotesReplies.ReplyNo = 1;
      this.bmrNotesReplies.Title = "Question";
      this.bmrNotesReplies.Reply = this.objBMRNotesQuestions.Title;
      // create array of IDs for Brokers e.g - [1,2]
      var objReceipentsId = {
        results: this.selectedBMRDealTeam
      }

      this.bmrNotesReplies.ReceipentsId = objReceipentsId


      await this.service.createSPItem("BMR Notes Discussion Replies", "BMR Notes Discussion Replies", this.bmrNotesReplies).subscribe(res => { })
    }
  }

  async SaveDealComments() {
    if (this.objDealCommentsQuestions.Title != null) {
      var objDC = new DealCommentsQuestions();
      objDC.DealId = this.primaryKey;
      objDC.ID = this.objDealCommentsQuestions.ID;
      objDC.Title = this.objDealCommentsQuestions.Title;

      var objBMRNotes = {
        results: this.selectedBMRDealTeam
      }
      objDC.ReceipentsId = objBMRNotes;

      await this.service.createSPItem("Deal Comments Discussion Questions", "Deal Comments Discussion Questions", objDC).subscribe(res => {
        this.SaveDealCommentsrReplies(res);
      })
    }
  }

  async SaveDealCommentsrReplies(data) {
    console.log(data);
    if (this.objDealCommentsQuestions.Title != null || this.objDealCommentsQuestions.Title != undefined) {
      this.dealCommentsReplies.DealId = this.primaryKey;
      this.dealCommentsReplies.intDealID = this.primaryKey;
      this.dealCommentsReplies.QuestionId = data.d.ID;
      this.dealCommentsReplies.intQuestionID = data.d.ID;
      this.dealCommentsReplies.ReplyNo = 1;
      this.dealCommentsReplies.Title = "Question";
      this.dealCommentsReplies.Reply = this.objDealCommentsQuestions.Title;
      // create array of IDs for Brokers e.g - [1,2]
      var objReceipentsId = {
        results: this.selectedBMRDealTeam
      }

      this.dealCommentsReplies.ReceipentsId = objReceipentsId


      await this.service.createSPItem("Deal Comments Discussion Replies", "Deal Comments Discussion Replies", this.dealCommentsReplies).subscribe(res => { })
    }
  }

  // ================ Save Key Upcoming Dates ==========================
  //#region
  async SaveKeyUpcoming() {
    if (this.KeyUpcomingrepeating.length >= 0) {
      var postCalls = [];
      for (let index = 0; index < this.KeyUpcomingrepeating.length; index++) {
        const element = this.KeyUpcomingrepeating[index];
        if (element.Description != '' || element.UpcomingDate != '') {
          var objKUD = new KeyUpcomingDates();
          objKUD.ID = 0;
          objKUD.DealId = this.primaryKey;
          objKUD.KeyUpcomingDate = element.UpcomingDate;
          objKUD.Title = element.Description;
          objKUD.EventListId = element.EventListId;
          objKUD.EventListText = element.EventListText;
          postCalls.push(this.service.createSPItem("KeyUpcomingDates", "KeyUpcomingDates", objKUD).toPromise());
        }
      }
    }
  }

  AddKeyUpcomingRow() {
    if (this.KeyUpcomingrepeating.length >= 0) {
      this.KeyUpcomingrepeating.push({
        UpcomingDate: '',
        Description: '',
      });
    }
  }

  DeleteRow(index: number) {
    if (this.KeyUpcomingrepeating.length != 1) {
      this.dialog.openConfirmDialog("Are you sure you want to delete this row?").afterClosed().subscribe(res => {
        if (res) {
          this.KeyUpcomingrepeating.splice(index, 1);
        }
      })
    }
  }
  //#endregion
  // ================ Save Key Upcoming Dates - END ====================

  // ================ Save Quick Links =================================
  //#region
  async SaveQuickLinks() {
    if (this.QuickLinks.length >= 0) {
      var postCalls = [];
      for (let index = 0; index < this.QuickLinks.length; index++) {
        const element = this.QuickLinks[index];
        if (element.Title != '' && element.DocLink != '') {
          var objQL = new QuickLinks();
          objQL.ID = 0;
          objQL.DealId = this.primaryKey;
          objQL.DocLink = element.DocLink;
          objQL.Title = element.Title;
          objQL.OrderBy = element.OrderBy
          postCalls.push(this.service.createSPItem("Quick Links", "Quick Links", objQL).toPromise());
        }
      }
    }
  }
  AddQuickLinksRow() {
    if (this.QuickLinks.length >= 0) {
      this.QuickLinks.push({
        OrderBy: 1,
        Title: '',
        DocLink: '',

      });
    }
  }
  DeleteRowQuickLinks(index: number) {
    if (this.QuickLinks.length != 1) {
      this.dialog.openConfirmDialog("Are you sure you want to delete this row?").afterClosed().subscribe(res => {
        if (res) {
          this.QuickLinks.splice(index, 1);
        }
      })
    }
  }
  //#endregion
  // ================ Save Quick Links - END ===========================

  // ================ Save Seller ======================================
  //#region
  async SaveSeller() {
    if (this.Sellerrepeating.length >= 0) {
      var postCalls = [];
      // Industry
      for (let index = 0; index < this.Sellerrepeating.length; index++) {
        const element = this.Sellerrepeating[index];
        if (element.Title != '') {
          var objS = new Seller();
          objS.ID = 0;
          objS.DealId = this.primaryKey;
          objS.Title = element.Title;
          postCalls.push(this.service.createSPItem("Seller", "Seller", objS).toPromise());
        }
      }
    }
  }

  AddSellerRow() {
    if (this.Sellerrepeating.length >= 0) {
      this.Sellerrepeating.push({
        Title: ''
      });
    }
  }

  DeleteRowSeller(index: number) {
    if (this.Sellerrepeating.length != 1) {
      this.dialog.openConfirmDialog("Are you sure you want to delete this row?").afterClosed().subscribe(res => {
        if (res) {
          this.Sellerrepeating.splice(index, 1);
        }
      })
    }
  }
  //#endregion
  // ================ Save Seller - END ================================

  //#endregion
  // ====================================================== Save - End =====================================

  // ====================================================== Common Functions =====================================
  //#region
  getSubMarket(value) {
    this.common.ShowSpinner();
    const query = {
      select: 'ID, Title, MarketId,Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: '(Inactive eq true or Inactive eq null) and MarketId eq ' + value.value,
      orderby: 'Title asc'
    };
    this.service.readItems("SubMarket", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompSubMarket.data = res['d'].results as SubMarket[];
      this.AutoCompSubMarket.resultObserve();
    });
  }
  getCategorization() {
    this.common.ShowSpinner
    const query = {
      select: 'ID, Title, Inactive,Modified',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    }
    this.service.readItems('Categorization', query).then(res => {
      this.common.HideSpinner();
      this.AutoCompCategorization.data = res['d'].results as Categorization[];
      this.AutoCompCategorization.resultObserve()
    })
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
    });
  }

  getEvents() {
    const query = {
      select: 'ID, Title',
      orderby: 'ID asc'
    };
    this.service.readItems("EventList", query).then(res => {
      this.common.HideSpinner();
      this.EventArray = res['d'].results as EventList[];

    });
  }

  allSelected = true;
  toggleAllSelection(value) {

    this.allSelected = !this.allSelected; // to control select-unselect
    if (this.allSelected) {
      if (value == "BMR Deal Team")
        this.BMRDealTeam.options.forEach((item: MatOption) => item.select());
      else if (value == "Brokerage")
        this.Brokerage.options.forEach((item: MatOption) => item.select());
      else if (value == "Brokers")
        this.Brokers.options.forEach((item: MatOption) => item.select());
      else if (value == "ResponsibleParty")
        this.ResponsibleParty.options.forEach((item: MatOption) => item.select());
    } else {
      if (value == "BMR Deal Team")
        this.BMRDealTeam.options.forEach((item: MatOption) => {
          item.deselect()
        });
      else if (value == "Brokerage")
        this.Brokerage.options.forEach((item: MatOption) => {
          item.deselect()
        });
      else if (value == "Brokers")
        this.Brokers.options.forEach((item: MatOption) => {
          item.deselect()
        });
      else if (value == "ResponsibleParty")
        this.ResponsibleParty.options.forEach((item: MatOption) => {
          item.deselect()
        });
    }
  }

  getDealTeamUsers() {
    this.service.getUsersByGroupName("DT Contributors").then(res => {
      // console.log(res);
      this.AutoBMRDealTeam.data = null;
      this.AutoBMRDealTeam.data = res['d']['results'] as any[];
      this.AutoBMRDealTeam.resultObserve();

    })
  }
  getState() {
    const query = {
      select: 'ID, Title, Name, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    this.service.readItems("States", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompState.data = res['d'].results as State[];
      this.AutoCompState.resultObserve();
    });
  }
  getStatus() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    this.service.readItems("Status", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompStatus.data = res['d'].results as Status[];
      this.AutoCompStatus.resultObserve();
    });
  }

  getProjectTypes() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'SortNo asc'
    };
    this.service.readItems("ProjectType", query).then(res => {
      this.common.HideSpinner();
      this.AutoCompProjectType.data = res['d'].results as Projecttype[];
      this.AutoCompProjectType.resultObserve();
    });
  }

  onBack() {
    this.router.navigate(['/home']);
  }
  reload() {
    this.router.navigate(['/portal/form']);
  }
  onDashboard() {
    this.router.navigate(['/portal/deals/list']);
  }
  calPurchasePrice(text: any) {
    if (text == 'PurchasePrice') {
      let val = this.objInvestmentSummary.PurchasePrice / this.objInvestmentSummary.InPlaceRSF;
      val = Math.round(val);
      this.objInvestmentSummary.PurchasePricePSF = val == NaN ? 0 : val;
    } else if (text == 'PurchasePricePSF') {
      let val = this.objInvestmentSummary.PurchasePricePSF * this.objInvestmentSummary.InPlaceRSF
      val = Math.round(val);
      this.objInvestmentSummary.PurchasePrice = val == undefined ? 0 : val;
    } else if (text == 'InPlaceRSF') {
      if (this.objInvestmentSummary.InPlaceRSF == null || this.objInvestmentSummary.InPlaceRSF == 0) {
        this.objInvestmentSummary.PurchasePrice = 0;
        this.objInvestmentSummary.PurchasePricePSF = 0;
      } else {
        // PurchasePrice
        let val = this.objInvestmentSummary.PurchasePrice / this.objInvestmentSummary.InPlaceRSF;
        val = Math.round(val);
        this.objInvestmentSummary.PurchasePricePSF = val == NaN ? 0 : val;
        // PurchasePricePSF
        let val1 = this.objInvestmentSummary.PurchasePricePSF * this.objInvestmentSummary.InPlaceRSF
        val1 = Math.round(val1);
        this.objInvestmentSummary.PurchasePrice = val1 == undefined ? 0 : val1;
      }

    }
  }

  calStabilized(text) {
    if (text == 'StabilizedBasis') {
      let val = this.objInvestmentSummary.StabilizedBasis / this.objInvestmentSummary.StabilizedRSF;
      val = Math.round(val);
      this.objInvestmentSummary.StabilizedBasisPSF = val == NaN ? 0 : val;
    } else if (text == 'StabilizedBasisPSF') {
      let val = this.objInvestmentSummary.StabilizedBasisPSF * this.objInvestmentSummary.StabilizedRSF
      val = Math.round(val);
      this.objInvestmentSummary.StabilizedBasis = val == undefined ? 0 : val;
    } else if ('StabilizedRSF') {
      if (this.objInvestmentSummary.StabilizedRSF == null || this.objInvestmentSummary.StabilizedRSF == 0) {
        this.objInvestmentSummary.StabilizedBasis = 0;
        this.objInvestmentSummary.StabilizedBasisPSF = 0;
      } else {
        // StabilizedBasis
        let val = this.objInvestmentSummary.StabilizedBasis / this.objInvestmentSummary.StabilizedRSF;
        val = Math.round(val);
        this.objInvestmentSummary.StabilizedBasisPSF = val == NaN ? 0 : val;
        // StabilizedBasisPSF
        let val1 = this.objInvestmentSummary.StabilizedBasisPSF * this.objInvestmentSummary.StabilizedRSF
        val1 = Math.round(val1);
        this.objInvestmentSummary.StabilizedBasis = val1 == undefined ? 0 : val1;
      }
    }
  }

  stabilizedrsf: number = null;
  stabilizedbasis: number = null;
  stabilizedbasispsf: number = null;
  calculatestabilized(value) {
    this.stabilizedbasispsf = value / this.stabilizedrsf;
  }
  labmrketann: number = null;
  labmrketmon: number = null;

  calLabMarket() {
    this.objInvestmentSummary.LabMarketRentPSFMon = this.objInvestmentSummary.LabMarketRentPSFAnn / 12;
  }

  calLabMarketMon() {
    this.objInvestmentSummary.LabMarketRentPSFAnn = this.objInvestmentSummary.LabMarketRentPSFMon * 12;
  }
  //#endregion
  // ====================================================== Common Functions - End =====================================

  // ====================================================== Map ==========================================
  //#region
  public autocomplete: any;
  public Placeoptions: any = {
    // componentRestrictions: { country: ["us"] },
    fields: ["address_components", "geometry", "geometry/location"],
    types: ["address"]
  }

  @ViewChild("placesRef") placesRef: HTMLInputElement;

  public handleAddressChange(address: any) {
    console.log(address.address_components);
    for (var index = 0; index < address.address_components.length; index++) {
      // address is being binded automatically with the field, no need to add address again.
      // if(address.address_components[index].types[0] == 'street_number' || address.address_components[index].types[0] == 'route'|| address.address_components[index].types[0] == 'locality')
      // this.formData.Address += address.address_components[index].short_name;

      // city
      if (address.address_components[index].types[0] == 'locality') {
        this.formData.City = address.address_components[index].short_name;
      }
      // state
      else if (address.address_components[index].types[0] == 'administrative_area_level_1') {
        let state = this.AutoCompState.data.filter(a => {
          return a.Title === address.address_components[index].short_name
        });
        this.formData.StateId = state[0].ID
      }


      // zip code
      else if (address.address_components[index].types[0] == 'postal_code') {
        this.formData.ZipCode = address.address_components[index].short_name;
      }
    }
    // latitude and longitutude
    this.formData.Address = address.formatted_address;
    this.formData.Longitude = address.geometry.location.lng();
    this.formData.Latitude = address.geometry.location.lat();
  }

  onEmptyAddress() {
    if (this.formData.Address == '' || this.formData.Address == null) {
      this.formData.Longitude = null;
      this.formData.Latitude = null;
      this.formData.City = null;
      this.formData.StateId = null;
      this.formData.ZipCode = null;
    }
  }
  //#endregion
}
