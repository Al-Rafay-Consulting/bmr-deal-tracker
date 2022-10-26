import { OnInit, EventEmitter, Renderer2, QueryList, AfterViewInit } from '@angular/core';
import { CalendarEvent } from '../../interfaces/calendar-event.interface';
import { MdbCalendarOptions } from '../../interfaces/calendar-options.interface';
export declare class MdbCalendarWeekViewComponent implements OnInit, AfterViewInit {
    private renderer;
    days: QueryList<any>;
    fullDays: QueryList<any>;
    get events(): CalendarEvent[];
    set events(events: CalendarEvent[]);
    private _events;
    weekDaysShort: string[];
    monthsShort: string[];
    weekDayIndex: number;
    options: MdbCalendarOptions;
    dateClicked: EventEmitter<any>;
    eventClicked: EventEmitter<any>;
    viewChanged: EventEmitter<string>;
    weekChanged: EventEmitter<any>;
    startDate: Date;
    endDate: Date;
    weekView: any;
    initDay: Date;
    dayCells: HTMLElement[];
    fullDayCells: HTMLElement[];
    columns: HTMLElement[];
    fullDaySelectionStart: Date;
    fullDaySelectionEnd: Date;
    fullDayEditing: boolean;
    dayEditing: boolean;
    selectionStartDate: Date;
    selectionEndDate: Date;
    dragStart: any;
    isDragging: boolean;
    dragEnd: any;
    constructor(renderer: Renderer2);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    trackByFn(index: any): any;
    previous(): void;
    next(): void;
    goToToday(): void;
    fullDayMouseDown(event: any, day: any): void;
    fullDayMouseUp(event: any, day: any): void;
    fullDaySelectRange(): void;
    fullDayClearSelection(): void;
    fullDayMouseMove(event: any): void;
    onMouseDown(event: any, day: any): void;
    onMouseUp(event: any, day: any): void;
    selectRange(): void;
    clearSelection(): void;
    onMouseMove(event: any): void;
    onEventClick(event: CalendarEvent): void;
    onDateClick(date: any): void;
    onViewChange(view: string): void;
    createWeekView(initDate: Date): {
        allDayRow: any[];
        weekRows: any[];
        period: {
            start: string;
            end: string;
        };
    };
}