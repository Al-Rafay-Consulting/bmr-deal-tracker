
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from 'ng-uikit-pro-standard';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { ToastType } from 'src/app/Enum/ToastType';
import { NgForm } from '@angular/forms';
import moment from 'moment';
import { startOfDay, addHours, addMinutes } from 'date-fns/esm';
import { SpConfig } from './SpConfig';
import { SPOperationsService } from '../services/spoperations.service';
import { LoginUser } from './User/login-user';
import { GeneralService } from '../services/general.service';
import { SharePointConfigService } from './SharePoint/share-point-config.service';

@Injectable({
  providedIn: 'root'
})


export class CommonService {
  ToastType: any;
  hideGlobalSearch: boolean = false;

  constructor(
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,
    public spService: SPOperationsService,
    public genService: GeneralService,
    public spConfigService: SharePointConfigService
  ) {

  }

  ShowSpinner() {
    this.spinner.show();
  }

  HideSpinner() {
    this.spinner.hide();
  }

  ShowToast(message: string, toasttype: ToastType) {
    const options = { opacity: 1, positionClass: 'md-toast-top-center', progressBar: true, closeButton: true, timeOut: 1000 };
    const optionsOther = { opacity: 1, positionClass: 'md-toast-top-center', progressBar: true, closeButton: true, timeOut: 5000 };

    if (toasttype == ToastType.Success)
      this.toast.success(message, "Success", options);
    else if (toasttype == ToastType.Error)
      this.toast.error(message, "Error", optionsOther);
    else if (toasttype == ToastType.Info)
      this.toast.info(message, "Information", optionsOther);
    else if (toasttype == ToastType.Warning)
      this.toast.warning(message, "Warning", optionsOther);
  }

  FillNgFormByObject(obj: any, form: NgForm): NgForm {

    for (let key of Object.keys(obj)) {
      if (key === "@odata.context")
        continue;

      form.value[key] = obj[key];

    }

    console.log(form.value)
    return form;

  }

  ConvertStringToTime(val): string {
    var year = 2020;
    var month = 1;
    var day = 1;

    var timeSplit = String(val).split(':');
    if (timeSplit.length > 0) {
      var hour = parseInt(timeSplit[0])
      var min = parseInt(timeSplit[1])
      var reserv = new Date(year, month, day, hour, min)
      return moment(reserv).format("hh:mm A")
    }
  }


  ConvertStringToHhMm(date: Date, val: string): Date {
    var timeSplit = String(val).split(':');
    if (timeSplit.length > 0) {
      var hour = parseInt(timeSplit[0])
      var min = parseInt(timeSplit[1])
      //var new_Date = addMinutes(addHours(startOfDay(new Date(date)), hour), min)
      var new_Date = new Date(new Date(date).setHours(hour, min))
      return new_Date;
    }
  }

  IsNullOrUndefined(value: any): boolean {
    if (value == null || value == undefined)
      return true;

    return false;
  }

  async GetEventDocumentLink(IsUploadedFromOther: boolean, eventID: number, venueName: string, eventName: string, Linkurl: string) {
    //var Linkurl = "";
    if (IsUploadedFromOther == true) {


      var docSetPage = await this.spConfigService.getRecordByTitleAsync("EventDocumentsArchived");

      Linkurl += docSetPage[0].ListUrl + "?";
      Linkurl += String(docSetPage[0]["RootFolder"]).replace('{Event}', eventID + '-' + venueName);
      Linkurl += "&FolderCTID=" + docSetPage[0]['ContentTypeID0'];
      console.log(Linkurl);
    }
    else {

      this.spService.getEventFolderInfo("Event Documents", eventID).then(res => {
        const eventFolderNameInDocSet = res as any;
        console.log(eventFolderNameInDocSet);

        if (eventFolderNameInDocSet['d'].results.length > 0) {


          this.spConfigService.getRecordByTitleAsync("docsethomepage").then(res_docSetPage => {
            Linkurl += res_docSetPage[0].ListUrl + "?";
            Linkurl += "ID=" + eventFolderNameInDocSet['d'].results[0].ID;

            this.spConfigService.getRecordByTitleAsync("Documents").then(res_docSet => {
              Linkurl += "&FolderCTID=" + res_docSet[0]['ContentTypeID0'];
              Linkurl += "&List=" + res_docSet[0].ListGUID;
              Linkurl += String(res_docSet[0]["RootFolder"]).replace('{Event}', eventID + ' - ' + eventName);
              Linkurl += String(res_docSet[0]["RecSRC"]).replace('{Event}', eventID + ' - ' + eventName);;

              console.log(Linkurl);
            });

          });

        }
      });

    }

  }

  //Convert date in UTC time zone
  UTCTime(date) {
    //Create a date from the returned date/time field
    var itemsdatetime = new Date(date);
    //Get a time representation of that date in milliseconds 
    var localTime = itemsdatetime.getTime();
    //Get the regional time offset based on the REST call to /_api/Web/RegionalSettings/TimeZone
    //value is in minutes, must be converted to milliseconds
    var regionTimeoffset = (SpConfig.UTCBias + SpConfig.UTCDaylightBias) * 60000;
    //Get the local time offset based on the date object
    //value is in minutes, must be converted to milliseconds
    var localTimeoffset = itemsdatetime.getTimezoneOffset() * 60000;
    //Create a new date object in the target field
    var adjusteddate = new Date();
    //Set the value of that date object to the original item plus 2x the difference between the local time zone offset and the regional time zone offset
    adjusteddate.setTime(localTime + ((localTimeoffset - regionTimeoffset) * 2));
    //Create a new date object in the target field
    var utcdate = new Date();
    //Set the value of the date object to the original item plus the differen
    //Set the value of the date object to the original item plus the difference between the local time zone offset and the regional time zone offset.
    utcdate.setTime(localTime + (localTimeoffset - regionTimeoffset));
    return utcdate;
  }

  BLFormatDate(date: string): string {
    if (date != null) {
      //return date.replace('-','/');
      return date.split('-').join('/');
    }
    else
      return date;

  }

  public CheckIfUserhasAccess(moduleName: string) {
    return false;
    /*
    if (LoginUser.IsAdmin == true)
      return false;

    var mAccess = LoginUser.getModulesAccess.filter(function (x) {
      return x.ModuleName == moduleName && x.IsVisible == true
    })

    if (mAccess.length == 0)
      return true;

    return false;
    */
  }

  public CheckIfUserhasAccess_Section(sectionName: string) {

    return false;

    /*
    if (LoginUser.IsAdmin == true)
      return false;

    var mAccess = LoginUser.getSectionAccess.filter(function (x) {
      return x.SectionName == sectionName && x.IsVisible == true
    })

    if (mAccess.length == 0)
      return true;

    return false;
    */
  }

  public CheckIfUserhasAccess_Action(sectionName: string, actionName: string) {

    return true;

    /*
    if (LoginUser.IsAdmin == true)
      return true;

    var mAccess = LoginUser.getActionAccess.filter(function (x) {
      return x.SectionName == sectionName && x.RightName == actionName && x.IsSectionVisible == true && x.HasPermission == true
    })

    if (mAccess.length > 0)
      return true;
    else
      return false;*/

  }
  checkRole(fieldFlag): Boolean {

    if (fieldFlag == 'A') {
      if (LoginUser.userRole == "admin")
        return true
      else
        return false;
    }

    if (fieldFlag == 'AC') {
      if (LoginUser.userRole == "admin" || LoginUser.userRole == "contributor")
        return true;
      else 
        return false;
    }

    if (fieldFlag == 'ACV') {
      if (LoginUser.userRole == "admin" || LoginUser.userRole == "contributor" || LoginUser.userRole == "visitor")
        return true;
      else 
        return false;
    }
return false;
  }
  async getSectionData() {
    /*
    await this.genService.GetConfigDataByTableWithPipe("RBAC_GetUserSections Where UserID eq " + LoginUser.loggedinUser.UserID).toPromise().then(res => {
      if (res['value'] != null) {
        var rbacUS = res['value'] as any[];
        LoginUser.getSectionAccess = rbacUS;

        //  rbacUS.forEach(element => {
        //    LoginUser.getSectionAccess.push(element);
        //  });

      }
    })
    */
  }




  getActionData() {
    /*
    this.genService.GetConfigDataWithQuery("select SectionName, RightName, IsSectionVisible, HasPermission from RBAC_GetUserActions Where UserID eq " + LoginUser.loggedinUser.UserID).then(res => {
      if (res['value'] != null) {
        var rbacUA = res['value'] as any[];
        LoginUser.getActionAccess = rbacUA;

        //  rbacUA.forEach(element => {
        //    LoginUser.getActionAccess.push(element);
        //  });

      }
    })
    */
  }





}