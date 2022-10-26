import { Component, OnInit,ViewChild } from '@angular/core';
import { StimulsoftViewerComponent } from 'stimulsoft-viewer-angular'; 
import { ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { ToastService, MDBModalService, MDBModalRef, ModalDirective } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Base/Common.service';
import moment from 'moment';
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { Dealtype } from 'src/app/modules/admin/dealtype/dealtype.model';
import { Market } from 'src/app/modules/admin/market/market.model';
import { Status } from 'src/app/modules/admin/status/status.model';
import { NgxSpinnerService } from 'ngx-spinner';
//declare stimulsoft :1
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsComponent {
  @ViewChild('viewer')viewer:StimulsoftViewerComponent;
  public FNotes: string = null;
  StartEventDate: Date = moment().startOf('year').toDate();
  EndEventDate: Date = moment().endOf('year').toDate();

  AutoCompDealType: Autocomplete<Dealtype> = new Autocomplete<Dealtype>("Title", "ID");
  AutoCompMarket: Autocomplete<Market> = new Autocomplete<Market>("Title", "ID");
  AutoCompStatus: Autocomplete<Status> = new Autocomplete<Status>("Title", "ID");

 //designer: any = new Stimulsoft.Designer.StiDesigner(this.options, 'StiDesigner', false);


 array = //object hay us k andar array hay. object ka name array hay. array ka ame data set hay
 {
   UserID:3,
   DB: {
    DB: [],
   },
 };

  Market: any[] = [];
  DealType: any[] = [];
  MarketName: string = "";
  DealTypeName: string = "";
  StatusName: string = "";


  constructor(
    public router: Router,
    public service: SPOperationsService,
    private SpinnerService: NgxSpinnerService,
    private http: HttpClient,
    public common: CommonService
  ) {
  }

  ngOnInit(): void { // Stimulsoft Licensing Key on page load 
    this.array = //object hay us k andar array hay. object ka name array hay. array ka ame data set hay
    {
      UserID:3,
      DB: {
        DB: [],
      },
    };
   
  }

  ngAfterViewInit() {
    this.getDealType();
    this.getMarket();
    this.getStatus();
    this.viewReport(this.StartEventDate, this.EndEventDate);
  }
  navPropertyDocuments() {
    window.open("https://alrafayconsulting.sharepoint.com/sites/PropertyManagement/REIT%20DMS/Forms/AllItems.aspx");
  }

  //Query to get Market data from Market list for  Dorpdown it should call on ngONIT
  getMarket() {
    //parameters to paas in to rest API
    var query = {
      select: "*",
      expand: "",
      top: "5000",
      orderby: "Created desc",
    }
    this.service.readItems("Market", query).then(async res => {
      this.Market = res['d'].results;
      this.AutoCompMarket.data = res['d'].results as Market[];
      this.AutoCompMarket.resultObserve();
    })
  };

  getDealType() {
    //parameters to paas in to rest API
    var query = {
      select: "*",
      expand: "",
      top: "5000",
      orderby: "Created desc",
    }
    this.service.readItems("DealType", query).then(async res => {
      this.AutoCompDealType.data = res['d'].results as Dealtype[];
      this.AutoCompDealType.resultObserve();
    })
  };

  getStatus() {
    //parameters to paas in to rest API
    var query = {
      select: "*",
      expand: "",
      top: "5000",
      orderby: "Created desc",
    }
    this.service.readItems("Status", query).then(async res => {
      this.AutoCompStatus.data = res['d'].results as Status[];
      this.AutoCompStatus.resultObserve();
    })
  };
  viewReport(startDate, endDate) {
    this.SpinnerService.show();
    startDate = moment(startDate).format("YYYY-MM-DD");

    endDate = moment(endDate).format("YYYY-MM-DD");
    this.array = {
      UserID:3,
      DB: {
        DB: [],
      },
    };
    var DealCommentsFilters = ""; //ReportOutput eq true and isDeleted eq false
    var filter = ""; //ReportOutput eq true and isDeleted eq false
    var KeyFilters = "";

    if (startDate != "" && startDate != undefined && startDate != null) {
      if (filter != "") filter += "and";

      if (DealCommentsFilters != "") DealCommentsFilters += "and";

      if (KeyFilters != "") KeyFilters += "and";

      filter += " DateEntered ge '" + startDate + "'";
      DealCommentsFilters += " Created ge '" + startDate + "'";
      KeyFilters += " KeyUpcomingDate ge '" + startDate + "'";
    }

    if (endDate != "" && endDate != undefined && endDate != null) {
      if (filter != "") filter += "and";

      if (DealCommentsFilters != "") DealCommentsFilters += "and";

      if (KeyFilters != "") KeyFilters += "and";

      filter += " DateEntered le '" + endDate + "'";
      DealCommentsFilters += " Created le '" + endDate + "'";
      KeyFilters += " KeyUpcomingDate le '" + endDate + "'";
    }

    //first Query to get data
    //parameters to paas in to rest API

    if (
      this.MarketName != "" &&
      this.MarketName != undefined &&
      this.MarketName != null
    ) {
      filter += " and (";
      for (let index = 0; index < this.MarketName.length; index++) {
        const element = this.MarketName[index];
        if (this.MarketName.length > 1 && index != 0) filter += " or";

        filter += " MarketId eq " + element.toString();
      }
      filter += ")";
    }
    if (
      this.StatusName != "" &&
      this.StatusName != undefined &&
      this.StatusName != null
    ) {
      filter += " and (";
      for (let index = 0; index < this.StatusName.length; index++) {
        const element = this.StatusName[index];
        if (this.StatusName.length > 1 && index != 0) filter += " or";

        filter += " StatusId eq " + element.toString();
      }
      filter += ")";
    }

    filter += " and isDeleted eq 0";

    var query = {
      select: "*",
      expand: "",
      top: "5000",
      filter: "",
      orderby: "Created desc",
      // filter: "ID eq 1 and Title eq 'abc' and Status eq 'In Progress' and Created ge 1/1/2001 and Created le 1/2/2001 "
    };
    this.service.readItems("KeyUpcomingDates", query).then(async (res) => {
      //here in quotation we declare list name data comes in RES
      var KeyUpcomingDates = res["d"].results;
      var query = {
        select: "*",
        expand: "",
        top: "5000",
        filter: DealCommentsFilters,
        orderby: "Created desc",
        // filter: "ID eq 1 and Title eq 'abc' and Status eq 'In Progress' and Created ge 1/1/2001 and Created le 1/2/2001 "
      };
      this.service
        .readItems("Deal Comments Discussion Replies", query)
        .then(async (res) => {
          //here in quotation we declare list name data comes in RES
          var DealCommentsNotes = res["d"].results;

          var query = {
            select:
              "*, Status/Id, Status/Title, Categorization/Id,ProjectType/Id,ProjectType/Title,Categorization/Title,DealType/Title, BMRDealTeam/Title,Market/Title,SubMarket/Title,FootnotesId,Footnotes/ID,Footnotes/Title",
            expand:
              "Status, DealType, ProjectType, Categorization,SubMarket,BMRDealTeam,Footnotes,Market",
            top: "5000",
            filter: filter,
            orderby: "Market/Title asc",
            // filter: "ID eq 1 and Title eq 'abc' and Status eq 'In Progress' and Created ge 1/1/2001 and Created le 1/2/2001 "
          };
          this.service.readItems("DealMaster", query).then(async (res) => {
            //here in quotation we declare list name data comes in RES
            var Deals = res["d"].results;
            Deals = Deals.filter((a) => a.ReportOutput == true);

            var query = {
              select: "ID,Title",
              top: "5000",
              orderby: "ID",
            };
            this.service.readItems("Footnotes", query).then(async (res) => {
              //here in quotation we declare list name data comes in RES
              var FootnotesData = res["d"].results;
              console.log(FootnotesData);
              //2nd Query to get data from another list
              var query = {
                //parameters to paas in to rest API

                select: "*,Funds/Id, Funds/Title,InPlaceRSF",
                expand: "Funds",
                top: "5000",
                orderby: "ID desc",
                // filter: "ID eq 1 and Title eq 'abc' and Status eq 'In Progress' and Created ge 1/1/2001 and Created le 1/2/2001 "
              };
              this.service
                .readItems("InvestmentSummary", query)
                .then(async (res) => {
                  //here in quotation we declare list name data comes in RES
                  var InvestmentSummary = res["d"].results;

                  var StatusArr = [
                    "Closed",
                    "U/E",
                    "DD",
                    "PSA",
                    "LOI",
                    "U/W",
                    "CA",
                    "Inactive",
                  ];
                  for (var count = 0; count < StatusArr.length; count++) {
                    var element = StatusArr[count];
                    var status1 = Deals.filter((x) => x.Status.Title == element);
                    if (status1.length > 0) {
                      for (var k = 0; k < status1.length; k++) {
                        status1[k].Status["sort"] = count;
                      }
                    }
                  }
                  //Third list query goes  here
                  var sumSF = 0;
                  var sumMM = 0;
                  var sumPSF = 0;
                  var sumSRSF = 0;
                  var sumSMM = 0;
                  var sumSPSD = 0;
                  var sumYoC = 0;
                  var count = 0;
                  var FootValues: string = "";
                  var filteredNotes = [];
                  var filteredNotes2 = [];
                  Deals = Deals.sort((a, b) => (a.Title > b.Title ? 1 : -1));
                  var IdsFootnotes = [];

                  for (var i = 0; i < Deals.length; i++) {
                    if (Deals[i].Footnotes.results.length > 0) {
                      for (var icount = 0; icount < Deals[i].Footnotes.results.length; icount++) {
                        IdsFootnotes.push(Deals[i].FootnotesId.results[icount]);
                      }
                    }
                  }
                  IdsFootnotes = IdsFootnotes.filter((c, index) => {
                    return IdsFootnotes.indexOf(c) === index;
                  });

                  IdsFootnotes = IdsFootnotes.sort((a, b) => (a > b ? 1 : -1));
                  if (IdsFootnotes.length > 0) {
                    for (var k = 0; k < IdsFootnotes.length; k++) {
                      filteredNotes = FootnotesData.filter((a) => a.ID == IdsFootnotes[k]);
                      FootValues += k + 1 + " - " + filteredNotes[0].Title + "\n";

                      var inc = k + 1;
                      filteredNotes2.push({
                        'NewID': inc,
                        'ID': IdsFootnotes[k]
                      });
                    }
                  }

                  for (var i = 0; i < Deals.length; i++) {
                    var BMRDealTeamCollection = "";
                    if (Deals[i].BMRDealTeam.results != undefined) {
                      for (var icount = 0; icount < Deals[i].BMRDealTeam.results.length; icount++) {
                        if (icount == Deals[i].BMRDealTeam.results.length - 1)
                          BMRDealTeamCollection +=
                            Deals[i].BMRDealTeam.results[icount].Title;
                        else
                          BMRDealTeamCollection +=
                            Deals[i].BMRDealTeam.results[icount].Title + ", ";
                      }
                    }
                    var FID = "";
                    if (Deals[i].Footnotes.results.length > 0) {
                      IdsFootnotes = IdsFootnotes.sort((a, b) =>
                        a > b ? 1 : -1
                      );
                      for (var icount = 0; icount < Deals[i].Footnotes.results.length; icount++) {
                        if (icount == Deals[i].Footnotes.results.length - 1) {
                          var showFID = filteredNotes2.filter((a) => a.ID == Deals[i].Footnotes.results[icount].ID);
                          FID += showFID[0].NewID;
                        } else {
                          var showFID = filteredNotes2.filter((a) => a.ID == Deals[i].Footnotes.results[icount].ID);
                          FID += showFID[0].NewID + ",";
                          // if(Deals[i].Footnotes.results[icount].ID == filteredNotes[0].ID)
                          // FID += filteredNotes[0].NewID+","
                        }
                      }
                    }

                    var filteredInvestment = InvestmentSummary.filter(
                      (a) => a.DealId == Deals[i].ID
                    );
                    sumSF += Deals[i].Status.Title != "Inactive" ? filteredInvestment[0].InPlaceRSF : 0;
                    sumMM += Number(this.numFormatter(filteredInvestment[0].PurchasePrice));
                    sumPSF += filteredInvestment[0].PurchasePricePSF;

                    sumSRSF += filteredInvestment[0].StabilizedRSF;
                    sumSMM += Number(this.numFormatter(filteredInvestment[0].StabilizedBasis == null ? 0 : filteredInvestment[0].StabilizedBasis));
                    sumSPSD += filteredInvestment[0].StabilizedBasisPSF;

                    if (filteredInvestment[0].UntrendedYoC != null && filteredInvestment[0].UntrendedYoC != 0) {
                      sumYoC += filteredInvestment[0].UntrendedYoC * Number(this.numFormatter(filteredInvestment[0].StabilizedBasis));
                      count++;
                    }

                    var filteredDealComments = DealCommentsNotes.filter(
                      (a) => a.DealId == Deals[i].ID
                    );
                    var filteredKeyDates = KeyUpcomingDates.filter(
                      (a) => a.DealId == Deals[i].ID
                    );
                    filteredKeyDates = filteredKeyDates.sort((a, b) =>
                      b.KeyUpcomingDate > a.KeyUpcomingDate ? 1 : -1
                    );
                    var FundsCollection = "";
                    for (
                      var icount = 0;
                      icount < filteredInvestment[0].Funds.results.length;
                      icount++
                    ) {
                      if (
                        icount ==
                        filteredInvestment[0].Funds.results.length - 1
                      )
                        FundsCollection +=
                          filteredInvestment[0].Funds.results[icount].Title;
                      else
                        FundsCollection +=
                          filteredInvestment[0].Funds.results[icount].Title +
                          ", ";
                    }
                    
                    this.array.DB.DB.push({
                      //Push data in to array
                      DEAL: Deals[i].Title, //left pe report k naam aur right pe list k naam
                      SF:filteredInvestment[0] == undefined? "": filteredInvestment[0].InPlaceRSF,
                      RunningSF: sumSF,
                      FUND: filteredInvestment[0] == undefined? "": FundsCollection,
                      TYPE: Deals[i].DealType.Title,
                      Market: Deals[i].Market.Title,
                      LOCATION: Deals[i].SubMarket.Title,
                      Categorization: Deals[i].Categorization.Title,
                      // Description: Deals[i].Description,
                      Lead: Deals[i] == undefined ? "" : BMRDealTeamCollection,
                      MM: filteredInvestment[0] == undefined ? "" : this.numFormatter(filteredInvestment[0].PurchasePrice),
                      RunningMM: sumMM,
                      STATUS: Deals[i].Status.Title,
                      StatusSort: Deals[i].Status.sort,
                      PSF: filteredInvestment[0] == undefined ? "" : filteredInvestment[0].PurchasePricePSF,
                      StablizedRSF: filteredInvestment[0] == undefined ? "" : filteredInvestment[0].StabilizedRSF,
                      MM1: filteredInvestment[0] == undefined ? "" : this.numFormatter(filteredInvestment[0].StabilizedBasis),
                      PSF1: filteredInvestment[0] == undefined ? "" : filteredInvestment[0].StabilizedBasisPSF,
                      YoC:filteredInvestment[0] == null? 0: filteredInvestment[0].UntrendedYoC / 100,
                      LabMarketRent:filteredInvestment[0] == undefined? "": filteredInvestment[0].LabMarketRentPSFAnn,
                      HardCostsPSF:filteredInvestment[0] == undefined? "": filteredInvestment[0].HardCostsPSF,
                      ConversionCostPSF:filteredInvestment[0] == undefined? "": filteredInvestment[0].ConversionCostPSF,
                      Notes: Deals[i].Description,
                      // Deals[0] == undefined
                      //   ? ""
                      //   : filteredDealComments[0].Reply.replace(
                      //       /<[^>]*>/g,
                      //       ""
                      //     ),
                      KEYDATESTATUS:filteredKeyDates[0] == undefined? "": moment(filteredKeyDates[0].KeyUpcomingDate).format("YYYY-MM-DD"),
                      Description:filteredKeyDates[0] == undefined? "": filteredKeyDates[0].Title,
                      ProjectType: Deals[i].ProjectType.Title,
                      Dates: "Test",
                      FootNotes: FootValues,
                      FID: FID,
                      CurrentDate: moment().format("YYYY-MM-DD"),
                    });
                  }
	
           console.log(this.array);

          this.getData(this.array);




        });
      })




    }); //service to get data from sharepoint via rest API
      });
    });


  }
  getData(array){


    //this.http.post("http://localhost:53244/api/Deal/Post", array).toPromise().then(a=>{//local
    this.http.post("https://api-bmr-wus-dealtracker-dev.azurewebsites.net/api/Deal/Post", array).toPromise().then(a=>{//prod
    

    a =  String(a).replace('.json','');
    //var reqUrl = "http://localhost:53244/DealTracker/{action}";//local
    var reqUrl = "https://api-bmr-wus-dealtracker-dev.azurewebsites.net/DealTracker/{action}";//prod
    var query = "InitViewer?filename="+a;    
    this.viewer.requestUrl =reqUrl;
    this.viewer.action = query;
    this.viewer.loadViewer(); 
    this.common.HideSpinner();
    })
  }
  sortByDate(a, b) {
    if (a.KeyUpcomingDate < b.KeyUpcomingDate) {
        return 1;
    }
    if (a.KeyUpcomingDate > b.KeyUpcomingDate) {
        return -1;
    }
    return 0;
}
  numFormatter(num) {
    if(num >= 1000 && num <= 999999){
        return (num/1000000).toFixed(2); // convert to K for number from > 1000 < 1 million 
    }else if(num >= 1000000 && num <= 999999999){
        return (num/1000000).toFixed(1); // convert to M for number from > 1 million 
    }else if(num < 999 && num > 0){
        return (num/1000000).toFixed(3); // if value < 1000, nothing to do
    }else if(num == 0)
    return 0;
}
  // ----------------------------------- filters ----------------------------
  //#region 
  public groupFilters: any = [];
  public allGroupsSelected: boolean = false;

  onFilter(event: any) {
    // Lease Info
  }

  onBack() {
    this.router.navigate(['/home']);
  }

  onFilterClick(frame) {
    var qry_StartDate = moment(this.StartEventDate).format("YYYY-MM-DD");

    var qry_EndDate = moment(this.EndEventDate).format("YYYY-MM-DD");

    this.viewReport(qry_StartDate, qry_EndDate);
    frame.close();
  }

  onFilterClear(frame) {
    this.StartEventDate = moment().startOf("year").toDate();

    this.EndEventDate = moment().endOf("year").toDate();
    this.MarketName = "";
    this.DealTypeName = "";
    this.StatusName = "";
    this.FNotes = "";
    this.viewReport(this.StartEventDate, this.EndEventDate);
    frame.close();
  }

  //#endregion

  public selectedHistoricalTenant: string = null;

  tenantHistoricalNotes(frame: any, tenant: string) {
    this.selectedHistoricalTenant = tenant;
    frame.show();
  }



  public showReportFlg: boolean = false;

  showReport() {
    this.showReportFlg = true;
  }

  reportChange() {
    this.showReportFlg = false;
  }

}
