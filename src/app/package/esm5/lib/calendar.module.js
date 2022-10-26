import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { MdbCalendarComponent } from './components/calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { ButtonsModule, ModalModule, IconsModule, TooltipModule, InputsModule } from 'angular-bootstrap-md';
import { EventModalComponent } from './components/event-modal/event-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MdbCalendarWeekViewComponent } from './components/calendar-week-view/calendar-week-view.component';
import { MdbCalendarMonthViewComponent } from './components/calendar-month-view/calendar-month-view.component';
import { MdbCalendarListViewComponent } from './components/calendar-list-view/calendar-list-view.component';
var MdbCalendarModule = /** @class */ (function () {
    function MdbCalendarModule() {
    }
    MdbCalendarModule = __decorate([
        NgModule({
            declarations: [
                MdbCalendarComponent,
                EventModalComponent,
                MdbCalendarWeekViewComponent,
                MdbCalendarMonthViewComponent,
                MdbCalendarListViewComponent
            ],
            imports: [
                ButtonsModule,
                InputsModule,
                IconsModule,
                ModalModule.forRoot(),
                TooltipModule.forRoot(),
                CommonModule,
                ReactiveFormsModule
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
export { MdbCalendarModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbWRiLWNhbGVuZGFyLyIsInNvdXJjZXMiOlsibGliL2NhbGVuZGFyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUNoRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLGFBQWEsRUFDYixXQUFXLEVBQ1gsV0FBVyxFQUNYLGFBQWEsRUFDYixZQUFZLEVBQ2IsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNyRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUM1RyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUMvRyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQTRCNUc7SUFBQTtJQUFnQyxDQUFDO0lBQXBCLGlCQUFpQjtRQTFCN0IsUUFBUSxDQUFDO1lBQ1IsWUFBWSxFQUFFO2dCQUNaLG9CQUFvQjtnQkFDcEIsbUJBQW1CO2dCQUNuQiw0QkFBNEI7Z0JBQzVCLDZCQUE2QjtnQkFDN0IsNEJBQTRCO2FBQzdCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLGFBQWE7Z0JBQ2IsWUFBWTtnQkFDWixXQUFXO2dCQUNYLFdBQVcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3JCLGFBQWEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3ZCLFlBQVk7Z0JBQ1osbUJBQW1CO2FBQ3BCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLG9CQUFvQjtnQkFDcEIsNEJBQTRCO2dCQUM1Qiw2QkFBNkI7Z0JBQzdCLDRCQUE0QjtnQkFDNUIsbUJBQW1CO2FBQ3BCO1lBQ0QsZUFBZSxFQUFFLENBQUMsbUJBQW1CLENBQUM7U0FDdkMsQ0FBQztPQUNXLGlCQUFpQixDQUFHO0lBQUQsd0JBQUM7Q0FBQSxBQUFqQyxJQUFpQztTQUFwQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWRiQ2FsZW5kYXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXIvY2FsZW5kYXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBCdXR0b25zTW9kdWxlLFxuICBNb2RhbE1vZHVsZSxcbiAgSWNvbnNNb2R1bGUsXG4gIFRvb2x0aXBNb2R1bGUsXG4gIElucHV0c01vZHVsZVxufSBmcm9tICdhbmd1bGFyLWJvb3RzdHJhcC1tZCc7XG5pbXBvcnQgeyBFdmVudE1vZGFsQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2V2ZW50LW1vZGFsL2V2ZW50LW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWRiQ2FsZW5kYXJXZWVrVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jYWxlbmRhci13ZWVrLXZpZXcvY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNZGJDYWxlbmRhck1vbnRoVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jYWxlbmRhci1tb250aC12aWV3L2NhbGVuZGFyLW1vbnRoLXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IE1kYkNhbGVuZGFyTGlzdFZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY2FsZW5kYXItbGlzdC12aWV3L2NhbGVuZGFyLWxpc3Qtdmlldy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNZGJDYWxlbmRhckNvbXBvbmVudCxcbiAgICBFdmVudE1vZGFsQ29tcG9uZW50LFxuICAgIE1kYkNhbGVuZGFyV2Vla1ZpZXdDb21wb25lbnQsXG4gICAgTWRiQ2FsZW5kYXJNb250aFZpZXdDb21wb25lbnQsXG4gICAgTWRiQ2FsZW5kYXJMaXN0Vmlld0NvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQnV0dG9uc01vZHVsZSxcbiAgICBJbnB1dHNNb2R1bGUsXG4gICAgSWNvbnNNb2R1bGUsXG4gICAgTW9kYWxNb2R1bGUuZm9yUm9vdCgpLFxuICAgIFRvb2x0aXBNb2R1bGUuZm9yUm9vdCgpLFxuICAgIENvbW1vbk1vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBNZGJDYWxlbmRhckNvbXBvbmVudCxcbiAgICBNZGJDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50LFxuICAgIE1kYkNhbGVuZGFyTW9udGhWaWV3Q29tcG9uZW50LFxuICAgIE1kYkNhbGVuZGFyTGlzdFZpZXdDb21wb25lbnQsXG4gICAgRXZlbnRNb2RhbENvbXBvbmVudFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtFdmVudE1vZGFsQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBNZGJDYWxlbmRhck1vZHVsZSB7fVxuIl19