import { __decorate, __metadata } from "tslib";
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MDBModalService, MDBModalRef } from 'angular-bootstrap-md';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { CalendarView } from '../../uilts/calendar-view';
import { take } from 'rxjs/operators';
import { format, getYear, getMonth, getDate } from 'date-fns';
let MdbCalendarComponent = class MdbCalendarComponent {
    constructor(modalService) {
        this.modalService = modalService;
        this.weekDaysDefault = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];
        this.weekDaysShortDefault = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.monthsDefault = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        this.monthsShortDefault = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        this.calendarOptions = {
            firstDayOfWeek: 'Sunday',
            monthViewBtnTxt: 'Month',
            weekViewBtnTxt: 'Week',
            listViewBtnTxt: 'List',
            todayBtnTxt: 'Today',
            eventAddTitle: 'Add new event',
            eventEditTitle: 'Edit event',
            eventCancelBtnTxt: 'Cancel',
            eventAddBtnTxt: 'Add',
            eventEditBtnTxt: 'Edit',
            eventDeleteBtnTxt: 'Delete'
        };
        this.dayLabels = [];
        this.dayLabelsShort = [];
        this.events = [];
        this.editable = true;
        this.weekDays = this.weekDaysDefault;
        this.weekDaysShort = this.weekDaysShortDefault;
        this.months = this.monthsDefault;
        this.monthsShort = this.monthsShortDefault;
        this.eventDeleted = new EventEmitter();
        this.eventEdited = new EventEmitter();
        this.eventAdded = new EventEmitter();
        this.monthChanged = new EventEmitter();
        this.weekChanged = new EventEmitter();
        this.listChanged = new EventEmitter();
        this.MS_IN_DAY = 24 * 60 * 60 * 1000;
        this.view = CalendarView;
        this.currentView = this.view.month;
    }
    ngOnInit() {
        this.calendarOptions = this.options ? Object.assign(this.calendarOptions, this.options) : this.calendarOptions;
        this._changeDaysOrder();
        if (this.defaultView) {
            this.onViewChange(this.defaultView);
        }
    }
    _changeDaysOrder() {
        const dayIndex = this.weekDayIndex = this.weekDaysDefault.indexOf(this.calendarOptions.firstDayOfWeek);
        if (dayIndex !== -1) {
            let index = dayIndex;
            for (let i = 0; i < this.weekDays.length; i++) {
                this.dayLabels.push(this.weekDays[index]);
                this.dayLabelsShort.push(this.weekDaysShort[index]);
                index = this.weekDaysDefault[index] === 'Saturday' ? 0 : index + 1;
            }
        }
    }
    getFormattedEvent(event) {
        return {
            id: event.id,
            name: event.name,
            startDate: format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
            endDate: format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
            color: event.color
        };
    }
    formatDate(date) {
        const year = getYear(date);
        const month = getMonth(date);
        const day = getDate(date);
    }
    onDayClick(day) {
        if (this.editable) {
            this.openAddModal(day);
        }
    }
    onEventClick(event) {
        this.openEditModal(event);
    }
    onViewChange(view) {
        this.currentView = this.view[view];
    }
    onMonthChange(event) {
        this.monthChanged.emit(event);
    }
    onWeekChange(event) {
        this.weekChanged.emit(event);
    }
    onListChange(event) {
        this.listChanged.emit(event);
    }
    openAddModal(event) {
        const data = {
            title: this.calendarOptions.eventAddTitle,
            actionBtn: this.calendarOptions.eventAddBtnTxt,
            cancelBtn: this.calendarOptions.eventCancelBtnTxt,
            mode: 'add',
            editable: this.editable,
            event: this.getFormattedEvent(event)
        };
        this.modalRef = this.modalService.show(EventModalComponent, { data });
        this.modalRef.content.eventData
            .pipe(take(1))
            .subscribe((newEvent) => {
            this.eventAdded.emit(newEvent);
        });
    }
    openEditModal(event) {
        const data = {
            title: this.calendarOptions.eventEditTitle,
            actionBtn: this.calendarOptions.eventEditBtnTxt,
            cancelBtn: this.calendarOptions.eventDeleteBtnTxt,
            mode: 'edit',
            editable: this.editable,
            event: event
        };
        this.modalRef = this.modalService.show(EventModalComponent, { data });
        this.modalRef.content.eventData
            .pipe(take(1))
            .subscribe((editedEvent) => {
            this.eventEdited.emit(editedEvent);
        });
        this.modalRef.content.eventDeleted
            .pipe(take(1))
            .subscribe((deletedEvent) => {
            this.eventDeleted.emit(deletedEvent);
        });
    }
};
MdbCalendarComponent.ctorParameters = () => [
    { type: MDBModalService }
];
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdbCalendarComponent.prototype, "events", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "options", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "editable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdbCalendarComponent.prototype, "weekDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdbCalendarComponent.prototype, "weekDaysShort", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdbCalendarComponent.prototype, "months", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdbCalendarComponent.prototype, "monthsShort", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], MdbCalendarComponent.prototype, "defaultView", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "eventDeleted", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "eventEdited", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "eventAdded", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "monthChanged", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "weekChanged", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarComponent.prototype, "listChanged", void 0);
MdbCalendarComponent = __decorate([
    Component({
        selector: 'mdb-calendar',
        template: "<div class=\"mdb-calendar\" [ngSwitch]=\"currentView\">\n  <mdb-calendar-month-view\n    *ngSwitchCase=\"view.month\"\n    [events]=\"events\"\n    [options]=\"calendarOptions\"\n    [weekDaysShort]=\"dayLabelsShort\"\n    [weekDayIndex]=\"weekDayIndex\"\n    [months]=\"months\"\n    (dayClicked)=\"onDayClick($event)\"\n    (eventClicked)=\"onEventClick($event)\"\n    (viewChanged)=\"onViewChange($event)\"\n    (monthChanged)=\"onMonthChange($event)\">\n  </mdb-calendar-month-view>\n\n  <mdb-calendar-week-view\n    *ngSwitchCase=\"view.week\"\n    [events]=\"events\"\n    [options]=\"calendarOptions\"\n    [weekDaysShort]=\"weekDaysShort\"\n    [weekDayIndex]=\"weekDayIndex\"\n    [monthsShort]=\"monthsShort\"\n    (dateClicked)=\"onDayClick($event)\"\n    (eventClicked)=\"onEventClick($event)\"\n    (viewChanged)=\"onViewChange($event)\"\n    (weekChanged)=\"onWeekChange($event)\">\n  </mdb-calendar-week-view>\n\n  <mdb-calendar-list-view\n    *ngSwitchCase=\"view.list\"\n    [events]=\"events\"\n    [options]=\"calendarOptions\"\n    [weekDayIndex]=\"weekDayIndex\"\n    [monthsShort]=\"monthsShort\"\n    (eventClicked)=\"onEventClick($event)\"\n    (viewChanged)=\"onViewChange($event)\"\n    (listChanged)=\"onListChange($event)\">\n  </mdb-calendar-list-view>\n</div>\n\n",
        styles: [""]
    }),
    __metadata("design:paramtypes", [MDBModalService])
], MdbCalendarComponent);
export { MdbCalendarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbWRiLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY2FsZW5kYXIvY2FsZW5kYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9FLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBUTlELElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0lBaUYvQixZQUFvQixZQUE2QjtRQUE3QixpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFoRmpELG9CQUFlLEdBQUc7WUFDaEIsUUFBUTtZQUNSLFFBQVE7WUFDUixTQUFTO1lBQ1QsV0FBVztZQUNYLFVBQVU7WUFDVixRQUFRO1lBQ1IsVUFBVTtTQUNYLENBQUM7UUFDRix5QkFBb0IsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pFLGtCQUFhLEdBQUc7WUFDZCxTQUFTO1lBQ1QsVUFBVTtZQUNWLE9BQU87WUFDUCxPQUFPO1lBQ1AsS0FBSztZQUNMLE1BQU07WUFDTixNQUFNO1lBQ04sUUFBUTtZQUNSLFdBQVc7WUFDWCxTQUFTO1lBQ1QsVUFBVTtZQUNWLFVB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QUFNLEVBQUU7OzBEQUF3QztBQUN2QztJQUFULE1BQU0sRUFBRTs7eURBQXVDO0FBQ3RDO0lBQVQsTUFBTSxFQUFFOzt5REFBdUM7QUF4RXJDLG9CQUFvQjtJQUxoQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsY0FBYztRQUN4Qix5eENBQXdDOztLQUV6QyxDQUFDO3FDQWtGa0MsZUFBZTtHQWpGdEMsb0JBQW9CLENBMExoQztTQTFMWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jYWxlbmRhci1ldmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTURCTW9kYWxTZXJ2aWNlLCBNREJNb2RhbFJlZiB9IGZyb20gJ2FuZ3VsYXItYm9vdHN0cmFwLW1kJztcbmltcG9ydCB7IEV2ZW50TW9kYWxDb21wb25lbnQgfSBmcm9tICcuLi9ldmVudC1tb2RhbC9ldmVudC1tb2RhbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJWaWV3IH0gZnJvbSAnLi4vLi4vdWlsdHMvY2FsZW5kYXItdmlldyc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgZm9ybWF0LCBnZXRZZWFyLCBnZXRNb250aCwgZ2V0RGF0ZSB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IE1kYkNhbGVuZGFyT3B0aW9ucyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvY2FsZW5kYXItb3B0aW9ucy5pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtZGItY2FsZW5kYXInLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jYWxlbmRhci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE1kYkNhbGVuZGFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgd2Vla0RheXNEZWZhdWx0ID0gW1xuICAgICdTdW5kYXknLFxuICAgICdNb25kYXknLFxuICAgICdUdWVzZGF5JyxcbiAgICAnV2VkbmVzZGF5JyxcbiAgICAnVGh1cnNkYXknLFxuICAgICdGcmlkYXknLFxuICAgICdTYXR1cmRheSdcbiAgXTtcbiAgd2Vla0RheXNTaG9ydERlZmF1bHQgPSBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddO1xuICBtb250aHNEZWZhdWx0ID0gW1xuICAgICdKYW51YXJ5JyxcbiAgICAnRmVicnVhcnknLFxuICAgICdNYXJjaCcsXG4gICAgJ0FwcmlsJyxcbiAgICAnTWF5JyxcbiAgICAnSnVuZScsXG4gICAgJ0p1bHknLFxuICAgICdBdWd1c3QnLFxuICAgICdTZXB0ZW1iZXInLFxuICAgICdPY3RvYmVyJyxcbiAgICAnTm92ZW1iZXInLFxuICAgICdEZWNlbWJlcidcbiAgXTtcbiAgbW9udGhzU2hvcnREZWZhdWx0ID0gW1xuICAgICdKYW4nLFxuICAgICdGZWInLFxuICAgICdNYXInLFxuICAgICdBcHInLFxuICAgICdNYXknLFxuICAgICdKdW4nLFxuICAgICdKdWwnLFxuICAgICdBdWcnLFxuICAgICdTZXAnLFxuICAgICdPY3QnLFxuICAgICdOb3YnLFxuICAgICdEZWMnXG4gIF07XG5cbiAgY2FsZW5kYXJPcHRpb25zOiBNZGJDYWxlbmRhck9wdGlvbnMgPSB7XG4gICAgZmlyc3REYXlPZldlZWs6ICdTdW5kYXknLFxuICAgIG1vbnRoVmlld0J0blR4dDogJ01vbnRoJyxcbiAgICB3ZWVrVmlld0J0blR4dDogJ1dlZWsnLFxuICAgIGxpc3RWaWV3QnRuVHh0OiAnTGlzdCcsXG4gICAgdG9kYXlCdG5UeHQ6ICdUb2RheScsXG4gICAgZXZlbnRBZGRUaXRsZTogJ0FkZCBuZXcgZXZlbnQnLFxuICAgIGV2ZW50RWRpdFRpdGxlOiAnRWRpdCBldmVudCcsXG4gICAgZXZlbnRDYW5jZWxCdG5UeHQ6ICdDYW5jZWwnLFxuICAgIGV2ZW50QWRkQnRuVHh0OiAnQWRkJyxcbiAgICBldmVudEVkaXRCdG5UeHQ6ICdFZGl0JyxcbiAgICBldmVudERlbGV0ZUJ0blR4dDogJ0RlbGV0ZSdcbiAgfTtcblxuICBkYXlMYWJlbHM6IHN0cmluZ1tdID0gW107XG4gIGRheUxhYmVsc1Nob3J0OiBzdHJpbmdbXSA9IFtdO1xuICB3ZWVrRGF5SW5kZXg6IG51bWJlcjtcblxuICBASW5wdXQoKSBldmVudHM6IENhbGVuZGFyRXZlbnRbXSA9IFtdO1xuICBASW5wdXQoKSBvcHRpb25zOiBNZGJDYWxlbmRhck9wdGlvbnM7XG4gIEBJbnB1dCgpIGVkaXRhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCkgd2Vla0RheXM6IHN0cmluZ1tdID0gdGhpcy53ZWVrRGF5c0RlZmF1bHQ7XG4gIEBJbnB1dCgpIHdlZWtEYXlzU2hvcnQ6IHN0cmluZ1tdID0gdGhpcy53ZWVrRGF5c1Nob3J0RGVmYXVsdDtcbiAgQElucHV0KCkgbW9udGhzOiBzdHJpbmdbXSA9IHRoaXMubW9udGhzRGVmYXVsdDtcbiAgQElucHV0KCkgbW9udGhzU2hvcnQ6IHN0cmluZ1tdID0gdGhpcy5tb250aHNTaG9ydERlZmF1bHQ7XG4gIEBJbnB1dCgpIGRlZmF1bHRWaWV3OiBDYWxlbmRhclZpZXc7XG4gIEBPdXRwdXQoKSBldmVudERlbGV0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENhbGVuZGFyRXZlbnQ+KCk7XG4gIEBPdXRwdXQoKSBldmVudEVkaXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJFdmVudD4oKTtcbiAgQE91dHB1dCgpIGV2ZW50QWRkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENhbGVuZGFyRXZlbnQ+KCk7XG5cbiAgQE91dHB1dCgpIG1vbnRoQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgd2Vla0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGxpc3RDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgbW9kYWxSZWY6IE1EQk1vZGFsUmVmO1xuICBNU19JTl9EQVkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuXG4gIHZpZXcgPSBDYWxlbmRhclZpZXc7XG5cbiAgY3VycmVudFZpZXc6IENhbGVuZGFyVmlldyA9IHRoaXMudmlldy5tb250aDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vZGFsU2VydmljZTogTURCTW9kYWxTZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY2FsZW5kYXJPcHRpb25zID0gdGhpcy5vcHRpb25zID8gT2JqZWN0LmFzc2lnbih0aGlzLmNhbGVuZGFyT3B0aW9ucywgdGhpcy5vcHRpb25zKSA6IHRoaXMuY2FsZW5kYXJPcHRpb25zO1xuICAgIHRoaXMuX2NoYW5nZURheXNPcmRlcigpO1xuICAgIGlmICh0aGlzLmRlZmF1bHRWaWV3KSB7IHRoaXMub25WaWV3Q2hhbmdlKHRoaXMuZGVmYXVsdFZpZXcpOyB9XG4gIH1cblxuICBwcml2YXRlIF9jaGFuZ2VEYXlzT3JkZXIoKSB7XG4gICAgY29uc3QgZGF5SW5kZXggPSB0aGlzLndlZWtEYXlJbmRleCA9IHRoaXMud2Vla0RheXNEZWZhdWx0LmluZGV4T2YodGhpcy5jYWxlbmRhck9wdGlvbnMuZmlyc3REYXlPZldlZWspO1xuXG4gICAgaWYgKGRheUluZGV4ICE9PSAtMSkge1xuICAgICAgbGV0IGluZGV4ID0gZGF5SW5kZXg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2Vla0RheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5kYXlMYWJlbHMucHVzaCh0aGlzLndlZWtEYXlzW2luZGV4XSk7XG4gICAgICAgIHRoaXMuZGF5TGFiZWxzU2hvcnQucHVzaCh0aGlzLndlZWtEYXlzU2hvcnRbaW5kZXhdKTtcbiAgICAgICAgaW5kZXggPSB0aGlzLndlZWtEYXlzRGVmYXVsdFtpbmRleF0gPT09ICdTYXR1cmRheScgPyAwIDogaW5kZXggKyAxO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgZ2V0Rm9ybWF0dGVkRXZlbnQoZXZlbnQ6IENhbGVuZGFyRXZlbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGV2ZW50LmlkLFxuICAgICAgbmFtZTogZXZlbnQubmFtZSxcbiAgICAgIHN0YXJ0RGF0ZTogZm9ybWF0KGV2ZW50LnN0YXJ0RGF0ZSwgJ1lZWVktTU0tREQsIEhIOm1tOnNzJyksXG4gICAgICBlbmREYXRlOiBmb3JtYXQoZXZlbnQuZW5kRGF0ZSwgJ1lZWVktTU0tREQsIEhIOm1tOnNzJyksXG4gICAgICBjb2xvcjogZXZlbnQuY29sb3JcbiAgICB9O1xuICB9XG5cbiAgZm9ybWF0RGF0ZShkYXRlOiBEYXRlKSB7XG4gICAgY29uc3QgeWVhciA9IGdldFllYXIoZGF0ZSk7XG4gICAgY29uc3QgbW9udGggPSBnZXRNb250aChkYXRlKTtcbiAgICBjb25zdCBkYXkgPSBnZXREYXRlKGRhdGUpO1xuICB9XG5cbiAgb25EYXlDbGljayhkYXk6IGFueSkge1xuICAgIGlmICh0aGlzLmVkaXRhYmxlKSB7XG4gICAgICB0aGlzLm9wZW5BZGRNb2RhbChkYXkpO1xuICAgIH1cbiAgfVxuXG4gIG9uRXZlbnRDbGljayhldmVudDogQ2FsZW5kYXJFdmVudCkge1xuICAgIHRoaXMub3BlbkVkaXRNb2RhbChldmVudCk7XG4gIH1cblxuICBvblZpZXdDaGFuZ2Uodmlldzogc3RyaW5nKSB7XG4gICAgdGhpcy5jdXJyZW50VmlldyA9IHRoaXMudmlld1t2aWV3XTtcbiAgfVxuXG4gIG9uTW9udGhDaGFuZ2UoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMubW9udGhDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgb25XZWVrQ2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLndlZWtDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgb25MaXN0Q2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLmxpc3RDaGFuZ2VkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgb3BlbkFkZE1vZGFsKGV2ZW50OiBDYWxlbmRhckV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLmNhbGVuZGFyT3B0aW9ucy5ldmVudEFkZFRpdGxlLFxuICAgICAgYWN0aW9uQnRuOiB0aGlzLmNhbGVuZGFyT3B0aW9ucy5ldmVudEFkZEJ0blR4dCxcbiAgICAgIGNhbmNlbEJ0bjogdGhpcy5jYWxlbmRhck9wdGlvbnMuZXZlbnRDYW5jZWxCdG5UeHQsXG4gICAgICBtb2RlOiAnYWRkJyxcbiAgICAgIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlLFxuICAgICAgZXZlbnQ6IHRoaXMuZ2V0Rm9ybWF0dGVkRXZlbnQoZXZlbnQpXG4gICAgfTtcbiAgICB0aGlzLm1vZGFsUmVmID0gdGhpcy5tb2RhbFNlcnZpY2Uuc2hvdyhFdmVudE1vZGFsQ29tcG9uZW50LCB7IGRhdGEgfSk7XG5cbiAgICB0aGlzLm1vZGFsUmVmLmNvbnRlbnQuZXZlbnREYXRhXG4gICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgLnN1YnNjcmliZSgobmV3RXZlbnQ6IENhbGVuZGFyRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5ldmVudEFkZGVkLmVtaXQobmV3RXZlbnQpO1xuICAgICAgfSk7XG4gIH1cblxuICBvcGVuRWRpdE1vZGFsKGV2ZW50OiBDYWxlbmRhckV2ZW50KSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLmNhbGVuZGFyT3B0aW9ucy5ldmVudEVkaXRUaXRsZSxcbiAgICAgIGFjdGlvbkJ0bjogdGhpcy5jYWxlbmRhck9wdGlvbnMuZXZlbnRFZGl0QnRuVHh0LFxuICAgICAgY2FuY2VsQnRuOiB0aGlzLmNhbGVuZGFyT3B0aW9ucy5ldmVudERlbGV0ZUJ0blR4dCxcbiAgICAgIG1vZGU6ICdlZGl0JyxcbiAgICAgIGVkaXRhYmxlOiB0aGlzLmVkaXRhYmxlLFxuICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgfTtcbiAgICB0aGlzLm1vZGFsUmVmID0gdGhpcy5tb2RhbFNlcnZpY2Uuc2hvdyhFdmVudE1vZGFsQ29tcG9uZW50LCB7IGRhdGEgfSk7XG5cbiAgICB0aGlzLm1vZGFsUmVmLmNvbnRlbnQuZXZlbnREYXRhXG4gICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgLnN1YnNjcmliZSgoZWRpdGVkRXZlbnQ6IENhbGVuZGFyRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5ldmVudEVkaXRlZC5lbWl0KGVkaXRlZEV2ZW50KTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5tb2RhbFJlZi5jb250ZW50LmV2ZW50RGVsZXRlZFxuICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgIC5zdWJzY3JpYmUoKGRlbGV0ZWRFdmVudDogQ2FsZW5kYXJFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmV2ZW50RGVsZXRlZC5lbWl0KGRlbGV0ZWRFdmVudCk7XG4gICAgICB9KTtcbiAgfVxufVxuIl19