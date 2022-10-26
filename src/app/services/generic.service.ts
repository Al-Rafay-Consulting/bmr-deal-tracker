import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { LoginUser } from '../Base/User/login-user';
import moment from 'moment';
import * as customConfig from 'src/app/customConfig.json';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  public rootURL = customConfig.api;

  constructor(private http: HttpClient) {
    console.log(this.rootURL);

  }


  postData(formData: any, controllerName: string, sectionName:string) {

    formData["CreatedBy"] = LoginUser.loggedinUser.UserID;
    formData["ModifiedBy"] = LoginUser.loggedinUser.UserID;

    var obj = {
      "Entity": formData,
      AuditInfo: {
        "ID": 0,
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "SectionName":sectionName
      }
    }

    return this.http.post(this.rootURL + controllerName + "/Insert", obj, this.getHeaders());
  }


  bulkPostData(ControllerName: string, formData: any[], sectionName:string) {

    var obj = {
      "Entity": formData,
      "AuditInfo": {
        "ID": 0,
        "UserId":LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "SectionName":sectionName
      }
    }

    return this.http.post(this.rootURL + ControllerName + "/BulkInsert", obj, this.getHeaders());
  }


  putData(ID: number, formData: any, controllerName: string, sectionName:string) {

    var obj = {
      "Entity": formData,
      AuditInfo: {
        "ID": parseInt(ID.toString()),
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD') },
        "SectionName":sectionName
    }

    return this.http.post(this.rootURL + controllerName + "/Update", obj, this.getHeaders());
  }

  updateData(ID: number, formData: any, CreatedBy: number, CreatedDate: Date, controllerName: string, sectionName:string) {

    var obj = {
      "Entity": formData,
      AuditInfo: {
        "ID": parseInt(ID.toString()),
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "CreatedBy": CreatedBy == null ? -1 : CreatedBy,
        "CreatedDate": CreatedDate == null ? moment(new Date()).format('YYYY-MM-DD') : moment(CreatedDate).format('YYYY-MM-DD'),
        "SectionName":sectionName
      }
    }

    return this.http.post(this.rootURL + controllerName + "/Update", obj, this.getHeaders());
  }

  patchData(controllerName: string, ID: number, singleObj: any, sectionName:string) {

    /*
    singleObj['ModifiedBy'] =  LoginUser.loggedinUser.UserID;
    singleObj['ModifiedDate'] =  moment(new Date()).format('YYYY-MM-DD');

    var obj = {
      "Entity": singleObj,
      AuditInfo: {
        "ID": parseInt(ID.toString()),
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "SectionName":sectionName
      }
    }

    return this.http.patch(this.rootURL + controllerName + "/Patche", obj);
    */
    return this.http.patch(this.rootURL + controllerName + "(" + ID + ")", singleObj, this.getHeaders());
  }

  /*
  deleteData(ID: number, controllerName: string) {
    return this.http.delete(this.rootURL + controllerName + "(" + ID + ")");
  }
  */

  removeData(ID: number, controllerName: string, sectionName:string) {
    var obj = {
      "ID": ID,
      AuditInfo: {
        "ID": parseInt(ID.toString()),
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "CreatedBy": LoginUser.loggedinUser.UserID,
        "CreatedDate": moment(new Date()).format('YYYY-MM-DD'),
        "SectionName":sectionName
      }
    }

    return this.http.post(this.rootURL + controllerName + "/Remove", obj, this.getHeaders());
  }

  getAllData(controllerName: string) {
    return this.http.get(this.rootURL + controllerName, this.getHeaders()).toPromise().then(
      res => res['value'] as any[]
    );
  }

  getDataByID(ID: number, controllerName: string, filter: string = "") {
    return this.http.get(this.rootURL + controllerName + "(" + ID + ")" + filter, this.getHeaders()).toPromise().then(res => res as any);
  }

  getAnyDataByID(ID: number, controllerName: string, filter: string = "") {
    return this.http.get(this.rootURL + controllerName + "(" + ID + ")" + filter, this.getHeaders()).toPromise().then(res => res);
  }

  async getDataByQuery(controllerName: string, query: string) {
    return await this.http.get(this.rootURL + controllerName + query, this.getHeaders()).toPromise().then(
      res => res['value'] as any[]
    );
  }

  getHeaders(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Token': localStorage.getItem(customConfig.tokenID),
      })
    };

    return httpOptions;
  }


}
