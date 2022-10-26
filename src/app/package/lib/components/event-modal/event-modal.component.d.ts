import { OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { FormGroup } from '@angular/forms';
import { CalendarEvent } from '../../interfaces/calendar-event.interface';
import { Subject } from 'rxjs';
export declare class EventModalComponent implements OnInit {
    modalRef: MDBModalRef;
    title: string;
    heading: string;
    actionBtn: string;
    cancelBtn: string;
    mode: string;
    editable: boolean;
    event: CalendarEvent;
    eventForm: FormGroup;
    constructor(modalRef: MDBModalRef);
    eventData: Subject<CalendarEvent>;
    eventDeleted: Subject<CalendarEvent>;
    getParsedValues(eventData: any): {
        id: string;
        name: any;
        startDate: Date;
        endDate: Date;
        color: any;
    };
    ngOnInit(): void;
    onSave(): void;
    onDelete(): void;
}
