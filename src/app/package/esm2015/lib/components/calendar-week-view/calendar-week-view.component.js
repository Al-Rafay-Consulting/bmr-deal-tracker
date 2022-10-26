import { __decorate, __metadata } from "tslib";
import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { startOfWeek, addDays, getDate, getDay, getMonth, getYear, startOfDay, addHours, addMinutes, subDays, endOfDay, isToday, isWeekend, format } from 'date-fns';
import { getWeekHourEvents, getWeekAllDayEvents } from '../../uilts/event-utils';
let MdbCalendarWeekViewComponent = class MdbCalendarWeekViewComponent {
    constructor(renderer) {
        this.renderer = renderer;
        this.weekDaysShort = [];
        this.monthsShort = [];
        this.weekDayIndex = 0;
        this.dateClicked = new EventEmitter();
        this.eventClicked = new EventEmitter();
        this.viewChanged = new EventEmitter();
        this.weekChanged = new EventEmitter();
        this.dayCells = [];
        this.fullDayCells = [];
        this.columns = [];
    }
    get events() {
        return this._events;
    }
    set events(events) {
        this._events = events;
        this.weekView = this.createWeekView(this.initDay);
    }
    ngOnInit() {
        const initDay = this.initDay = startOfWeek(startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
        this.weekView = this.createWeekView(initDay);
    }
    ngAfterViewInit() {
        this.fullDayCells = this.fullDays
            .toArray()
            .map((el) => el.nativeElement);
        this.dayCells = this.days
            .toArray()
            .map((el) => el.nativeElement);
        for (let i = 1; i <= 7; i++) {
            this.dayCells.forEach((row) => {
                this.columns.push(row.children[i]);
            });
        }
    }
    trackByFn(index) {
        return index;
    }
    previous() {
        this.initDay = subDays(this.initDay, 7);
        this.weekView = this.createWeekView(this.initDay);
        this.weekChanged.emit({
            startDate: this.startDate,
            endDate: this.endDate
        });
    }
    next() {
        this.initDay = addDays(this.initDay, 7);
        this.weekView = this.createWeekView(this.initDay);
        this.weekChanged.emit({
            startDate: this.initDay,
            endDate: this.endDate
        });
    }
    goToToday() {
        this.initDay = startOfWeek(startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
        this.weekView = this.createWeekView(this.initDay);
        this.weekChanged.emit({
            startDate: this.startDate,
            endDate: this.endDate
        });
    }
    fullDayMouseDown(event, day) {
        if (this.dayEditing) {
            return;
        }
        this.fullDayEditing = true;
        this.dragStart = this.fullDayCells.indexOf(event.target);
        this.isDragging = true;
        this.fullDaySelectionStart = day.startDate;
    }
    fullDayMouseUp(event, day) {
        this.dragEnd = this.fullDayCells.indexOf(event.target);
        this.fullDaySelectionEnd = day.endDate;
        this.fullDayEditing = false;
        const calendarEvent = {
            name: 'New event',
            startDate: this.fullDaySelectionStart,
            endDate: this.fullDaySelectionEnd,
            color: 'info'
        };
        if (this.dragStart !== this.dragEnd) {
            this.dateClicked.emit(calendarEvent);
        }
        this.isDragging = false;
        if (this.dragEnd !== 0) {
            this.fullDaySelectRange();
        }
        this.fullDayClearSelection();
    }
    fullDaySelectRange() {
        this.fullDayClearSelection();
        if (this.dragEnd > this.dragStart) {
            if (this.dragEnd + 1 < this.dragStart) {
                this.fullDayCells
                    .slice(this.dragEnd, this.dragStart + 1)
                    .forEach(cell => this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)'));
            }
            else {
                this.fullDayCells
                    .slice(this.dragStart, this.dragEnd + 1)
                    .forEach(cell => this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)'));
            }
        }
    }
    fullDayClearSelection() {
        this.fullDayCells.forEach(cell => this.renderer.removeStyle(cell, 'background-color'));
    }
    fullDayMouseMove(event) {
        event.preventDefault();
        if (this.dayEditing) {
            return;
        }
        if (this.isDragging) {
            this.dragEnd = this.fullDayCells.indexOf(event.target);
            this.fullDaySelectRange();
        }
    }
    onMouseDown(event, day) {
        if (this.fullDayEditing) {
            return;
        }
        this.dayEditing = true;
        this.dragStart = this.columns.indexOf(event.target);
        this.isDragging = true;
        this.selectionStartDate = day.startDate;
    }
    onMouseUp(event, day) {
        this.dragEnd = this.columns.indexOf(event.target);
        this.selectionEndDate = day.endDate;
        this.dayEditing = false;
        const calendarEvent = {
            name: 'New event',
            startDate: new Date(this.selectionStartDate),
            endDate: new Date(this.selectionEndDate),
            color: 'info'
        };
        if (this.dragStart !== this.dragEnd) {
            this.dateClicked.emit(calendarEvent);
        }
        this.isDragging = false;
        if (this.dragEnd !== 0) {
            this.selectRange();
        }
        this.clearSelection();
    }
    selectRange() {
        this.clearSelection();
        if (this.dragEnd > this.dragStart) {
            if (this.dragEnd + 1 < this.dragStart) {
                this.columns
                    .slice(this.dragEnd, this.dragStart + 1)
                    .forEach(cell => this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)'));
            }
            else {
                this.columns
                    .slice(this.dragStart, this.dragEnd + 1)
                    .forEach(cell => this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)'));
            }
        }
    }
    clearSelection() {
        this.columns.forEach(cell => this.renderer.removeStyle(cell, 'background-color'));
    }
    onMouseMove(event) {
        event.preventDefault();
        if (this.fullDayEditing) {
            return;
        }
        if (this.isDragging) {
            this.dragEnd = this.columns.indexOf(event.target);
            this.selectRange();
        }
    }
    onEventClick(event) {
        const eventCopy = {
            id: event.id,
            name: event.name,
            startDate: format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
            endDate: format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
            color: event.color
        };
        this.eventClicked.emit(eventCopy);
    }
    onDateClick(date) {
        const newEvent = {
            name: 'New event',
            startDate: date.startDate,
            endDate: date.endDate,
            color: 'info'
        };
        this.dateClicked.emit(newEvent);
    }
    onViewChange(view) {
        this.viewChanged.emit(view);
    }
    createWeekView(initDate) {
        const firstDay = initDate;
        const lastDay = addDays(firstDay, 6);
        this.startDate = firstDay;
        this.endDate = lastDay;
        const period = {
            start: `${getDate(firstDay)} ${this.monthsShort[getMonth(firstDay)]}, ${getYear(firstDay)}`,
            end: `${getDate(lastDay)} ${this.monthsShort[getMonth(lastDay)]}, ${getYear(lastDay)}`
        };
        const allDayRow = [];
        const weekRows = [];
        let row = [];
        let date;
        let month;
        let year;
        let day;
        let dayNumber;
        let startDate;
        let endDate;
        let dayStart;
        let dayEnd;
        for (let i = 0; i < 24; i++) {
            row = [];
            for (let j = 0; j < 7; j++) {
                date = addDays(firstDay, j);
                month = getMonth(date) + 1;
                year = getYear(date);
                day = this.weekDaysShort[getDay(date)];
                dayNumber = getDate(date);
                startDate = addHours(startOfDay(date), i);
                endDate = addMinutes(startDate, 59.99);
                dayStart = startOfDay(date);
                dayEnd = endOfDay(date);
                row.push({
                    startDate: startDate,
                    endDate: endDate,
                    isToday: isToday(date),
                    isWeekend: isWeekend(date),
                    events: getWeekHourEvents(this.events, startDate, endDate, dayStart, dayEnd)
                });
                if (i === 1) {
                    allDayRow.push({
                        startDate: dayStart,
                        endDate: dayEnd,
                        isToday: isToday(date),
                        isWeekend: isWeekend(date),
                        day: day,
                        dayNumber: dayNumber,
                        month: month,
                        events: getWeekAllDayEvents(this.events, dayStart, dayEnd, dayStart, dayEnd)
                    });
                }
            }
            weekRows.push({ row });
        }
        return { allDayRow, weekRows, period };
    }
};
MdbCalendarWeekViewComponent.ctorParameters = () => [
    { type: Renderer2 }
];
__decorate([
    ViewChildren('dayEl'),
    __metadata("design:type", QueryList)
], MdbCalendarWeekViewComponent.prototype, "days", void 0);
__decorate([
    ViewChildren('fullDayEl'),
    __metadata("design:type", QueryList)
], MdbCalendarWeekViewComponent.prototype, "fullDays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], MdbCalendarWeekViewComponent.prototype, "events", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdbCalendarWeekViewComponent.prototype, "weekDaysShort", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdbCalendarWeekViewComponent.prototype, "monthsShort", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdbCalendarWeekViewComponent.prototype, "weekDayIndex", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdbCalendarWeekViewComponent.prototype, "options", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarWeekViewComponent.prototype, "dateClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarWeekViewComponent.prototype, "eventClicked", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarWeekViewComponent.prototype, "viewChanged", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdbCalendarWeekViewComponent.prototype, "weekChanged", void 0);
MdbCalendarWeekViewComponent = __decorate([
    Component({
        selector: 'mdb-calendar-week-view',
        template: "<div class=\"mdb-week-view\">\n  <div class=\"d-flex justify-content-between mb-3\">\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"previous()\">\n        <mdb-icon fas icon=\"chevron-left\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"next()\">\n        <mdb-icon fas icon=\"chevron-right\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"goToToday()\">{{ options.todayBtnTxt }}</button>\n    </div>\n    <h2>{{ weekView.period.start }} - {{ weekView.period.end }}</h2>\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('month')\">{{ options.monthViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('week')\">{{ options.weekViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('list')\">{{ options.listViewBtnTxt }}</button>\n    </div>\n  </div>\n\n  <table>\n    <thead>\n      <th></th>\n      <th\n        *ngFor=\"let day of weekView.allDayRow; trackBy: trackByFn\"\n        [ngClass]=\"{'light-blue lighten-5': day.isToday, 'rgba-mdb-color-slight': day.isWeekend && !day.isToday }\">\n        {{ day.day }} {{ day.month }}/{{ day.dayNumber }}\n      </th>\n    </thead>\n\n    <tbody>\n      <tr>\n        <th>All day</th>\n        <td\n          #fullDayEl\n          *ngFor=\"let day of weekView.allDayRow; trackBy: trackByFn\"\n          [ngClass]=\"{'mdb-today-cell': day.isToday, 'rgba-mdb-color-slight': day.isWeekend && !day.isToday }\"\n          (click)=\"onDateClick(day)\"\n          (mousedown)=\"fullDayMouseDown($event, day)\"\n          (mouseup)=\"fullDayMouseUp($event, day)\"\n          (mouseenter)=\"fullDayMouseMove($event)\">\n          <div\n            class=\"mdb-event mdb-event-long text-white small px-1 bg-{{ event.color }}\"\n            [ngClass]=\"{\n              'mdb-event-long': event.longEvent && !event.eventStart && !event.eventEnd,\n              'mdb-event-start': event.longEvent && event.eventStart,\n              'mdb-event-end': event.longEvent && event.eventEnd,\n              'mdb-event-single': !event.longEvent\n              }\"\n            mdbTooltip=\"{{ event.name }}\"\n            placement=\"top\"\n            *ngFor=\"let event of day.events\" (click)=\"onEventClick(event); $event.stopPropagation()\">\n            <span>{{ event.name }}</span>\n          </div>\n        </td>\n      </tr>\n      <tr #dayEl *ngFor=\"let row of weekView.weekRows; let index = index; trackBy: trackByFn\">\n        <th>{{ index }}:00</th>\n        <td\n          (mousedown)=\"onMouseDown($event, date)\"\n          (mouseup)=\"onMouseUp($event, date)\"\n          (mouseenter)=\"onMouseMove($event)\"\n          *ngFor=\"let date of row.row; trackBy: trackByFn\" (click)=\"onDateClick(date)\" [ngClass]=\"{'mdb-today-cell': date.isToday, 'rgba-mdb-color-slight': date.isWeekend && !date.isToday }\">\n          <div\n            class=\"mdb-event text-white small px-1 bg-{{ event.color }}\"\n            *ngFor=\"let event of date.events; trackBy: trackByFn\"\n            (click)=\"onEventClick(event); $event.stopPropagation()\"\n            mdbTooltip=\"{{ event.name }}\"\n            placement=\"top\"\n            [ngClass]=\"{\n              'mdb-vertical-event-long': event.longEvent && !event.eventStart && !event.eventEnd,\n              'mdb-vertical-event-start': event.longEvent && event.eventStart,\n              'mdb-vertical-event-end': event.longEvent && event.eventEnd,\n              'mdb-vertical-single-event': !event.longEvent\n              }\">\n            <span>{{ event.name }}</span>\n          </div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n\n</div>\n",
        styles: [".mdb-today-cell{background-color:#e1f5fe}.mdb-week-view{width:100%;height:100%;margin-bottom:50px}.mdb-week-view table{table-layout:fixed;width:100%}.mdb-week-view table th{text-align:center!important;height:30px;font-weight:700;border:1px solid #ddd;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdb-week-view table td{vertical-align:top;cursor:pointer;border:1px solid #ddd;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdb-vertical-single-event{margin:2px 1px;float:left;width:17px;height:84px}.mdb-vertical-event-start{margin:2px 1px -2px;float:left;width:17px;height:88px}.mdb-vertical-event-start span,.mdb-vertical-single-event span{display:block;transform:rotate(90deg);white-space:nowrap}.mdb-vertical-event-end{margin:-2px 1px 2px;float:left;width:17px;height:88px;text-indent:-9999px}.mdb-vertical-event-long{margin:-2px 1px;float:left;width:17px;height:92px;text-indent:-9999px}.mdb-event{cursor:pointer;font-weight:700;text-align:left!important}.mdb-event-start{margin:1px -2px 1px 2px}.mdb-event-end{margin:1px 2px 1px -2px;text-indent:-9999px}.mdb-event-long{margin:1px -2px;text-indent:-9999px}.mdb-event-single{margin:1px 2px}"]
    }),
    __metadata("design:paramtypes", [Renderer2])
], MdbCalendarWeekViewComponent);
export { MdbCalendarWeekViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL21kYi1jYWxlbmRhci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NhbGVuZGFyLXdlZWstdmlldy9jYWxlbmRhci13ZWVrLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsYUFBYSxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsT0FBTyxFQUNQLE9BQU8sRUFDUCxNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8sRUFDUCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFVBQVUsRUFDVixPQUFPLEVBQ1AsUUFBUSxFQUNSLE9BQU8sRUFDUCxTQUFTLEVBQ1QsTUFBTSxFQUNQLE1BQU0sVUFBVSxDQUFDO0FBRWxCLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ3BCLE1BQU0seUJBQXlCLENBQUM7QUFRakMsSUFBYSw0QkFBNEIsR0FBekMsTUFBYSw0QkFBNEI7SUE4Q3ZDLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFqQzlCLGtCQUFhLEdBQWEsRUFBRSxDQUFDO1FBQzdCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQzNCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBR2hCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN0QyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdkMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3pDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQVFoRCxhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUM3QixpQkFB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RSxTQUFTO3dCQUNwQixLQUFLLEVBQUUsS0FBSzt3QkFDWixNQUFNLEVBQUUsbUJBQW1CLENBQ3pCLElBQUksQ0FBQyxNQUFNLEVBQ1gsUUFBUSxFQUNSLE1BQU0sRUFDTixRQUFRLEVBQ1IsTUFBTSxDQUNQO3FCQUNGLENBQUMsQ0FBQztpQkFDSjthQUNGO1lBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDeEI7UUFDRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0NBQ0YsQ0FBQTs7WUEvUytCLFNBQVM7O0FBN0NoQjtJQUF0QixZQUFZLENBQUMsT0FBTyxDQUFDOzhCQUFPLFNBQVM7MERBQU07QUFDakI7SUFBMUIsWUFBWSxDQUFDLFdBQVcsQ0FBQzs4QkFBVyxTQUFTOzhEQUFNO0FBR3BEO0lBREMsS0FBSyxFQUFFOzs7MERBR1A7QUFNUTtJQUFSLEtBQUssRUFBRTs7bUVBQThCO0FBQzdCO0lBQVIsS0FBSyxFQUFFOztpRUFBNEI7QUFDM0I7SUFBUixLQUFLLEVBQUU7O2tFQUFrQjtBQUNqQjtJQUFSLEtBQUssRUFBRTs7NkRBQTZCO0FBRTNCO0lBQVQsTUFBTSxFQUFFOztpRUFBdUM7QUFDdEM7SUFBVCxNQUFNLEVBQUU7O2tFQUF3QztBQUN2QztJQUFULE1BQU0sRUFBRTs7aUVBQTBDO0FBQ3pDO0lBQVQsTUFBTSxFQUFFOztpRUFBdUM7QUFyQnJDLDRCQUE0QjtJQUx4QyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsd0JBQXdCO1FBQ2xDLGs2SEFBa0Q7O0tBRW5ELENBQUM7cUNBK0M4QixTQUFTO0dBOUM1Qiw0QkFBNEIsQ0E2VnhDO1NBN1ZZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEVsZW1lbnRSZWYsXG4gIEFmdGVyVmlld0luaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBzdGFydE9mV2VlayxcbiAgYWRkRGF5cyxcbiAgZ2V0RGF0ZSxcbiAgZ2V0RGF5LFxuICBnZXRNb250aCxcbiAgZ2V0WWVhcixcbiAgc3RhcnRPZkRheSxcbiAgYWRkSG91cnMsXG4gIGFkZE1pbnV0ZXMsXG4gIHN1YkRheXMsXG4gIGVuZE9mRGF5LFxuICBpc1RvZGF5LFxuICBpc1dlZWtlbmQsXG4gIGZvcm1hdFxufSBmcm9tICdkYXRlLWZucyc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jYWxlbmRhci1ldmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHtcbiAgZ2V0V2Vla0hvdXJFdmVudHMsXG4gIGdldFdlZWtBbGxEYXlFdmVudHNcbn0gZnJvbSAnLi4vLi4vdWlsdHMvZXZlbnQtdXRpbHMnO1xuaW1wb3J0IHsgTWRiQ2FsZW5kYXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jYWxlbmRhci1vcHRpb25zLmludGVyZmFjZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21kYi1jYWxlbmRhci13ZWVrLXZpZXcnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTWRiQ2FsZW5kYXJXZWVrVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGRyZW4oJ2RheUVsJykgZGF5czogUXVlcnlMaXN0PGFueT47XG4gIEBWaWV3Q2hpbGRyZW4oJ2Z1bGxEYXlFbCcpIGZ1bGxEYXlzOiBRdWVyeUxpc3Q8YW55PjtcblxuICBASW5wdXQoKVxuICBnZXQgZXZlbnRzKCkge1xuICAgIHJldHVybiB0aGlzLl9ldmVudHM7XG4gIH1cbiAgc2V0IGV2ZW50cyhldmVudHM6IENhbGVuZGFyRXZlbnRbXSkge1xuICAgIHRoaXMuX2V2ZW50cyA9IGV2ZW50cztcbiAgICB0aGlzLndlZWtWaWV3ID0gdGhpcy5jcmVhdGVXZWVrVmlldyh0aGlzLmluaXREYXkpO1xuICB9XG4gIHByaXZhdGUgX2V2ZW50czogQ2FsZW5kYXJFdmVudFtdO1xuICBASW5wdXQoKSB3ZWVrRGF5c1Nob3J0OiBzdHJpbmdbXSA9IFtdO1xuICBASW5wdXQoKSBtb250aHNTaG9ydDogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgd2Vla0RheUluZGV4ID0gMDtcbiAgQElucHV0KCkgb3B0aW9uczogTWRiQ2FsZW5kYXJPcHRpb25zO1xuXG4gIEBPdXRwdXQoKSBkYXRlQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSB2aWV3Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICBAT3V0cHV0KCkgd2Vla0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBzdGFydERhdGU6IERhdGU7XG4gIGVuZERhdGU6IERhdGU7XG5cbiAgd2Vla1ZpZXc6IGFueTtcbiAgaW5pdERheTogRGF0ZTtcblxuICBkYXlDZWxsczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuICBmdWxsRGF5Q2VsbHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgY29sdW1uczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuXG4gIGZ1bGxEYXlTZWxlY3Rpb25TdGFydDogRGF0ZTtcbiAgZnVsbERheVNlbGVjdGlvbkVuZDogRGF0ZTtcblxuICBmdWxsRGF5RWRpdGluZzogYm9vbGVhbjtcbiAgZGF5RWRpdGluZzogYm9vbGVhbjtcblxuICBzZWxlY3Rpb25TdGFydERhdGU6IERhdGU7XG4gIHNlbGVjdGlvbkVuZERhdGU6IERhdGU7XG5cbiAgZHJhZ1N0YXJ0OiBhbnk7XG4gIGlzRHJhZ2dpbmc6IGJvb2xlYW47XG4gIGRyYWdFbmQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc3QgaW5pdERheSA9IHRoaXMuaW5pdERheSA9IHN0YXJ0T2ZXZWVrKHN0YXJ0T2ZEYXkobmV3IERhdGUoKSksIHsgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtEYXlJbmRleCB9KTtcbiAgICB0aGlzLndlZWtWaWV3ID0gdGhpcy5jcmVhdGVXZWVrVmlldyhpbml0RGF5KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmZ1bGxEYXlDZWxscyA9IHRoaXMuZnVsbERheXNcbiAgICAudG9BcnJheSgpXG4gICAgLm1hcCgoZWw6IEVsZW1lbnRSZWYpID0+IGVsLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgdGhpcy5kYXlDZWxscyA9IHRoaXMuZGF5c1xuICAgIC50b0FycmF5KClcbiAgICAubWFwKChlbDogRWxlbWVudFJlZikgPT4gZWwubmF0aXZlRWxlbWVudCk7XG5cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDc7IGkrKykge1xuICAgICAgdGhpcy5kYXlDZWxscy5mb3JFYWNoKCAocm93OiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5jb2x1bW5zLnB1c2gocm93LmNoaWxkcmVuW2ldKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICB9XG5cbiAgdHJhY2tCeUZuKGluZGV4KSB7XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgcHJldmlvdXMoKSB7XG4gICAgdGhpcy5pbml0RGF5ID0gc3ViRGF5cyh0aGlzLmluaXREYXksIDcpO1xuICAgIHRoaXMud2Vla1ZpZXcgPSB0aGlzLmNyZWF0ZVdlZWtWaWV3KHRoaXMuaW5pdERheSk7XG4gICAgdGhpcy53ZWVrQ2hhbmdlZC5lbWl0KHtcbiAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsXG4gICAgICBlbmREYXRlOiB0aGlzLmVuZERhdGVcbiAgICB9KTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5pbml0RGF5ID0gYWRkRGF5cyh0aGlzLmluaXREYXksIDcpO1xuICAgIHRoaXMud2Vla1ZpZXcgPSB0aGlzLmNyZWF0ZVdlZWtWaWV3KHRoaXMuaW5pdERheSk7XG4gICAgdGhpcy53ZWVrQ2hhbmdlZC5lbWl0KHtcbiAgICAgIHN0YXJ0RGF0ZTogdGhpcy5pbml0RGF5LFxuICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlXG4gICAgfSk7XG4gIH1cblxuICBnb1RvVG9kYXkoKSB7XG4gICAgdGhpcy5pbml0RGF5ID0gc3RhcnRPZldlZWsoc3RhcnRPZkRheShuZXcgRGF0ZSgpKSwgeyB3ZWVrU3RhcnRzT246IHRoaXMud2Vla0RheUluZGV4IH0pO1xuICAgIHRoaXMud2Vla1ZpZXcgPSB0aGlzLmNyZWF0ZVdlZWtWaWV3KHRoaXMuaW5pdERheSk7XG4gICAgdGhpcy53ZWVrQ2hhbmdlZC5lbWl0KHtcbiAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsXG4gICAgICBlbmREYXRlOiB0aGlzLmVuZERhdGVcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bGxEYXlNb3VzZURvd24oZXZlbnQ6IGFueSwgZGF5OiBhbnkpIHtcbiAgICBpZiAodGhpcy5kYXlFZGl0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZnVsbERheUVkaXRpbmcgPSB0cnVlO1xuICAgIHRoaXMuZHJhZ1N0YXJ0ID0gdGhpcy5mdWxsRGF5Q2VsbHMuaW5kZXhPZihldmVudC50YXJnZXQpO1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5mdWxsRGF5U2VsZWN0aW9uU3RhcnQgPSBkYXkuc3RhcnREYXRlO1xuICB9XG5cbiAgZnVsbERheU1vdXNlVXAoZXZlbnQ6IGFueSwgZGF5OiBhbnkpIHtcbiAgICB0aGlzLmRyYWdFbmQgPSB0aGlzLmZ1bGxEYXlDZWxscy5pbmRleE9mKGV2ZW50LnRhcmdldCk7XG4gICAgdGhpcy5mdWxsRGF5U2VsZWN0aW9uRW5kID0gZGF5LmVuZERhdGU7XG4gICAgdGhpcy5mdWxsRGF5RWRpdGluZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgY2FsZW5kYXJFdmVudCA9IHtcbiAgICAgIG5hbWU6ICdOZXcgZXZlbnQnLFxuICAgICAgc3RhcnREYXRlOiB0aGlzLmZ1bGxEYXlTZWxlY3Rpb25TdGFydCxcbiAgICAgIGVuZERhdGU6IHRoaXMuZnVsbERheVNlbGVjdGlvbkVuZCxcbiAgICAgIGNvbG9yOiAnaW5mbydcbiAgICB9O1xuICAgIGlmICh0aGlzLmRyYWdTdGFydCAhPT0gdGhpcy5kcmFnRW5kKSB7XG4gICAgICB0aGlzLmRhdGVDbGlja2VkLmVtaXQoY2FsZW5kYXJFdmVudCk7XG4gICAgfVxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZHJhZ0VuZCAhPT0gMCkge1xuICAgICAgdGhpcy5mdWxsRGF5U2VsZWN0UmFuZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmZ1bGxEYXlDbGVhclNlbGVjdGlvbigpO1xuICB9XG5cbiAgZnVsbERheVNlbGVjdFJhbmdlKCkge1xuICAgIHRoaXMuZnVsbERheUNsZWFyU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5kcmFnRW5kID4gdGhpcy5kcmFnU3RhcnQpIHtcbiAgICAgIGlmICh0aGlzLmRyYWdFbmQgKyAxIDwgdGhpcy5kcmFnU3RhcnQpIHtcbiAgICAgICAgdGhpcy5mdWxsRGF5Q2VsbHNcbiAgICAgICAgICAuc2xpY2UodGhpcy5kcmFnRW5kLCB0aGlzLmRyYWdTdGFydCArIDEpXG4gICAgICAgICAgLmZvckVhY2goY2VsbCA9PlxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDY5LDgyLDExMCwuMyknKVxuICAgICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZ1bGxEYXlDZWxsc1xuICAgICAgICAgIC5zbGljZSh0aGlzLmRyYWdTdGFydCwgdGhpcy5kcmFnRW5kICsgMSlcbiAgICAgICAgICAuZm9yRWFjaChjZWxsID0+XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNlbGwsICdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JnYmEoNjksODIsMTEwLC4zKScpXG4gICAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdWxsRGF5Q2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5mdWxsRGF5Q2VsbHMuZm9yRWFjaChjZWxsID0+XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZVN0eWxlKGNlbGwsICdiYWNrZ3JvdW5kLWNvbG9yJylcbiAgICApO1xuICB9XG5cbiAgZnVsbERheU1vdXNlTW92ZShldmVudDogYW55KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5kYXlFZGl0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIHRoaXMuZHJhZ0VuZCA9IHRoaXMuZnVsbERheUNlbGxzLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICAgIHRoaXMuZnVsbERheVNlbGVjdFJhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZURvd24oZXZlbnQ6IGFueSwgZGF5OiBhbnkpIHtcbiAgICBpZiAodGhpcy5mdWxsRGF5RWRpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGF5RWRpdGluZyA9IHRydWU7XG4gICAgdGhpcy5kcmFnU3RhcnQgPSB0aGlzLmNvbHVtbnMuaW5kZXhPZihldmVudC50YXJnZXQpO1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgdGhpcy5zZWxlY3Rpb25TdGFydERhdGUgPSBkYXkuc3RhcnREYXRlO1xuICB9XG5cbiAgb25Nb3VzZVVwKGV2ZW50OiBhbnksIGRheTogYW55KSB7XG4gICAgdGhpcy5kcmFnRW5kID0gdGhpcy5jb2x1bW5zLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICB0aGlzLnNlbGVjdGlvbkVuZERhdGUgPSBkYXkuZW5kRGF0ZTtcbiAgICB0aGlzLmRheUVkaXRpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IGNhbGVuZGFyRXZlbnQgPSB7XG4gICAgICBuYW1lOiAnTmV3IGV2ZW50JyxcbiAgICAgIHN0YXJ0RGF0ZTogbmV3IERhdGUodGhpcy5zZWxlY3Rpb25TdGFydERhdGUpLFxuICAgICAgZW5kRGF0ZTogbmV3IERhdGUodGhpcy5zZWxlY3Rpb25FbmREYXRlKSxcbiAgICAgIGNvbG9yOiAnaW5mbydcbiAgICB9O1xuICAgIGlmICh0aGlzLmRyYWdTdGFydCAhPT0gdGhpcy5kcmFnRW5kKSB7XG4gICAgICB0aGlzLmRhdGVDbGlja2VkLmVtaXQoY2FsZW5kYXJFdmVudCk7XG4gICAgfVxuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZHJhZ0VuZCAhPT0gMCkge1xuICAgICAgdGhpcy5zZWxlY3RSYW5nZSgpO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIHNlbGVjdFJhbmdlKCkge1xuICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcblxuICAgIGlmICh0aGlzLmRyYWdFbmQgPiB0aGlzLmRyYWdTdGFydCkge1xuICAgICAgaWYgKHRoaXMuZHJhZ0VuZCArIDEgPCB0aGlzLmRyYWdTdGFydCkge1xuICAgICAgICB0aGlzLmNvbHVtbnNcbiAgICAgICAgICAuc2xpY2UodGhpcy5kcmFnRW5kLCB0aGlzLmRyYWdTdGFydCArIDEpXG4gICAgICAgICAgLmZvckVhY2goY2VsbCA9PlxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDY5LDgyLDExMCwuMyknKVxuICAgICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbHVtbnNcbiAgICAgICAgICAuc2xpY2UodGhpcy5kcmFnU3RhcnQsIHRoaXMuZHJhZ0VuZCArIDEpXG4gICAgICAgICAgLmZvckVhY2goY2VsbCA9PlxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDY5LDgyLDExMCwuMyknKVxuICAgICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5jb2x1bW5zLmZvckVhY2goY2VsbCA9PlxuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicpXG4gICAgKTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKHRoaXMuZnVsbERheUVkaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgdGhpcy5kcmFnRW5kID0gdGhpcy5jb2x1bW5zLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICAgIHRoaXMuc2VsZWN0UmFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBvbkV2ZW50Q2xpY2soZXZlbnQ6IENhbGVuZGFyRXZlbnQpIHtcbiAgICBjb25zdCBldmVudENvcHkgPSB7XG4gICAgICBpZDogZXZlbnQuaWQsXG4gICAgICBuYW1lOiBldmVudC5uYW1lLFxuICAgICAgc3RhcnREYXRlOiBmb3JtYXQoZXZlbnQuc3RhcnREYXRlLCAnWVlZWS1NTS1ERCwgSEg6bW06c3MnKSxcbiAgICAgIGVuZERhdGU6IGZvcm1hdChldmVudC5lbmREYXRlLCAnWVlZWS1NTS1ERCwgSEg6bW06c3MnKSxcbiAgICAgIGNvbG9yOiBldmVudC5jb2xvclxuICAgIH07XG4gICAgdGhpcy5ldmVudENsaWNrZWQuZW1pdChldmVudENvcHkpO1xuICB9XG5cbiAgb25EYXRlQ2xpY2soZGF0ZTogYW55KSB7XG4gICAgY29uc3QgbmV3RXZlbnQgPSB7XG4gICAgICBuYW1lOiAnTmV3IGV2ZW50JyxcbiAgICAgIHN0YXJ0RGF0ZTogZGF0ZS5zdGFydERhdGUsXG4gICAgICBlbmREYXRlOiBkYXRlLmVuZERhdGUsXG4gICAgICBjb2xvcjogJ2luZm8nXG4gICAgfTtcbiAgICB0aGlzLmRhdGVDbGlja2VkLmVtaXQobmV3RXZlbnQpO1xuICB9XG5cbiAgb25WaWV3Q2hhbmdlKHZpZXc6IHN0cmluZykge1xuICAgIHRoaXMudmlld0NoYW5nZWQuZW1pdCh2aWV3KTtcbiAgfVxuXG4gIGNyZWF0ZVdlZWtWaWV3KGluaXREYXRlOiBEYXRlKSB7XG4gICAgY29uc3QgZmlyc3REYXkgPSBpbml0RGF0ZTtcbiAgICBjb25zdCBsYXN0RGF5ID0gYWRkRGF5cyhmaXJzdERheSwgNik7XG5cbiAgICB0aGlzLnN0YXJ0RGF0ZSA9IGZpcnN0RGF5O1xuICAgIHRoaXMuZW5kRGF0ZSA9IGxhc3REYXk7XG5cbiAgICBjb25zdCBwZXJpb2QgPSB7XG4gICAgICBzdGFydDogYCR7Z2V0RGF0ZShmaXJzdERheSl9ICR7XG4gICAgICAgIHRoaXMubW9udGhzU2hvcnRbZ2V0TW9udGgoZmlyc3REYXkpXVxuICAgICAgfSwgJHtnZXRZZWFyKGZpcnN0RGF5KX1gLFxuICAgICAgZW5kOiBgJHtnZXREYXRlKGxhc3REYXkpfSAke1xuICAgICAgICB0aGlzLm1vbnRoc1Nob3J0W2dldE1vbnRoKGxhc3REYXkpXVxuICAgICAgfSwgJHtnZXRZZWFyKGxhc3REYXkpfWBcbiAgICB9O1xuXG4gICAgY29uc3QgYWxsRGF5Um93ID0gW107XG4gICAgY29uc3Qgd2Vla1Jvd3MgPSBbXTtcbiAgICBsZXQgcm93ID0gW107XG4gICAgbGV0IGRhdGU6IERhdGU7XG4gICAgbGV0IG1vbnRoOiBudW1iZXI7XG4gICAgbGV0IHllYXI6IG51bWJlcjtcbiAgICBsZXQgZGF5OiBzdHJpbmc7XG4gICAgbGV0IGRheU51bWJlcjogbnVtYmVyO1xuICAgIGxldCBzdGFydERhdGU6IERhdGU7XG4gICAgbGV0IGVuZERhdGU6IERhdGU7XG4gICAgbGV0IGRheVN0YXJ0OiBEYXRlO1xuICAgIGxldCBkYXlFbmQ6IERhdGU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI0OyBpKyspIHtcbiAgICAgIHJvdyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDc7IGorKykge1xuICAgICAgICBkYXRlID0gYWRkRGF5cyhmaXJzdERheSwgaik7XG4gICAgICAgIG1vbnRoID0gZ2V0TW9udGgoZGF0ZSkgKyAxO1xuICAgICAgICB5ZWFyID0gZ2V0WWVhcihkYXRlKTtcbiAgICAgICAgZGF5ID0gdGhpcy53ZWVrRGF5c1Nob3J0W2dldERheShkYXRlKV07XG4gICAgICAgIGRheU51bWJlciA9IGdldERhdGUoZGF0ZSk7XG4gICAgICAgIHN0YXJ0RGF0ZSA9IGFkZEhvdXJzKHN0YXJ0T2ZEYXkoZGF0ZSksIGkpO1xuICAgICAgICBlbmREYXRlID0gYWRkTWludXRlcyhzdGFydERhdGUsIDU5Ljk5KTtcbiAgICAgICAgZGF5U3RhcnQgPSBzdGFydE9mRGF5KGRhdGUpO1xuICAgICAgICBkYXlFbmQgPSBlbmRPZkRheShkYXRlKTtcblxuICAgICAgICByb3cucHVzaCh7XG4gICAgICAgICAgc3RhcnREYXRlOiBzdGFydERhdGUsXG4gICAgICAgICAgZW5kRGF0ZTogZW5kRGF0ZSxcbiAgICAgICAgICBpc1RvZGF5OiBpc1RvZGF5KGRhdGUpLFxuICAgICAgICAgIGlzV2Vla2VuZDogaXNXZWVrZW5kKGRhdGUpLFxuICAgICAgICAgIGV2ZW50czogZ2V0V2Vla0hvdXJFdmVudHMoXG4gICAgICAgICAgICB0aGlzLmV2ZW50cyxcbiAgICAgICAgICAgIHN0YXJ0RGF0ZSxcbiAgICAgICAgICAgIGVuZERhdGUsXG4gICAgICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgICAgIGRheUVuZFxuICAgICAgICAgIClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICBhbGxEYXlSb3cucHVzaCh7XG4gICAgICAgICAgICBzdGFydERhdGU6IGRheVN0YXJ0LFxuICAgICAgICAgICAgZW5kRGF0ZTogZGF5RW5kLFxuICAgICAgICAgICAgaXNUb2RheTogaXNUb2RheShkYXRlKSxcbiAgICAgICAgICAgIGlzV2Vla2VuZDogaXNXZWVrZW5kKGRhdGUpLFxuICAgICAgICAgICAgZGF5OiBkYXksXG4gICAgICAgICAgICBkYXlOdW1iZXI6IGRheU51bWJlcixcbiAgICAgICAgICAgIG1vbnRoOiBtb250aCxcbiAgICAgICAgICAgIGV2ZW50czogZ2V0V2Vla0FsbERheUV2ZW50cyhcbiAgICAgICAgICAgICAgdGhpcy5ldmVudHMsXG4gICAgICAgICAgICAgIGRheVN0YXJ0LFxuICAgICAgICAgICAgICBkYXlFbmQsXG4gICAgICAgICAgICAgIGRheVN0YXJ0LFxuICAgICAgICAgICAgICBkYXlFbmRcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd2Vla1Jvd3MucHVzaCh7IHJvdyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgYWxsRGF5Um93LCB3ZWVrUm93cywgcGVyaW9kIH07XG4gIH1cbn1cbiJdfQ==