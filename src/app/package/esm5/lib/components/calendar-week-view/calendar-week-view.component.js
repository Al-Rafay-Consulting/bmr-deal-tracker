import { __decorate, __metadata } from "tslib";
import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { startOfWeek, addDays, getDate, getDay, getMonth, getYear, startOfDay, addHours, addMinutes, subDays, endOfDay, isToday, isWeekend, format } from 'date-fns';
import { getWeekHourEvents, getWeekAllDayEvents } from '../../uilts/event-utils';
var MdbCalendarWeekViewComponent = /** @class */ (function () {
    function MdbCalendarWeekViewComponent(renderer) {
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
    Object.defineProperty(MdbCalendarWeekViewComponent.prototype, "events", {
        get: function () {
            return this._events;
        },
        set: function (events) {
            this._events = events;
            this.weekView = this.createWeekView(this.initDay);
        },
        enumerable: true,
        configurable: true
    });
    MdbCalendarWeekViewComponent.prototype.ngOnInit = function () {
        var initDay = this.initDay = startOfWeek(startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
        this.weekView = this.createWeekView(initDay);
    };
    MdbCalendarWeekViewComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.fullDayCells = this.fullDays
            .toArray()
            .map(function (el) { return el.nativeElement; });
        this.dayCells = this.days
            .toArray()
            .map(function (el) { return el.nativeElement; });
        var _loop_1 = function (i) {
            this_1.dayCells.forEach(function (row) {
                _this.columns.push(row.children[i]);
            });
        };
        var this_1 = this;
        for (var i = 1; i <= 7; i++) {
            _loop_1(i);
        }
    };
    MdbCalendarWeekViewComponent.prototype.trackByFn = function (index) {
        return index;
    };
    MdbCalendarWeekViewComponent.prototype.previous = function () {
        this.initDay = subDays(this.initDay, 7);
        this.weekView = this.createWeekView(this.initDay);
        this.weekChanged.emit({
            startDate: this.startDate,
            endDate: this.endDate
        });
    };
    MdbCalendarWeekViewComponent.prototype.next = function () {
        this.initDay = addDays(this.initDay, 7);
        this.weekView = this.createWeekView(this.initDay);
        this.weekChanged.emit({
            startDate: this.initDay,
            endDate: this.endDate
        });
    };
    MdbCalendarWeekViewComponent.prototype.goToToday = function () {
        this.initDay = startOfWeek(startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
        this.weekView = this.createWeekView(this.initDay);
        this.weekChanged.emit({
            startDate: this.startDate,
            endDate: this.endDate
        });
    };
    MdbCalendarWeekViewComponent.prototype.fullDayMouseDown = function (event, day) {
        if (this.dayEditing) {
            return;
        }
        this.fullDayEditing = true;
        this.dragStart = this.fullDayCells.indexOf(event.target);
        this.isDragging = true;
        this.fullDaySelectionStart = day.startDate;
    };
    MdbCalendarWeekViewComponent.prototype.fullDayMouseUp = function (event, day) {
        this.dragEnd = this.fullDayCells.indexOf(event.target);
        this.fullDaySelectionEnd = day.endDate;
        this.fullDayEditing = false;
        var calendarEvent = {
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
    };
    MdbCalendarWeekViewComponent.prototype.fullDaySelectRange = function () {
        var _this = this;
        this.fullDayClearSelection();
        if (this.dragEnd > this.dragStart) {
            if (this.dragEnd + 1 < this.dragStart) {
                this.fullDayCells
                    .slice(this.dragEnd, this.dragStart + 1)
                    .forEach(function (cell) {
                    return _this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)');
                });
            }
            else {
                this.fullDayCells
                    .slice(this.dragStart, this.dragEnd + 1)
                    .forEach(function (cell) {
                    return _this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)');
                });
            }
        }
    };
    MdbCalendarWeekViewComponent.prototype.fullDayClearSelection = function () {
        var _this = this;
        this.fullDayCells.forEach(function (cell) {
            return _this.renderer.removeStyle(cell, 'background-color');
        });
    };
    MdbCalendarWeekViewComponent.prototype.fullDayMouseMove = function (event) {
        event.preventDefault();
        if (this.dayEditing) {
            return;
        }
        if (this.isDragging) {
            this.dragEnd = this.fullDayCells.indexOf(event.target);
            this.fullDaySelectRange();
        }
    };
    MdbCalendarWeekViewComponent.prototype.onMouseDown = function (event, day) {
        if (this.fullDayEditing) {
            return;
        }
        this.dayEditing = true;
        this.dragStart = this.columns.indexOf(event.target);
        this.isDragging = true;
        this.selectionStartDate = day.startDate;
    };
    MdbCalendarWeekViewComponent.prototype.onMouseUp = function (event, day) {
        this.dragEnd = this.columns.indexOf(event.target);
        this.selectionEndDate = day.endDate;
        this.dayEditing = false;
        var calendarEvent = {
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
    };
    MdbCalendarWeekViewComponent.prototype.selectRange = function () {
        var _this = this;
        this.clearSelection();
        if (this.dragEnd > this.dragStart) {
            if (this.dragEnd + 1 < this.dragStart) {
                this.columns
                    .slice(this.dragEnd, this.dragStart + 1)
                    .forEach(function (cell) {
                    return _this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)');
                });
            }
            else {
                this.columns
                    .slice(this.dragStart, this.dragEnd + 1)
                    .forEach(function (cell) {
                    return _this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)');
                });
            }
        }
    };
    MdbCalendarWeekViewComponent.prototype.clearSelection = function () {
        var _this = this;
        this.columns.forEach(function (cell) {
            return _this.renderer.removeStyle(cell, 'background-color');
        });
    };
    MdbCalendarWeekViewComponent.prototype.onMouseMove = function (event) {
        event.preventDefault();
        if (this.fullDayEditing) {
            return;
        }
        if (this.isDragging) {
            this.dragEnd = this.columns.indexOf(event.target);
            this.selectRange();
        }
    };
    MdbCalendarWeekViewComponent.prototype.onEventClick = function (event) {
        var eventCopy = {
            id: event.id,
            name: event.name,
            startDate: format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
            endDate: format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
            color: event.color
        };
        this.eventClicked.emit(eventCopy);
    };
    MdbCalendarWeekViewComponent.prototype.onDateClick = function (date) {
        var newEvent = {
            name: 'New event',
            startDate: date.startDate,
            endDate: date.endDate,
            color: 'info'
        };
        this.dateClicked.emit(newEvent);
    };
    MdbCalendarWeekViewComponent.prototype.onViewChange = function (view) {
        this.viewChanged.emit(view);
    };
    MdbCalendarWeekViewComponent.prototype.createWeekView = function (initDate) {
        var firstDay = initDate;
        var lastDay = addDays(firstDay, 6);
        this.startDate = firstDay;
        this.endDate = lastDay;
        var period = {
            start: getDate(firstDay) + " " + this.monthsShort[getMonth(firstDay)] + ", " + getYear(firstDay),
            end: getDate(lastDay) + " " + this.monthsShort[getMonth(lastDay)] + ", " + getYear(lastDay)
        };
        var allDayRow = [];
        var weekRows = [];
        var row = [];
        var date;
        var month;
        var year;
        var day;
        var dayNumber;
        var startDate;
        var endDate;
        var dayStart;
        var dayEnd;
        for (var i = 0; i < 24; i++) {
            row = [];
            for (var j = 0; j < 7; j++) {
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
            weekRows.push({ row: row });
        }
        return { allDayRow: allDayRow, weekRows: weekRows, period: period };
    };
    MdbCalendarWeekViewComponent.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
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
    return MdbCalendarWeekViewComponent;
}());
export { MdbCalendarWeekViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL21kYi1jYWxlbmRhci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NhbGVuZGFyLXdlZWstdmlldy9jYWxlbmRhci13ZWVrLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsYUFBYSxFQUNkLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxXQUFXLEVBQ1gsT0FBTyxFQUNQLE9BQU8sRUFDUCxNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8sRUFDUCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFVBQVUsRUFDVixPQUFPLEVBQ1AsUUFBUSxFQUNSLE9BQU8sRUFDUCxTQUFTLEVBQ1QsTUFBTSxFQUNQLE1BQU0sVUFBVSxDQUFDO0FBRWxCLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsbUJBQW1CLEVBQ3BCLE1BQU0seUJBQXlCLENBQUM7QUFRakM7SUE4Q0Usc0NBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFqQzlCLGtCQUFhLEdBQWEsRUFBRSxDQUFDO1FBQzdCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQzNCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBR2hCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN0QyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdkMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3pDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQVFoRCxhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUM3QixpQkFBWSxHQUFrQixFQUFFLENBQUM7UUFDakMsWUFBTyxH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QjtRQUx4QyxTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsd0JBQXdCO1lBQ2xDLGs2SEFBa0Q7O1NBRW5ELENBQUM7eUNBK0M4QixTQUFTO09BOUM1Qiw0QkFBNEIsQ0E2VnhDO0lBQUQsbUNBQUM7Q0FBQSxBQTdWRCxJQTZWQztTQTdWWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBFbGVtZW50UmVmLFxuICBBZnRlclZpZXdJbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgc3RhcnRPZldlZWssXG4gIGFkZERheXMsXG4gIGdldERhdGUsXG4gIGdldERheSxcbiAgZ2V0TW9udGgsXG4gIGdldFllYXIsXG4gIHN0YXJ0T2ZEYXksXG4gIGFkZEhvdXJzLFxuICBhZGRNaW51dGVzLFxuICBzdWJEYXlzLFxuICBlbmRPZkRheSxcbiAgaXNUb2RheSxcbiAgaXNXZWVrZW5kLFxuICBmb3JtYXRcbn0gZnJvbSAnZGF0ZS1mbnMnO1xuaW1wb3J0IHsgQ2FsZW5kYXJFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvY2FsZW5kYXItZXZlbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7XG4gIGdldFdlZWtIb3VyRXZlbnRzLFxuICBnZXRXZWVrQWxsRGF5RXZlbnRzXG59IGZyb20gJy4uLy4uL3VpbHRzL2V2ZW50LXV0aWxzJztcbmltcG9ydCB7IE1kYkNhbGVuZGFyT3B0aW9ucyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvY2FsZW5kYXItb3B0aW9ucy5pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtZGItY2FsZW5kYXItd2Vlay12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NhbGVuZGFyLXdlZWstdmlldy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NhbGVuZGFyLXdlZWstdmlldy5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE1kYkNhbGVuZGFyV2Vla1ZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkcmVuKCdkYXlFbCcpIGRheXM6IFF1ZXJ5TGlzdDxhbnk+O1xuICBAVmlld0NoaWxkcmVuKCdmdWxsRGF5RWwnKSBmdWxsRGF5czogUXVlcnlMaXN0PGFueT47XG5cbiAgQElucHV0KClcbiAgZ2V0IGV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRzO1xuICB9XG4gIHNldCBldmVudHMoZXZlbnRzOiBDYWxlbmRhckV2ZW50W10pIHtcbiAgICB0aGlzLl9ldmVudHMgPSBldmVudHM7XG4gICAgdGhpcy53ZWVrVmlldyA9IHRoaXMuY3JlYXRlV2Vla1ZpZXcodGhpcy5pbml0RGF5KTtcbiAgfVxuICBwcml2YXRlIF9ldmVudHM6IENhbGVuZGFyRXZlbnRbXTtcbiAgQElucHV0KCkgd2Vla0RheXNTaG9ydDogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgbW9udGhzU2hvcnQ6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIHdlZWtEYXlJbmRleCA9IDA7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IE1kYkNhbGVuZGFyT3B0aW9ucztcblxuICBAT3V0cHV0KCkgZGF0ZUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGV2ZW50Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgdmlld0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgQE91dHB1dCgpIHdlZWtDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgc3RhcnREYXRlOiBEYXRlO1xuICBlbmREYXRlOiBEYXRlO1xuXG4gIHdlZWtWaWV3OiBhbnk7XG4gIGluaXREYXk6IERhdGU7XG5cbiAgZGF5Q2VsbHM6IEhUTUxFbGVtZW50W10gPSBbXTtcbiAgZnVsbERheUNlbGxzOiBIVE1MRWxlbWVudFtdID0gW107XG4gIGNvbHVtbnM6IEhUTUxFbGVtZW50W10gPSBbXTtcblxuICBmdWxsRGF5U2VsZWN0aW9uU3RhcnQ6IERhdGU7XG4gIGZ1bGxEYXlTZWxlY3Rpb25FbmQ6IERhdGU7XG5cbiAgZnVsbERheUVkaXRpbmc6IGJvb2xlYW47XG4gIGRheUVkaXRpbmc6IGJvb2xlYW47XG5cbiAgc2VsZWN0aW9uU3RhcnREYXRlOiBEYXRlO1xuICBzZWxlY3Rpb25FbmREYXRlOiBEYXRlO1xuXG4gIGRyYWdTdGFydDogYW55O1xuICBpc0RyYWdnaW5nOiBib29sZWFuO1xuICBkcmFnRW5kOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnN0IGluaXREYXkgPSB0aGlzLmluaXREYXkgPSBzdGFydE9mV2VlayhzdGFydE9mRGF5KG5ldyBEYXRlKCkpLCB7IHdlZWtTdGFydHNPbjogdGhpcy53ZWVrRGF5SW5kZXggfSk7XG4gICAgdGhpcy53ZWVrVmlldyA9IHRoaXMuY3JlYXRlV2Vla1ZpZXcoaW5pdERheSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5mdWxsRGF5Q2VsbHMgPSB0aGlzLmZ1bGxEYXlzXG4gICAgLnRvQXJyYXkoKVxuICAgIC5tYXAoKGVsOiBFbGVtZW50UmVmKSA9PiBlbC5uYXRpdmVFbGVtZW50KTtcblxuICAgIHRoaXMuZGF5Q2VsbHMgPSB0aGlzLmRheXNcbiAgICAudG9BcnJheSgpXG4gICAgLm1hcCgoZWw6IEVsZW1lbnRSZWYpID0+IGVsLm5hdGl2ZUVsZW1lbnQpO1xuXG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSA3OyBpKyspIHtcbiAgICAgIHRoaXMuZGF5Q2VsbHMuZm9yRWFjaCggKHJvdzogYW55KSA9PiB7XG4gICAgICAgIHRoaXMuY29sdW1ucy5wdXNoKHJvdy5jaGlsZHJlbltpXSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIHRyYWNrQnlGbihpbmRleCkge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHByZXZpb3VzKCkge1xuICAgIHRoaXMuaW5pdERheSA9IHN1YkRheXModGhpcy5pbml0RGF5LCA3KTtcbiAgICB0aGlzLndlZWtWaWV3ID0gdGhpcy5jcmVhdGVXZWVrVmlldyh0aGlzLmluaXREYXkpO1xuICAgIHRoaXMud2Vla0NoYW5nZWQuZW1pdCh7XG4gICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLFxuICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlXG4gICAgfSk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIHRoaXMuaW5pdERheSA9IGFkZERheXModGhpcy5pbml0RGF5LCA3KTtcbiAgICB0aGlzLndlZWtWaWV3ID0gdGhpcy5jcmVhdGVXZWVrVmlldyh0aGlzLmluaXREYXkpO1xuICAgIHRoaXMud2Vla0NoYW5nZWQuZW1pdCh7XG4gICAgICBzdGFydERhdGU6IHRoaXMuaW5pdERheSxcbiAgICAgIGVuZERhdGU6IHRoaXMuZW5kRGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgZ29Ub1RvZGF5KCkge1xuICAgIHRoaXMuaW5pdERheSA9IHN0YXJ0T2ZXZWVrKHN0YXJ0T2ZEYXkobmV3IERhdGUoKSksIHsgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtEYXlJbmRleCB9KTtcbiAgICB0aGlzLndlZWtWaWV3ID0gdGhpcy5jcmVhdGVXZWVrVmlldyh0aGlzLmluaXREYXkpO1xuICAgIHRoaXMud2Vla0NoYW5nZWQuZW1pdCh7XG4gICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLFxuICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlXG4gICAgfSk7XG4gIH1cblxuICBmdWxsRGF5TW91c2VEb3duKGV2ZW50OiBhbnksIGRheTogYW55KSB7XG4gICAgaWYgKHRoaXMuZGF5RWRpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZ1bGxEYXlFZGl0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLmRyYWdTdGFydCA9IHRoaXMuZnVsbERheUNlbGxzLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuZnVsbERheVNlbGVjdGlvblN0YXJ0ID0gZGF5LnN0YXJ0RGF0ZTtcbiAgfVxuXG4gIGZ1bGxEYXlNb3VzZVVwKGV2ZW50OiBhbnksIGRheTogYW55KSB7XG4gICAgdGhpcy5kcmFnRW5kID0gdGhpcy5mdWxsRGF5Q2VsbHMuaW5kZXhPZihldmVudC50YXJnZXQpO1xuICAgIHRoaXMuZnVsbERheVNlbGVjdGlvbkVuZCA9IGRheS5lbmREYXRlO1xuICAgIHRoaXMuZnVsbERheUVkaXRpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IGNhbGVuZGFyRXZlbnQgPSB7XG4gICAgICBuYW1lOiAnTmV3IGV2ZW50JyxcbiAgICAgIHN0YXJ0RGF0ZTogdGhpcy5mdWxsRGF5U2VsZWN0aW9uU3RhcnQsXG4gICAgICBlbmREYXRlOiB0aGlzLmZ1bGxEYXlTZWxlY3Rpb25FbmQsXG4gICAgICBjb2xvcjogJ2luZm8nXG4gICAgfTtcbiAgICBpZiAodGhpcy5kcmFnU3RhcnQgIT09IHRoaXMuZHJhZ0VuZCkge1xuICAgICAgdGhpcy5kYXRlQ2xpY2tlZC5lbWl0KGNhbGVuZGFyRXZlbnQpO1xuICAgIH1cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmRyYWdFbmQgIT09IDApIHtcbiAgICAgIHRoaXMuZnVsbERheVNlbGVjdFJhbmdlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5mdWxsRGF5Q2xlYXJTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIGZ1bGxEYXlTZWxlY3RSYW5nZSgpIHtcbiAgICB0aGlzLmZ1bGxEYXlDbGVhclNlbGVjdGlvbigpO1xuXG4gICAgaWYgKHRoaXMuZHJhZ0VuZCA+IHRoaXMuZHJhZ1N0YXJ0KSB7XG4gICAgICBpZiAodGhpcy5kcmFnRW5kICsgMSA8IHRoaXMuZHJhZ1N0YXJ0KSB7XG4gICAgICAgIHRoaXMuZnVsbERheUNlbGxzXG4gICAgICAgICAgLnNsaWNlKHRoaXMuZHJhZ0VuZCwgdGhpcy5kcmFnU3RhcnQgKyAxKVxuICAgICAgICAgIC5mb3JFYWNoKGNlbGwgPT5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY2VsbCwgJ2JhY2tncm91bmQtY29sb3InLCAncmdiYSg2OSw4MiwxMTAsLjMpJylcbiAgICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mdWxsRGF5Q2VsbHNcbiAgICAgICAgICAuc2xpY2UodGhpcy5kcmFnU3RhcnQsIHRoaXMuZHJhZ0VuZCArIDEpXG4gICAgICAgICAgLmZvckVhY2goY2VsbCA9PlxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDY5LDgyLDExMCwuMyknKVxuICAgICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVsbERheUNsZWFyU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuZnVsbERheUNlbGxzLmZvckVhY2goY2VsbCA9PlxuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bGxEYXlNb3VzZU1vdmUoZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMuZGF5RWRpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLmRyYWdFbmQgPSB0aGlzLmZ1bGxEYXlDZWxscy5pbmRleE9mKGV2ZW50LnRhcmdldCk7XG4gICAgICB0aGlzLmZ1bGxEYXlTZWxlY3RSYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGV2ZW50OiBhbnksIGRheTogYW55KSB7XG4gICAgaWYgKHRoaXMuZnVsbERheUVkaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmRheUVkaXRpbmcgPSB0cnVlO1xuICAgIHRoaXMuZHJhZ1N0YXJ0ID0gdGhpcy5jb2x1bW5zLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0aW9uU3RhcnREYXRlID0gZGF5LnN0YXJ0RGF0ZTtcbiAgfVxuXG4gIG9uTW91c2VVcChldmVudDogYW55LCBkYXk6IGFueSkge1xuICAgIHRoaXMuZHJhZ0VuZCA9IHRoaXMuY29sdW1ucy5pbmRleE9mKGV2ZW50LnRhcmdldCk7XG4gICAgdGhpcy5zZWxlY3Rpb25FbmREYXRlID0gZGF5LmVuZERhdGU7XG4gICAgdGhpcy5kYXlFZGl0aW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBjYWxlbmRhckV2ZW50ID0ge1xuICAgICAgbmFtZTogJ05ldyBldmVudCcsXG4gICAgICBzdGFydERhdGU6IG5ldyBEYXRlKHRoaXMuc2VsZWN0aW9uU3RhcnREYXRlKSxcbiAgICAgIGVuZERhdGU6IG5ldyBEYXRlKHRoaXMuc2VsZWN0aW9uRW5kRGF0ZSksXG4gICAgICBjb2xvcjogJ2luZm8nXG4gICAgfTtcbiAgICBpZiAodGhpcy5kcmFnU3RhcnQgIT09IHRoaXMuZHJhZ0VuZCkge1xuICAgICAgdGhpcy5kYXRlQ2xpY2tlZC5lbWl0KGNhbGVuZGFyRXZlbnQpO1xuICAgIH1cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmRyYWdFbmQgIT09IDApIHtcbiAgICAgIHRoaXMuc2VsZWN0UmFuZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gIH1cblxuICBzZWxlY3RSYW5nZSgpIHtcbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5kcmFnRW5kID4gdGhpcy5kcmFnU3RhcnQpIHtcbiAgICAgIGlmICh0aGlzLmRyYWdFbmQgKyAxIDwgdGhpcy5kcmFnU3RhcnQpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zXG4gICAgICAgICAgLnNsaWNlKHRoaXMuZHJhZ0VuZCwgdGhpcy5kcmFnU3RhcnQgKyAxKVxuICAgICAgICAgIC5mb3JFYWNoKGNlbGwgPT5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY2VsbCwgJ2JhY2tncm91bmQtY29sb3InLCAncmdiYSg2OSw4MiwxMTAsLjMpJylcbiAgICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb2x1bW5zXG4gICAgICAgICAgLnNsaWNlKHRoaXMuZHJhZ1N0YXJ0LCB0aGlzLmRyYWdFbmQgKyAxKVxuICAgICAgICAgIC5mb3JFYWNoKGNlbGwgPT5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY2VsbCwgJ2JhY2tncm91bmQtY29sb3InLCAncmdiYSg2OSw4MiwxMTAsLjMpJylcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKGNlbGwgPT5cbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUoY2VsbCwgJ2JhY2tncm91bmQtY29sb3InKVxuICAgICk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldmVudDogYW55KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLmZ1bGxEYXlFZGl0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIHRoaXMuZHJhZ0VuZCA9IHRoaXMuY29sdW1ucy5pbmRleE9mKGV2ZW50LnRhcmdldCk7XG4gICAgICB0aGlzLnNlbGVjdFJhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgb25FdmVudENsaWNrKGV2ZW50OiBDYWxlbmRhckV2ZW50KSB7XG4gICAgY29uc3QgZXZlbnRDb3B5ID0ge1xuICAgICAgaWQ6IGV2ZW50LmlkLFxuICAgICAgbmFtZTogZXZlbnQubmFtZSxcbiAgICAgIHN0YXJ0RGF0ZTogZm9ybWF0KGV2ZW50LnN0YXJ0RGF0ZSwgJ1lZWVktTU0tREQsIEhIOm1tOnNzJyksXG4gICAgICBlbmREYXRlOiBmb3JtYXQoZXZlbnQuZW5kRGF0ZSwgJ1lZWVktTU0tREQsIEhIOm1tOnNzJyksXG4gICAgICBjb2xvcjogZXZlbnQuY29sb3JcbiAgICB9O1xuICAgIHRoaXMuZXZlbnRDbGlja2VkLmVtaXQoZXZlbnRDb3B5KTtcbiAgfVxuXG4gIG9uRGF0ZUNsaWNrKGRhdGU6IGFueSkge1xuICAgIGNvbnN0IG5ld0V2ZW50ID0ge1xuICAgICAgbmFtZTogJ05ldyBldmVudCcsXG4gICAgICBzdGFydERhdGU6IGRhdGUuc3RhcnREYXRlLFxuICAgICAgZW5kRGF0ZTogZGF0ZS5lbmREYXRlLFxuICAgICAgY29sb3I6ICdpbmZvJ1xuICAgIH07XG4gICAgdGhpcy5kYXRlQ2xpY2tlZC5lbWl0KG5ld0V2ZW50KTtcbiAgfVxuXG4gIG9uVmlld0NoYW5nZSh2aWV3OiBzdHJpbmcpIHtcbiAgICB0aGlzLnZpZXdDaGFuZ2VkLmVtaXQodmlldyk7XG4gIH1cblxuICBjcmVhdGVXZWVrVmlldyhpbml0RGF0ZTogRGF0ZSkge1xuICAgIGNvbnN0IGZpcnN0RGF5ID0gaW5pdERhdGU7XG4gICAgY29uc3QgbGFzdERheSA9IGFkZERheXMoZmlyc3REYXksIDYpO1xuXG4gICAgdGhpcy5zdGFydERhdGUgPSBmaXJzdERheTtcbiAgICB0aGlzLmVuZERhdGUgPSBsYXN0RGF5O1xuXG4gICAgY29uc3QgcGVyaW9kID0ge1xuICAgICAgc3RhcnQ6IGAke2dldERhdGUoZmlyc3REYXkpfSAke1xuICAgICAgICB0aGlzLm1vbnRoc1Nob3J0W2dldE1vbnRoKGZpcnN0RGF5KV1cbiAgICAgIH0sICR7Z2V0WWVhcihmaXJzdERheSl9YCxcbiAgICAgIGVuZDogYCR7Z2V0RGF0ZShsYXN0RGF5KX0gJHtcbiAgICAgICAgdGhpcy5tb250aHNTaG9ydFtnZXRNb250aChsYXN0RGF5KV1cbiAgICAgIH0sICR7Z2V0WWVhcihsYXN0RGF5KX1gXG4gICAgfTtcblxuICAgIGNvbnN0IGFsbERheVJvdyA9IFtdO1xuICAgIGNvbnN0IHdlZWtSb3dzID0gW107XG4gICAgbGV0IHJvdyA9IFtdO1xuICAgIGxldCBkYXRlOiBEYXRlO1xuICAgIGxldCBtb250aDogbnVtYmVyO1xuICAgIGxldCB5ZWFyOiBudW1iZXI7XG4gICAgbGV0IGRheTogc3RyaW5nO1xuICAgIGxldCBkYXlOdW1iZXI6IG51bWJlcjtcbiAgICBsZXQgc3RhcnREYXRlOiBEYXRlO1xuICAgIGxldCBlbmREYXRlOiBEYXRlO1xuICAgIGxldCBkYXlTdGFydDogRGF0ZTtcbiAgICBsZXQgZGF5RW5kOiBEYXRlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XG4gICAgICByb3cgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA3OyBqKyspIHtcbiAgICAgICAgZGF0ZSA9IGFkZERheXMoZmlyc3REYXksIGopO1xuICAgICAgICBtb250aCA9IGdldE1vbnRoKGRhdGUpICsgMTtcbiAgICAgICAgeWVhciA9IGdldFllYXIoZGF0ZSk7XG4gICAgICAgIGRheSA9IHRoaXMud2Vla0RheXNTaG9ydFtnZXREYXkoZGF0ZSldO1xuICAgICAgICBkYXlOdW1iZXIgPSBnZXREYXRlKGRhdGUpO1xuICAgICAgICBzdGFydERhdGUgPSBhZGRIb3VycyhzdGFydE9mRGF5KGRhdGUpLCBpKTtcbiAgICAgICAgZW5kRGF0ZSA9IGFkZE1pbnV0ZXMoc3RhcnREYXRlLCA1OS45OSk7XG4gICAgICAgIGRheVN0YXJ0ID0gc3RhcnRPZkRheShkYXRlKTtcbiAgICAgICAgZGF5RW5kID0gZW5kT2ZEYXkoZGF0ZSk7XG5cbiAgICAgICAgcm93LnB1c2goe1xuICAgICAgICAgIHN0YXJ0RGF0ZTogc3RhcnREYXRlLFxuICAgICAgICAgIGVuZERhdGU6IGVuZERhdGUsXG4gICAgICAgICAgaXNUb2RheTogaXNUb2RheShkYXRlKSxcbiAgICAgICAgICBpc1dlZWtlbmQ6IGlzV2Vla2VuZChkYXRlKSxcbiAgICAgICAgICBldmVudHM6IGdldFdlZWtIb3VyRXZlbnRzKFxuICAgICAgICAgICAgdGhpcy5ldmVudHMsXG4gICAgICAgICAgICBzdGFydERhdGUsXG4gICAgICAgICAgICBlbmREYXRlLFxuICAgICAgICAgICAgZGF5U3RhcnQsXG4gICAgICAgICAgICBkYXlFbmRcbiAgICAgICAgICApXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpID09PSAxKSB7XG4gICAgICAgICAgYWxsRGF5Um93LnB1c2goe1xuICAgICAgICAgICAgc3RhcnREYXRlOiBkYXlTdGFydCxcbiAgICAgICAgICAgIGVuZERhdGU6IGRheUVuZCxcbiAgICAgICAgICAgIGlzVG9kYXk6IGlzVG9kYXkoZGF0ZSksXG4gICAgICAgICAgICBpc1dlZWtlbmQ6IGlzV2Vla2VuZChkYXRlKSxcbiAgICAgICAgICAgIGRheTogZGF5LFxuICAgICAgICAgICAgZGF5TnVtYmVyOiBkYXlOdW1iZXIsXG4gICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgICAgICBldmVudHM6IGdldFdlZWtBbGxEYXlFdmVudHMoXG4gICAgICAgICAgICAgIHRoaXMuZXZlbnRzLFxuICAgICAgICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgICAgICAgZGF5RW5kLFxuICAgICAgICAgICAgICBkYXlTdGFydCxcbiAgICAgICAgICAgICAgZGF5RW5kXG4gICAgICAgICAgICApXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdlZWtSb3dzLnB1c2goeyByb3cgfSk7XG4gICAgfVxuICAgIHJldHVybiB7IGFsbERheVJvdywgd2Vla1Jvd3MsIHBlcmlvZCB9O1xuICB9XG59XG4iXX0=