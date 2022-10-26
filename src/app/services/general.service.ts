import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http'
import { LoginUser } from '../Base/User/login-user';
import moment from 'moment';
import * as customConfig from 'src/app/customConfig.json';

@Injectable({
  providedIn: 'root'
})

export class GeneralService {

  constructor(private http: HttpClient) {}
  list: object[];
  public ControllerName: string;
  readonly rootURL = customConfig.api;

  postData(ControllerName: string, formData: any, sectionName: string) {
    var obj = {
      "Entity": formData,
      "AuditInfo": {
        "ID": 0,
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "SectionName": sectionName
      }
    }
    return this.http.post(this.rootURL + ControllerName + "/Insert", obj, this.getHeaders());
  }

  bulkPostData(ControllerName: string, formData: any[], sectionName: string) {
    var obj = {
      "Entity": formData,
      "AuditInfo": {
        "ID": 0,
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "SectionName": sectionName
      }
    }
    return this.http.post(this.rootURL + ControllerName + "/BulkInsert", obj, this.getHeaders());
  }

  putData(ControllerName: string, ID: number, formData: any, sectionName: string) {

    var obj = {
      "Entity": formData,
      "AuditInfo": {
        "ID": parseInt(ID.toString()),
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "SectionName": sectionName
      }
    }
    return this.http.post(this.rootURL + ControllerName + "/Update", obj, this.getHeaders());
  }

  updateData(ControllerName: string, ID: number, formData: any, CreatedBy: number, CreatedDate: Date, sectionName: string) {
    var obj = {
      "Entity": formData,
      "AuditInfo": {
        "ID": parseInt(ID.toString()),
        "UserId": LoginUser.loggedinUser.UserID,
        "TransactionDate": moment(new Date()).format('YYYY-MM-DD'),
        "CreatedBy": CreatedBy == null ? -1 : CreatedBy,
        "CreatedDate": CreatedDate == null ? moment(new Date()).format('YYYY-MM-DD') : moment(CreatedDate).format('YYYY-MM-DD'),
        "SectionName": sectionName
      }
    }
    return this.http.post(this.rootURL + ControllerName + "/Update", obj, this.getHeaders());
  }

  setData(funcionName: string, obj: any) {
    return this.http.post(this.rootURL + funcionName, obj, this.getHeaders());
  }

  patchData(controllerName: string, ID: number, obj: any) {
    return this.http.patch(this.rootURL + controllerName + "(" + ID + ")", obj, this.getHeaders());
  }

  async GetDataByQuery(query: string) {
    return await this.http.get(this.rootURL + query, this.getHeaders()).toPromise()
  }

  async GetConfigDataByTableQuery(query: string) {
    return await this.http.get(this.rootURL + "api/Config/GetDataByTable(" + query + ")", this.getHeaders()).toPromise()
  }

  async GetConfigDataWithQuery(query: string) {
    return await this.http.get(this.rootURL + "api/Config/GetDataByQuery(" + query + ")", this.getHeaders()).toPromise()
  }

  GetConfigDataWithBodyQuery(query: string) {
    var obj = {
      Query: query
    }
    return this.http.post(this.rootURL + "api/Config/GetDataByBody", obj, this.getPostHeaders())
  }

  GetConfigDataWithQueryWithPipe(query: string) {
    return this.http.get(this.rootURL + "api/Config/GetDataByQuery(" + query + ")", this.getHeaders())
  }

  GetConfigDataByTableWithPipe(query: string) {
    return this.http.get(this.rootURL + "api/Config/GetDataByTable(" + query + ")", this.getHeaders())
  }

  getHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Token': localStorage.getItem(customConfig.tokenID),
      })
    };
    return httpOptions;
  }

  getPostHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Token': localStorage.getItem(customConfig.tokenID),
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }

  async Authenticate(userName: any, password: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(userName + ':' + password),
      }),
      observe: 'response' as 'response'
    };

    return await this.http.post(this.rootURL + 'authenticate', null, httpOptions).toPromise()
  }

  async getToken(userName: any, password: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(userName + ':' + password),
      }),
      observe: 'response' as 'response'
    };

    return await this.http.post(this.rootURL + 'Authenticate/get/token', null, httpOptions).toPromise()
  }
}
