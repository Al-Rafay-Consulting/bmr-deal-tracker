import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { startOfWeek, addDays, getDate, getYear, getMonth, subDays, startOfDay, format, endOfDay } from 'date-fns';
import { getListViewEvents } from '../../uilts/event-utils';
var MdbCalendarListViewComponent = /** @class */ (function () {
    function MdbCalendarListViewComponent() {
        this.monthsShort = [];
        this.weekDayIndex = 0;
        this.viewChanged = new EventEmitter();
        this.eventClicked = new EventEmitter();
        this.listChanged = new EventEmitter();
    }
    Object.defineProperty(MdbCalendarListViewComponent.prototype, "events", {
        get: function () {
            return this._events;
        },
        set: function (events) {
            this._events = events;
            this.listView = this.createListView(this.initDay);
        },
        enumerable: true,
        configurable: true
    });
    MdbCalendarListViewComponent.prototype.ngOnInit = function () {
        var initDay = this.initDay = startOfWeek(startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
        this.listView = this.createListView(this.initDay);
    };
    MdbCalendarListViewComponent.prototype.previous = function () {
        this.initDay = subDays(this.initDay, 7);
        this.listView = this.createListView(this.initDay);
        this.listChanged.emit({
            startDate: this.startDate,
            endDate: this.endDate
        });
    };
    MdbCalendarListViewComponent.prototype.next = function () {
        this.initDay = addDays(this.initDay, 7);
        this.listView = this.createListView(this.initDay);
        this.listChanged.emit({
            startDate: this.startDate,
            endDate: this.endDate
        });
    };
    MdbCalendarListViewComponent.prototype.goToToday = function () {
        this.initDay = startOfWeek(startOfDay(new Date()));
        this.listView = this.createListView(this.initDay);
        this.listChanged.emit({
            startDate: this.startDate,
            endDate: this.endDate
        });
    };
    MdbCalendarListViewComponent.prototype.onViewChange = function (view) {
        this.viewChanged.emit(view);
    };
    MdbCalendarListViewComponent.prototype.trackByFn = function (index) {
        return index;
    };
    MdbCalendarListViewComponent.prototype.onEventClick = function (event) {
        var eventCopy = {
            id: event.id,
            name: event.name,
            startDate: format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
            endDate: format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
            color: event.color
        };
        this.eventClicked.emit(eventCopy);
    };
    MdbCalendarListViewComponent.prototype.createListView = function (date) {
        var firstDay = date;
        var lastDay = endOfDay(addDays(firstDay, 6));
        var period = {
            start: getDate(firstDay) + " " + this.monthsShort[getMonth(firstDay)] + ", " + getYear(firstDay),
            end: getDate(lastDay) + " " + this.monthsShort[getMonth(lastDay)] + ", " + getYear(lastDay)
        };
        this.startDate = firstDay;
        this.endDate = lastDay;
        var eventsInPeriod = getListViewEvents(this.events, firstDay, lastDay);
        return { eventsInPeriod: eventsInPeriod, period: period };
    };
    __decorate([
        Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], MdbCalendarListViewComponent.prototype, "events", null);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], MdbCalendarListViewComponent.prototype, "monthsShort", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MdbCalendarListViewComponent.prototype, "options", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MdbCalendarListViewComponent.prototype, "weekDayIndex", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MdbCalendarListViewComponent.prototype, "viewChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MdbCalendarListViewComponent.prototype, "eventClicked", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MdbCalendarListViewComponent.prototype, "listChanged", void 0);
    MdbCalendarListViewComponent = __decorate([
        Component({
            selector: 'mdb-calendar-list-view',
            template: "<div class=\"mdb-list-view\">\n  <div class=\"mdb-week-view\">\n    <div class=\"d-flex justify-content-between mb-3\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"previous()\">\n          <mdb-icon fas icon=\"chevron-left\"></mdb-icon>\n        </button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"next()\">\n          <mdb-icon fas icon=\"chevron-right\"></mdb-icon>\n        </button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"goToToday()\">{{ options.todayBtnTxt }}</button>\n      </div>\n      <h2>{{ listView.period.start }} - {{ listView.period.end }}</h2>\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('month')\">{{ options.monthViewBtnTxt }}</button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('week')\">{{ options.weekViewBtnTxt }}</button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('list')\">{{ options.listViewBtnTxt }}</button>\n      </div>\n    </div>\n\n    <table>\n      <tbody>\n        <ng-container *ngFor=\"let event of listView.eventsInPeriod; trackBy: trackByFn\">\n          <tr class=\"grey lighten-4\">\n            <th class=\"text-left font-weight-bold\"><mdb-icon fas icon=\"calendar-alt\"></mdb-icon> {{ event.start.date }} - {{ event.end.date }}</th>\n            <th class=\"font-weight-bold text-right\"><mdb-icon fas icon=\"clock\"></mdb-icon> {{ event.start.time }} - {{ event.end.time }}</th>\n          </tr>\n          <tr (click)=\"onEventClick(event)\">\n            <td class=\"text-left mdb-list-event\" colspan=\"2\"><mdb-icon fas icon=\"circle\" class=\"pr-1 text-{{ event.color }}\"></mdb-icon>{{ event.name }}</td>\n          </tr>\n        </ng-container>\n      </tbody>\n    </table>\n  </div>\n",
            styles: [".mdb-list-view{width:100%;height:100%;margin-bottom:50px}.mdb-list-view table{table-layout:fixed;width:100%;border:1px solid #ddd}.mdb-list-view table tr td,.mdb-list-view table tr th{padding:8px 10px;border-top:1px solid #ddd;border-bottom:1px solid #ddd}.mdb-list-event{cursor:pointer}.mdb-list-event:hover{background-color:rgba(69,82,110,.05)}"]
        }),
        __metadata("design:paramtypes", [])
    ], MdbCalendarListViewComponent);
    return MdbCalendarListViewComponent;
}());
export { MdbCalendarListViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItbGlzdC12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL21kYi1jYWxlbmRhci8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NhbGVuZGFyLWxpc3Qtdmlldy9jYWxlbmRhci1saXN0LXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNuSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQVM1RDtJQXlCRTtRQWZTLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBRTNCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRWhCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUN6QyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdkMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBU2hDLENBQUM7SUF2QmpCLHNCQUFJLGdEQUFNO2FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzthQUNELFVBQVcsTUFBdUI7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxDQUFDOzs7T0FKQTtJQXVCRCwrQ0FBUSxHQUFSO1FBQ0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLElB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QUFPLENBQUMsQ0FBQyxVQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUc7U0FDdkYsQ0FBQztRQUVGLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLElBQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXpFLE9BQU8sRUFBRSxjQUFjLGdCQUFBLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQztJQUNwQyxDQUFDO0lBMUZEO1FBREMsS0FBSyxFQUFFOzs7OERBR1A7SUFNUTtRQUFSLEtBQUssRUFBRTs7cUVBQTRCO0lBQzNCO1FBQVIsS0FBSyxFQUFFOztpRUFBNkI7SUFDNUI7UUFBUixLQUFLLEVBQUU7O3NFQUFrQjtJQUVoQjtRQUFULE1BQU0sRUFBRTs7cUVBQTBDO0lBQ3pDO1FBQVQsTUFBTSxFQUFFOztzRUFBd0M7SUFDdkM7UUFBVCxNQUFNLEVBQUU7O3FFQUF1QztJQWhCckMsNEJBQTRCO1FBTHhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSx3QkFBd0I7WUFDbEMsNi9EQUFrRDs7U0FFbkQsQ0FBQzs7T0FDVyw0QkFBNEIsQ0E4RnhDO0lBQUQsbUNBQUM7Q0FBQSxBQTlGRCxJQThGQztTQTlGWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBzdGFydE9mV2VlaywgYWRkRGF5cywgZ2V0RGF0ZSwgZ2V0WWVhciwgZ2V0TW9udGgsIHN1YkRheXMsIHN0YXJ0T2ZEYXksIGZvcm1hdCwgZW5kT2ZEYXkgfSBmcm9tICdkYXRlLWZucyc7XG5pbXBvcnQgeyBnZXRMaXN0Vmlld0V2ZW50cyB9IGZyb20gJy4uLy4uL3VpbHRzL2V2ZW50LXV0aWxzJztcbmltcG9ydCB7IENhbGVuZGFyRXZlbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhbGVuZGFyLWV2ZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBNZGJDYWxlbmRhck9wdGlvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhbGVuZGFyLW9wdGlvbnMuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWRiLWNhbGVuZGFyLWxpc3QtdmlldycsXG4gIHRlbXBsYXRlVXJsOiAnLi9jYWxlbmRhci1saXN0LXZpZXcuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jYWxlbmRhci1saXN0LXZpZXcuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBNZGJDYWxlbmRhckxpc3RWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgZ2V0IGV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5fZXZlbnRzO1xuICB9XG4gIHNldCBldmVudHMoZXZlbnRzOiBDYWxlbmRhckV2ZW50W10pIHtcbiAgICB0aGlzLl9ldmVudHMgPSBldmVudHM7XG4gICAgdGhpcy5saXN0VmlldyA9IHRoaXMuY3JlYXRlTGlzdFZpZXcodGhpcy5pbml0RGF5KTtcbiAgfVxuICBwcml2YXRlIF9ldmVudHM6IENhbGVuZGFyRXZlbnRbXTtcbiAgQElucHV0KCkgbW9udGhzU2hvcnQ6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIG9wdGlvbnM6IE1kYkNhbGVuZGFyT3B0aW9ucztcbiAgQElucHV0KCkgd2Vla0RheUluZGV4ID0gMDtcblxuICBAT3V0cHV0KCkgdmlld0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgQE91dHB1dCgpIGV2ZW50Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgbGlzdENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBsaXN0VmlldzogYW55O1xuXG4gIGluaXREYXk6IERhdGU7XG5cbiAgc3RhcnREYXRlOiBEYXRlO1xuICBlbmREYXRlOiBEYXRlO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc3QgaW5pdERheSA9IHRoaXMuaW5pdERheSA9IHN0YXJ0T2ZXZWVrKHN0YXJ0T2ZEYXkobmV3IERhdGUoKSksIHsgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtEYXlJbmRleCB9KTtcbiAgICB0aGlzLmxpc3RWaWV3ID0gdGhpcy5jcmVhdGVMaXN0Vmlldyh0aGlzLmluaXREYXkpO1xuICB9XG5cbiAgcHJldmlvdXMoKSB7XG4gICAgdGhpcy5pbml0RGF5ID0gc3ViRGF5cyh0aGlzLmluaXREYXksIDcpO1xuICAgIHRoaXMubGlzdFZpZXcgPSB0aGlzLmNyZWF0ZUxpc3RWaWV3KHRoaXMuaW5pdERheSk7XG4gICAgdGhpcy5saXN0Q2hhbmdlZC5lbWl0KHtcbiAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsXG4gICAgICBlbmREYXRlOiB0aGlzLmVuZERhdGVcbiAgICB9KTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5pbml0RGF5ID0gYWRkRGF5cyh0aGlzLmluaXREYXksIDcpO1xuICAgIHRoaXMubGlzdFZpZXcgPSB0aGlzLmNyZWF0ZUxpc3RWaWV3KHRoaXMuaW5pdERheSk7XG4gICAgdGhpcy5saXN0Q2hhbmdlZC5lbWl0KHtcbiAgICAgIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsXG4gICAgICBlbmREYXRlOiB0aGlzLmVuZERhdGVcbiAgICB9KTtcbiAgfVxuXG4gIGdvVG9Ub2RheSgpIHtcbiAgICB0aGlzLmluaXREYXkgPSBzdGFydE9mV2VlayhzdGFydE9mRGF5KG5ldyBEYXRlKCkpKTtcbiAgICB0aGlzLmxpc3RWaWV3ID0gdGhpcy5jcmVhdGVMaXN0Vmlldyh0aGlzLmluaXREYXkpO1xuICAgIHRoaXMubGlzdENoYW5nZWQuZW1pdCh7XG4gICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLFxuICAgICAgZW5kRGF0ZTogdGhpcy5lbmREYXRlXG4gICAgfSk7XG4gIH1cblxuICBvblZpZXdDaGFuZ2Uodmlldzogc3RyaW5nKSB7XG4gICAgdGhpcy52aWV3Q2hhbmdlZC5lbWl0KHZpZXcpO1xuICB9XG5cbiAgdHJhY2tCeUZuKGluZGV4KSB7XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgb25FdmVudENsaWNrKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCBldmVudENvcHkgPSB7XG4gICAgICBpZDogZXZlbnQuaWQsXG4gICAgICBuYW1lOiBldmVudC5uYW1lLFxuICAgICAgc3RhcnREYXRlOiBmb3JtYXQoZXZlbnQuc3RhcnREYXRlLCAnWVlZWS1NTS1ERCwgSEg6bW06c3MnKSxcbiAgICAgIGVuZERhdGU6IGZvcm1hdChldmVudC5lbmREYXRlLCAnWVlZWS1NTS1ERCwgSEg6bW06c3MnKSxcbiAgICAgIGNvbG9yOiBldmVudC5jb2xvclxuICAgIH07XG4gICAgdGhpcy5ldmVudENsaWNrZWQuZW1pdChldmVudENvcHkpO1xuICB9XG5cbiAgY3JlYXRlTGlzdFZpZXcoZGF0ZTogRGF0ZSkge1xuICAgIGNvbnN0IGZpcnN0RGF5ID0gZGF0ZTtcbiAgICBjb25zdCBsYXN0RGF5ID0gZW5kT2ZEYXkoYWRkRGF5cyhmaXJzdERheSwgNikpO1xuICAgIGNvbnN0IHBlcmlvZCA9IHtcbiAgICAgIHN0YXJ0OiBgJHtnZXREYXRlKGZpcnN0RGF5KX0gJHt0aGlzLm1vbnRoc1Nob3J0W2dldE1vbnRoKGZpcnN0RGF5KV19LCAke2dldFllYXIoZmlyc3REYXkpfWAsXG4gICAgICBlbmQ6IGAke2dldERhdGUobGFzdERheSl9ICR7dGhpcy5tb250aHNTaG9ydFtnZXRNb250aChsYXN0RGF5KV19LCAke2dldFllYXIobGFzdERheSl9YFxuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0RGF0ZSA9IGZpcnN0RGF5O1xuICAgIHRoaXMuZW5kRGF0ZSA9IGxhc3REYXk7XG5cbiAgICBjb25zdCBldmVudHNJblBlcmlvZCA9IGdldExpc3RWaWV3RXZlbnRzKHRoaXMuZXZlbnRzLCBmaXJzdERheSwgbGFzdERheSk7XG5cbiAgICByZXR1cm4geyBldmVudHNJblBlcmlvZCwgcGVyaW9kIH07XG4gIH1cblxufVxuIl19