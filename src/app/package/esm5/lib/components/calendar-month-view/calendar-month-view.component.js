import { __decorate, __metadata } from "tslib";
import { Component, OnInit, Input, EventEmitter, Output, Renderer2, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { getDaysInMonth, startOfDay, endOfDay, isToday, isWeekend, format, startOfWeek, getDate } from 'date-fns';
import { getMonthDayEvents } from '../../uilts/event-utils';
var MdbCalendarMonthViewComponent = /** @class */ (function () {
    function MdbCalendarMonthViewComponent(renderer) {
        this.renderer = renderer;
        this.weekDayIndex = 0;
        this.dayClicked = new EventEmitter();
        this.eventClicked = new EventEmitter();
        this.viewChanged = new EventEmitter();
        this.monthChanged = new EventEmitter();
        this.allCells = [];
        this.dates = [];
    }
    Object.defineProperty(MdbCalendarMonthViewComponent.prototype, "events", {
        get: function () {
            return this._events;
        },
        set: function (events) {
            this._events = events;
            this.dates.forEach(function (week) {
                week.week.forEach(function (day) {
                    day.events = getMonthDayEvents(events, day.startOfDay, day.endOfDay);
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    MdbCalendarMonthViewComponent.prototype.ngOnInit = function () {
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth();
        this.createMonthView(currentYear, currentMonth);
    };
    MdbCalendarMonthViewComponent.prototype.ngAfterViewInit = function () {
        this.allCells = this.days
            .toArray()
            .map(function (el) { return el.nativeElement; });
    };
    MdbCalendarMonthViewComponent.prototype.trackByFn = function (index) {
        return index;
    };
    MdbCalendarMonthViewComponent.prototype.trackByEvent = function (index, item) {
        return item.id;
    };
    MdbCalendarMonthViewComponent.prototype.trackByDay = function (index, item) {
        return item.dayNumber;
    };
    MdbCalendarMonthViewComponent.prototype.onMouseDown = function (event, day) {
        this.dragStart = this.allCells.indexOf(event.target);
        this.isDragging = true;
        this.selectionStartDate = day.startOfDay;
    };
    MdbCalendarMonthViewComponent.prototype.onMouseUp = function (event, day) {
        this.dragEnd = this.allCells.indexOf(event.target);
        this.selectionEndDate = day.endOfDay;
        var calendarEvent = {
            name: 'New event',
            startDate: this.selectionStartDate,
            endDate: this.selectionEndDate,
            color: 'info'
        };
        if (this.dragStart !== this.dragEnd) {
            this.dayClicked.emit(calendarEvent);
        }
        this.isDragging = false;
        if (this.dragEnd !== 0) {
            this.selectRange();
        }
        this.clearSelection();
    };
    MdbCalendarMonthViewComponent.prototype.selectRange = function () {
        var _this = this;
        this.clearSelection();
        if (this.dragEnd > this.dragStart) {
            if (this.dragEnd + 1 < this.dragStart) {
                this.allCells
                    .slice(this.dragEnd, this.dragStart + 1)
                    .forEach(function (cell) {
                    return _this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)');
                });
            }
            else {
                this.allCells
                    .slice(this.dragStart, this.dragEnd + 1)
                    .forEach(function (cell) {
                    return _this.renderer.setStyle(cell, 'background-color', 'rgba(69,82,110,.3)');
                });
            }
        }
    };
    MdbCalendarMonthViewComponent.prototype.clearSelection = function () {
        var _this = this;
        this.allCells.forEach(function (cell) {
            return _this.renderer.removeStyle(cell, 'background-color');
        });
    };
    MdbCalendarMonthViewComponent.prototype.onMouseMove = function (event) {
        event.preventDefault();
        if (this.isDragging) {
            this.dragEnd = this.allCells.indexOf(event.target);
            this.selectRange();
        }
    };
    MdbCalendarMonthViewComponent.prototype.onDayClick = function (day) {
        var newEvent = {
            name: 'New event',
            startDate: day.startOfDay,
            endDate: day.endOfDay,
            color: 'info'
        };
        this.dayClicked.emit(newEvent);
    };
    MdbCalendarMonthViewComponent.prototype.onEventClick = function (event) {
        var eventCopy = {
            id: event.id,
            name: event.name,
            startDate: format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
            endDate: format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
            color: event.color
        };
        this.eventClicked.emit(eventCopy);
    };
    MdbCalendarMonthViewComponent.prototype.onViewChange = function (view) {
        this.viewChanged.emit(view);
    };
    MdbCalendarMonthViewComponent.prototype.next = function () {
        if (this.selectedMonth === 11) {
            this.createMonthView(this.selectedYear + 1, 0);
        }
        else {
            this.createMonthView(this.selectedYear, this.selectedMonth + 1);
        }
        this.monthChanged.emit({
            index: this.selectedMonth,
            month: this.months[this.selectedMonth],
            year: this.selectedYear
        });
    };
    MdbCalendarMonthViewComponent.prototype.previous = function () {
        if (this.selectedMonth === 0) {
            this.createMonthView(this.selectedYear - 1, 11);
        }
        else {
            this.createMonthView(this.selectedYear, this.selectedMonth - 1);
        }
        this.monthChanged.emit({
            index: this.selectedMonth,
            month: this.months[this.selectedMonth],
            year: this.selectedYear
        });
    };
    MdbCalendarMonthViewComponent.prototype.goToToday = function () {
        var today = new Date();
        var currentYear = today.getFullYear();
        var currentMonth = today.getMonth();
        this.createMonthView(currentYear, currentMonth);
        this.monthChanged.emit({
            index: this.selectedMonth,
            name: this.months[this.selectedMonth],
            year: this.selectedYear
        });
    };
    MdbCalendarMonthViewComponent.prototype.getDaysInPreviousMonth = function (year, month) {
        if (month === -1) {
            return getDaysInMonth(new Date(year - 1, 11));
        }
        return getDaysInMonth(new Date(year, month));
    };
    MdbCalendarMonthViewComponent.prototype.createMonthView = function (year, month) {
        this.selectedMonth = month;
        this.selectedYear = year;
        var daysInMonth = getDaysInMonth(new Date(year, month));
        var daysInPreviousMonth = this.getDaysInPreviousMonth(year, month - 1);
        var firstDay = startOfWeek(new Date(year, month), { weekStartsOn: this.weekDayIndex });
        var firstVisibleDay = getDate(firstDay);
        var dayStart;
        var dayEnd;
        var dates = [];
        var dayNumber = 1;
        var monthNumber = month;
        for (var i = 1; i < 7; i++) {
            var week = [];
            if (i === 1 && firstVisibleDay !== 1) {
                for (var j = firstVisibleDay; j <= daysInPreviousMonth; j++) {
                    dayStart = startOfDay(new Date(year, month - 1, j));
                    dayEnd = endOfDay(new Date(year, month - 1, j));
                    week.push({
                        dayNumber: j,
                        isToday: false,
                        isWeekend: isWeekend(new Date(year, month - 1, j)),
                        month: month - 1,
                        startOfDay: startOfDay(new Date(year, month - 1, j)),
                        endOfDay: endOfDay(new Date(year, month - 1, j)),
                        events: getMonthDayEvents(this.events, dayStart, dayEnd)
                    });
                }
                var daysLeft = 7 - week.length;
                for (var j = 0; j < daysLeft; j++) {
                    dayStart = startOfDay(new Date(year, month, dayNumber));
                    dayEnd = endOfDay(new Date(year, month, dayNumber));
                    week.push({
                        dayNumber: dayNumber,
                        isToday: isToday(new Date(year, month, dayNumber)),
                        isWeekend: isWeekend(new Date(year, month, dayNumber)),
                        month: month,
                        startOfDay: startOfDay(new Date(year, month, dayNumber)),
                        endOfDay: endOfDay(new Date(year, month, dayNumber)),
                        events: getMonthDayEvents(this.events, dayStart, dayEnd)
                    });
                    dayNumber++;
                }
            }
            else {
                for (var j = 1; j < 8; j++) {
                    if (dayNumber > daysInMonth) {
                        dayNumber = 1;
                        monthNumber = month + 1;
                    }
                    dayStart = startOfDay(new Date(year, monthNumber, dayNumber));
                    dayEnd = endOfDay(new Date(year, monthNumber, dayNumber));
                    week.push({
                        dayNumber: dayNumber,
                        isToday: isToday(new Date(year, monthNumber, dayNumber)),
                        isWeekend: isWeekend(new Date(year, monthNumber, dayNumber)),
                        month: monthNumber,
                        startOfDay: startOfDay(new Date(year, monthNumber, dayNumber)),
                        endOfDay: endOfDay(new Date(year, monthNumber, dayNumber)),
                        events: getMonthDayEvents(this.events, dayStart, dayEnd)
                    });
                    dayNumber++;
                }
            }
            dates.push({ week: week });
        }
        this.dates = dates;
    };
    MdbCalendarMonthViewComponent.ctorParameters = function () { return [
        { type: Renderer2 }
    ]; };
    __decorate([
        ViewChildren('dayEl'),
        __metadata("design:type", QueryList)
    ], MdbCalendarMonthViewComponent.prototype, "days", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], MdbCalendarMonthViewComponent.prototype, "events", null);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], MdbCalendarMonthViewComponent.prototype, "weekDaysShort", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], MdbCalendarMonthViewComponent.prototype, "months", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MdbCalendarMonthViewComponent.prototype, "weekDayIndex", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MdbCalendarMonthViewComponent.prototype, "options", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MdbCalendarMonthViewComponent.prototype, "dayClicked", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MdbCalendarMonthViewComponent.prototype, "eventClicked", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MdbCalendarMonthViewComponent.prototype, "viewChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MdbCalendarMonthViewComponent.prototype, "monthChanged", void 0);
    MdbCalendarMonthViewComponent = __decorate([
        Component({
            selector: 'mdb-calendar-month-view',
            template: "<div class=\"mdb-month-view\">\n  <div class=\"d-flex justify-content-between mb-3\">\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"previous()\">\n        <mdb-icon fas icon=\"chevron-left\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"next()\">\n        <mdb-icon fas icon=\"chevron-right\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"goToToday()\">{{ options.todayBtnTxt }}</button>\n    </div>\n    <h2>{{ months[selectedMonth]}} {{ selectedYear }}</h2>\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('month')\">{{ options.monthViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('week')\">{{ options.weekViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('list')\">{{ options.listViewBtnTxt }}</button>\n    </div>\n  </div>\n  <table>\n    <thead>\n      <th *ngFor=\"let day of weekDaysShort; trackBy: trackByFn\">{{ day }}</th>\n    </thead>\n\n    <tbody>\n      <tr *ngFor=\"let week of dates; trackBy: trackByFn\">\n        <td #dayEl *ngFor=\"let day of week.week; trackBy: trackByFn\" [ngClass]=\"{'mdb-today-cell': day.isToday, 'rgba-mdb-color-slight': day.isWeekend && !day.isToday }\"\n          (click)=\"onDayClick(day)\" (mousedown)=\"onMouseDown($event, day)\" (mouseup)=\"onMouseUp($event, day)\" (mouseenter)=\"onMouseMove($event)\">\n          <span class=\"mdb-day-field\" [ngClass]=\"{'text-light': day.month !== selectedMonth}\">{{ day.dayNumber }}</span>\n          <div\n            class=\"mdb-event mdb-event-long text-white small px-1 bg-{{ event.color }}\"\n            [ngClass]=\"{\n              'mdb-event-long': event.longEvent && !event.eventStart && !event.eventEnd,\n              'mdb-event-start': event.longEvent && event.eventStart,\n              'mdb-event-end': event.longEvent && event.eventEnd,\n              'mdb-event-single': !event.longEvent\n              }\"\n            mdbTooltip=\"{{ event.name }}\"\n            placement=\"top\"\n            *ngFor=\"let event of day.events; trackBy: trackByEvent\" (click)=\"onEventClick(event); $event.stopPropagation()\">\n            <span>{{ event.name }}</span>\n          </div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n",
            styles: [".mdb-today-cell{background-color:#e1f5fe}.mdb-month-view table{table-layout:fixed;width:100%}.mdb-month-view table th{text-align:center!important;height:30px;font-weight:700;border:1px solid #ddd}.mdb-month-view table td{height:12vh;padding-top:25px;vertical-align:top;position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid #ddd}.mdb-month-view table td:hover{background-color:rgba(69,82,110,.05)!important}.mdb-day-field{position:absolute;right:8px;top:5px}.mdb-event{cursor:pointer;font-weight:700;text-align:left!important}.mdb-event-start{margin:1px -2px 1px 2px}.mdb-event-end{margin:1px 2px 1px -2px;text-indent:-9999px}.mdb-event-long{margin:1px -2px;text-indent:-9999px}.mdb-event-single{margin:1px 2px}"]
        }),
        __metadata("design:paramtypes", [Renderer2])
    ], MdbCalendarMonthViewComponent);
    return MdbCalendarMonthViewComponent;
}());
export { MdbCalendarMonthViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbW9udGgtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9tZGItY2FsZW5kYXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9jYWxlbmRhci1tb250aC12aWV3L2NhbGVuZGFyLW1vbnRoLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsWUFBWSxFQUNaLE1BQU0sRUFDTixTQUFTLEVBQ1QsYUFBYSxFQUNiLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNYLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxjQUFjLEVBQ2QsVUFBVSxFQUNWLFFBQVEsRUFDUixPQUFPLEVBQ1AsU0FBUyxFQUNULE1BQU0sRUFDTixXQUFXLEVBQ1gsT0FBTyxFQUNSLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBUTVEO0lBdUNFLHVDQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBdEI5QixpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUdoQixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNyQyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdkMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ3pDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQVFqRCxhQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUU3QixVQUFLLEdBQUcsRUFBRSxDQUFDO0lBTStCLENBQUM7SUFwQzNDLHNCQUFJLGlEQUFNO2FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzthQUNELFVBQVcsTUFBdUI7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxD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LEVBQUU7O3VFQUF3QztJQXZCdEMsNkJBQTZCO1FBTHpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsOGlGQUFtRDs7U0FFcEQsQ0FBQzt5Q0F3QzhCLFNBQVM7T0F2QzVCLDZCQUE2QixDQW9SekM7SUFBRCxvQ0FBQztDQUFBLEFBcFJELElBb1JDO1NBcFJZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jYWxlbmRhci1ldmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHtcbiAgZ2V0RGF5c0luTW9udGgsXG4gIHN0YXJ0T2ZEYXksXG4gIGVuZE9mRGF5LFxuICBpc1RvZGF5LFxuICBpc1dlZWtlbmQsXG4gIGZvcm1hdCxcbiAgc3RhcnRPZldlZWssXG4gIGdldERhdGVcbn0gZnJvbSAnZGF0ZS1mbnMnO1xuaW1wb3J0IHsgZ2V0TW9udGhEYXlFdmVudHMgfSBmcm9tICcuLi8uLi91aWx0cy9ldmVudC11dGlscyc7XG5pbXBvcnQgeyBNZGJDYWxlbmRhck9wdGlvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhbGVuZGFyLW9wdGlvbnMuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWRiLWNhbGVuZGFyLW1vbnRoLXZpZXcnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXItbW9udGgtdmlldy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NhbGVuZGFyLW1vbnRoLXZpZXcuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBNZGJDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGRyZW4oJ2RheUVsJykgZGF5czogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBASW5wdXQoKVxuICBnZXQgZXZlbnRzKCkge1xuICAgIHJldHVybiB0aGlzLl9ldmVudHM7XG4gIH1cbiAgc2V0IGV2ZW50cyhldmVudHM6IENhbGVuZGFyRXZlbnRbXSkge1xuICAgIHRoaXMuX2V2ZW50cyA9IGV2ZW50cztcbiAgICB0aGlzLmRhdGVzLmZvckVhY2god2VlayA9PiB7XG4gICAgICB3ZWVrLndlZWsuZm9yRWFjaChkYXkgPT4ge1xuICAgICAgICBkYXkuZXZlbnRzID0gZ2V0TW9udGhEYXlFdmVudHMoZXZlbnRzLCBkYXkuc3RhcnRPZkRheSwgZGF5LmVuZE9mRGF5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgX2V2ZW50czogQ2FsZW5kYXJFdmVudFtdO1xuICBASW5wdXQoKSB3ZWVrRGF5c1Nob3J0OiBzdHJpbmdbXTtcbiAgQElucHV0KCkgbW9udGhzOiBzdHJpbmdbXTtcbiAgQElucHV0KCkgd2Vla0RheUluZGV4ID0gMDtcbiAgQElucHV0KCkgb3B0aW9uczogTWRiQ2FsZW5kYXJPcHRpb25zO1xuXG4gIEBPdXRwdXQoKSBkYXlDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBldmVudENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHZpZXdDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIEBPdXRwdXQoKSBtb250aENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBzZWxlY3RlZE1vbnRoOiBudW1iZXI7XG4gIHNlbGVjdGVkWWVhcjogbnVtYmVyO1xuXG4gIHNlbGVjdGlvblN0YXJ0RGF0ZTogRGF0ZTtcbiAgc2VsZWN0aW9uRW5kRGF0ZTogRGF0ZTtcblxuICBhbGxDZWxsczogSFRNTEVsZW1lbnRbXSA9IFtdO1xuXG4gIGRhdGVzID0gW107XG5cbiAgZHJhZ1N0YXJ0OiBhbnk7XG4gIGlzRHJhZ2dpbmc6IGJvb2xlYW47XG4gIGRyYWdFbmQ6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc3QgY3VycmVudFllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gbmV3IERhdGUoKS5nZXRNb250aCgpO1xuICAgIHRoaXMuY3JlYXRlTW9udGhWaWV3KGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuYWxsQ2VsbHMgPSB0aGlzLmRheXNcbiAgICAgIC50b0FycmF5KClcbiAgICAgIC5tYXAoKGVsOiBFbGVtZW50UmVmKSA9PiBlbC5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIHRyYWNrQnlGbihpbmRleCkge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHRyYWNrQnlFdmVudChpbmRleCwgaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmlkO1xuICB9XG5cbiAgdHJhY2tCeURheShpbmRleCwgaXRlbSkge1xuICAgIHJldHVybiBpdGVtLmRheU51bWJlcjtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGV2ZW50OiBhbnksIGRheTogYW55KSB7XG4gICAgdGhpcy5kcmFnU3RhcnQgPSB0aGlzLmFsbENlbGxzLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2VsZWN0aW9uU3RhcnREYXRlID0gZGF5LnN0YXJ0T2ZEYXk7XG4gIH1cblxuICBvbk1vdXNlVXAoZXZlbnQ6IGFueSwgZGF5OiBhbnkpIHtcbiAgICB0aGlzLmRyYWdFbmQgPSB0aGlzLmFsbENlbGxzLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICB0aGlzLnNlbGVjdGlvbkVuZERhdGUgPSBkYXkuZW5kT2ZEYXk7XG5cbiAgICBjb25zdCBjYWxlbmRhckV2ZW50ID0ge1xuICAgICAgbmFtZTogJ05ldyBldmVudCcsXG4gICAgICBzdGFydERhdGU6IHRoaXMuc2VsZWN0aW9uU3RhcnREYXRlLFxuICAgICAgZW5kRGF0ZTogdGhpcy5zZWxlY3Rpb25FbmREYXRlLFxuICAgICAgY29sb3I6ICdpbmZvJ1xuICAgIH07XG4gICAgaWYgKHRoaXMuZHJhZ1N0YXJ0ICE9PSB0aGlzLmRyYWdFbmQpIHtcbiAgICAgIHRoaXMuZGF5Q2xpY2tlZC5lbWl0KGNhbGVuZGFyRXZlbnQpO1xuICAgIH1cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmRyYWdFbmQgIT09IDApIHtcbiAgICAgIHRoaXMuc2VsZWN0UmFuZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gIH1cblxuICBzZWxlY3RSYW5nZSgpIHtcbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5kcmFnRW5kID4gdGhpcy5kcmFnU3RhcnQpIHtcbiAgICAgIGlmICh0aGlzLmRyYWdFbmQgKyAxIDwgdGhpcy5kcmFnU3RhcnQpIHtcbiAgICAgICAgdGhpcy5hbGxDZWxsc1xuICAgICAgICAgIC5zbGljZSh0aGlzLmRyYWdFbmQsIHRoaXMuZHJhZ1N0YXJ0ICsgMSlcbiAgICAgICAgICAuZm9yRWFjaChjZWxsID0+XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNlbGwsICdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JnYmEoNjksODIsMTEwLC4zKScpXG4gICAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWxsQ2VsbHNcbiAgICAgICAgICAuc2xpY2UodGhpcy5kcmFnU3RhcnQsIHRoaXMuZHJhZ0VuZCArIDEpXG4gICAgICAgICAgLmZvckVhY2goY2VsbCA9PlxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjZWxsLCAnYmFja2dyb3VuZC1jb2xvcicsICdyZ2JhKDY5LDgyLDExMCwuMyknKVxuICAgICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xlYXJTZWxlY3Rpb24oKSB7XG4gICAgdGhpcy5hbGxDZWxscy5mb3JFYWNoKGNlbGwgPT5cbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUoY2VsbCwgJ2JhY2tncm91bmQtY29sb3InKVxuICAgICk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldmVudDogYW55KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLmRyYWdFbmQgPSB0aGlzLmFsbENlbGxzLmluZGV4T2YoZXZlbnQudGFyZ2V0KTtcbiAgICAgIHRoaXMuc2VsZWN0UmFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBvbkRheUNsaWNrKGRheTogYW55KSB7XG4gICAgY29uc3QgbmV3RXZlbnQgPSB7XG4gICAgICBuYW1lOiAnTmV3IGV2ZW50JyxcbiAgICAgIHN0YXJ0RGF0ZTogZGF5LnN0YXJ0T2ZEYXksXG4gICAgICBlbmREYXRlOiBkYXkuZW5kT2ZEYXksXG4gICAgICBjb2xvcjogJ2luZm8nXG4gICAgfTtcbiAgICB0aGlzLmRheUNsaWNrZWQuZW1pdChuZXdFdmVudCk7XG4gIH1cblxuICBvbkV2ZW50Q2xpY2soZXZlbnQ6IENhbGVuZGFyRXZlbnQpIHtcbiAgICBjb25zdCBldmVudENvcHkgPSB7XG4gICAgICBpZDogZXZlbnQuaWQsXG4gICAgICBuYW1lOiBldmVudC5uYW1lLFxuICAgICAgc3RhcnREYXRlOiBmb3JtYXQoZXZlbnQuc3RhcnREYXRlLCAnWVlZWS1NTS1ERCwgSEg6bW06c3MnKSxcbiAgICAgIGVuZERhdGU6IGZvcm1hdChldmVudC5lbmREYXRlLCAnWVlZWS1NTS1ERCwgSEg6bW06c3MnKSxcbiAgICAgIGNvbG9yOiBldmVudC5jb2xvclxuICAgIH07XG4gICAgdGhpcy5ldmVudENsaWNrZWQuZW1pdChldmVudENvcHkpO1xuICB9XG5cbiAgb25WaWV3Q2hhbmdlKHZpZXc6IHN0cmluZykge1xuICAgIHRoaXMudmlld0NoYW5nZWQuZW1pdCh2aWV3KTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRNb250aCA9PT0gMTEpIHtcbiAgICAgIHRoaXMuY3JlYXRlTW9udGhWaWV3KHRoaXMuc2VsZWN0ZWRZZWFyICsgMSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3JlYXRlTW9udGhWaWV3KHRoaXMuc2VsZWN0ZWRZZWFyLCB0aGlzLnNlbGVjdGVkTW9udGggKyAxKTtcbiAgICB9XG5cbiAgICB0aGlzLm1vbnRoQ2hhbmdlZC5lbWl0KHtcbiAgICAgIGluZGV4OiB0aGlzLnNlbGVjdGVkTW9udGgsXG4gICAgICBtb250aDogdGhpcy5tb250aHNbdGhpcy5zZWxlY3RlZE1vbnRoXSxcbiAgICAgIHllYXI6IHRoaXMuc2VsZWN0ZWRZZWFyXG4gICAgfSk7XG4gIH1cblxuICBwcmV2aW91cygpIHtcbiAgICBpZiAodGhpcy5zZWxlY3RlZE1vbnRoID09PSAwKSB7XG4gICAgICB0aGlzLmNyZWF0ZU1vbnRoVmlldyh0aGlzLnNlbGVjdGVkWWVhciAtIDEsIDExKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jcmVhdGVNb250aFZpZXcodGhpcy5zZWxlY3RlZFllYXIsIHRoaXMuc2VsZWN0ZWRNb250aCAtIDEpO1xuICAgIH1cblxuICAgIHRoaXMubW9udGhDaGFuZ2VkLmVtaXQoe1xuICAgICAgaW5kZXg6IHRoaXMuc2VsZWN0ZWRNb250aCxcbiAgICAgIG1vbnRoOiB0aGlzLm1vbnRoc1t0aGlzLnNlbGVjdGVkTW9udGhdLFxuICAgICAgeWVhcjogdGhpcy5zZWxlY3RlZFllYXJcbiAgICB9KTtcbiAgfVxuXG4gIGdvVG9Ub2RheSgpIHtcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgY3VycmVudFllYXIgPSB0b2RheS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IHRvZGF5LmdldE1vbnRoKCk7XG4gICAgdGhpcy5jcmVhdGVNb250aFZpZXcoY3VycmVudFllYXIsIGN1cnJlbnRNb250aCk7XG5cbiAgICB0aGlzLm1vbnRoQ2hhbmdlZC5lbWl0KHtcbiAgICAgIGluZGV4OiB0aGlzLnNlbGVjdGVkTW9udGgsXG4gICAgICBuYW1lOiB0aGlzLm1vbnRoc1t0aGlzLnNlbGVjdGVkTW9udGhdLFxuICAgICAgeWVhcjogdGhpcy5zZWxlY3RlZFllYXJcbiAgICB9KTtcbiAgfVxuXG4gIGdldERheXNJblByZXZpb3VzTW9udGgoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBpZiAobW9udGggPT09IC0xKSB7XG4gICAgICByZXR1cm4gZ2V0RGF5c0luTW9udGgobmV3IERhdGUoeWVhciAtIDEsIDExKSk7XG4gICAgfVxuICAgIHJldHVybiBnZXREYXlzSW5Nb250aChuZXcgRGF0ZSh5ZWFyLCBtb250aCkpO1xuICB9XG5cbiAgY3JlYXRlTW9udGhWaWV3KHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlcikge1xuICAgIHRoaXMuc2VsZWN0ZWRNb250aCA9IG1vbnRoO1xuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0geWVhcjtcbiAgICBjb25zdCBkYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoKG5ldyBEYXRlKHllYXIsIG1vbnRoKSk7XG4gICAgY29uc3QgZGF5c0luUHJldmlvdXNNb250aCA9IHRoaXMuZ2V0RGF5c0luUHJldmlvdXNNb250aCh5ZWFyLCBtb250aCAtIDEpO1xuICAgIGNvbnN0IGZpcnN0RGF5ID0gc3RhcnRPZldlZWsobmV3IERhdGUoeWVhciwgbW9udGgpLCB7IHdlZWtTdGFydHNPbjogdGhpcy53ZWVrRGF5SW5kZXggfSk7XG4gICAgY29uc3QgZmlyc3RWaXNpYmxlRGF5ID0gZ2V0RGF0ZShmaXJzdERheSk7XG5cbiAgICBsZXQgZGF5U3RhcnQ6IERhdGU7XG4gICAgbGV0IGRheUVuZDogRGF0ZTtcblxuICAgIGNvbnN0IGRhdGVzID0gW107XG4gICAgbGV0IGRheU51bWJlciA9IDE7XG4gICAgbGV0IG1vbnRoTnVtYmVyID0gbW9udGg7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDc7IGkrKykge1xuICAgICAgY29uc3Qgd2VlayA9IFtdO1xuXG4gICAgICBpZiAoaSA9PT0gMSAmJiBmaXJzdFZpc2libGVEYXkgIT09IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGZpcnN0VmlzaWJsZURheTsgaiA8PSBkYXlzSW5QcmV2aW91c01vbnRoOyBqKyspIHtcbiAgICAgICAgICBkYXlTdGFydCA9IHN0YXJ0T2ZEYXkobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBqKSk7XG4gICAgICAgICAgZGF5RW5kID0gZW5kT2ZEYXkobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBqKSk7XG4gICAgICAgICAgd2Vlay5wdXNoKHtcbiAgICAgICAgICAgIGRheU51bWJlcjogaixcbiAgICAgICAgICAgIGlzVG9kYXk6IGZhbHNlLFxuICAgICAgICAgICAgaXNXZWVrZW5kOiBpc1dlZWtlbmQobmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBqKSksXG4gICAgICAgICAgICBtb250aDogbW9udGggLSAxLFxuICAgICAgICAgICAgc3RhcnRPZkRheTogc3RhcnRPZkRheShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGopKSxcbiAgICAgICAgICAgIGVuZE9mRGF5OiBlbmRPZkRheShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGopKSxcbiAgICAgICAgICAgIGV2ZW50czogZ2V0TW9udGhEYXlFdmVudHModGhpcy5ldmVudHMsIGRheVN0YXJ0LCBkYXlFbmQpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXlzTGVmdCA9IDcgLSB3ZWVrLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRheXNMZWZ0OyBqKyspIHtcbiAgICAgICAgICBkYXlTdGFydCA9IHN0YXJ0T2ZEYXkobmV3IERhdGUoeWVhciwgbW9udGgsIGRheU51bWJlcikpO1xuICAgICAgICAgIGRheUVuZCA9IGVuZE9mRGF5KG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXlOdW1iZXIpKTtcblxuICAgICAgICAgIHdlZWsucHVzaCh7XG4gICAgICAgICAgICBkYXlOdW1iZXI6IGRheU51bWJlcixcbiAgICAgICAgICAgIGlzVG9kYXk6IGlzVG9kYXkobmV3IERhdGUoeWVhciwgbW9udGgsIGRheU51bWJlcikpLFxuICAgICAgICAgICAgaXNXZWVrZW5kOiBpc1dlZWtlbmQobmV3IERhdGUoeWVhciwgbW9udGgsIGRheU51bWJlcikpLFxuICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgc3RhcnRPZkRheTogc3RhcnRPZkRheShuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5TnVtYmVyKSksXG4gICAgICAgICAgICBlbmRPZkRheTogZW5kT2ZEYXkobmV3IERhdGUoeWVhciwgbW9udGgsIGRheU51bWJlcikpLFxuICAgICAgICAgICAgZXZlbnRzOiBnZXRNb250aERheUV2ZW50cyh0aGlzLmV2ZW50cywgZGF5U3RhcnQsIGRheUVuZClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXlOdW1iZXIrKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA4OyBqKyspIHtcbiAgICAgICAgICBpZiAoZGF5TnVtYmVyID4gZGF5c0luTW9udGgpIHtcbiAgICAgICAgICAgIGRheU51bWJlciA9IDE7XG4gICAgICAgICAgICBtb250aE51bWJlciA9IG1vbnRoICsgMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXlTdGFydCA9IHN0YXJ0T2ZEYXkobmV3IERhdGUoeWVhciwgbW9udGhOdW1iZXIsIGRheU51bWJlcikpO1xuICAgICAgICAgIGRheUVuZCA9IGVuZE9mRGF5KG5ldyBEYXRlKHllYXIsIG1vbnRoTnVtYmVyLCBkYXlOdW1iZXIpKTtcblxuICAgICAgICAgIHdlZWsucHVzaCh7XG4gICAgICAgICAgICBkYXlOdW1iZXI6IGRheU51bWJlcixcbiAgICAgICAgICAgIGlzVG9kYXk6IGlzVG9kYXkobmV3IERhdGUoeWVhciwgbW9udGhOdW1iZXIsIGRheU51bWJlcikpLFxuICAgICAgICAgICAgaXNXZWVrZW5kOiBpc1dlZWtlbmQobmV3IERhdGUoeWVhciwgbW9udGhOdW1iZXIsIGRheU51bWJlcikpLFxuICAgICAgICAgICAgbW9udGg6IG1vbnRoTnVtYmVyLFxuICAgICAgICAgICAgc3RhcnRPZkRheTogc3RhcnRPZkRheShuZXcgRGF0ZSh5ZWFyLCBtb250aE51bWJlciwgZGF5TnVtYmVyKSksXG4gICAgICAgICAgICBlbmRPZkRheTogZW5kT2ZEYXkobmV3IERhdGUoeWVhciwgbW9udGhOdW1iZXIsIGRheU51bWJlcikpLFxuICAgICAgICAgICAgZXZlbnRzOiBnZXRNb250aERheUV2ZW50cyh0aGlzLmV2ZW50cywgZGF5U3RhcnQsIGRheUVuZClcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXlOdW1iZXIrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZGF0ZXMucHVzaCh7IHdlZWsgfSk7XG4gICAgfVxuICAgIHRoaXMuZGF0ZXMgPSBkYXRlcztcbiAgfVxufVxuIl19