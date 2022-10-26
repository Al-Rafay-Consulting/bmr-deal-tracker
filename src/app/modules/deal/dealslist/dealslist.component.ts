// import { State } from 'src/app/modules/admin/state/state.model';
import { DealMaster } from './../dealmaster.model';
import { Subject } from 'rxjs';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarEvent, CalendarEventAction, CalendarDateFormatter, CalendarEventTimesChangedEvent, CalendarView, CalendarMonthViewBeforeRenderEvent } from 'angular-calendar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { default as _rollupMoment, Moment } from 'moment';
import * as _moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from 'src/app/Base/Table';
import { ToastService, MDBModalService, MDBModalRef, ModalDirective } from 'ng-uikit-pro-standard';
import { CommonService } from '../../../Base/Common.service';
import { DateTime } from 'luxon';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { Status } from 'src/app/modules/admin/status/status.model';
import { Market } from 'src/app/modules/admin/market/market.model';

import { Projecttype } from 'src/app/modules/admin/projecttype/projecttype.model';

import { Autocomplete } from 'src/app/Base/Autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import moment from 'moment';
import { I } from 'projects/ng-uikit-pro-standard/src/lib/free/utils/keyboard-navigation';
import { MyCalendarComponent } from 'src/app/sharedComponent/my-calendar/my-calendar.component';
import { max } from 'date-fns';

@Component({
  selector: 'app-dealslist',
  templateUrl: './dealslist.component.html',
  styleUrls: ['./dealslist.component.scss']
})

export class DealslistComponent extends Table implements OnInit {
  // =================== variables
  //#region
  GraphView: boolean = true;
  ListView: boolean = false;
  CalendarViewChip: boolean = true;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  @ViewChild('modalContent', {
    static: true
  })
  selectedStatusForCalendar : string = "";
  filterCalendarString : string = "";
  modalContent: TemplateRef<any>;
  public searchInput = false;
  refresh: Subject<any> = new Subject();
  DisplayName: string = "";
  displayedColumns: string[] = ['Title', 'Market', 'SubMarket', 'Status', 'KeyDate' ,'Funds'];
  public modalRef: MDBModalRef;
  selectedChipStatusName = "Status";
  selectedChipViewName = "L";
  activeDayIsOpen: boolean = true;
  headingName: string = "";
  parent: string = "";
  other: string = "";

  filterby: string = 'Status'; // by default
  clickedDate: Date;
  clickedColumn: number;
  calendarDate: any[] = []
  longitude = -87.623177;
  latitude = 41.881832;
  selectedChipModule = "Occupancy";
  selectedChipPeriod = "DoD";
  FilterDate: Date = new Date();
  pdfEnable :boolean = false;
  StatusName: string = null;
  MarketName: string = "";
  ProjectTypeName: string = "";
  YearName: string = "";
  ModuleOptions: any[] = [];
  AutoCompYear: Autocomplete<any> = new Autocomplete<any>("Title", "ID");
  AutoCompStatus: Autocomplete<Status> = new Autocomplete<Status>("Title", "ID");
  AutoCompMarket: Autocomplete<Market> = new Autocomplete<Market>("Title", "ID");

  AutoCompProjectType: Autocomplete<Projecttype> = new Autocomplete<Projecttype>("Title", "ID");
  markers = [{
    latitude: 41.881832,
    longitude: -87.623177,
    Title: 'Chicago'
  },
  {
    latitude: 40.7128,
    longitude: -74.0060,
    Title: 'New York'
  },
  {
    latitude: 27.798244,
    longitude: -82.798462,
    Title: 'Florida'
  },
  {
    latitude: 41.392502,
    longitude: -81.534447,
    Title: 'Bedford, OH, the US'
  },
  {
    latitude: 32.349998,
    longitude: -95.300003,
    Title: 'Texas'
  }
  ];

  protected _onDestroy = new Subject<void>();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  labelOptions = {
    color: '#CC0000',
  }
  actions: CalendarEventAction[] = [{
    label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    a11yLabel: 'Edit',
    onClick: ({
      event
    }: {
      event: CalendarEvent
    }): void => {
      this.handleEvent('Edited', event);
    },
  },
  {
    label: '<i class="fas fa-fw fa-trash-alt"></i>',
    a11yLabel: 'Delete',
    onClick: ({
      event
    }: {
      event: CalendarEvent
    }): void => {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.handleEvent('Deleted', event);
    },
  },
  ];
  events: CalendarEvent[];
  Allevents: CalendarEvent[];
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {
      event,
      action
    };
    this.modal.open(this.modalContent, {
      size: 'lg'
    });
  }

  @ViewChild('Status') Status: MatSelect;
  @ViewChild('Market') Market: MatSelect;
  @ViewChild('ProjectType') ProjectType: MatSelect;

  @ViewChild('Year') Year: MatSelect;
  constructor(
    private modal: NgbModal,
    public service: SPOperationsService,
    public router: Router,
    public modalService: MDBModalService,
    public common: CommonService,
    public route: ActivatedRoute
  ) {
    super(router);
    this.common.hideGlobalSearch = false;
  }
  navigate(property: any) {
    this.router.navigate(['/portal/deals/main'], {
      queryParams: {
        ID: property.ID
      }
    });
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
  ngOnInit(): void {
    this.viewDate = new Date();
    this.getUniqueYears();
    this.getDealsData();    // get deals data
    this.getStatus();
    this.getEventList();
    this.getMarkets();

    this.getProjectTypes();
    // set dashboard heading
    if (this.other != '') {
      this.setheading(this.other);
    }
  }
  // on destroy of component - life cycle hook
  ngOnDestroy() {
    this.common.hideGlobalSearch = false;
  }
  // get deals data
  getDealsData() {
    this.common.ShowSpinner();
    this.pdfEnable = false;
    // ------------------ Set filters
    var filter = "isDeleted eq 0";
    // YearName
    if (this.YearName != "" && this.YearName != undefined && this.YearName != null) {
      for (let index = 0; index < this.YearName.length; index++) {
        const element = this.YearName[index];
        if (this.YearName.length > 1 && index !=0)
        filter += " or"
      else
        filter += " and"
        var sDate = new Date(element);
        filter += " (DateEntered ge '" + moment(new Date(sDate.getFullYear(), sDate.getMonth(), 1)).format('YYYY-MM-DD') + "' and DateEntered le '" + moment(new Date(sDate.getFullYear(), 11, 31)).format('YYYY-MM-DD') + "')";
      }
    }
    // MarketName
    if (this.MarketName != "" && this.MarketName != undefined && this.MarketName != null) {
      for (let index = 0; index < this.MarketName.length; index++) {
        const element = this.MarketName[index];
        if (this.MarketName.length > 1 && index !=0)
          filter += " or"
        else
          filter += " and"
        filter += " (MarketId eq " + element.toString() + ")";
      }
    }
    // StatusName
    if (this.StatusName != "" && this.StatusName != undefined && this.StatusName != null) {
      for (let index = 0; index < this.StatusName.length; index++) {
        const element = this.StatusName[index];
        if (this.StatusName.length > 1 && index !=0)
        filter += " or"
      else
        filter += " and"

        filter += " (StatusId eq " + element.toString() + ")";
      }
    }
    // ProjectTypeName
    if (this.ProjectTypeName != "" && this.ProjectTypeName != undefined && this.ProjectTypeName != null) {
      for (let index = 0; index < this.ProjectTypeName.length; index++) {
        const element = this.ProjectTypeName[index];
        if (this.ProjectTypeName.length > 1 && index !=0)
        filter += " or"
      else
        filter += " and"
        filter += " (ProjectTypeId eq " + element.toString() + ")";
      }
    }
    // ------------------- Set order by using filter by
    let orderby = "Status/Title,Title";
    if (this.filterby == 'Market') {
      orderby = 'Market/Title,Title';
    } 
    if (this.filterby == 'Projecttype') {
      orderby = 'ProjectType/Title,Title';
      
    } 
    // ------------------- set query Investment Summary
    const query = {
      select: 'ID, Title, Funds/Title,DealId,Deal/Title',
      filter: '',
      orderby: '',
      expand: 'Funds,Deal'
    };
    this.service.readItems("InvestmentSummary", query).then(res => {
      let InvestmentItems = res['d'].results;
      const query = {
        select: 'ID, Title,KeyUpcomingDate,DealId,Deal/isDeleted',
        filter: 'Deal/isDeleted eq 0',
        expand: 'Deal',
        orderby:'KeyUpcomingDate desc',
      };
      this.service.readItems("KeyUpcomingDates", query).then(res => {
        let KeyUpcomingDatesItems = res['d'].results;
        const query = {
          select: 'ID, Title, SF, Market/Title, SubMarket/Title, Status/Title, Address, DateEntered, ProjectType/Title,isDeleted,Longitude,Latitude',
          filter: filter,
          orderby: orderby,
          expand: 'Market, SubMarket, Status, ProjectType'
        };
        this.filterCalendarString = filter;
        // ------------------- network call
  
        this.service.readItems("DealMaster", query).then(res => {
          let resItems = res['d'].results;
          resItems = resItems.filter(x => x.isDeleted == 0);
           if(this.selectedChipStatusName == 'Projecttype'){
             resItems = resItems.filter(res => res.ProjectType.Title === "BX/BMR Workstreams" )
             console.log(resItems);
           }
          var StatusArr = ['Closed','U/E','DD', 'U/W','CA','On Hold','Inactive','PSA','LOI',];
          for(var count=0;count<StatusArr.length;count++){
            var element = StatusArr[count];
            var status1 = resItems.filter(x => x.Status.Title == element);
            if(status1.length > 0){
              for(var k=0;k<status1.length;k++){
                status1[k].Status['sort'] = count;
              }
            }

          }
          resItems = resItems.sort((a, b) => (a.Status.sort > b.Status.sort ) ? 1 : -1)     
          let items = [];
          var FinalKeyDate = "";
          for (let k = 0; k < resItems.length; k++) {
            var  elemntKeyUpcoming = KeyUpcomingDatesItems.filter(x => x.DealId == resItems[k].ID);
            elemntKeyUpcoming = elemntKeyUpcoming.sort(this.sortByDate);

            var TodaysDate = moment(new Date()).format("MM/DD/YYYY");
            var flag = false;
            console.log(TodaysDate);
            for(var keyCount=0;keyCount<elemntKeyUpcoming.length;keyCount++){
              var keyDate = moment(elemntKeyUpcoming[keyCount].KeyUpcomingDate).format("MM/DD/YYYY");
              if(new Date(keyDate) > new Date(TodaysDate)){
                flag = true;
                FinalKeyDate = keyDate;
              }else{
                if(flag == true){
                  break;
                }else{
                  FinalKeyDate = keyDate;
                  break;
                }
              }
            }
            var  keyValue = elemntKeyUpcoming.filter(x => 
              moment(x.KeyUpcomingDate).format("MM/DD/YYYY") == FinalKeyDate
              );
            elemntKeyUpcoming = elemntKeyUpcoming.sort(this.sortByDate);
            var  elemntInvest = InvestmentItems.filter(x => x.DealId == resItems[k].ID);
            var iFundsItems = "";
            if(elemntInvest.length >0){
   
              for(var iFunds=0;iFunds<elemntInvest[0].Funds.results.length;iFunds++){
                if(iFunds == (elemntInvest[0].Funds.results.length)-1)
                iFundsItems += elemntInvest[0].Funds.results[iFunds].Title
                else
                iFundsItems += elemntInvest[0].Funds.results[iFunds].Title+", ";
              }
            }

            let item = {
              ID: resItems[k].ID,
              Title: resItems[k].Title,
              Market: resItems[k].Market.Title,
              SubMarket: resItems[k].SubMarket.Title,
              Status: resItems[k].Status.Title,
              StatusSort: resItems[k].Status.sort,
              Funds: (elemntInvest.length > 0)?iFundsItems:"",
              KeyDate: (keyValue.length > 0)?moment(FinalKeyDate).format("MM/DD")+" - "+keyValue[0].Title:"",//
              KeyDatesSort: (elemntKeyUpcoming.length > 0)?moment(FinalKeyDate).format("MM/DD/YYYY"):"",//moment(elemntKeyUpcoming[0].KeyUpcomingDate).format("MM/DD")+" - "+elemntKeyUpcoming[0].Title
              DateEntered: resItems[k].DateEntered,
              Address: resItems[k].Address,
              ProjectType: resItems[k].ProjectType.Title,
              Latitude:resItems[k].Latitude,
              Longitude:resItems[k].Longitude,
            }
            items.push(item);
          }

          var uniqueGroups = this.getUniqueGroupValues(items, this.filterby);
          this.setData(items, uniqueGroups, this.filterby);
          this.listData = new MatTableDataSource(items as DealMaster[]);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          // map data
          this.setMapData(items);
          // hide spinner
          this.common.HideSpinner();
        });
      });

    });

  }

  setData(data: any[], UniqueColumns: any[], filter) {
    data = data.sort((a, b) => (new Date(a.KeyDatesSort) < new Date(b.KeyDatesSort) ) ? 1 : -1)
    if (filter == 'Status') {
      data = data.sort((a, b) => (a.StatusSort > b.StatusSort ) ? 1 : -1)
    } 
    else  {
      data = data.sort((a, b) => (a.Market > b.Market ) ? 1 : -1)
    } 
    for (let index = 0; index < UniqueColumns.length; index++) {
      var element = UniqueColumns[index];

      if (filter == 'Status') {
        var newIndex = data.findIndex(x => x.Status === element);
      } else  if(filter == 'Market'){
        var newIndex = data.findIndex(x => x.Market === element);
      } else {
        var newIndex = data.findIndex(x => x.ProjectType === element);
      }
     
      data.splice(newIndex, 0, {
        Title: (element == undefined || element == null) ? "Not Defined" : element,
        isGroup: true
      });
    }
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
  setMapData(data: any) {
    this.markers = data;
  }
SavePDF(){
  this.pdfEnable = true;
}
getEventList() {
  const query = {
    select: 'ID, Title,ColorCode',
    orderby: 'ID desc'
  };

  this.service.readItems("EventList", query).then(res => {
    this.common.HideSpinner();
    this.ModuleOptions = res['d'].results;

  });

}
  getStatus() {
    const query = {
      select: 'ID, Title, Inactive,Modified, Editor/Title,ColorCode',
      expand: 'Editor',
      filter: 'Inactive eq true or Inactive eq null',
      orderby: 'Title asc'
    };

    this.service.readItems("Status", query).then(res => {
      this.common.HideSpinner();
      //this.ModuleOptions = res['d'].results;
      this.AutoCompStatus.data = res['d'].results as Status[];
      this.AutoCompStatus.resultObserve();

    });

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


  getUniqueGroupValues(data: any[], filter): any[] {
    if (filter == 'Status') {
      return data.map(item => item.Status)
        .filter((value, index, self) => self.indexOf(value) === index)
    } else if (filter == 'Market') {
      return data.map(item => item.Market)
        .filter((value, index, self) => self.indexOf(value) === index)
    } else {
      return data.map(item => item.ProjectType)
        .filter((value, index, self) => self.indexOf(value) === index)
    }
  }

  getUniqueYears() {
    const query = {
      select: 'ID, Title,DateEntered',
      filter: '',
      orderby: 'DateEntered desc',
      expand: ''
    };
    // ------------------- network call
    this.service.readItems("DealMaster", query).then(res => {
      let data = res['d'].results;
      var items = [];
    var Filtereddata = data.map(item => moment(item.DateEntered).format("YYYY"))
      .filter((value, index, self) => self.indexOf(value) === index)
    for (var i = 0; i < Filtereddata.length; i++) {
      let item = {
        ID: Filtereddata[i],
        Title: Filtereddata[i]
      }
      items.push(item);
    }
    Filtereddata = items;
    this.AutoCompYear.data = null;
    this.AutoCompYear.data = Filtereddata as any[];
    this.AutoCompYear.resultObserve();
  });
}
  allSelected = true;
  toggleAllSelection(value) {
    this.allSelected = !this.allSelected;  // to control select-unselect

    if (this.allSelected) {
      if (value == "Status")
        this.Status.options.forEach((item: MatOption) => item.select());
      else if (value == "Market")
        this.Market.options.forEach((item: MatOption) => item.select());
      else if (value == "Project Type")
        this.ProjectType.options.forEach((item: MatOption) => item.select());
      else if (value == "Year")
        this.Year.options.forEach((item: MatOption) => item.select());
    } else {
      if (value == "Status")
        this.Status.options.forEach((item: MatOption) => { item.deselect() });
      else if (value == "Market")
        this.Market.options.forEach((item: MatOption) => { item.deselect() });
      else if (value == "Project Type")
        this.ProjectType.options.forEach((item: MatOption) => { item.deselect() });
      else if (value == "Year")
        this.Year.options.forEach((item: MatOption) => { item.deselect() });
    }
  }
  onFilterClear(frame: ModalDirective) {
    this.YearName = null;
    this.MarketName = "";
    this.StatusName = "";
    this.ProjectTypeName = "";
    this.getDealsData();
    frame.hide();
  }

  onFilterClick(frame: ModalDirective) {
    this.getDealsData();
    frame.hide();
  }

  setheading(label) {
    this.headingName = label;
  }

  onEdit(gen: DealMaster) {
    if (gen.ID != undefined)
      this.router.navigate(['/portal/deals/main'], {
        queryParams: {
          dealID: gen.ID
        }
      })
  }
  onChipStatus(value){
    this.selectedStatusForCalendar = value;
  }
  onChipStatusClick(symbol) {
    this.selectedChipStatusName = symbol;
    this.filterby = symbol;
    this.getDealsData();
  }

  onChipViewClick(symbol) {
    this.selectedChipViewName = symbol;
    if (symbol == 'G') {
      this.GraphView = false;
      this.ListView = true;
      this.CalendarViewChip = true;
    } else if (symbol == 'L') {
      this.GraphView = true;
      this.ListView = false;
      this.CalendarViewChip = true;
    } else if (symbol == 'C') {
      this.GraphView = true;
      this.ListView = true;
      this.CalendarViewChip = false;
    }
  }

  onBack() {
    this.router.navigate(['/home']);
  }

  openNewDealList() {
    this.router.navigate(['/portal/form']);
  }
}
