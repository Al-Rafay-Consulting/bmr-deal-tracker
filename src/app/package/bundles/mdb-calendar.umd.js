(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('angular-bootstrap-md'), require('@angular/forms'), require('rxjs'), require('date-fns'), require('rxjs/operators'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('mdb-calendar', ['exports', '@angular/core', 'angular-bootstrap-md', '@angular/forms', 'rxjs', 'date-fns', 'rxjs/operators', '@angular/common'], factory) :
    (global = global || self, factory(global['mdb-calendar'] = {}, global.ng.core, global['angular-bootstrap-md'], global.ng.forms, global.rxjs, global['date-fns'], global.rxjs.operators, global.ng.common));
}(this, (function (exports, core, angularBootstrapMd, forms, rxjs, dateFns, operators, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var EventModalComponent = /** @class */ (function () {
        function EventModalComponent(modalRef) {
            this.modalRef = modalRef;
            this.eventData = new rxjs.Subject();
            this.eventDeleted = new rxjs.Subject();
        }
        EventModalComponent.prototype.getParsedValues = function (eventData) {
            var id = this.event.id;
            var name = eventData.name;
            var startDate = dateFns.parse(eventData.startDate.replace(', ', 'T'));
            var endDate = dateFns.parse(eventData.endDate.replace(', ', 'T'));
            var color = eventData.color;
            return { id: id, name: name, startDate: startDate, endDate: endDate, color: color };
        };
        EventModalComponent.prototype.ngOnInit = function () {
            if (this.event && this.mode === 'edit') {
                this.eventForm = new forms.FormGroup({
                    name: new forms.FormControl({ value: this.event.name, disabled: !this.editable }),
                    startDate: new forms.FormControl({ value: this.event.startDate, disabled: !this.editable }),
                    endDate: new forms.FormControl({ value: this.event.endDate, disabled: !this.editable }),
                    color: new forms.FormControl({ value: this.event.color, disabled: !this.editable })
                });
            }
            else {
                this.eventForm = new forms.FormGroup({
                    name: new forms.FormControl('New event'),
                    startDate: new forms.FormControl(this.event.startDate),
                    endDate: new forms.FormControl(this.event.endDate),
                    color: new forms.FormControl(this.event.color)
                });
            }
        };
        EventModalComponent.prototype.onSave = function () {
            var event = this.getParsedValues(this.eventForm.value);
            this.eventData.next(event);
            this.modalRef.hide();
        };
        EventModalComponent.prototype.onDelete = function () {
            var event = this.getParsedValues(this.eventForm.value);
            this.eventDeleted.next(event);
            this.modalRef.hide();
        };
        EventModalComponent.ctorParameters = function () { return [
            { type: angularBootstrapMd.MDBModalRef }
        ]; };
        EventModalComponent = __decorate([
            core.Component({
                selector: 'mdb-event-modal',
                template: "<div class=\"modal-content\">\n  <div class=\"modal-header\">\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\n      <span aria-hidden=\"true\">\u00D7</span>\n    </button>\n    <h4 class=\"modal-title w-100\" id=\"myModalLabel\"> {{ title }}</h4>\n  </div>\n  <div class=\"modal-body\">\n    <form [formGroup]=\"eventForm\">\n      <div class=\"md-form\">\n        <input type=\"text\" mdbInput formControlName=\"name\" class=\"form-control w-100\">\n        <label>Name</label>\n      </div>\n      <div class=\"md-form\">\n        <input type=\"text\" mdbInput formControlName=\"startDate\" class=\"form-control w-100\">\n        <label>Start date</label>\n      </div>\n      <div class=\"md-form\">\n        <input type=\"text\" mdbInput formControlName=\"endDate\" class=\"form-control w-100\">\n        <label>End date</label>\n      </div>\n\n      <p>Color</p>\n      <div>\n        <div class=\"custom-control custom-radio custom-control-inline font-weight-bold\">\n          <input type=\"radio\" checked value=\"info\" name=\"color\" id=\"info\" class=\"custom-control-input\" formControlName=\"color\">\n          <label for=\"info\" class=\"custom-control-label text-info\">Info</label>\n        </div>\n        <div class=\"custom-control custom-radio custom-control-inline font-weight-bold\">\n          <input type=\"radio\" value=\"success\" name=\"color\" id=\"success\" class=\"custom-control-input\" formControlName=\"color\">\n          <label for=\"success\" class=\"custom-control-label text-success\">Success</label>\n        </div>\n        <div class=\"custom-control custom-radio custom-control-inline font-weight-bold\">\n          <input type=\"radio\" value=\"warning\" name=\"color\" id=\"warning\" class=\"custom-control-input\" formControlName=\"color\">\n          <label for=\"warning\" class=\"custom-control-label text-warning\">Warning</label>\n        </div>\n        <div class=\"custom-control custom-radio custom-control-inline font-weight-bold\">\n          <input type=\"radio\" value=\"danger\" name=\"color\" id=\"danger\" class=\"custom-control-input\" formControlName=\"color\">\n          <label for=\"danger\" class=\"custom-control-label text-danger\">Danger</label>\n        </div>\n        <div class=\"custom-control custom-radio custom-control-inline font-weight-bold\">\n          <input type=\"radio\" value=\"primary\" name=\"color\" id=\"primary\" class=\"custom-control-input\" formControlName=\"color\">\n          <label for=\"primary\" class=\"custom-control-label text-primary\">Primary</label>\n        </div>\n        <div class=\"custom-control custom-radio custom-control-inline font-weight-bold\">\n          <input type=\"radio\" value=\"secondary\" name=\"color\" id=\"secondary\" class=\"custom-control-input\" formControlName=\"color\">\n          <label for=\"secondary\" class=\"custom-control-label text-secondary\">Secondary</label>\n        </div>\n      </div>\n    </form>\n  </div>\n  <div *ngIf=\"mode === 'edit' && this.editable\" class=\"modal-footer\">\n    <button type=\"button\" mdbBtn color=\"danger\" class=\"waves-light\" aria-label=\"Close\" (click)=\"onDelete()\" mdbWavesEffect>{{ cancelBtn }}</button>\n    <button type=\"button\" mdbBtn color=\"primary\" class=\"relative waves-light\" mdbWavesEffect (click)=\"onSave()\">{{ actionBtn }}</button>\n  </div>\n  <div *ngIf=\"mode === 'add'\" class=\"modal-footer\">\n    <button type=\"button\" mdbBtn color=\"secondary\" class=\"waves-light\" aria-label=\"Close\" (click)=\"modalRef.hide()\" mdbWavesEffect>{{ cancelBtn }}</button>\n    <button type=\"button\" mdbBtn color=\"primary\" class=\"relative waves-light\" mdbWavesEffect (click)=\"onSave()\">{{ actionBtn }}</button>\n  </div>\n</div>",
                styles: [""]
            }),
            __metadata("design:paramtypes", [angularBootstrapMd.MDBModalRef])
        ], EventModalComponent);
        return EventModalComponent;
    }());

    var CalendarView;
    (function (CalendarView) {
        CalendarView["month"] = "month";
        CalendarView["week"] = "week";
        CalendarView["list"] = "list";
    })(CalendarView || (CalendarView = {}));

    var MdbCalendarComponent = /** @class */ (function () {
        function MdbCalendarComponent(modalService) {
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
            this.eventDeleted = new core.EventEmitter();
            this.eventEdited = new core.EventEmitter();
            this.eventAdded = new core.EventEmitter();
            this.monthChanged = new core.EventEmitter();
            this.weekChanged = new core.EventEmitter();
            this.listChanged = new core.EventEmitter();
            this.MS_IN_DAY = 24 * 60 * 60 * 1000;
            this.view = CalendarView;
            this.currentView = this.view.month;
        }
        MdbCalendarComponent.prototype.ngOnInit = function () {
            this.calendarOptions = this.options ? Object.assign(this.calendarOptions, this.options) : this.calendarOptions;
            this._changeDaysOrder();
            if (this.defaultView) {
                this.onViewChange(this.defaultView);
            }
        };
        MdbCalendarComponent.prototype._changeDaysOrder = function () {
            var dayIndex = this.weekDayIndex = this.weekDaysDefault.indexOf(this.calendarOptions.firstDayOfWeek);
            if (dayIndex !== -1) {
                var index = dayIndex;
                for (var i = 0; i < this.weekDays.length; i++) {
                    this.dayLabels.push(this.weekDays[index]);
                    this.dayLabelsShort.push(this.weekDaysShort[index]);
                    index = this.weekDaysDefault[index] === 'Saturday' ? 0 : index + 1;
                }
            }
        };
        MdbCalendarComponent.prototype.getFormattedEvent = function (event) {
            return {
                id: event.id,
                name: event.name,
                startDate: dateFns.format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
                endDate: dateFns.format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
                color: event.color
            };
        };
        MdbCalendarComponent.prototype.formatDate = function (date) {
            var year = dateFns.getYear(date);
            var month = dateFns.getMonth(date);
            var day = dateFns.getDate(date);
        };
        MdbCalendarComponent.prototype.onDayClick = function (day) {
            if (this.editable) {
                this.openAddModal(day);
            }
        };
        MdbCalendarComponent.prototype.onEventClick = function (event) {
            this.openEditModal(event);
        };
        MdbCalendarComponent.prototype.onViewChange = function (view) {
            this.currentView = this.view[view];
        };
        MdbCalendarComponent.prototype.onMonthChange = function (event) {
            this.monthChanged.emit(event);
        };
        MdbCalendarComponent.prototype.onWeekChange = function (event) {
            this.weekChanged.emit(event);
        };
        MdbCalendarComponent.prototype.onListChange = function (event) {
            this.listChanged.emit(event);
        };
        MdbCalendarComponent.prototype.openAddModal = function (event) {
            var _this = this;
            var data = {
                title: this.calendarOptions.eventAddTitle,
                actionBtn: this.calendarOptions.eventAddBtnTxt,
                cancelBtn: this.calendarOptions.eventCancelBtnTxt,
                mode: 'add',
                editable: this.editable,
                event: this.getFormattedEvent(event)
            };
            this.modalRef = this.modalService.show(EventModalComponent, { data: data });
            this.modalRef.content.eventData
                .pipe(operators.take(1))
                .subscribe(function (newEvent) {
                _this.eventAdded.emit(newEvent);
            });
        };
        MdbCalendarComponent.prototype.openEditModal = function (event) {
            var _this = this;
            var data = {
                title: this.calendarOptions.eventEditTitle,
                actionBtn: this.calendarOptions.eventEditBtnTxt,
                cancelBtn: this.calendarOptions.eventDeleteBtnTxt,
                mode: 'edit',
                editable: this.editable,
                event: event
            };
            this.modalRef = this.modalService.show(EventModalComponent, { data: data });
            this.modalRef.content.eventData
                .pipe(operators.take(1))
                .subscribe(function (editedEvent) {
                _this.eventEdited.emit(editedEvent);
            });
            this.modalRef.content.eventDeleted
                .pipe(operators.take(1))
                .subscribe(function (deletedEvent) {
                _this.eventDeleted.emit(deletedEvent);
            });
        };
        MdbCalendarComponent.ctorParameters = function () { return [
            { type: angularBootstrapMd.MDBModalService }
        ]; };
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarComponent.prototype, "events", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "options", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "editable", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarComponent.prototype, "weekDays", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarComponent.prototype, "weekDaysShort", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarComponent.prototype, "months", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarComponent.prototype, "monthsShort", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", String)
        ], MdbCalendarComponent.prototype, "defaultView", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "eventDeleted", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "eventEdited", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "eventAdded", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "monthChanged", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "weekChanged", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarComponent.prototype, "listChanged", void 0);
        MdbCalendarComponent = __decorate([
            core.Component({
                selector: 'mdb-calendar',
                template: "<div class=\"mdb-calendar\" [ngSwitch]=\"currentView\">\n  <mdb-calendar-month-view\n    *ngSwitchCase=\"view.month\"\n    [events]=\"events\"\n    [options]=\"calendarOptions\"\n    [weekDaysShort]=\"dayLabelsShort\"\n    [weekDayIndex]=\"weekDayIndex\"\n    [months]=\"months\"\n    (dayClicked)=\"onDayClick($event)\"\n    (eventClicked)=\"onEventClick($event)\"\n    (viewChanged)=\"onViewChange($event)\"\n    (monthChanged)=\"onMonthChange($event)\">\n  </mdb-calendar-month-view>\n\n  <mdb-calendar-week-view\n    *ngSwitchCase=\"view.week\"\n    [events]=\"events\"\n    [options]=\"calendarOptions\"\n    [weekDaysShort]=\"weekDaysShort\"\n    [weekDayIndex]=\"weekDayIndex\"\n    [monthsShort]=\"monthsShort\"\n    (dateClicked)=\"onDayClick($event)\"\n    (eventClicked)=\"onEventClick($event)\"\n    (viewChanged)=\"onViewChange($event)\"\n    (weekChanged)=\"onWeekChange($event)\">\n  </mdb-calendar-week-view>\n\n  <mdb-calendar-list-view\n    *ngSwitchCase=\"view.list\"\n    [events]=\"events\"\n    [options]=\"calendarOptions\"\n    [weekDayIndex]=\"weekDayIndex\"\n    [monthsShort]=\"monthsShort\"\n    (eventClicked)=\"onEventClick($event)\"\n    (viewChanged)=\"onViewChange($event)\"\n    (listChanged)=\"onListChange($event)\">\n  </mdb-calendar-list-view>\n</div>\n\n",
                styles: [""]
            }),
            __metadata("design:paramtypes", [angularBootstrapMd.MDBModalService])
        ], MdbCalendarComponent);
        return MdbCalendarComponent;
    }());

    var MS_IN_DAY = 24 * 60 * 60 * 1000;
    var MS_IN_HOUR = 60 * 60 * 1000;
    function getPeriodEvents(events, start, end) {
        return events.filter(function (event) {
            if (event.startDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.endDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.startDate <= start && event.endDate >= end) {
                return true;
            }
            return false;
        });
    }
    function getMonthDayEvents(events, start, end) {
        return events
            .filter(function (event) {
            if (event.startDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.endDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.startDate <= start && event.endDate >= end) {
                return true;
            }
            return false;
        })
            .map(function (event) {
            return __assign(__assign({}, event), { startStr: dateFns.format(event.startDate, 'YYYY-MM-DDTHH:mm:ss'), endStr: dateFns.format(event.endDate, 'YYYY-MM-DDTHH:mm:ss'), eventStart: event.startDate >= start, eventEnd: event.endDate <= end, longEvent: event.endDate.getTime() - event.startDate.getTime() >= MS_IN_DAY });
        });
    }
    function getListViewEvents(events, start, end) {
        return events
            .filter(function (event) {
            if (event.startDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.endDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.startDate <= start && event.endDate >= end) {
                return true;
            }
            if (event.startDate >= start && event.startDate <= end) {
                return true;
            }
            return false;
        })
            .map(function (event) {
            return __assign(__assign({}, event), { startStr: dateFns.format(event.startDate, 'YYYY-MM-DDTHH:mm:ss'), endStr: dateFns.format(event.endDate, 'YYYY-MM-DDTHH:mm:ss'), start: {
                    date: dateFns.format(event.startDate, 'DD/MM/YYYY'),
                    time: dateFns.format(event.startDate, 'h:mm:ss A')
                }, end: {
                    date: dateFns.format(event.endDate, 'DD/MM/YYYY'),
                    time: dateFns.format(event.endDate, 'h:mm:ss A')
                } });
        });
    }
    function getWeekDayEvents(events, start, end, dayStart, dayEnd) {
        return events
            .filter(function (event) {
            if (event.startDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.endDate >= start && event.endDate <= end) {
                return true;
            }
            if (event.startDate <= start && event.endDate >= end) {
                return true;
            }
            return false;
        })
            .map(function (event) {
            return __assign(__assign({}, event), { startStr: dateFns.format(event.startDate, 'YYYY-MM-DDTHH:mm:ss'), endStr: dateFns.format(event.endDate, 'YYYY-MM-DDTHH:mm:ss'), allDay: event.startDate <= dayStart && event.endDate.getTime() >= dayEnd.getTime() - 999 });
        });
    }
    function getWeekHourEvents(events, start, end, dayStart, dayEnd) {
        return getWeekDayEvents(events, start, end, dayStart, dayEnd)
            .filter(function (event) { return !event.allDay; })
            .map(function (event) {
            return __assign(__assign({}, event), { eventStart: event.startDate >= start, eventEnd: event.endDate <= end, longEvent: event.endDate.getTime() - event.startDate.getTime() >= MS_IN_HOUR });
        });
    }
    function getWeekAllDayEvents(events, start, end, dayStart, dayEnd) {
        return getWeekDayEvents(events, start, end, dayStart, dayEnd)
            .filter(function (event) { return event.allDay; })
            .map(function (event) {
            return __assign(__assign({}, event), { eventStart: event.startDate >= dayStart, eventEnd: event.endDate <= dayEnd, longEvent: event.endDate.getTime() - event.startDate.getTime() >= MS_IN_DAY });
        });
    }

    var MdbCalendarWeekViewComponent = /** @class */ (function () {
        function MdbCalendarWeekViewComponent(renderer) {
            this.renderer = renderer;
            this.weekDaysShort = [];
            this.monthsShort = [];
            this.weekDayIndex = 0;
            this.dateClicked = new core.EventEmitter();
            this.eventClicked = new core.EventEmitter();
            this.viewChanged = new core.EventEmitter();
            this.weekChanged = new core.EventEmitter();
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
            var initDay = this.initDay = dateFns.startOfWeek(dateFns.startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
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
            this.initDay = dateFns.subDays(this.initDay, 7);
            this.weekView = this.createWeekView(this.initDay);
            this.weekChanged.emit({
                startDate: this.startDate,
                endDate: this.endDate
            });
        };
        MdbCalendarWeekViewComponent.prototype.next = function () {
            this.initDay = dateFns.addDays(this.initDay, 7);
            this.weekView = this.createWeekView(this.initDay);
            this.weekChanged.emit({
                startDate: this.initDay,
                endDate: this.endDate
            });
        };
        MdbCalendarWeekViewComponent.prototype.goToToday = function () {
            this.initDay = dateFns.startOfWeek(dateFns.startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
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
                startDate: dateFns.format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
                endDate: dateFns.format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
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
            var lastDay = dateFns.addDays(firstDay, 6);
            this.startDate = firstDay;
            this.endDate = lastDay;
            var period = {
                start: dateFns.getDate(firstDay) + " " + this.monthsShort[dateFns.getMonth(firstDay)] + ", " + dateFns.getYear(firstDay),
                end: dateFns.getDate(lastDay) + " " + this.monthsShort[dateFns.getMonth(lastDay)] + ", " + dateFns.getYear(lastDay)
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
                    date = dateFns.addDays(firstDay, j);
                    month = dateFns.getMonth(date) + 1;
                    year = dateFns.getYear(date);
                    day = this.weekDaysShort[dateFns.getDay(date)];
                    dayNumber = dateFns.getDate(date);
                    startDate = dateFns.addHours(dateFns.startOfDay(date), i);
                    endDate = dateFns.addMinutes(startDate, 59.99);
                    dayStart = dateFns.startOfDay(date);
                    dayEnd = dateFns.endOfDay(date);
                    row.push({
                        startDate: startDate,
                        endDate: endDate,
                        isToday: dateFns.isToday(date),
                        isWeekend: dateFns.isWeekend(date),
                        events: getWeekHourEvents(this.events, startDate, endDate, dayStart, dayEnd)
                    });
                    if (i === 1) {
                        allDayRow.push({
                            startDate: dayStart,
                            endDate: dayEnd,
                            isToday: dateFns.isToday(date),
                            isWeekend: dateFns.isWeekend(date),
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
            { type: core.Renderer2 }
        ]; };
        __decorate([
            core.ViewChildren('dayEl'),
            __metadata("design:type", core.QueryList)
        ], MdbCalendarWeekViewComponent.prototype, "days", void 0);
        __decorate([
            core.ViewChildren('fullDayEl'),
            __metadata("design:type", core.QueryList)
        ], MdbCalendarWeekViewComponent.prototype, "fullDays", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array),
            __metadata("design:paramtypes", [Array])
        ], MdbCalendarWeekViewComponent.prototype, "events", null);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarWeekViewComponent.prototype, "weekDaysShort", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarWeekViewComponent.prototype, "monthsShort", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarWeekViewComponent.prototype, "weekDayIndex", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarWeekViewComponent.prototype, "options", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarWeekViewComponent.prototype, "dateClicked", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarWeekViewComponent.prototype, "eventClicked", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarWeekViewComponent.prototype, "viewChanged", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarWeekViewComponent.prototype, "weekChanged", void 0);
        MdbCalendarWeekViewComponent = __decorate([
            core.Component({
                selector: 'mdb-calendar-week-view',
                template: "<div class=\"mdb-week-view\">\n  <div class=\"d-flex justify-content-between mb-3\">\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"previous()\">\n        <mdb-icon fas icon=\"chevron-left\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"next()\">\n        <mdb-icon fas icon=\"chevron-right\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"goToToday()\">{{ options.todayBtnTxt }}</button>\n    </div>\n    <h2>{{ weekView.period.start }} - {{ weekView.period.end }}</h2>\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('month')\">{{ options.monthViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('week')\">{{ options.weekViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('list')\">{{ options.listViewBtnTxt }}</button>\n    </div>\n  </div>\n\n  <table>\n    <thead>\n      <th></th>\n      <th\n        *ngFor=\"let day of weekView.allDayRow; trackBy: trackByFn\"\n        [ngClass]=\"{'light-blue lighten-5': day.isToday, 'rgba-mdb-color-slight': day.isWeekend && !day.isToday }\">\n        {{ day.day }} {{ day.month }}/{{ day.dayNumber }}\n      </th>\n    </thead>\n\n    <tbody>\n      <tr>\n        <th>All day</th>\n        <td\n          #fullDayEl\n          *ngFor=\"let day of weekView.allDayRow; trackBy: trackByFn\"\n          [ngClass]=\"{'mdb-today-cell': day.isToday, 'rgba-mdb-color-slight': day.isWeekend && !day.isToday }\"\n          (click)=\"onDateClick(day)\"\n          (mousedown)=\"fullDayMouseDown($event, day)\"\n          (mouseup)=\"fullDayMouseUp($event, day)\"\n          (mouseenter)=\"fullDayMouseMove($event)\">\n          <div\n            class=\"mdb-event mdb-event-long text-white small px-1 bg-{{ event.color }}\"\n            [ngClass]=\"{\n              'mdb-event-long': event.longEvent && !event.eventStart && !event.eventEnd,\n              'mdb-event-start': event.longEvent && event.eventStart,\n              'mdb-event-end': event.longEvent && event.eventEnd,\n              'mdb-event-single': !event.longEvent\n              }\"\n            mdbTooltip=\"{{ event.name }}\"\n            placement=\"top\"\n            *ngFor=\"let event of day.events\" (click)=\"onEventClick(event); $event.stopPropagation()\">\n            <span>{{ event.name }}</span>\n          </div>\n        </td>\n      </tr>\n      <tr #dayEl *ngFor=\"let row of weekView.weekRows; let index = index; trackBy: trackByFn\">\n        <th>{{ index }}:00</th>\n        <td\n          (mousedown)=\"onMouseDown($event, date)\"\n          (mouseup)=\"onMouseUp($event, date)\"\n          (mouseenter)=\"onMouseMove($event)\"\n          *ngFor=\"let date of row.row; trackBy: trackByFn\" (click)=\"onDateClick(date)\" [ngClass]=\"{'mdb-today-cell': date.isToday, 'rgba-mdb-color-slight': date.isWeekend && !date.isToday }\">\n          <div\n            class=\"mdb-event text-white small px-1 bg-{{ event.color }}\"\n            *ngFor=\"let event of date.events; trackBy: trackByFn\"\n            (click)=\"onEventClick(event); $event.stopPropagation()\"\n            mdbTooltip=\"{{ event.name }}\"\n            placement=\"top\"\n            [ngClass]=\"{\n              'mdb-vertical-event-long': event.longEvent && !event.eventStart && !event.eventEnd,\n              'mdb-vertical-event-start': event.longEvent && event.eventStart,\n              'mdb-vertical-event-end': event.longEvent && event.eventEnd,\n              'mdb-vertical-single-event': !event.longEvent\n              }\">\n            <span>{{ event.name }}</span>\n          </div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n\n</div>\n",
                styles: [".mdb-today-cell{background-color:#e1f5fe}.mdb-week-view{width:100%;height:100%;margin-bottom:50px}.mdb-week-view table{table-layout:fixed;width:100%}.mdb-week-view table th{text-align:center!important;height:30px;font-weight:700;border:1px solid #ddd;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdb-week-view table td{vertical-align:top;cursor:pointer;border:1px solid #ddd;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdb-vertical-single-event{margin:2px 1px;float:left;width:17px;height:84px}.mdb-vertical-event-start{margin:2px 1px -2px;float:left;width:17px;height:88px}.mdb-vertical-event-start span,.mdb-vertical-single-event span{display:block;transform:rotate(90deg);white-space:nowrap}.mdb-vertical-event-end{margin:-2px 1px 2px;float:left;width:17px;height:88px;text-indent:-9999px}.mdb-vertical-event-long{margin:-2px 1px;float:left;width:17px;height:92px;text-indent:-9999px}.mdb-event{cursor:pointer;font-weight:700;text-align:left!important}.mdb-event-start{margin:1px -2px 1px 2px}.mdb-event-end{margin:1px 2px 1px -2px;text-indent:-9999px}.mdb-event-long{margin:1px -2px;text-indent:-9999px}.mdb-event-single{margin:1px 2px}"]
            }),
            __metadata("design:paramtypes", [core.Renderer2])
        ], MdbCalendarWeekViewComponent);
        return MdbCalendarWeekViewComponent;
    }());

    var MdbCalendarMonthViewComponent = /** @class */ (function () {
        function MdbCalendarMonthViewComponent(renderer) {
            this.renderer = renderer;
            this.weekDayIndex = 0;
            this.dayClicked = new core.EventEmitter();
            this.eventClicked = new core.EventEmitter();
            this.viewChanged = new core.EventEmitter();
            this.monthChanged = new core.EventEmitter();
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
                startDate: dateFns.format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
                endDate: dateFns.format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
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
                return dateFns.getDaysInMonth(new Date(year - 1, 11));
            }
            return dateFns.getDaysInMonth(new Date(year, month));
        };
        MdbCalendarMonthViewComponent.prototype.createMonthView = function (year, month) {
            this.selectedMonth = month;
            this.selectedYear = year;
            var daysInMonth = dateFns.getDaysInMonth(new Date(year, month));
            var daysInPreviousMonth = this.getDaysInPreviousMonth(year, month - 1);
            var firstDay = dateFns.startOfWeek(new Date(year, month), { weekStartsOn: this.weekDayIndex });
            var firstVisibleDay = dateFns.getDate(firstDay);
            var dayStart;
            var dayEnd;
            var dates = [];
            var dayNumber = 1;
            var monthNumber = month;
            for (var i = 1; i < 7; i++) {
                var week = [];
                if (i === 1 && firstVisibleDay !== 1) {
                    for (var j = firstVisibleDay; j <= daysInPreviousMonth; j++) {
                        dayStart = dateFns.startOfDay(new Date(year, month - 1, j));
                        dayEnd = dateFns.endOfDay(new Date(year, month - 1, j));
                        week.push({
                            dayNumber: j,
                            isToday: false,
                            isWeekend: dateFns.isWeekend(new Date(year, month - 1, j)),
                            month: month - 1,
                            startOfDay: dateFns.startOfDay(new Date(year, month - 1, j)),
                            endOfDay: dateFns.endOfDay(new Date(year, month - 1, j)),
                            events: getMonthDayEvents(this.events, dayStart, dayEnd)
                        });
                    }
                    var daysLeft = 7 - week.length;
                    for (var j = 0; j < daysLeft; j++) {
                        dayStart = dateFns.startOfDay(new Date(year, month, dayNumber));
                        dayEnd = dateFns.endOfDay(new Date(year, month, dayNumber));
                        week.push({
                            dayNumber: dayNumber,
                            isToday: dateFns.isToday(new Date(year, month, dayNumber)),
                            isWeekend: dateFns.isWeekend(new Date(year, month, dayNumber)),
                            month: month,
                            startOfDay: dateFns.startOfDay(new Date(year, month, dayNumber)),
                            endOfDay: dateFns.endOfDay(new Date(year, month, dayNumber)),
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
                        dayStart = dateFns.startOfDay(new Date(year, monthNumber, dayNumber));
                        dayEnd = dateFns.endOfDay(new Date(year, monthNumber, dayNumber));
                        week.push({
                            dayNumber: dayNumber,
                            isToday: dateFns.isToday(new Date(year, monthNumber, dayNumber)),
                            isWeekend: dateFns.isWeekend(new Date(year, monthNumber, dayNumber)),
                            month: monthNumber,
                            startOfDay: dateFns.startOfDay(new Date(year, monthNumber, dayNumber)),
                            endOfDay: dateFns.endOfDay(new Date(year, monthNumber, dayNumber)),
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
            { type: core.Renderer2 }
        ]; };
        __decorate([
            core.ViewChildren('dayEl'),
            __metadata("design:type", core.QueryList)
        ], MdbCalendarMonthViewComponent.prototype, "days", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array),
            __metadata("design:paramtypes", [Array])
        ], MdbCalendarMonthViewComponent.prototype, "events", null);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarMonthViewComponent.prototype, "weekDaysShort", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarMonthViewComponent.prototype, "months", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarMonthViewComponent.prototype, "weekDayIndex", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarMonthViewComponent.prototype, "options", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarMonthViewComponent.prototype, "dayClicked", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarMonthViewComponent.prototype, "eventClicked", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarMonthViewComponent.prototype, "viewChanged", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarMonthViewComponent.prototype, "monthChanged", void 0);
        MdbCalendarMonthViewComponent = __decorate([
            core.Component({
                selector: 'mdb-calendar-month-view',
                template: "<div class=\"mdb-month-view\">\n  <div class=\"d-flex justify-content-between mb-3\">\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"previous()\">\n        <mdb-icon fas icon=\"chevron-left\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"next()\">\n        <mdb-icon fas icon=\"chevron-right\"></mdb-icon>\n      </button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"goToToday()\">{{ options.todayBtnTxt }}</button>\n    </div>\n    <h2>{{ months[selectedMonth]}} {{ selectedYear }}</h2>\n    <div class=\"btn-group btn-group-sm\" role=\"group\">\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('month')\">{{ options.monthViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('week')\">{{ options.weekViewBtnTxt }}</button>\n      <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('list')\">{{ options.listViewBtnTxt }}</button>\n    </div>\n  </div>\n  <table>\n    <thead>\n      <th *ngFor=\"let day of weekDaysShort; trackBy: trackByFn\">{{ day }}</th>\n    </thead>\n\n    <tbody>\n      <tr *ngFor=\"let week of dates; trackBy: trackByFn\">\n        <td #dayEl *ngFor=\"let day of week.week; trackBy: trackByFn\" [ngClass]=\"{'mdb-today-cell': day.isToday, 'rgba-mdb-color-slight': day.isWeekend && !day.isToday }\"\n          (click)=\"onDayClick(day)\" (mousedown)=\"onMouseDown($event, day)\" (mouseup)=\"onMouseUp($event, day)\" (mouseenter)=\"onMouseMove($event)\">\n          <span class=\"mdb-day-field\" [ngClass]=\"{'text-light': day.month !== selectedMonth}\">{{ day.dayNumber }}</span>\n          <div\n            class=\"mdb-event mdb-event-long text-white small px-1 bg-{{ event.color }}\"\n            [ngClass]=\"{\n              'mdb-event-long': event.longEvent && !event.eventStart && !event.eventEnd,\n              'mdb-event-start': event.longEvent && event.eventStart,\n              'mdb-event-end': event.longEvent && event.eventEnd,\n              'mdb-event-single': !event.longEvent\n              }\"\n            mdbTooltip=\"{{ event.name }}\"\n            placement=\"top\"\n            *ngFor=\"let event of day.events; trackBy: trackByEvent\" (click)=\"onEventClick(event); $event.stopPropagation()\">\n            <span>{{ event.name }}</span>\n          </div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n",
                styles: [".mdb-today-cell{background-color:#e1f5fe}.mdb-month-view table{table-layout:fixed;width:100%}.mdb-month-view table th{text-align:center!important;height:30px;font-weight:700;border:1px solid #ddd}.mdb-month-view table td{height:12vh;padding-top:25px;vertical-align:top;position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid #ddd}.mdb-month-view table td:hover{background-color:rgba(69,82,110,.05)!important}.mdb-day-field{position:absolute;right:8px;top:5px}.mdb-event{cursor:pointer;font-weight:700;text-align:left!important}.mdb-event-start{margin:1px -2px 1px 2px}.mdb-event-end{margin:1px 2px 1px -2px;text-indent:-9999px}.mdb-event-long{margin:1px -2px;text-indent:-9999px}.mdb-event-single{margin:1px 2px}"]
            }),
            __metadata("design:paramtypes", [core.Renderer2])
        ], MdbCalendarMonthViewComponent);
        return MdbCalendarMonthViewComponent;
    }());

    var MdbCalendarListViewComponent = /** @class */ (function () {
        function MdbCalendarListViewComponent() {
            this.monthsShort = [];
            this.weekDayIndex = 0;
            this.viewChanged = new core.EventEmitter();
            this.eventClicked = new core.EventEmitter();
            this.listChanged = new core.EventEmitter();
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
            var initDay = this.initDay = dateFns.startOfWeek(dateFns.startOfDay(new Date()), { weekStartsOn: this.weekDayIndex });
            this.listView = this.createListView(this.initDay);
        };
        MdbCalendarListViewComponent.prototype.previous = function () {
            this.initDay = dateFns.subDays(this.initDay, 7);
            this.listView = this.createListView(this.initDay);
            this.listChanged.emit({
                startDate: this.startDate,
                endDate: this.endDate
            });
        };
        MdbCalendarListViewComponent.prototype.next = function () {
            this.initDay = dateFns.addDays(this.initDay, 7);
            this.listView = this.createListView(this.initDay);
            this.listChanged.emit({
                startDate: this.startDate,
                endDate: this.endDate
            });
        };
        MdbCalendarListViewComponent.prototype.goToToday = function () {
            this.initDay = dateFns.startOfWeek(dateFns.startOfDay(new Date()));
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
                startDate: dateFns.format(event.startDate, 'YYYY-MM-DD, HH:mm:ss'),
                endDate: dateFns.format(event.endDate, 'YYYY-MM-DD, HH:mm:ss'),
                color: event.color
            };
            this.eventClicked.emit(eventCopy);
        };
        MdbCalendarListViewComponent.prototype.createListView = function (date) {
            var firstDay = date;
            var lastDay = dateFns.endOfDay(dateFns.addDays(firstDay, 6));
            var period = {
                start: dateFns.getDate(firstDay) + " " + this.monthsShort[dateFns.getMonth(firstDay)] + ", " + dateFns.getYear(firstDay),
                end: dateFns.getDate(lastDay) + " " + this.monthsShort[dateFns.getMonth(lastDay)] + ", " + dateFns.getYear(lastDay)
            };
            this.startDate = firstDay;
            this.endDate = lastDay;
            var eventsInPeriod = getListViewEvents(this.events, firstDay, lastDay);
            return { eventsInPeriod: eventsInPeriod, period: period };
        };
        __decorate([
            core.Input(),
            __metadata("design:type", Array),
            __metadata("design:paramtypes", [Array])
        ], MdbCalendarListViewComponent.prototype, "events", null);
        __decorate([
            core.Input(),
            __metadata("design:type", Array)
        ], MdbCalendarListViewComponent.prototype, "monthsShort", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarListViewComponent.prototype, "options", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], MdbCalendarListViewComponent.prototype, "weekDayIndex", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarListViewComponent.prototype, "viewChanged", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarListViewComponent.prototype, "eventClicked", void 0);
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], MdbCalendarListViewComponent.prototype, "listChanged", void 0);
        MdbCalendarListViewComponent = __decorate([
            core.Component({
                selector: 'mdb-calendar-list-view',
                template: "<div class=\"mdb-list-view\">\n  <div class=\"mdb-week-view\">\n    <div class=\"d-flex justify-content-between mb-3\">\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"previous()\">\n          <mdb-icon fas icon=\"chevron-left\"></mdb-icon>\n        </button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"next()\">\n          <mdb-icon fas icon=\"chevron-right\"></mdb-icon>\n        </button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"goToToday()\">{{ options.todayBtnTxt }}</button>\n      </div>\n      <h2>{{ listView.period.start }} - {{ listView.period.end }}</h2>\n      <div class=\"btn-group btn-group-sm\" role=\"group\">\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('month')\">{{ options.monthViewBtnTxt }}</button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('week')\">{{ options.weekViewBtnTxt }}</button>\n        <button mdbBtn color=\"info\" outline=\"true\" class=\"px-4\" (click)=\"onViewChange('list')\">{{ options.listViewBtnTxt }}</button>\n      </div>\n    </div>\n\n    <table>\n      <tbody>\n        <ng-container *ngFor=\"let event of listView.eventsInPeriod; trackBy: trackByFn\">\n          <tr class=\"grey lighten-4\">\n            <th class=\"text-left font-weight-bold\"><mdb-icon fas icon=\"calendar-alt\"></mdb-icon> {{ event.start.date }} - {{ event.end.date }}</th>\n            <th class=\"font-weight-bold text-right\"><mdb-icon fas icon=\"clock\"></mdb-icon> {{ event.start.time }} - {{ event.end.time }}</th>\n          </tr>\n          <tr (click)=\"onEventClick(event)\">\n            <td class=\"text-left mdb-list-event\" colspan=\"2\"><mdb-icon fas icon=\"circle\" class=\"pr-1 text-{{ event.color }}\"></mdb-icon>{{ event.name }}</td>\n          </tr>\n        </ng-container>\n      </tbody>\n    </table>\n  </div>\n",
                styles: [".mdb-list-view{width:100%;height:100%;margin-bottom:50px}.mdb-list-view table{table-layout:fixed;width:100%;border:1px solid #ddd}.mdb-list-view table tr td,.mdb-list-view table tr th{padding:8px 10px;border-top:1px solid #ddd;border-bottom:1px solid #ddd}.mdb-list-event{cursor:pointer}.mdb-list-event:hover{background-color:rgba(69,82,110,.05)}"]
            }),
            __metadata("design:paramtypes", [])
        ], MdbCalendarListViewComponent);
        return MdbCalendarListViewComponent;
    }());

    var MdbCalendarModule = /** @class */ (function () {
        function MdbCalendarModule() {
        }
        MdbCalendarModule = __decorate([
            core.NgModule({
                declarations: [
                    MdbCalendarComponent,
                    EventModalComponent,
                    MdbCalendarWeekViewComponent,
                    MdbCalendarMonthViewComponent,
                    MdbCalendarListViewComponent
                ],
                imports: [
                    angularBootstrapMd.ButtonsModule,
                    angularBootstrapMd.InputsModule,
                    angularBootstrapMd.IconsModule,
                    angularBootstrapMd.ModalModule.forRoot(),
                    angularBootstrapMd.TooltipModule.forRoot(),
                    common.CommonModule,
                    forms.ReactiveFormsModule
                ],
                exports: [
                    MdbCalendarComponent,
                    MdbCalendarWeekViewComponent,
                    MdbCalendarMonthViewComponent,
                    MdbCalendarListViewComponent,
                    EventModalComponent
                ],
                entryComponents: [EventModalComponent]
            })
        ], MdbCalendarModule);
        return MdbCalendarModule;
    }());

    exports.MdbCalendarComponent = MdbCalendarComponent;
    exports.MdbCalendarModule = MdbCalendarModule;
    exports.ɵa = EventModalComponent;
    exports.ɵb = MdbCalendarWeekViewComponent;
    exports.ɵc = MdbCalendarMonthViewComponent;
    exports.ɵd = MdbCalendarListViewComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mdb-calendar.umd.js.map
