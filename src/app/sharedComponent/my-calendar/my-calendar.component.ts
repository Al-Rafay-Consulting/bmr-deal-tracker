import { Subject } from 'rxjs';
import { ToastType } from 'src/app/Enum/ToastType';
import { Autocomplete } from 'src/app/Base/Autocomplete'

import { Component, ViewChild, TemplateRef, OnInit, HostListener, Input, AfterViewInit , Output, EventEmitter, OnChanges, ElementRef} from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { GeneralService } from 'src/app/services/general.service';
import { CalendarEvent, CalendarEventAction, CalendarDateFormatter, CalendarEventTimesChangedEvent, CalendarView, CalendarMonthViewBeforeRenderEvent } from 'angular-calendar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

import { BLBase } from 'src/app/Base/BLBase/BLBase.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService, MDBModalService, MDBModalRef, ModalDirective } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
//import { CustomDateFormatter } from 'src/app/calen  /custom-date-formatter.provider';
import { CustomDateFormatter } from 'src/app/canlendar-avail/custom-date-formatter.provider';
import{ KeyUpcomingDates } from 'src/app/modules/deal/keyupcomingdates.model';
import { StimulsoftViewerComponent } from 'stimulsoft-viewer-angular'; 
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';

// For Date Picker month
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';


import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

import { DateTime } from 'luxon';
import { CommonService } from 'src/app/Base/Common.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { SPOperationsService } from 'src/app/services/spoperations.service';

import { takeUntil, take } from 'rxjs/operators';
import { DealMaster } from 'src/app/modules/deal/dealmaster.model';
import { Color } from '@angular-material-components/color-picker';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas'
import { HttpClient } from '@angular/common/http';
const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


const colors: any = {};
colors['blue'] = {
  primary: '#33b5e5',
  secondary: '#D1E8FF',
}

colors['black'] = {
  primary: 'black',
  secondary: 'black',
}

 //object hay us k andar array hay. object ka name array hay. array ka ame data set hay

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  styleUrls: ['./my-calendar.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class MyCalendarComponent implements OnInit,OnChanges {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  
  @ViewChild('viewer')viewer:StimulsoftViewerComponent;

  public array: any=[];     
  public GlobalArray: any=[];  
  public modalRef: MDBModalRef;
  date = new FormControl(moment());
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  clickedDate: Date;
  clickedColumn: number;
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;

  FilterDate: Date = new Date();

  protected _onDestroy = new Subject<void>();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  events: CalendarEvent[];
  Allevents: CalendarEvent[];

  eventsToolTip:[]=[];
    @Input() selectedStatus :any = null;
    @Input() filterCalendarString :any = null;
    @Input() pdfEnable :any = null;

    

  constructor(
    private modal: NgbModal,
    public sp: SPOperationsService,
    public modalService: MDBModalService,
    public genService: GeneralService,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public service: SPOperationsService,
    public dialog: ConfirmDialogeService,
    public router: Router,
    public route: ActivatedRoute,
    private http: HttpClient,
    public common: CommonService,

    // public venueMonthCivic : VenueMonthNotesClass
  ) {
  }

  addNewItem(value: string) {
    //this.newItemEvent.emit(value);
  }


  ngOnChanges(changes: any): void {
    if(this.pdfEnable == true)
      this.SavePDF();

    this.viewDate = new Date();
    this.GenerateCalendarData(this.viewDate);
    console.log(this.selectedStatus);
  }

  onEdit(gen) {
    if (gen != undefined)
      this.router.navigate(['/portal/deals/main'], {
        queryParams: {
          dealID: gen.id
        }
      })
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterViewInit() {

  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      const dayOfMonth = day.date.getDate();
      if (dayOfMonth > 5 && dayOfMonth < 10 && day.inMonth) {
        //day.cssClass = 'bg-pink';
      }
    });
  }

 


  ngOnInit(): void {



      this.viewDate = new Date();

      this.refresh = new Subject();
      this.objKeyUpcomingDates = new KeyUpcomingDates();
    
    this.GenerateCalendarData(this.viewDate);

    console.log(this.selectedStatus);

  }

  public SavePDF(){  
    this.common.ShowSpinner();
    //this.CalendarViewReport()
     const e = document.getElementById('buttonsShow');
     if (e != null) {
       e.style.visibility="hidden";
     }
    
    

     var content = document.getElementById('CalendarChips')
  
     html2canvas(content).then((canvas) =>{

       const FILEChips = canvas.toDataURL('image/png')
       var CalendarChips = document.getElementById('content')
       html2canvas(CalendarChips).then((Chips) =>{
         const FILEURI = Chips.toDataURL('image/png')
         let doc = new jspdf({
           orientation: 'l', // landscape
           unit: 'pt', // points, pixels won't work properly
           format: [Chips.width, Chips.height] // set needed dimensions for any element
       });

       const pdfWidth = doc.internal.pageSize.getWidth();
       const pdfHeight = doc.internal.pageSize.getHeight();
       doc.addImage(FILEURI, 'PNG', 50, 46, pdfWidth-116, pdfHeight-70);
       //doc.addImage(FILEChips, 'PNG', 140, 740, 1350, 60);
       //doc.addImage(FILEChips, 'PNG', pdfWidth-1500, 600, pdfWidth-400, pdfHeight-(pdfHeight+50));
       doc.addImage(FILEChips, 'PNG', 50, pdfHeight-70, pdfWidth-300, 60);
       //var img = new Image()
       //img.src = 'assets/sample.png'
       //pdf.addImage(img, 'png', 10, 78, 12, 15)
       if (e != null) {
         e.style.visibility="visible";
       }
       doc.save('Calendar.pdf');
       this.common.HideSpinner();
       });
     


     });
  
    //doc.save('test.pdf');  
  } 
  CalendarViewReport(){

    var element = this.GlobalArray;

    for(var i=0;i<element.length;i++){
      element[i].KeyUpcomingDate = moment(element[i].KeyUpcomingDate).format("MM/DD/YYYY");
      element[i].StartMonth =  moment(element[i].KeyUpcomingDate).startOf('month').format("MMMM");   
      element[i].EndMonth =  moment(element[i].KeyUpcomingDate).endOf('month').format("MMMM");

      element[i].StartYear = moment(element[i].KeyUpcomingDate).startOf('year').format("YYYY");  
      element[i].EndYear = moment(element[i].KeyUpcomingDate).endOf('year').format("YYYY");  

      element[i].FiscalYear = moment(element[i].KeyUpcomingDate).format("YYYY");  
      element[i].FiscalMonth = moment(element[i].KeyUpcomingDate).format("MMMM");  
      element[i].FiscalMonthNumber = moment(element[i].KeyUpcomingDate).month()+1; 

      element[i].StartMonthNumber = moment(element[i].KeyUpcomingDate).month()+1;
      element[i].EndMonthNumber = moment(element[i].KeyUpcomingDate).month()+1;

      element[i].CNT = 1;
    }
    console.log(this.GlobalArray)
    this.getData(this.GlobalArray)
  }
  getData(array){


    this.http.post("http://localhost:53244/api/Deal/Post", array).toPromise().then(a=>{//local
    //this.http.post("https://api-bmr-wus-dealtracker-dev.azurewebsites.net/api/Deal/Post", array).toPromise().then(a=>{//prod
    

    a =  String(a).replace('.json','');
    var reqUrl = "http://localhost:53244/DealTracker/{action}";//local
    //ng servevar reqUrl = "https://api-bmr-wus-dealtracker-dev.azurewebsites.net/DealTracker/{action}";//prod
    var query = "InitViewer?filename="+a;    
    this.viewer.requestUrl =reqUrl;
    this.viewer.action = query;
    this.viewer.loadViewer(); 
    this.common.HideSpinner();
    })
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
 
    }
  }


  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        }
      },
    ];
  }

  

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay(ChangedDate: any) {
    this.activeDayIsOpen = false;

    this.GenerateCalendarData(ChangedDate);
    
  }

  dayEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

 

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();

  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    ctrlValue.year(normalizedMonth.year());
    this.date.setValue(ctrlValue);
    datepicker.close();

    this.viewDate = new Date(this.date.value);

    this.GenerateCalendarData(this.viewDate);
    
  }


  objKeyUpcomingDates: KeyUpcomingDates;
  GenerateCalendarData(TodayDate: Date) {
    this.array = [];
    var filter="";
    if(this.selectedStatus != undefined)
      filter = 'StatusId eq ' + this.selectedStatus.ID;
    var startDate = moment(TodayDate).startOf('month').format("MM-DD-YYYY");
    var endDate = moment(TodayDate).endOf('month').format("MM-DD-YYYY");
    if(this.filterCalendarString != undefined)
    filter += this.filterCalendarString;

    const query = {
      select: 'ID, Title, Funds/Title,DealId',
      filter: '',
      orderby: '',
      expand: 'Funds',
      top: 5000
    };
    this.service.readItems("InvestmentSummary", query).then(res => {
      var InvestmentItems = res['d'].results;
      const query = {
        select: 'ID, Title, DateEntered, ReportOutput, Address, City, ZipCode, Description, SF,isDeleted, \
        StateId, State/ID, State/Title, State/Name, \
        MarketId, Market/ID, Market/Title, \
        BrokersId, Brokers/ID, Brokers/Title, \
        BrokerageId, Brokerage/ID, Brokerage/Title, \
        SubMarketId, SubMarket/ID, SubMarket/Title, \
        DealTypeId, DealType/ID, DealType/Title, \
        StatusId, Status/ID, Status/Title,Status/ColorCode, \
        ProjectTypeId, ProjectType/ID, ProjectType/Title, \
        BMRDealTeamId, BMRDealTeam/ID, BMRDealTeam/Title',
        filter: filter,
        expand: 'Market, SubMarket, DealType, Status, ProjectType, BMRDealTeam, Brokers, Brokerage, State',
        orderby: ''
      };
      this.service.readItems("DealMaster", query).then(res => {
          var DealMasterItems = res['d'].results;
          DealMasterItems = DealMasterItems.filter(x => x.isDeleted == false);
          filter="";
          if (startDate != "" && startDate != undefined && startDate != null) {
            if (filter != "")
              filter += "and"
      
            filter += " KeyUpcomingDate ge '" + startDate + "'";
          }
      
          if (endDate != "" && endDate != undefined && endDate != null) {
            if (filter != "")
              filter += "and"
      
            filter += " KeyUpcomingDate le '" + endDate + "'";
          }
        const query1 = {
          select: 'Title,ID,DealId,Deal/ID, Deal/Title, KeyUpcomingDate,EventListId,EventList/Title,EventList/ColorCode,EventListText',
          filter: filter,
          expand: 'Deal,EventList',
          orderby: 'ID desc',
          top: 5000
        };
        this.service.readItems("KeyUpcomingDates", query1).then(res => {
          var KeyUpcomingDates = res['d'].results;
          for(var icount=0;icount<DealMasterItems.length;icount++){
            var elementDeal = DealMasterItems[icount];
            var filteredkeyUpcomingDate = KeyUpcomingDates.filter(a => a.DealId == elementDeal.ID);
            var filteredInvestmentItems = InvestmentItems.filter(a => a.DealId == elementDeal.ID);


              var iFundsItems = "";
              for(var iFunds=0;iFunds<filteredInvestmentItems[0].Funds.results.length;iFunds++){
                if(iFunds == (filteredInvestmentItems[0].Funds.results.length)-1)
                iFundsItems += filteredInvestmentItems[0].Funds.results[iFunds].Title
                else
                iFundsItems += filteredInvestmentItems[0].Funds.results[iFunds].Title+", ";
              }
            for (var i = 0; i < filteredkeyUpcomingDate.length; i++) {
              this.array.push({ //Push data in to array
                "ID": filteredkeyUpcomingDate[i].ID,  //left pe report k naam aur right pe list k naam.
                "DealID":elementDeal.ID,
                "Title": elementDeal.Title,
                "Funds": iFundsItems,
                "Address": elementDeal.Address,
                "Status": elementDeal.Status.Title,
                "EventList": filteredkeyUpcomingDate[i].EventList.Title,
                "EventListText":filteredkeyUpcomingDate[i].EventListText,
                "StatusColorCode": filteredkeyUpcomingDate[i].EventList.ColorCode,// elementDeal.Status.ColorCode,
                "DealType": elementDeal.DealType.Title,
                "DateDescription": filteredkeyUpcomingDate[i].Title,
                "KeyUpcomingDate":filteredkeyUpcomingDate[i].KeyUpcomingDate
              });
            }
          }
          this.GlobalArray = this.array;
          this.events =this.createCalendarEventData(this.array);
          this.array = [];
          this.refresh = new Subject();
        });
      });
    });



  }

  createCalendarEventData(data: []): CalendarEvent[] {

    var eventarray: CalendarEvent[] = [];

    data.forEach(element => {
      eventarray.push(
        {
          id: element['DealID'],
          start: this.common.ConvertStringToHhMm(element['KeyUpcomingDate'], '08:00'),
          end: this.common.ConvertStringToHhMm(element['KeyUpcomingDate'], '23:59'),
          title: element['Title'],
          color: {
            primary: element['StatusColorCode'],
            secondary: '#FFFFFF',
          },
          //color: element['EventStatus'] == null ? colors.blue : element['IsSecured'] == true ? colors.black : colors[element['Color']],
          //actions: this.actions,
          //allDay: true,
          // resizable: {
          //   beforeStart: true,
          //   afterEnd: true,
          // },
          meta: {
            ToolTipDate: element['KeyUpcomingDate'],
            DealName: element['Title'],
            DealID: element['DealID'], 
            Status: element['Status'],
            Funds: element['Funds'], 
            EventList: element['EventList'],  
            //Funds: element['Funds'], 
            Address: element['Address'], 
            DateDescription: element['DateDescription'], 
            EventListText: element['EventListText'], 
          }        

        })

    });

  

    return eventarray;
  }



  

  filterCalendar(type: string, event: MatDatepickerInputEvent<Date>) {
    this.viewDate = new Date(event.value);

    //this.refresh = new Subject();
    this.GenerateCalendarData(this.viewDate);
    

  }

   
  allVenueSelected = false;
















 

}

