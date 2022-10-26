import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import moment from 'moment';

@Injectable({
   providedIn: 'root'
})

export class UtilityService {
   constructor(private http: HttpClient) { }

   toFix(val: any, dec: number) {
      if (Math.floor(val) === val) {
         return val
      } else {
         var res = val.toFixed(dec);
         return parseFloat(res);
      }
   }

   shortDate(dat) {
      let date = new Date(dat);
      let month = date.getMonth() + 1;
      var day = date.getDate();
      let mm = month.toString();
      let dd = day.toString();
      if (month < 10) {
         mm = '0' + mm;
      } else {
         mm = month.toString();
      }
      if (day < 10) {
         dd = '0' + dd;
      }
      return mm + '/' + dd + '/' + date.getFullYear();
   }

   stringDate(dat) {
      let date = new Date(dat);
      let month = date.getMonth() + 1;
      var day = date.getDate();
      let mm = month.toString();
      let dd = day.toString();
      if (month < 10) {
         mm = '0' + mm;
      } else {
         mm = month.toString();
      }
      if (day < 10) {
         dd = '0' + dd;
      }
      return date.getFullYear() + '-' + mm +'-'+ dd; 
   }

   lastMod(dat) {
      let datt = this.shortDate(dat);
      let tme = this.formatAMPM(dat);
      return datt +', '+tme;
   }

   chkYN(val: any) {
      if (val == true) {
         return "Yes";
      } else if (val == false) {
         return "No";
      }
   }

   formatAMPM(dt: any) { 
      let dat = new Date(dt);
      let hours = dat.getHours();
      let minutes = dat.getMinutes();
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      let minutes2 = minutes < 10 ? '0'+minutes : minutes;
      let strTime = hours + ':' + minutes2 + ' ' + ampm;
      return strTime;
   }
}
