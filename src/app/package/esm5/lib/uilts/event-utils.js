import { __assign } from "tslib";
import { format } from 'date-fns';
export var MS_IN_DAY = 24 * 60 * 60 * 1000;
export var MS_IN_HOUR = 60 * 60 * 1000;
export function getPeriodEvents(events, start, end) {
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
export function getMonthDayEvents(events, start, end) {
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
        return __assign(__assign({}, event), { startStr: format(event.startDate, 'YYYY-MM-DDTHH:mm:ss'), endStr: format(event.endDate, 'YYYY-MM-DDTHH:mm:ss'), eventStart: event.startDate >= start, eventEnd: event.endDate <= end, longEvent: event.endDate.getTime() - event.startDate.getTime() >= MS_IN_DAY });
    });
}
export function getListViewEvents(events, start, end) {
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
        return __assign(__assign({}, event), { startStr: format(event.startDate, 'YYYY-MM-DDTHH:mm:ss'), endStr: format(event.endDate, 'YYYY-MM-DDTHH:mm:ss'), start: {
                date: format(event.startDate, 'DD/MM/YYYY'),
                time: format(event.startDate, 'h:mm:ss A')
            }, end: {
                date: format(event.endDate, 'DD/MM/YYYY'),
                time: format(event.endDate, 'h:mm:ss A')
            } });
    });
}
export function getWeekDayEvents(events, start, end, dayStart, dayEnd) {
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
        return __assign(__assign({}, event), { startStr: format(event.startDate, 'YYYY-MM-DDTHH:mm:ss'), endStr: format(event.endDate, 'YYYY-MM-DDTHH:mm:ss'), allDay: event.startDate <= dayStart && event.endDate.getTime() >= dayEnd.getTime() - 999 });
    });
}
export function getWeekHourEvents(events, start, end, dayStart, dayEnd) {
    return getWeekDayEvents(events, start, end, dayStart, dayEnd)
        .filter(function (event) { return !event.allDay; })
        .map(function (event) {
        return __assign(__assign({}, event), { eventStart: event.startDate >= start, eventEnd: event.endDate <= end, longEvent: event.endDate.getTime() - event.startDate.getTime() >= MS_IN_HOUR });
    });
}
export function getWeekAllDayEvents(events, start, end, dayStart, dayEnd) {
    return getWeekDayEvents(events, start, end, dayStart, dayEnd)
        .filter(function (event) { return event.allDay; })
        .map(function (event) {
        return __assign(__assign({}, event), { eventStart: event.startDate >= dayStart, eventEnd: event.endDate <= dayEnd, longEvent: event.endDate.getTime() - event.startDate.getTime() >= MS_IN_DAY });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtdXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9tZGItY2FsZW5kYXIvIiwic291cmNlcyI6WyJsaWIvdWlsdHMvZXZlbnQtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbEMsTUFBTSxDQUFDLElBQU0sU0FBUyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUM3QyxNQUFNLENBQUMsSUFBTSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFekMsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUFXLEVBQUUsS0FBVyxFQUFFLEdBQVM7SUFDakUsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFFLFVBQUMsS0FBVTtRQUUvQixJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFO1lBQ2xELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUVmLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxNQUFXLEVBQUUsS0FBVyxFQUFFLEdBQVM7SUFDbkUsT0FBTyxNQUFNO1NBQ1osTUFBTSxDQUFFLFVBQUMsS0FBVTtRQUNsQixJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFO1lBQ2xELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksR0FBRyxFQUFFO1lBQ3BELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBRSxVQUFDLEtBQUs7UUFDViw2QkFDSyxLQUFLLEtBQ1IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLEVBQ3hELE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxFQUNwRCxVQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLEVBQ3BDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLEdBQUcsRUFDOUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxTQUFTLElBQzNFO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLE1BQVcsRUFBRSxLQUFXLEVBQUUsR0FBUztJQUNuRSxPQUFPLE1BQU07U0FDWixNQUFNLENBQUUsVUFBQyxLQUFVO1FBQ2xCLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxHQUFHLEVBQUU7WUFDcEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxHQUFHLEVBQUU7WUFDbEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxHQUFHLEVBQUU7WUFDcEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxHQUFHLEVBQUU7WUFDdEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO1NBQ0QsR0FBRyxDQUFFLFVBQUMsS0FBSztRQUNWLDZCQUNLLEtBQUssS0FDUixRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsRUFDeEQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLEVBQ3BELEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO2dCQUMzQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO2FBQzNDLEVBQ0QsR0FBRyxFQUFFO2dCQUNILElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7Z0JBQ3pDLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUM7YUFDekMsSUFDRDtJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUdELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxNQUFXLEVBQUUsS0FBVyxFQUFFLEdBQVMsRUFBRSxRQUFjLEVBQUUsTUFBWTtJQUNoRyxPQUFPLE1BQU07U0FDWixNQUFNLENBQUUsVUFBQyxLQUFVO1FBQ2xCLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxHQUFHLEVBQUU7WUFDcEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxHQUFHLEVBQUU7WUFDbEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxHQUFHLEVBQUU7WUFDcEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO1NBQ0QsR0FBRyxDQUFFLFVBQUMsS0FBSztRQUNWLDZCQUNLLEtBQUssS0FDUixRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUscUJBQXFCLENBQUMsRUFDeEQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLEVBQ3BELE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxJQUFJLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLElBQ3hGO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLGlCQUFpQixDQUFDLE1BQVcsRUFBRSxLQUFXLEVBQUUsR0FBUyxFQUFFLFFBQWMsRUFBRSxNQUFZO0lBQ2pHLE9BQU8sZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztTQUMxRCxNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQWIsQ0FBYSxDQUFDO1NBQzlCLEdBQUcsQ0FBRSxVQUFBLEtBQUs7UUFDVCw2QkFDSyxLQUFLLEtBQ1YsVUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxFQUNwQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sSUFBSSxHQUFHLEVBQzlCLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksVUFBVSxJQUMxRTtJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxNQUFXLEVBQUUsS0FBVyxFQUFFLEdBQVMsRUFBRSxRQUFjLEVBQUUsTUFBWTtJQUNuRyxPQUFPLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7U0FDMUQsTUFBTSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE1BQU0sRUFBWixDQUFZLENBQUM7U0FDN0IsR0FBRyxDQUFFLFVBQUEsS0FBSztRQUNULDZCQUNLLEtBQUssS0FDUixVQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxRQUFRLEVBQ3ZDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLE1BQU0sRUFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxTQUFTLElBQzNFO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAnZGF0ZS1mbnMnO1xuXG5leHBvcnQgY29uc3QgTVNfSU5fREFZID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbmV4cG9ydCBjb25zdCBNU19JTl9IT1VSID0gNjAgKiA2MCAqIDEwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQZXJpb2RFdmVudHMoZXZlbnRzOiBhbnksIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUpIHtcbiAgcmV0dXJuIGV2ZW50cy5maWx0ZXIoIChldmVudDogYW55KSA9PiB7XG5cbiAgICBpZiAoZXZlbnQuc3RhcnREYXRlID49IHN0YXJ0ICYmIGV2ZW50LmVuZERhdGUgPD0gZW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuZW5kRGF0ZSA+PSBzdGFydCAmJiBldmVudC5lbmREYXRlIDw9IGVuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LnN0YXJ0RGF0ZSA8PSBzdGFydCAmJiBldmVudC5lbmREYXRlID49IGVuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9udGhEYXlFdmVudHMoZXZlbnRzOiBhbnksIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUpIHtcbiAgcmV0dXJuIGV2ZW50c1xuICAuZmlsdGVyKCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGlmIChldmVudC5zdGFydERhdGUgPj0gc3RhcnQgJiYgZXZlbnQuZW5kRGF0ZSA8PSBlbmQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChldmVudC5lbmREYXRlID49IHN0YXJ0ICYmIGV2ZW50LmVuZERhdGUgPD0gZW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuc3RhcnREYXRlIDw9IHN0YXJ0ICYmIGV2ZW50LmVuZERhdGUgPj0gZW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pXG4gIC5tYXAoIChldmVudCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5ldmVudCxcbiAgICAgIHN0YXJ0U3RyOiBmb3JtYXQoZXZlbnQuc3RhcnREYXRlLCAnWVlZWS1NTS1ERFRISDptbTpzcycpLFxuICAgICAgZW5kU3RyOiBmb3JtYXQoZXZlbnQuZW5kRGF0ZSwgJ1lZWVktTU0tRERUSEg6bW06c3MnKSxcbiAgICAgIGV2ZW50U3RhcnQ6IGV2ZW50LnN0YXJ0RGF0ZSA+PSBzdGFydCxcbiAgICAgIGV2ZW50RW5kOiBldmVudC5lbmREYXRlIDw9IGVuZCxcbiAgICAgIGxvbmdFdmVudDogZXZlbnQuZW5kRGF0ZS5nZXRUaW1lKCkgLSBldmVudC5zdGFydERhdGUuZ2V0VGltZSgpID49IE1TX0lOX0RBWVxuICAgIH07XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlzdFZpZXdFdmVudHMoZXZlbnRzOiBhbnksIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUpIHtcbiAgcmV0dXJuIGV2ZW50c1xuICAuZmlsdGVyKCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGlmIChldmVudC5zdGFydERhdGUgPj0gc3RhcnQgJiYgZXZlbnQuZW5kRGF0ZSA8PSBlbmQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChldmVudC5lbmREYXRlID49IHN0YXJ0ICYmIGV2ZW50LmVuZERhdGUgPD0gZW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuc3RhcnREYXRlIDw9IHN0YXJ0ICYmIGV2ZW50LmVuZERhdGUgPj0gZW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuc3RhcnREYXRlID49IHN0YXJ0ICYmIGV2ZW50LnN0YXJ0RGF0ZSA8PSBlbmQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSlcbiAgLm1hcCggKGV2ZW50KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgc3RhcnRTdHI6IGZvcm1hdChldmVudC5zdGFydERhdGUsICdZWVlZLU1NLUREVEhIOm1tOnNzJyksXG4gICAgICBlbmRTdHI6IGZvcm1hdChldmVudC5lbmREYXRlLCAnWVlZWS1NTS1ERFRISDptbTpzcycpLFxuICAgICAgc3RhcnQ6IHtcbiAgICAgICAgZGF0ZTogZm9ybWF0KGV2ZW50LnN0YXJ0RGF0ZSwgJ0REL01NL1lZWVknKSxcbiAgICAgICAgdGltZTogZm9ybWF0KGV2ZW50LnN0YXJ0RGF0ZSwgJ2g6bW06c3MgQScpXG4gICAgICB9LFxuICAgICAgZW5kOiB7XG4gICAgICAgIGRhdGU6IGZvcm1hdChldmVudC5lbmREYXRlLCAnREQvTU0vWVlZWScpLFxuICAgICAgICB0aW1lOiBmb3JtYXQoZXZlbnQuZW5kRGF0ZSwgJ2g6bW06c3MgQScpXG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlZWtEYXlFdmVudHMoZXZlbnRzOiBhbnksIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsIGRheVN0YXJ0OiBEYXRlLCBkYXlFbmQ6IERhdGUpIHtcbiAgcmV0dXJuIGV2ZW50c1xuICAuZmlsdGVyKCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgIGlmIChldmVudC5zdGFydERhdGUgPj0gc3RhcnQgJiYgZXZlbnQuZW5kRGF0ZSA8PSBlbmQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChldmVudC5lbmREYXRlID49IHN0YXJ0ICYmIGV2ZW50LmVuZERhdGUgPD0gZW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuc3RhcnREYXRlIDw9IHN0YXJ0ICYmIGV2ZW50LmVuZERhdGUgPj0gZW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pXG4gIC5tYXAoIChldmVudCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5ldmVudCxcbiAgICAgIHN0YXJ0U3RyOiBmb3JtYXQoZXZlbnQuc3RhcnREYXRlLCAnWVlZWS1NTS1ERFRISDptbTpzcycpLFxuICAgICAgZW5kU3RyOiBmb3JtYXQoZXZlbnQuZW5kRGF0ZSwgJ1lZWVktTU0tRERUSEg6bW06c3MnKSxcbiAgICAgIGFsbERheTogZXZlbnQuc3RhcnREYXRlIDw9IGRheVN0YXJ0ICYmIGV2ZW50LmVuZERhdGUuZ2V0VGltZSgpID49IGRheUVuZC5nZXRUaW1lKCkgLSA5OTksXG4gICAgfTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRXZWVrSG91ckV2ZW50cyhldmVudHM6IGFueSwgc3RhcnQ6IERhdGUsIGVuZDogRGF0ZSwgZGF5U3RhcnQ6IERhdGUsIGRheUVuZDogRGF0ZSkge1xuICByZXR1cm4gZ2V0V2Vla0RheUV2ZW50cyhldmVudHMsIHN0YXJ0LCBlbmQsIGRheVN0YXJ0LCBkYXlFbmQpXG4gICAgLmZpbHRlcihldmVudCA9PiAhZXZlbnQuYWxsRGF5KVxuICAgIC5tYXAoIGV2ZW50ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmV2ZW50LFxuICAgICAgZXZlbnRTdGFydDogZXZlbnQuc3RhcnREYXRlID49IHN0YXJ0LFxuICAgICAgZXZlbnRFbmQ6IGV2ZW50LmVuZERhdGUgPD0gZW5kLFxuICAgICAgbG9uZ0V2ZW50OiBldmVudC5lbmREYXRlLmdldFRpbWUoKSAtIGV2ZW50LnN0YXJ0RGF0ZS5nZXRUaW1lKCkgPj0gTVNfSU5fSE9VUlxuICAgICAgfTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdlZWtBbGxEYXlFdmVudHMoZXZlbnRzOiBhbnksIHN0YXJ0OiBEYXRlLCBlbmQ6IERhdGUsIGRheVN0YXJ0OiBEYXRlLCBkYXlFbmQ6IERhdGUpIHtcbiAgcmV0dXJuIGdldFdlZWtEYXlFdmVudHMoZXZlbnRzLCBzdGFydCwgZW5kLCBkYXlTdGFydCwgZGF5RW5kKVxuICAgIC5maWx0ZXIoZXZlbnQgPT4gZXZlbnQuYWxsRGF5KVxuICAgIC5tYXAoIGV2ZW50ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmV2ZW50LFxuICAgICAgICBldmVudFN0YXJ0OiBldmVudC5zdGFydERhdGUgPj0gZGF5U3RhcnQsXG4gICAgICAgIGV2ZW50RW5kOiBldmVudC5lbmREYXRlIDw9IGRheUVuZCxcbiAgICAgICAgbG9uZ0V2ZW50OiBldmVudC5lbmREYXRlLmdldFRpbWUoKSAtIGV2ZW50LnN0YXJ0RGF0ZS5nZXRUaW1lKCkgPj0gTVNfSU5fREFZXG4gICAgICB9O1xuICAgIH0pO1xufVxuIl19