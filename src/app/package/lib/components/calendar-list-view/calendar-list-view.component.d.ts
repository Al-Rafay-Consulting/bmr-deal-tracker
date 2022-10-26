import { OnInit, EventEmitter } from '@angular/core';
import { CalendarEvent } from '../../interfaces/calendar-event.interface';
import { MdbCalendarOptions } from '../../interfaces/calendar-options.interface';
export declare class MdbCalendarListViewComponent implements OnInit {
    get events(): CalendarEvent[];
    set events(events: CalendarEvent[]);
    private _events;
    monthsShort: string[];
    options: MdbCalendarOptions;
    weekDayIndex: number;
    viewChanged: EventEmitter<string>;
    eventClicked: EventEmitter<any>;
    listChanged: EventEmitter<any>;
    listView: any;
    initDay: Date;
    startDate: Date;
    endDate: Date;
    constructor();
    ngOnInit(): void;
    previous(): void;
    next(): void;
    goToToday(): void;
    onViewChange(view: string): void;
    trackByFn(index: any): any;
    onEventClick(event: any): void;
    createListView(date: Date): {
        eventsInPeriod: any;
        period: {
            start: string;
            end: string;
        };
    };
}
