import { Subject } from 'rxjs';


import { Component, ViewChild, TemplateRef, OnInit, HostListener, Input, AfterViewInit , Output, EventEmitter} from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { GeneralService } from 'src/app/services/general.service';
import { CalendarEvent, CalendarEventAction, CalendarDateFormatter, CalendarEventTimesChangedEvent, CalendarView, CalendarMonthViewBeforeRenderEvent } from 'angular-calendar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';


import { NgxSpinnerService } from "ngx-spinner";
import { ToastService, MDBModalService, MDBModalRef, ModalDirective } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CustomDateFormatter } from './custom-date-formatter.provider';



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


import { CommonService } from 'src/app/Base/Common.service';

import { SPOperationsService } from 'src/app/services/spoperations.service';



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

@Component({
  selector: 'app-canlendar-avail',
  templateUrl: './canlendar-avail.component.html',
  styleUrls: ['./canlendar-avail.component.scss'],
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
export class CanlendarAvailComponent implements OnInit{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  
  


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

  constructor(
    private modal: NgbModal,
    public sp: SPOperationsService,
    public modalService: MDBModalService,
    public genService: GeneralService,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public service: GenericService,
    public dialog: ConfirmDialogeService,
    public router: Router,
    public route: ActivatedRoute,
    public common: CommonService,

    // public venueMonthCivic : VenueMonthNotesClass
  ) {
  }

  addNewItem(value: string) {
    //this.newItemEvent.emit(value);
  }


  ngOnChanges(changes: any): void {

    this.viewDate = new Date();
    this.GenerateCalendarData(this.viewDate);
    
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

    
    this.GenerateCalendarData(this.viewDate);



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


   
  GenerateCalendarData(TodayDate: Date) {
    //this.ShowSpinner();

    // var allSelectedVenueID = "";
    // for (let index = 0; index < this.VenueID.length; index++) {
    //   const element = this.VenueID[index];
    //   allSelectedVenueID += element.toString();/
    //   if (index < this.VenueID.length - 1)
    //     allSelectedVenueID += ","
    // }
    
   /* var startDate = moment(TodayDate).startOf('month').format("MM-DD-YYYY");
    var endDate = moment(TodayDate).endOf('month').format("MM-DD-YYYY");

    this.genService.GetConfigDataWithQuery("SP_GetAvails '" + startDate + "', '" + endDate + "', '"+this.selectedChipVenueID+"'" ).then(res => {
      var calendarData = res['value'] as [];
        this.events = this.createCalendarEventData(calendarData);
        this.Allevents = [...this.events];
        //this.getDataByChip(this.selectedChipVenueName, this.selectedChipEventStatus);

        this.refresh = new Subject();
        this.HideSpinner();

        this.common.HideSpinner();
    });

    this.genService.GetConfigDataWithQuery("sp_GetAvails_Events '" + startDate + "', '" + endDate + "', '"+this.selectedChipVenueID+"'" ).then(res => {
      this.eventsToolTip = res['value'] as [];            
    });*/
    this.createCalendarEventData([]);

  }

  createCalendarEventData(data: []): CalendarEvent[] {

    var eventarray: CalendarEvent[] = [];

    //data.forEach(element => {
      eventarray.push(
        {
          id: 1,
          start: this.common.ConvertStringToHhMm(new Date(), "08:00"),
          end: this.common.ConvertStringToHhMm(new Date(), "08:00"),
          title: "Test",
          color: colors.green,
          //color: element['EventStatus'] == null ? colors.blue : element['IsSecured'] == true ? colors.black : colors[element['Color']],
          //actions: this.actions,
          //allDay: true,
          // resizable: {
          //   beforeStart: true,
          //   afterEnd: true,
          // },
          meta: {
            //ToolTipDate: element['ToolTipDate'],          
          }        
        })

   // });

  

    return eventarray;
  }



  

  filterCalendar(type: string, event: MatDatepickerInputEvent<Date>) {
    this.viewDate = new Date(event.value);

    //this.refresh = new Subject();
    this.GenerateCalendarData(this.viewDate);
    

  }

   
  allVenueSelected = false;
















 

}

