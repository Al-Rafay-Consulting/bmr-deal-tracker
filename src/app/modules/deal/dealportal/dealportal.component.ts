import { QuickLinks } from './../quicklinks.model';

// ============================================================== imports
//#region
import { KeyUpcomingDates } from './../keyupcomingdates.model';
import { InvestmentSummary } from './../investmentsummary.model';
import { Seller } from '../seller.model';
import { Deal } from 'src/app/modules/deal/deal.model';
import { EventList } from 'src/app/modules/deal/Eventlist.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { MDBModalService, ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { GeneralService } from '../../../services/general.service';
import { SharePointConfigService } from '../../../Base/SharePoint/share-point-config.service';
import { CommonService } from '../../../Base/Common.service';
import { SpBLBase } from 'src/app/Base/SpBLBase/SpBLBase.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { getStartOffsetOfAttribute } from '@angular/cdk/schematics';
import { Broker } from 'src/app/modules/admin/broker/broker.model';
import { Brokerage } from 'src/app/modules/admin/brokerage/brokerage.model';
import { Dealgroup } from 'src/app/modules/admin/dealgroup/dealgroup.model';
import { Footnotes } from 'src/app/modules/admin/footnotes/footnotes.model';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import * as customConfig from 'src/app/customConfig.json';
import { GooglePlaceDirective } from 'src/app/google-place.directive';
import { Address } from 'cluster';
// import { State } from './../../admin/state/state.model';
import { GenericService } from 'src/app/services/generic.service';
import { DealMaster } from '../dealmaster.model';
import { NgForm } from '@angular/forms';
import { Contactperson } from '../contactperson.model';
declare var google: any;
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dealportal',
  templateUrl: './dealportal.component.html',
  styleUrls: ['./dealportal.component.scss']
})
//#endregion


export class DealportalComponent extends SpBLBase<Deal> implements OnInit {
  // ================================ variables ======================
  //#region
  primaryKey: number = 0;
  PropertyName: string = "";
  vendorNotesList: any[] = [];
  isLinear = false;
  longitude = -87.623177;
  latitude = 41.881832;

  repeating: any[] = [];
  contactData: any = null;
  Sellerrepeating: any[] = [];
  itemsList: any[] = [];
  protected _onDestroy = new Subject<void>();

  private keyUpcomingDate_Obj: any = {
    ID: 0,
    DealId: 0,
    date: null,
    description: null
  };

  Sellerarray: any[] = [{
    name: ''
  }];
  section: string = "";
  questionId: number = 0;
  public dealItem: any = {};
  public dealItem_Edit: any = {};

  public investmentSummary: InvestmentSummary = new InvestmentSummary();
  public investmentSummary_Edit: InvestmentSummary = new InvestmentSummary();

  public sellerItem: Seller[] = [];
  public sellerItem_Edit: Seller[] = [];

  public KeyUpcomingDates: KeyUpcomingDates[] = [];
  public KeyUpcomingDates_Edit: KeyUpcomingDates[] = [];

  public QuickLinks: QuickLinks[] = [];
  public QuickLinks_Edit: QuickLinks[] = [];

  public fundItem: any = {};
  // ==========================
  EventArray: any[] = [];
  actionType: string = "";
  BPAID: number = 0;
  folderName: string = '';
  action: Subject<any[]> = new Subject<any[]>();
  Documents = [];
  attachments: any[] = [];
  filesToUpload: FileList | null = null;
  fileStore = [];
  // =========================



  AutoCompBrokerage: Autocomplete<Brokerage> = new Autocomplete<Brokerage>("Title", "ID");
  AutoCompBroker: Autocomplete<Broker> = new Autocomplete<Broker>("Title", "ID");
  AutoBMRDealTeam: Autocomplete<any> = new Autocomplete<any>("Title", "Id");

  AutoCompFunds: Autocomplete<Dealgroup> = new Autocomplete<Dealgroup>("Title", "ID");
  @ViewChild('BMRDealTeam') BMRDealTeam: MatSelect;
  @ViewChild('Footnotes') Footnotes: MatSelect;
  @ViewChild('Brokerage') Brokerage: MatSelect;
  @ViewChild('Dealgroup') Dealgroup: MatSelect;
  @ViewChild('Brokers') Brokers: MatSelect;
  @ViewChild('ResponsibleParty') ResponsibleParty: MatSelect;
  @ViewChild('staticTabs') public tabs;
  //#endregion

  constructor(
    public service: SPOperationsService,
    public router: Router,
    public modalService: MDBModalService,
    public common: CommonService,
    public spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    public toast: ToastService,
    public _formBuilder: FormBuilder,
    public dialog: ConfirmDialogeService,
    public genService: GeneralService,
    public spConfigService: SharePointConfigService,
    public messageDialog?: MessageDialogeService,
  ) {
    super(service, router, route, spinner, toast, dialog, messageDialog);
    this.common.hideGlobalSearch = true;
  }

  public Initializeobject() {
    this.formData = new Deal();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.queryParams.subscribe(params => {
      this.primaryKey = params['dealID'] || null;
    });
    this.AddKeyUpcomingDateRow();
    this.AddSellerRow();
    this.AddQuickLinksRow();
    // deals data
    this.getDealData();
    this.getInvestmentData();
    this.getSellerData();
    this.getKeyUpcomingDatesData();
    this.getEvents();
    this.getQuickLinks();
    this.getDealImages();


  }

  public imageString = '';
  public originalFolder = null;
  public copyFolderName = null;

  public images_Edit = [];
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
  getDealImages() {
    this.images = [];
    this.images_Edit = [];
    this.service.getDocumentsFromDocumentLibraryBPA('DealImages', 'Deal_' + this.primaryKey).then(res => {
      let items = res[0]['d'].results;
      for (let k = 0; k < items.length; k++) {
        let item = {
          img: customConfig.baseUrl + items[k].ServerRelativeUrl,
          thumb: customConfig.baseUrl + items[k].ServerRelativeUrl,
          description: items[k].Name,
          relativeURL: items[k].ServerRelativeUrl
        }
        this.images.push(item);
        this.images_Edit.push(item);
      }
      this.imageString = JSON.stringify(this.images);
    }, error => {
      console.log(error);
    });
  }

  @ViewChild('copyImg') copyImg: ElementRef<HTMLElement>;
  @ViewChild('orgFolder') orgFolder: ElementRef<HTMLDivElement>;
  @ViewChild('copyFolder') copyFolder: ElementRef<HTMLDivElement>;
  copyDealImages() {
    this.originalFolder = 'Deal_' + this.primaryKey;
    this.copyFolderName = 'Deal_' + this.copyPrimaryKey;
    console.log(this.originalFolder);
    console.log(this.copyFolderName);
    // orgFolder
    let org: HTMLDivElement = this.orgFolder.nativeElement;
    org.innerText = this.originalFolder;
    // copyFolder
    let cpp: HTMLDivElement = this.copyFolder.nativeElement;
    cpp.innerText = this.copyFolderName;
    // button
    let el: HTMLElement = this.copyImg.nativeElement;
    el.click();
  }

  handleFileInput(files: FileList, index?: number) {
    this.filesToUpload = files;
    this.fileStore.push({ "Department": this.folderName, "InputGroupGuid": '', 'AttachedFileGUID': 0, "files": files, "index": 1 });
  }

  async saveImages(frame: ModalDirective) {
    await this.service.uploadDepartmentFiles("DealImages", 'Deal_' + this.primaryKey, this.fileStore).then(res => {
      setTimeout(() => {
        this.common.ShowToast("Attachment Uploaded Successfully", ToastType.Success);
        this.common.HideSpinner();
        this.getDealImages();
        this.action.next();
      }, 2000);
      frame.hide();
    },
      error => {
        console.error(error);
        this.common.HideSpinner();
        this.messageDialog.openMessageDialog("Some thing wrong. Documents are not uploaded. Please contact to Dev team.");
      }
    );
  }

  ngAfterViewInit() {
    var tabName = "";
    this.route.queryParams
      .subscribe(params => {
        tabName = params['tab'] || '';
        this.section = params['section'] || '';
        this.questionId = params['questionId'] || 0;
      });
    if (tabName == "dealcomments")
      this.tabs.setActiveTab(2);
    if (tabName == "bmrnotes")
      this.tabs.setActiveTab(3);
    // else if (tabName == "questions")
    //this.stepper.selectedIndex = 2;
    //else if (tabName == "tasks")
    //this.stepper.selectedIndex = 3;

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // ================================================== Get select options =====================================
  //#region
  getOptions() {
    this.getMarkets();
    this.getDealTeamUsers();
    // this.getSubMarkets();
    this.getState();
    this.getProjectType();

    this.getStatus();
    this.getResponsibleParty();
    this.getBrokers();
    this.getCategorization();
    this.gerBrokerage();
    this.getFootnotes();
  }

  public DealTeam_all: ExpandedTitle[] = [];
  public selectedDealTeam: ExpandedTitle[] = [];
  public selectedDealTeam_Copy: ExpandedTitle[] = [];



  async getDealTeamUsers() {
    this.DealTeam_all = [];

    await this.service.getUsersByGroupName("DT Contributors").then(res => {
      let items = res['d'].results;
      for (let k = 0; k < items.length; k++) {
        let item = {
          Id: items[k].Id,
          ID: items[k].Id,
          Title: items[k].Title
        }
        this.DealTeam_all.push(item);

      }
      if (this.dealItem.BMRDealTeamId != null) {
        this.selectedDealTeam = this.dealItem.BMRDealTeamId.results;
        this.selectedDealTeam_Copy = this.dealItem.BMRDealTeamId.results;
      }

    });
  }

  public Footnotes_all: ExpandedTitle[] = [];
  public selectedFootnotes: ExpandedTitle[] = [];
  public selectedFootnotes_Copy: ExpandedTitle[] = [];
  async getFootnotes() {
    this.Footnotes_all = [];
    const query = {
      select: 'ID, Title',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'ID'
    };
    await this.service.readItems("Footnotes", query).then(res => {
      let items = res['d'].results;
      for (let k = 0; k < items.length; k++) {
        let item = {
          Id: items[k].Id,
          ID: items[k].Id,
          Title: items[k].Title
        }
        this.Footnotes_all.push(item);
      }
      if (this.dealItem.FootnotesId != null) {
        this.selectedFootnotes = this.dealItem.FootnotesId.results;
        this.selectedFootnotes_Copy = this.dealItem.FootnotesId.results;
      }
    });
  }

  public markets_all: ExpandedTitle[] = [];
  public selectedMarket: ExpandedTitle = new ExpandedTitle();

  async getMarkets() {
    this.markets_all = [];
    const query = {
      select: 'Id, Title',
      orderby: 'Title'
    };
    await this.service.readItems("Market", query).then(res => {
      this.markets_all = res['d'].results;
      let filtered = this.markets_all.filter(a => {
        return a.Id === this.dealItem_Edit.Market.ID
      });
      this.selectedMarket = filtered[0];
      this.getSubMarkets(this.selectedMarket.ID);
    });
  }

  public subMarkets_all: ExpandedTitle[] = [];
  public selectedSubMarket: ExpandedTitle = new ExpandedTitle();
  async getSubMarkets(MarketID: any) {
    this.subMarkets_all = [];
    const query = {
      select: 'ID, Title, MarketId,Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: '(Inactive eq true or Inactive eq null) and MarketId eq ' + MarketID,
      orderby: 'Title asc'
    };
    await this.service.readItems("SubMarket", query).then(res => {
      this.subMarkets_all = res['d'].results;
      let filtered = this.subMarkets_all.filter(a => {
        return a.Id === this.dealItem_Edit.SubMarket.ID
      });
      this.selectedSubMarket = filtered[0];
    });
  }

  public projectType_all: ExpandedTitle[] = [];
  public selectedProjectType: ExpandedTitle = new ExpandedTitle();
  async getProjectType() {
    this.projectType_all = [];
    const query = {
      select: 'ID, Title',
      orderby: 'SortNo'
    };
    await this.service.readItems("ProjectType", query).then(res => {
      this.projectType_all = res['d'].results;
      let filtered = this.projectType_all.filter(a => {
        return a.Id === this.dealItem_Edit.ProjectType.ID
      });
      this.selectedProjectType = filtered[0];
    });
  }

  public dealType_all: ExpandedTitle[] = [];
  public selectedDealType: ExpandedTitle = new ExpandedTitle();


  public status_all: ExpandedTitle[] = [];
  public currency_all: ExpandedTitle[] = [];
  public selectedStatus: ExpandedTitle = new ExpandedTitle();
  public selectedCurrency: ExpandedTitle = new ExpandedTitle();
  async getStatus() {
    this.status_all = [];
    const query = {
      select: 'ID, Title',
      orderby: 'Title'
    };
    await this.service.readItems("Status", query).then(res => {
      this.status_all = res['d'].results;
      let filtered = this.status_all.filter(a => {
        return a.Id === this.dealItem_Edit.Status.ID
      });
      this.selectedStatus = filtered[0];
    });
  }
  async getCurrency() {
    this.currency_all = [];
    const query = {
      select: 'ID, Title',
      orderby: 'Title'
    };
    await this.service.readItems("Currency", query).then(res => {
      this.currency_all = res['d'].results;
      let filtered = this.currency_all.filter(a => {
        return a.Id === this.investmentSummary_Edit.CurrencyId
      });
      this.selectedCurrency = filtered[0];
    });
  }
  public broker_all: ExpandedTitle[] = [];
  public selectedBroker: ExpandedTitle[] = [];
  public selectedBroker_Copy: ExpandedTitle[] = [];
  async getBrokers() {
    this.broker_all = [];
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    await this.service.readItems("Brokers", query).then(res => {
      this.broker_all = res['d'].results;
      this.selectedBroker = this.dealItem.BrokersId.results;
      this.selectedBroker_Copy = this.dealItem.BrokersId.results;
    });
  }
  public responsibleparty_all: ExpandedTitle[] = [];
  public selectedResponsibleParty: ExpandedTitle[] = [];
  public selectedResponsibleParty_Copy: ExpandedTitle[] = [];
  async getResponsibleParty() {
    this.broker_all = [];
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    await this.service.readItems("ResponsibleParty", query).then(res => {
      this.responsibleparty_all = res['d'].results;
      this.selectedResponsibleParty = this.dealItem.ResponsiblePartyId.results;
      this.selectedResponsibleParty_Copy = this.dealItem.ResponsiblePartyId.results;
    });
  }

  public Brokerage_all: ExpandedTitle[] = [];
  public selectedBrokerage: ExpandedTitle[] = [];
  public selectedBrokerage_Copy: ExpandedTitle[] = [];


  gerBrokerage() {
    this.Brokerage_all = [];
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };
    this.service.readItems("Brokerage", query).then(res => {
      this.Brokerage_all = res['d'].results;
      this.selectedBrokerage = this.dealItem.BrokerageId.results;
      this.selectedBrokerage_Copy = this.dealItem.BrokerageId.results;
    });
  }

  Categorization: any[] = ['Tier 1', 'Tier 2', 'Tier 3'
  ]
  public Categorization_all: ExpandedTitle[] = [];
  // Categorization: any = null; 
  selectedCategorization: any = null;
  getCategorization() {
    this.Categorization_all = [];
    const query = {
      select: 'ID, Title, Inactive,Modified',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    }
    this.service.readItems("Categorization", query).then(res => {
      this.Categorization_all = res['d'].results;
      this.selectedCategorization = this.dealItem.CategorizationId;
    });
  }
  getAllowedUsers() {
  }

  public states_all: State[] = [];
  public selectedState: State = new State();
  async getState() {
    this.states_all = [];
    const query = {
      select: 'ID, Title, Name',
      orderby: 'Name'
    };
    await this.service.readItems("States", query).then(res => {
      this.states_all = res['d'].results;
      let filtered = this.states_all.filter(a => {
        return a.Title === this.dealItem_Edit.State.Title
      });
      this.selectedState = filtered[0];
      // console.log(this.selectedState);
    });
  }

  public funds_all: ExpandedTitle[] = [];
  public selectedFunds: ExpandedTitle = new ExpandedTitle();
  async getFunds() {
    this.funds_all = [];
    const query = {
      select: 'ID, Title',
      orderby: ''
    };
    await this.service.readItems("Funds", query).then(res => {
      this.funds_all = res['d'].results;
      this.selectedFunds = this.fundItem
    });
  }


  // ===================== select change
  selMarket(event) {
    this.selectedMarket = event.value;
    this.getSubMarkets(this.selectedMarket.ID);
  }

  selSubMarket(event) {
    this.selectedSubMarket = event.value;
  }

  selState(event) {
    this.selectedState = event.value;
  }
  selCurrency(event) {
    this.selectedCurrency = event.value;
  }
  selFunds(event) {
    this.selectedFunds = event.value;
  }

  selProjectType(event) {
    this.selectedProjectType = event.value;
  }

  selDealType(event) {
    this.selectedDealType = event.value;
  }

  selDealTeam(event) {
    this.selectedDealType = event.value;
  }

  selStatus(event) {
    this.selectedStatus = event.value;
  }
  OtherChanges(event, item) {
    if (event.value != 8)
      item.EventListText = "";

  }
  //#endregion
  // ================================================== Get select options - END ===============================
  // ----
  // ----
  // ================================================== Get Deals Data =========================================
  //#region

  // getDealData
  public _Brokers = '';
  public _Categorization = '';
  public _Brokerage = '';
  public _Footnotes = '';
  public FootnotesView = '';
  public _DealTeam = '';

  public _Funds = '';
  public _ResponsibleParty = '';
  getDealData() {
    this.selectedBrokerage = [];
    this.selectedBroker = [];
    this.dealItem = {};
    const query = {
      select: 'ID, Title, DateEntered, ReportOutput, Address, City, ZipCode, Description, SF, Longitude, Latitude, \
      StateId, State/ID, State/Title, State/Name,\
      MarketId, Market/ID, Market/Title,\
      BrokersId, Brokers/ID, Brokers/Title,\
      CategorizationId, Categorization/ID, Categorization/Title,\
      BrokerageId, Brokerage/ID, Brokerage/Title,\
      ResponsiblePartyId, ResponsibleParty/ID, ResponsibleParty/Title,\
      SubMarketId, SubMarket/ID, SubMarket/Title,\
      StatusId, Status/ID, Status/Title, \
      ProjectTypeId, ProjectType/ID, ProjectType/Title, \
      FootnotesId, Footnotes/ID, Footnotes/Title, \
      BMRDealTeamId, BMRDealTeam/ID, BMRDealTeam/Title',

      filter: 'ID eq ' + this.primaryKey,
      expand: 'Market, SubMarket, Status, ProjectType, BMRDealTeam, Brokers, Brokerage, State,Footnotes,ResponsibleParty , Categorization',
      orderby: ''
    };
    this.service.readItems("DealMaster", query).then(res => {
      this.dealItem = res['d'].results[0];
      console.log(this.dealItem);
      // deep clone to edit
      this.dealItem_Edit = JSON.parse(JSON.stringify(this.dealItem));
      //this.getOptions();
      // console
      this._Brokers = this.formMultipleString(this.dealItem.Brokers.results, 'Title');
      this._Brokerage = this.formMultipleString(this.dealItem.Brokerage.results, 'Title');
      this._Categorization = this.dealItem.Categorization.Title;
      this._Footnotes = this.dealItem.Footnotes.results;
      this._ResponsibleParty = this.formMultipleString(this.dealItem.ResponsibleParty.results, 'Title');

      if (this.dealItem.BMRDealTeam.results) {
        this._DealTeam = this.formMultipleString(this.dealItem.BMRDealTeam.results, 'Title');
      }

      this.placeMarker();
    });
  }

  // ======================================= map view ========================

  public markers = {
    latitude: 0,
    longitude: 0,
    Address: "",
    Title: "",
    iconUrl: ""
  };

  showMainInfoEdit() {
    this.dealItem_Edit = JSON.parse(JSON.stringify(this.dealItem));
    this.getOptions();
  }
  showInvestSummaryInfoEdit() {
    this.investmentSummary_Edit = JSON.parse(JSON.stringify(this.investmentSummary));
    this.getFunds();
    this.getCurrency();
  }
  showDealDetailsInfoEdit() {
    this.sellerItem_Edit = JSON.parse(JSON.stringify(this.sellerItem));
    this.getStatus();
    this.getBrokers();
    this.getCategorization();
    this.gerBrokerage();
  }
  showKeyUpcomingDatesInfoEdit() {
    this.KeyUpcomingDates_Edit = JSON.parse(JSON.stringify(this.KeyUpcomingDates));
    for (let k = 0; k < this.KeyUpcomingDates_Edit.length; k++) {
      this.KeyUpcomingDates_Edit[k].KeyUpcomingDate = this.dateString(this.KeyUpcomingDates_Edit[k].KeyUpcomingDate);
    }
  }
  showQuickLinksInfoEdit() {
    this.QuickLinks_Edit = JSON.parse(JSON.stringify(this.QuickLinks));
  }

  placeMarker() {
    if (this.dealItem.Address != null || this.dealItem.Address != undefined) {
      this.markers = {
        latitude: this.dealItem.Latitude,
        longitude: this.dealItem.Longitude,
        Address: this.dealItem.Address,
        Title: this.dealItem.Title,
        iconUrl: "assets/red.png"
      };
      console.log(this.markers);
    } else {
      this.markers = {
        longitude: -87.623177,
        latitude: 41.881832,
        Address: "",
        Title: "",
        iconUrl: ""
      }

    }

  }

  onMouseHover(infoWindow, gm, row: any) {
    if (gm.lastOpen != null) {
      try {
        gm.lastOpen.close();
      } catch (error) {
        console.log(error);
      }
    }
    gm.lastOpen = infoWindow;
    //this.currentID = row.ID;
    infoWindow.open();
  }
  onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
  }
  // ====================================== map view ==========================

  // investmentSummary
  getInvestmentData() {

    this.investmentSummary = new InvestmentSummary();
    const query = {
      select: '*, Funds, FundsId, Funds/ID, Funds/Title,CurrencyId, Currency/ID, Currency/Title',
      filter: 'DealId eq ' + this.primaryKey,
      expand: 'Funds,Currency',
      orderby: ''
    };
    this.service.readItems("InvestmentSummary", query).then(res => {
      this.investmentSummary = res['d'].results[0];
      this.fundItem = this.investmentSummary.FundsId.results;
      this.investmentSummary_Edit = JSON.parse(JSON.stringify(this.investmentSummary));
      this._Funds = this.formMultipleString(res['d'].results[0].Funds.results, 'Title');
      this.getFunds();
    });
  }
  // SellerData
  public sellerString = '';
  getSellerData() {
    this.sellerItem = [];
    const query = {
      select: 'ID, DealId, Title',
      filter: 'DealId eq ' + this.primaryKey,
      expand: '',
      orderby: 'ID'
    };
    this.service.readItems("Seller", query).then(res => {
      this.sellerItem = res['d'].results;

      this.sellerItem_Edit = JSON.parse(JSON.stringify(this.sellerItem));
      this.sellerString = this.formMultipleString(this.sellerItem, 'Title');
    });
  }
  // KeyUpcomingDates
  getKeyUpcomingDatesData() {
    this.KeyUpcomingDates = [];
    const query = {
      select: 'DealId, Title, ID, KeyUpcomingDate,EventListId,EventList/ID,EventList/Title,EventList/ColorCode,EventListText',
      filter: 'DealId eq ' + this.primaryKey,
      expand: 'EventList',
      orderby: 'KeyUpcomingDate'
    };
    this.service.readItems("KeyUpcomingDates", query).then(res => {
      this.KeyUpcomingDates = res['d'].results;
      this.KeyUpcomingDates_Edit = JSON.parse(JSON.stringify(this.KeyUpcomingDates));
      for (let k = 0; k < this.KeyUpcomingDates_Edit.length; k++) {
        this.KeyUpcomingDates_Edit[k].KeyUpcomingDate = this.dateString(this.KeyUpcomingDates_Edit[k].KeyUpcomingDate);
      }
      // console.log(this.KeyUpcomingDates_Edit);
    });
  }
  // Quick Links
  async getQuickLinks() {
    this.QuickLinks = [];
    const query = {
      select: 'DealId, Title, ID, DocLink,OrderBy',
      filter: 'DealId eq ' + this.primaryKey,
      expand: '',
      orderby: 'OrderBy'
    };
    await this.service.readItems("Quick%20Links", query).then(res => {
      this.QuickLinks = res['d'].results;
      this.QuickLinks_Edit = JSON.parse(JSON.stringify(this.QuickLinks));
    });
  }
  //#endregion
  // ================================================== Get Deals Data - End ===================================
  // ----
  // ----
  // ================================================== Update Data ===========================================
  //#region
  updateDealsInfo(frame: ModalDirective) {
    this.selectedDealTeam = this.selectedDealTeam.filter(function (x) {
      return x !== undefined;
    });
    this.common.ShowSpinner();
    let item = {
      ID: this.dealItem_Edit.ID,
      // info col
      Title: this.dealItem_Edit.Title,
      DateEntered: this.dealItem_Edit.DateEntered,
      MarketId: this.selectedMarket == undefined ? null : this.selectedMarket.Id,
      SubMarketId: this.selectedSubMarket == undefined ? null : this.selectedSubMarket.Id,
      ReportOutput: this.dealItem_Edit.ReportOutput,
      // address col
      Address: this.dealItem_Edit.Address,
      City: this.dealItem_Edit.City,
      StateId: this.selectedState == undefined ? null : this.selectedState.ID,
      ZipCode: this.dealItem_Edit.ZipCode,
      // team col
      Description: this.dealItem_Edit.Description,
      ProjectTypeId: this.selectedProjectType == undefined ? null : this.selectedProjectType.ID,
      BMRDealTeamId: { results: this.selectedDealTeam },
      ResponsiblePartyId: { results: this.selectedResponsibleParty },
      FootnotesId: { results: this.selectedFootnotes },
      Longitude: this.dealItem_Edit.Longitude,
      Latitude: this.dealItem_Edit.Latitude
    }
    this.service.updateItem('DealMaster', 'DealMaster', this.dealItem_Edit.ID, item).then(res => {
      this.common.HideSpinner();
      this.getDealData();
      frame.hide();
      this.common.ShowToast("Successfully Updated the Main Info", ToastType.Success);
    }, error => {
      console.log(error);
      frame.hide();

    });
  }

  updateInvestmentSummary(frame: ModalDirective) {
    this.common.ShowSpinner();
    let item = {
      ID: this.investmentSummary_Edit.ID,
      // col 1
      FundsId: { results: this.selectedFunds },
      CurrencyId: this.selectedCurrency == undefined ? null : this.selectedCurrency.Id,
      InPlaceRSF: Number(this.investmentSummary_Edit.InPlaceRSF),
      StabilizedBasis: Number(this.investmentSummary_Edit.StabilizedBasis),
      UntrendedYoC: Number(this.investmentSummary_Edit.UntrendedYoC),
      HardCostsPSF: Number(this.investmentSummary_Edit.HardCostsPSF),
      // col 2
      AnalysisStartDate: this.investmentSummary_Edit.AnalysisStartDate,
      PurchasePrice: this.investmentSummary_Edit.PurchasePrice,
      StabilizedRSF: this.investmentSummary_Edit.StabilizedRSF,
      LabMarketRentPSFAnn: this.investmentSummary_Edit.LabMarketRentPSFAnn,
      TenantImprovementsPSF: this.investmentSummary_Edit.TenantImprovementsPSF,
      // col 3
      EstCompletionDate: this.investmentSummary_Edit.EstCompletionDate,
      PurchasePricePSF: this.investmentSummary_Edit.PurchasePricePSF,
      StabilizedBasisPSF: this.investmentSummary_Edit.StabilizedBasisPSF,
      LabMarketRentPSFMon: this.investmentSummary_Edit.LabMarketRentPSFMon,
      ConversionCostPSF: this.investmentSummary_Edit.ConversionCostPSF
    }
    this.service.updateItem('InvestmentSummary', 'InvestmentSummary', this.investmentSummary_Edit.ID, item).then(res => {
      this.common.HideSpinner();
      this.getInvestmentData();
      frame.hide();
      this.common.ShowToast("Successfully Updated the Investment Summary", ToastType.Success);
    }, error => {
      console.log(error);
    });
  }

  updateBrokerage(frame: ModalDirective) {
    // ========================================= Update seller ===========================
    if (JSON.stringify(this.sellerItem_Edit) == JSON.stringify(this.sellerItem)) {
      // console.log('seller items are same');
    } else {
      // console.log('seller items are NOT same UPDATEEE');
      this.updateSeller();
    }
    // ========================================= Update brokerage ========================
    if (JSON.stringify(this.dealItem_Edit.BrokerageId.results) == JSON.stringify(this.selectedBrokerage)
      && JSON.stringify(this.dealItem_Edit.BrokersId.results) == JSON.stringify(this.selectedBroker)
      && this.dealItem_Edit.CategorizationId == this.selectedCategorization
      && this.dealItem_Edit.StatusId == this.selectedStatus.ID) {
      // console.log('Broker items are same');
      frame.hide();
      return;
    } else {
      // remove undefined values
      this.selectedBrokerage = this.selectedBrokerage.filter(function (x) {
        return x !== undefined;
      });
      this.selectedBroker = this.selectedBroker.filter(function (x) {
        return x !== undefined;
      });
      // console.log('Broker items are NOT same UPDATEEE');
      this.common.ShowSpinner();
      let item = {
        ID: this.dealItem_Edit.ID,
        BrokerageId: { results: this.selectedBrokerage },
        BrokersId: { results: this.selectedBroker },
        StatusId: this.selectedStatus.ID,
        CategorizationId: this.selectedCategorization
      }
      this.service.updateItem('DealMaster', 'DealMaster', this.dealItem_Edit.ID, item).then(res => {
        this.common.HideSpinner();
        this.getDealData();
        frame.hide();
        this.common.ShowToast("Successfully Updated the Deal Details", ToastType.Success);
      }, error => {
        console.log(error);
      });
    }
  }

  updateKeyUpcomingDates(frame: ModalDirective) {
    this.common.ShowSpinner();
    let postCalls = [];
    let items = [];
    for (let k = 0; k < this.KeyUpcomingDates_Edit.length; k++) {
      let item = {
        ID: this.KeyUpcomingDates_Edit[k].ID,
        DealId: this.dealItem_Edit.ID,
        Title: this.KeyUpcomingDates_Edit[k].Title,
        KeyUpcomingDate: this.KeyUpcomingDates_Edit[k].KeyUpcomingDate,
        EventListId: this.KeyUpcomingDates_Edit[k].EventListId,
        EventListText: this.KeyUpcomingDates_Edit[k].EventListText
      }
      items.push(item);
    }
    for (let k = 0; k < items.length; k++) {
      if (items[k].ID == 0) {
        postCalls.push(this.service.createSPItem2("KeyUpcomingDates", "KeyUpcomingDates", items[k]).then(res => {
          // console.log('created dates');
        }));
      } else {
        postCalls.push(this.service.updateItem2('KeyUpcomingDates', 'KeyUpcomingDates', items[k].ID, items[k]).then(res => {
          // console.log('updated dates');
        }));
      }
    }
    Promise.all(postCalls).then(res => {
      frame.hide();
      this.getKeyUpcomingDatesData();
      this.common.HideSpinner();
      this.common.ShowToast("Successfully Updated the KeyUpcoming Dates", ToastType.Success);
    });
  }

  updateSeller() {
    this.common.ShowSpinner();
    let postCalls = [];
    let items = [];
    for (let k = 0; k < this.sellerItem_Edit.length; k++) {
      let item = {
        ID: this.sellerItem_Edit[k].ID,
        Title: this.sellerItem_Edit[k].Title,
        DealId: this.dealItem_Edit.ID
      }
      items.push(item);
    }
    for (let k = 0; k < items.length; k++) {
      if (items[k].ID == 0) {
        postCalls.push(this.service.createSPItem2("Seller", "Seller", items[k]).then(res => {
          // console.log('created dates');
        }));
      } else {
        postCalls.push(this.service.updateItem2('Seller', 'Seller', items[k].ID, items[k]).then(res => {
          // console.log('updated dates');
        }));
      }
    }
    Promise.all(postCalls).then(res => {
      this.getSellerData();
      this.common.HideSpinner();
      this.ShowToast("Successfully Updated!", ToastType.Success);
    });
  }

  updateQuickLinks(frame: ModalDirective) {
    this.common.ShowSpinner();
    let postCalls = [];
    let items = [];
    for (let k = 0; k < this.QuickLinks_Edit.length; k++) {
      let item = {
        ID: this.QuickLinks_Edit[k].ID,
        Title: this.QuickLinks_Edit[k].Title,
        DocLink: this.QuickLinks_Edit[k].DocLink,
        DealId: this.dealItem_Edit.ID,
        OrderBy: this.QuickLinks_Edit[k].OrderBy
      }
      items.push(item);
    }
    for (let k = 0; k < items.length; k++) {
      if (items[k].ID == 0) {
        postCalls.push(this.service.createSPItem2("Quick Links", "Quick Links", items[k]).then(res => {
          // console.log('created dates');
        }));
      } else {
        postCalls.push(this.service.updateItem2('Quick Links', 'Quick Links', items[k].ID, items[k]).then(res => {
          // console.log('updated dates');
        }));
      }
    }
    Promise.all(postCalls).then(res => {
      this.getQuickLinks();
      this.common.HideSpinner();
      frame.hide();
      this.common.ShowToast("Successfully Updated the Quick Links", ToastType.Success);

    });
  }
  //#endregion
  // ================================================== Update Data - End =====================================
  // -------
  // -------
  // ====================================================== Copy ==============================================
  //#region
  public copyTitle = null;
  public copyPrimaryKey = null;
  public copyPostCalls = [];
  onCopySubmit(frame: ModalDirective) {
    this.ShowSpinner();
    this.copyPostCalls = [];
    let item = {
      // info col
      Title: this.copyTitle,
      DateEntered: this.dealItem.DateEntered,
      MarketId: this.dealItem.MarketId,
      SubMarketId: this.dealItem.SubMarketId,
      ReportOutput: this.dealItem.ReportOutput,
      // address col
      Address: this.dealItem.Address,
      City: this.dealItem.City,
      StateId: this.dealItem.StateId,
      ZipCode: this.dealItem.ZipCode,
      // team col
      Description: this.dealItem.Description,
      ProjectTypeId: this.dealItem.ProjectTypeId,
      BrokerageId: this.dealItem.BrokerageId,
      BrokersId: this.dealItem.BrokersId,
      StatusId: this.dealItem.StatusId,
      BMRDealTeamId: this.dealItem.BMRDealTeamId,
      FootnotesId: this.dealItem.FootnotesId,
      ResponsiblePartyId: this.dealItem.ResponsiblePartyId,
      Longitude: this.dealItem_Edit.Longitude,
      Latitude: this.dealItem_Edit.Latitude,
      isDeleted: 0
    }
    if (item.BMRDealTeamId == null)
      delete item.BMRDealTeamId;
    this.service.createSPItem('DealMaster', 'DealMaster', item).subscribe(res => {
      this.copyPrimaryKey = res['d'].ID;
      this.createImageFolder();
      this.CopyInvestmentSummary();
      this.CopyKeyUpcoming();
      this.CopySeller();
      this.CopyQuickLinks();
      Promise.all(this.copyPostCalls).then(res => {
        setTimeout(() => {
          frame.hide();
          this.HideSpinner();
          this.common.ShowToast("Successfully Created!", ToastType.Success);
          this.router.navigate(['/portal/deals/list'], {
            queryParams: {
              status: 'All'
            }
          });
        }, 3000);
      });
    }, error => {
      frame.hide();
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

  createImageFolder() {
    this.service.createFolder('DealImages', 'Deal_' + this.copyPrimaryKey).then(res => {
      this.copyDealImages();
    }, error => {
      console.log(error);
    });
  }

  CopyInvestmentSummary() {
    let item = new InvestmentSummary();
    item.DealId = this.copyPrimaryKey;
    item.FundsId = { results: this.selectedFunds };   // covert funds from currency to drop down
    item.CurrencyId = this.dealItem.CurrencyId,  
    item.AnalysisStartDate = this.investmentSummary.AnalysisStartDate;
    item.EstCompletionDate = this.investmentSummary.EstCompletionDate;
    item.InPlaceRSF = this.investmentSummary.InPlaceRSF;
    item.StabilizedRSF = this.investmentSummary.StabilizedRSF;
    item.PurchasePrice = this.investmentSummary.PurchasePrice;
    item.PurchasePricePSF = this.investmentSummary.PurchasePricePSF;
    item.StabilizedBasis = this.investmentSummary.StabilizedBasis;
    item.StabilizedBasisPSF = this.investmentSummary.StabilizedBasisPSF;
    item.LabMarketRentPSFAnn = this.investmentSummary.LabMarketRentPSFAnn;
    item.LabMarketRentPSFMon = this.investmentSummary.LabMarketRentPSFMon;
    item.HardCostsPSF = this.investmentSummary.HardCostsPSF;
    item.TenantImprovementsPSF = this.investmentSummary.TenantImprovementsPSF;
    item.ConversionCostPSF = this.investmentSummary.ConversionCostPSF;
    item.UntrendedYoC = this.investmentSummary.UntrendedYoC;
    delete item.Funds;
    this.copyPostCalls.push(this.service.createSPItem2("InvestmentSummary", "InvestmentSummary", item).then(res => {
      // console.log('InvestmentSummary copied');
    }));
  }

  CopyKeyUpcoming() {
    if (this.KeyUpcomingDates.length >= 0) {
      for (let index = 0; index < this.KeyUpcomingDates.length; index++) {
        const element = this.KeyUpcomingDates[index];
        if (element.Title != null || element.KeyUpcomingDate != null) {
          let item = new KeyUpcomingDates();
          item.ID = 0;
          item.DealId = this.copyPrimaryKey;
          item.KeyUpcomingDate = element.KeyUpcomingDate;
          item.Title = element.Title;
          item.EventListId = element.EventListId;
          item.EventListText = element.EventListText;
          this.copyPostCalls.push(this.service.createSPItem2("KeyUpcomingDates", "KeyUpcomingDates", item).then(res => {
            // console.log('KeyUpcomingDates copied');
          }));
        }
      }
    }
  }

  CopyQuickLinks() {
    if (this.QuickLinks.length >= 0) {
      for (let index = 0; index < this.QuickLinks.length; index++) {
        const element = this.QuickLinks[index];
        if (element.Title != null && element.DocLink != null) {
          let item = new QuickLinks();
          item.ID = 0;
          item.DealId = this.copyPrimaryKey;
          item.DocLink = element.DocLink;
          item.Title = element.Title;
          item.OrderBy = element.OrderBy;
          this.copyPostCalls.push(this.service.createSPItem2("Quick Links", "Quick Links", item).then(res => {
            // console.log('Quick Links copied');
          }));
        }
      }
    }
  }

  CopySeller() {
    if (this.sellerItem.length >= 0) {
      // Industry
      for (let index = 0; index < this.sellerItem.length; index++) {
        const element = this.sellerItem[index];
        if (element.Title != null) {
          let item = new Seller();
          item.ID = 0;
          item.DealId = this.copyPrimaryKey;
          item.Title = element.Title;
          this.copyPostCalls.push(this.service.createSPItem2("Seller", "Seller", item).then(res => {
            // console.log('Seller copied');
          }));
        }
      }
    }
  }
  //#endregion
  // ================ Save Seller - END ================================

  //#endregion
  // ====================================================== Copy - End =====================================
  // -------
  // -------
  // ================================================== Common Functions ======================================
  //#region
  onBack() {
    this.router.navigate(['/portal/deals/list'], {
      queryParams: {
        status: 'All'
      }
    });
  }

  onCopy(frame: ModalDirective) {
    frame.hide();
    this.common.ShowSpinner();
    setTimeout(() => {
      this.common.HideSpinner();
      this.common.ShowToast("Successfully Created!", ToastType.Success);
      this.router.navigate(['/portal/deals/list'], {
        queryParams: {
          status: 'All'
        }
      });
    }, 3000);
  }

  onDelete(ID: number) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe(res => {
      if (res) {
        this.common.ShowSpinner();
        let item = {
          ID: this.dealItem_Edit.ID,
          isDeleted: 1
        }
        this.service.updateItem('DealMaster', 'DealMaster', this.dealItem_Edit.ID, item).then(res => {
          // ============================================ create item to send email notification
          let item2 = {
            DealId: this.primaryKey,
            isDeleted: true
          }
          this.service.createSPItem("Delete Deals Info", "Delete Deals Info", item2).subscribe(res => {
            this.common.HideSpinner();
            this.common.ShowToast("Successfully Deleted!", ToastType.Success);
            this.router.navigate(['/portal/deals/list'], {
              queryParams: {
                status: 'All'
              }
            });
          });
          // ==============================================
        }, error => {
          this.ShowToast(error.message, ToastType.Error);
        });
      }
    })
  }

  // https://alrafayconsulting.sharepoint.com/sites/DMSDemo2/deal-tracker/Lists/Delete%20Deals%20Info/AllItems.aspx

  onNotesAdded(clientNote: any[]) {
    //this.vendorNotesonCreate.push(clientNote);
  }
  openSite(row: any) {
    var str = row.DocLink;
    if (str.indexOf("http://") == 0 || str.indexOf("https://") == 0) {
      window.open(row.DocLink, "_blank");
    } else {
      window.open('https://' + row.DocLink, "_blank");
    }

  }
  formMultipleString(items: any, columnName) {
    let ress = '';
    if (items != undefined || items.length > 0) {
      for (let k = 0; k < items.length; k++) {
        if (k == 0) {
          ress += items[k][columnName];
        } else {
          ress += ', ' + items[k][columnName];
        }
      }
    }
    return ress
  }

  BeforeFillInForm(formData: any) {
    this.contactData = formData;
  }

  public images = [
    {
      img: 'https://thumbs.dreamstime.com/z/office-building-24773299.jpg',
      thumb: 'https://thumbs.dreamstime.com/z/office-building-24773299.jpg',
      description: 'Image 1',
      relativeURL: ''
    },
    {
      img: 'https://www.zeromileproperty.com/wp-content/uploads/2016/06/Real-Estate-Agent.jpg',
      thumb: 'https://www.zeromileproperty.com/wp-content/uploads/2016/06/Real-Estate-Agent.jpg',
      description: 'Image 2',
      relativeURL: ''
    },
    {
      img: 'https://thumbs.dreamstime.com/z/office-building-24773299.jpg',
      thumb: 'https://thumbs.dreamstime.com/z/office-building-24773299.jpg',
      description: 'Image 3',
      relativeURL: ''
    },
    {
      img: 'https://www.zeromileproperty.com/wp-content/uploads/2016/06/Real-Estate-Agent.jpg',
      thumb: 'https://www.zeromileproperty.com/wp-content/uploads/2016/06/Real-Estate-Agent.jpg',
      description: 'Image 4',
      relativeURL: ''
    },
    {
      img: 'data:image/jpeg;base64,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',
      thumb: 'data:image/jpeg;base64,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',
      description: 'Image 5',
      relativeURL: ''
    },
    {
      img: 'https://www.zeromileproperty.com/wp-content/uploads/2016/06/Real-Estate-Agent.jpg',
      thumb: 'https://www.zeromileproperty.com/wp-content/uploads/2016/06/Real-Estate-Agent.jpg',
      description: 'Image 6',
      relativeURL: ''
    }
  ];

  DeleteQuickLinksRow(index: number) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this row?").afterClosed().subscribe(res => {
      if (res) {
        this.common.ShowSpinner();
        if (this.QuickLinks_Edit[index].ID == 0) {
          this.QuickLinks_Edit.splice(index, 1);
          this.common.HideSpinner();
        } else {
          this.service.deleteItem("Quick%20Links", this.QuickLinks_Edit[index].ID).then(res => {
            // console.log("Data Updated");
            this.common.HideSpinner();
            this.getQuickLinks();
            this.common.ShowToast("Successfully Deleted!", ToastType.Success);
          }, error => {
            this.ShowToast(error.message, ToastType.Error);
          });
        }
      }
    });
  }

  DeleteImage(DocURL: string) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this row?").afterClosed().subscribe(res => {
      if (res) {
        this.common.ShowSpinner();
        this.service.deleteDocument(DocURL).then(res => {
          // console.log("Data Updated");
          this.common.HideSpinner();
          this.getDealImages();
          this.common.ShowToast("Successfully Deleted!", ToastType.Success);
        }, error => {
          // console.log(error);
          this.ShowToast(error.message, ToastType.Error);
        });
      }
    });
  }

  AddQuickLinksRow() {
    let newItem: QuickLinks = new QuickLinks();
    this.QuickLinks_Edit.push(newItem);
  }

  AddSellerRow() {
    let newItem: Seller = new Seller();
    this.sellerItem_Edit.push(newItem);
    // console.log(this.sellerItem_Edit);
  }

  DeleteSellerRow(index: number) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this row?").afterClosed().subscribe(res => {
      if (res) {
        this.common.ShowSpinner();
        if (this.sellerItem_Edit[index].ID == 0) {
          this.sellerItem_Edit.splice(index, 1);
          this.common.HideSpinner();
        } else {
          this.service.deleteItem("Seller", this.sellerItem_Edit[index].ID).then(res => {
            // console.log("Data Updated");
            this.common.HideSpinner();
            this.getSellerData();
            this.common.ShowToast("Successfully Deleted!", ToastType.Success);
          }, error => {
            // console.log("Data not Updated. Check details in next line");
            console.log(error);
            this.ShowToast(error.message, ToastType.Error);
          });
        }
      }
    });
  }

  AddKeyUpcomingDateRow() {
    let newItem: KeyUpcomingDates = new KeyUpcomingDates();
    this.KeyUpcomingDates_Edit.push(newItem);
    // console.log(this.KeyUpcomingDates_Edit);
  }

  DeleteKeyUpcomingDateRow(index: number) {
    this.dialog.openConfirmDialog("Are you sure you want to delete this row?").afterClosed().subscribe(res => {
      if (res) {
        if (this.KeyUpcomingDates_Edit[index].ID == 0) {
          this.KeyUpcomingDates_Edit.splice(index, 1);
        } else {
          this.common.ShowSpinner();
          this.service.deleteItem("KeyUpcomingDates", this.KeyUpcomingDates_Edit[index].ID).then(res => {
            this.common.HideSpinner();
            this.getKeyUpcomingDatesData();
            this.common.ShowToast("Successfully Deleted!", ToastType.Success);
          }, error => {
            this.ShowToast(error.message, ToastType.Error);
          });
        }
      }
    });
  }

  //#endregion
  // ================================================== Common Functions - END ================================
  // -------
  // -------
  // ================================================== calculation functions =================================
  //#region
  stabilizedrsf: number = null;
  stabilizedbasis: number = null;
  stabilizedbasispsf: number = null;

  // calculatestabilized(value) {
  //   this.investmentSummary_Edit.StabilizedBasisPSF = value / this.investmentSummary_Edit.StabilizedRSF;
  // }

  labmrketann: number = null;
  labmrketmon: number = null;

  calculatelabmarket() {
    this.formData.LabMarketRentMon = this.formData.LabMarketRentAnn / 12;
  }

  isPurchasePriceEnabled: boolean = true;
  isPurchasePricePSFEnabled: boolean = true;

  calPurchasePrice(text: string) {
    if (text == 'PurchasePrice') {
      let val = this.investmentSummary_Edit.PurchasePrice / this.investmentSummary_Edit.InPlaceRSF;
      val = Math.round(val);
      this.investmentSummary_Edit.PurchasePricePSF = val == NaN ? 0 : val;
    } else if (text == 'PurchasePricePSF') {
      let val = this.investmentSummary_Edit.PurchasePricePSF * this.investmentSummary_Edit.InPlaceRSF
      val = Math.round(val);
      this.investmentSummary_Edit.PurchasePrice = val == undefined ? 0 : val;
    } else if (text == 'InPlaceRSF') {
      if (this.investmentSummary_Edit.InPlaceRSF == null || this.investmentSummary_Edit.InPlaceRSF == 0) {
        this.investmentSummary_Edit.PurchasePrice = 0;
        this.investmentSummary_Edit.PurchasePricePSF = 0;
      } else {
        // PurchasePrice
        let val = this.investmentSummary_Edit.PurchasePrice / this.investmentSummary_Edit.InPlaceRSF;
        val = Math.round(val);
        this.investmentSummary_Edit.PurchasePricePSF = val == NaN ? 0 : val;
        // PurchasePricePSF
        let val1 = this.investmentSummary_Edit.PurchasePricePSF * this.investmentSummary_Edit.InPlaceRSF
        val1 = Math.round(val1);
        this.investmentSummary_Edit.PurchasePrice = val1 == undefined ? 0 : val1;
      }
    }
  }

  calStabilized(text: string) {
    if (text == 'StabilizedBasis') {
      let val = this.investmentSummary_Edit.StabilizedBasis / this.investmentSummary_Edit.StabilizedRSF;
      val = Math.round(val);
      this.investmentSummary_Edit.StabilizedBasisPSF = val == NaN ? 0 : val;
    } else if (text == 'StabilizedBasisPSF') {
      let val = this.investmentSummary_Edit.StabilizedBasisPSF * this.investmentSummary_Edit.StabilizedRSF;
      val = Math.round(val);
      this.investmentSummary_Edit.StabilizedBasis = val == undefined ? 0 : val;
    } else if ('StabilizedRSF') {
      if (this.investmentSummary_Edit.StabilizedRSF == null || this.investmentSummary_Edit.StabilizedRSF == 0) {
        this.investmentSummary_Edit.StabilizedBasis = 0;
        this.investmentSummary_Edit.StabilizedBasisPSF = 0;
      } else {
        // StabilizedBasis
        let val = this.investmentSummary_Edit.StabilizedBasis / this.investmentSummary_Edit.StabilizedRSF;
        val = Math.round(val);
        this.investmentSummary_Edit.StabilizedBasisPSF = val == NaN ? 0 : val;
        // StabilizedBasisPSF
        let val1 = this.investmentSummary_Edit.StabilizedBasisPSF * this.investmentSummary_Edit.StabilizedRSF
        val1 = Math.round(val1);
        this.investmentSummary_Edit.StabilizedBasis = val1 == undefined ? 0 : val1;
      }
    }
  }

  calLabMarket() {
    this.investmentSummary_Edit.LabMarketRentPSFMon = this.investmentSummary_Edit.LabMarketRentPSFAnn / 12;
  }

  calLabMarketMon() {
    this.investmentSummary_Edit.LabMarketRentPSFAnn = this.investmentSummary_Edit.LabMarketRentPSFMon * 12;
  }
  //#endregion
  // ================================================== calculation functions - End ===========================
  //#region
  public selectedClients: number[] = []; // users selected clients
  public AutoCompClient: Autocomplete<any> = new Autocomplete<any>("ClientName", "ID");
  searchClient: any = null;


  private allSelectedFunds = true;
  toggleAllFunds() {
    this.allSelectedFunds = !this.allSelectedFunds; // to control select-unselect
    if (this.allSelectedFunds) {
      this.Dealgroup.options.forEach((item: MatOption) => {
        item.deselect();
      });
    } else {
      this.Dealgroup.options.forEach((item: MatOption) => {
        item.select();
      });
    }
  }

  private allSelectedBrokers = true;
  toggleAllBrokers() {
    this.allSelectedBrokers = !this.allSelectedBrokers; // to control select-unselect
    if (this.allSelectedBrokers) {
      this.Brokers.options.forEach((item: MatOption) => {
        item.deselect();
      });
    } else {
      this.Brokers.options.forEach((item: MatOption) => {
        item.select();
      });
    }
  }


  private allSelectedBrokerage = true;
  toggleAllBrokerage() {
    this.allSelectedBrokerage = !this.allSelectedBrokerage; // to control select-unselect
    if (this.allSelectedBrokerage) {
      this.Brokerage.options.forEach((item: MatOption) => {
        item.deselect();
      });
    } else {

      this.Brokerage.options.forEach((item: MatOption) => {
        item.select();
      });
    }
  }

  private allSelectedDealTeam = true;
  toggleAllDealTeam() {
    this.allSelectedDealTeam = !this.allSelectedDealTeam; // to control select-unselect
    if (this.allSelectedDealTeam) {
      this.BMRDealTeam.options.forEach((item: MatOption) => {
        item.deselect();
      });
    } else {
      this.BMRDealTeam.options.forEach((item: MatOption) => {
        item.select();
      });
    }
  }

  private allSelectedResponsibleParty = true;
  toggleAllResponsibleParty() {
    this.allSelectedResponsibleParty = !this.allSelectedResponsibleParty; // to control select-unselect
    if (this.allSelectedResponsibleParty) {
      this.ResponsibleParty.options.forEach((item: MatOption) => {
        item.deselect();
      });
    } else {
      this.ResponsibleParty.options.forEach((item: MatOption) => {
        item.select();
      });
    }
  }

  private allSelectedFootnotes = true;
  toggleAllFootnotes() {
    this.allSelectedFootnotes = !this.allSelectedFootnotes; // to control select-unselect
    if (this.allSelectedFootnotes) {
      this.Footnotes.options.forEach((item: MatOption) => {
        item.deselect();
      });
    } else {
      this.Footnotes.options.forEach((item: MatOption) => {
        item.select();
      });
    }
  }

  dateString(dat) {
    let date = new Date(dat);
    let month = date.getMonth() + 1;
    let mm = month < 10 ? '0' + month : month.toString();
    let day = date.getDate();
    let dd = day < 10 ? '0' + day : day.toString();
    return date.getFullYear() + '-' + mm + '-' + dd;
  };


  public autocomplete: any;
  public Placeoptions: any = {
    // componentRestrictions: { country: ["us"] },
    fields: ["address_components", "geometry", "geometry/location"],
    types: ["address"]
  }
  @ViewChild("placesRef2") placesRef2: HTMLInputElement;

  public handleAddressChange(address: any) {
    console.log(address.address_components);
    for (var index = 0; index < address.address_components.length; index++) {
      // address is being binded automatically with the field, no need to add address again.
      // if(address.address_components[index].types[0] == 'street_number' || address.address_components[index].types[0] == 'route'|| address.address_components[index].types[0] == 'locality')
      // this.formData.Address += address.address_components[index].short_name;

      // city
      if (address.address_components[index].types[0] == 'locality') {
        this.dealItem_Edit.City = address.address_components[index].short_name;
      }
      // state
      else if (address.address_components[index].types[0] == 'administrative_area_level_1') {
        let state = this.states_all.filter(a => {
          return a.Title === address.address_components[index].short_name
        });
        this.selectedState = state[0]
      }
      // zip code
      else if (address.address_components[index].types[0] == 'postal_code') {
        this.dealItem_Edit.ZipCode = address.address_components[index].short_name;
      }
    }
    // latitude and longitutude
    this.dealItem_Edit.Address = address.formatted_address;
    this.dealItem_Edit.Longitude = address.geometry.location.lng();
    this.dealItem_Edit.Latitude = address.geometry.location.lat();
  }

  onEmptyAddress() {
    if (this.dealItem_Edit.Address == '' || this.dealItem_Edit.Address == null) {
      this.dealItem_Edit.Longitude = null;
      this.dealItem_Edit.Latitude = null;
      this.dealItem_Edit.City = null;
      this.selectedState = null;
      this.dealItem_Edit.ZipCode = null;
    }
  }
  //#endregion
}


class ExpandedTitle {
  ID: number = null;
  Id: number = null;
  Title: string = null;
}

class State {
  ID: number = null;
  Id: number = null;
  Name: string = null;
  Title: string = null;
}
