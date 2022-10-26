import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CalendarService{

  selectedClients:number[]=[];
  VenueID: number[] = [];
  EventStatusID: number[] = [];
  viewDate: Date = new Date();
  
  IsAppLoaded:boolean = false;

  selectedChipVenueName = ""; 
  selectedChipEventStatus = null;
  
  constructor() { }
}
