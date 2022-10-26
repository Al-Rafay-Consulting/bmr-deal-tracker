import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { SpConfig } from '../Base/SpConfig';
import * as customConfig from 'src/app/customConfig.json';

declare let SP: any;

@Injectable({
  providedIn: 'root'
})
export class SPOperationsService {
  jsonHeader = 'application/json; odata=verbose';
  headers = { 'Content-Type': this.jsonHeader, Accept: this.jsonHeader };
  apiUrl: string;
  //baseUrl: string = "http://";
  //baseUrl: string = "http://localhost:8080";
  baseUrl: string = customConfig.baseUrl;
  context = { FormDigestValue: "", WebFullUrl: "" };

  constructor(private http: HttpClient) {
    this.setBaseUrl(null);
    this.getContext();
    this.getLoggedInUser();
  }

  setBaseUrl(webUrl?: string) {
    if (window.location.origin.indexOf("sharepoint.com") > 0)
      this.baseUrl = window.location.origin;

    this.baseUrl += customConfig.spSite; //"/sp";  //site collection or sub site
    ///this.baseUrl += "/sites/EM";  //site collection or sub site
    //this.baseUrl += "/sites/EM2";  //site collection or sub site
    this.apiUrl = this.baseUrl + '/_api/web/lists/GetByTitle(\'{0}\')/items';
  }

  setListItemType(listTitle: string) {
    let titleForItemTpe = listTitle.replace(/ /g, '_x0020_');
    return "SP.Data." + titleForItemTpe.charAt(0).toUpperCase() + titleForItemTpe.slice(1) + "ListItem";
  }

  setDocumentItemType(listTitle: string) {
    let titleForItemTpe = listTitle.replace(/ /g, '_x0020_');
    return "SP.Data." + titleForItemTpe.charAt(0).toUpperCase() + titleForItemTpe.slice(1) + "Item";
  }

  async getContext() {
    const url = this.baseUrl + "/_api/contextinfo";
    const data = JSON.stringify({});
    const ctx = await this.http.post(url, data, this.getHeaders(true, true)).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });

    if (ctx) {
      this.context.FormDigestValue = ctx.d.GetContextWebInformation.FormDigestValue;
      this.context.WebFullUrl = ctx.d.GetContextWebInformation.WebFullUrl;
      console.log('new token avialble')
      //console.log(this.context.FormDigestValue)
    }
    return ctx;
  }

  async getLoggedInUser() {
    const url = this.baseUrl + "/_api/web/currentUser"; //_api/SP.UserProfiles.PeopleManager/GetMyProperties
    return await this.http.get(url, this.getHeaders(true, true)).toPromise();
  }

  async getAllUsers() {

    const url = this.baseUrl + "/_api/web/sitegroups/getbyname('EMUsers')/users"; //_api/SP.UserProfiles.PeopleManager/GetMyProperties
    return await this.http.get(url, this.getHeaders(true, true)).toPromise();
  }

  getHeaders(bAddContext: any, returnOp: any) {
    const headerCopy: any = Object.assign({}, this.headers);
    if (bAddContext) {
      if (this.context) {
        headerCopy['X-RequestDigest'] = this.context.FormDigestValue;
      }
    }
    if (returnOp) {
      const httpOptions = {
        headers: new HttpHeaders(headerCopy)
      };
      return httpOptions;
    } else {
      return headerCopy;
    }
  }

  queryBuilder(url: string, query: any): string {
    if (query) {
      if (query.select) {
        url += ((url.indexOf('?') === -1) ? '?' : '&') + '$select=' + query.select;
      }
      if (query.filter) {
        url += ((url.indexOf('?') === -1) ? '?' : '&') + '$filter=' + query.filter;
      }
      if (query.expand) {
        url += ((url.indexOf('?') === -1) ? '?' : '&') + '$expand=' + query.expand;
      }
      if (query.orderby) {
        url += ((url.indexOf('?') === -1) ? '?' : '&') + '$orderby=' + query.orderby;
      }
      if (query.top) {
        url += ((url.indexOf('?') === -1) ? '?' : '&') + '$top=' + query.top;
      }
      if (query.skip) {
        url += ((url.indexOf('?') === -1) ? '?' : '&') + '$skip=' + query.skip;
      }
    }
    return url;
  }

  getItemURL(listTitle: string, id: any, query?: any) {
    let url = this.apiUrl.replace('{0}', listTitle) + '(' + id + ')';
    url = this.queryBuilder(url, query);
    return url;
  }

  getReadURL(listTitle: string, query?: any) {
    let url = this.apiUrl.replace('{0}', listTitle);
    url = this.queryBuilder(url, query);
    return url;
  }

  async createItem(listTitle: string, jsonBody: any) {
    const url = this.getReadURL(listTitle, null);
    const type = this.setListItemType(listTitle);

    if (!jsonBody.__metadata) {
      jsonBody.__metadata = {
        'type': type
      };
    }

    const data = JSON.stringify(jsonBody);
    const res = await this.http.post(url, data, this.getHeaders(true, true)).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
    return res.d;
  }

  setListItemTypePostPut(listTitle: string) {
    let titleForItemTpe = listTitle.replace(/ /g, '_x0020_');
    return "SP.Data." + titleForItemTpe.charAt(0).toUpperCase() + titleForItemTpe.slice(1) + "ListItem";
  }


  createSPItem(listTitle: string, listItemType:string, jsonBody: any) {
    const url = this.getReadURL(listTitle, null);
    const type = this.setListItemTypePostPut(listItemType);
    if (!jsonBody.__metadata) {
      jsonBody.__metadata = {
        'type': type
      };
    }
    const data = JSON.stringify(jsonBody);
    return this.http.post(url, data, this.getHeaders(true, true));
  }

  async updateItem(listTitle: string, listItemType:string, id: any, jsonBody: any) {
    const localOptions = this.getHeaders(true, false);
    localOptions['X-HTTP-Method'] = 'MERGE';
    localOptions['If-Match'] = '*';
    const type = this.setListItemTypePostPut(listItemType);

    if (!jsonBody.__metadata) {
      jsonBody.__metadata = {
        'type': type
      };
    }

    const data = JSON.stringify(jsonBody);
    const url = this.getItemURL(listTitle, id);
    const httpOptions = {
      headers: new HttpHeaders(localOptions)
    };

    await this.http.post(url, data, httpOptions).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
  }

  createSPItem2(listTitle: string, listItemType:string, jsonBody: any) {
    const url = this.getReadURL(listTitle, null);
    const type = this.setListItemTypePostPut(listItemType);
    if (!jsonBody.__metadata) {
      jsonBody.__metadata = {
        'type': type
      };
    }
    const data = JSON.stringify(jsonBody);
    return this.http.post(url, data, this.getHeaders(true, true)).toPromise();
  }

  updateItem2(listTitle: string, listItemType:string, id: any, jsonBody: any) {
    const localOptions = this.getHeaders(true, false);
    localOptions['X-HTTP-Method'] = 'MERGE';
    localOptions['If-Match'] = '*';
    const type = this.setListItemTypePostPut(listItemType);
    if (!jsonBody.__metadata) {
      jsonBody.__metadata = {
        'type': type
      };
    }
    const data = JSON.stringify(jsonBody);
    const url = this.getItemURL(listTitle, id);
    const httpOptions = {
      headers: new HttpHeaders(localOptions)
    };
    return this.http.post(url, data, httpOptions).toPromise();
  }

  readItems_Caml(listTitle: string,caml?:any) {
    var url = this.getReadURL(listTitle, null);
    //const type = this.setListItemTypePostPut(listItemType);
    url = url.replace('items','GetItems')

    //caml = "<View><Query><Where><Eq><FieldRef Name='EndDate'/><Value Type='DateTime'><Today /></Value></Eq></Where></View></Query>";
    caml = "<View><Query><GroupBy Collapse='TRUE'><FieldRef Name='Company0' /></GroupBy></Query><OrderBy><FieldRef Name='Company0' Ascending='TRUE' /></OrderBy><ViewFields><FieldRef Name='Company0' /></ViewFields></View>";


    var jsonBody = {
      query:{
        __metadata: {'type': "SP.CamlQuery"},
        ViewXml: caml
      }
    };

    /*
    jsonBody.query = null;
    jsonBody.query.__metadata = {
      'type': "SP.CamlQuery"
    };

    jsonBody.query.ViewXml = {
      'ViewXml': caml
    };*/


    //var data = { "query" :{"__metadata": { "type": "SP.CamlQuery" }, "ViewXml": caml} };

    const data = JSON.stringify(jsonBody);
    return this.http.post(url, data, this.getHeaders(true, true))

  }
  // async getUsersByGroupName(groupName:string) {

  //   const url = this.baseUrl + "/_api/web/sitegroups/getbyname('"+groupName+"')/users"; //_api/SP.UserProfiles.PeopleManager/GetMyProperties
  //   return await this.http.get(url, this.getHeaders(true, true)).toPromise();
  // }
  async getUsersByGroupName(groupName:string, query?:any) {

    let url = this.baseUrl + "/_api/web/sitegroups/getbyname('"+groupName+"')/users"; //_api/SP.UserProfiles.PeopleManager/GetMyProperties

    url = this.queryBuilder(url, query)

    return await this.http.get(url, this.getHeaders(true, true)).toPromise();

    }
  async readItems(listTitle: string, query?: any) {
    const url = this.getReadURL(listTitle, query);
    return await this.http.get(url, this.getHeaders(true, true)).toPromise();
  }

  readItemsHttp(listTitle: string, query?: any) {
    const url = this.getReadURL(listTitle, query);
    return  this.http.get(url, this.getHeaders(true, true));
  }

  async readItemById(listTitle: string, Id:number, query: any) {
    const url = this.getItemURL(listTitle, Id, query);
    return await this.http.get(url, this.getHeaders(true, true)).toPromise();
  }

  async deleteItem(listTitle: string, id: number) {
    const localOptions = this.getHeaders(true, false);
    localOptions['X-HTTP-Method'] = 'DELETE'; // set the delete header for post call.
    localOptions['If-Match'] = '*';
    const url = this.getItemURL(listTitle, id);
    const httpOptions = {
      headers: new HttpHeaders(localOptions)
    };

    let res = await this.http.post(url, null, httpOptions).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });

    return res;
  }

  deleteItemPromise(listTitle: string, id: number) {
    const localOptions = this.getHeaders(true, false);
    localOptions['X-HTTP-Method'] = 'DELETE'; // set the delete header for post call.
    localOptions['If-Match'] = '*';
    const url = this.getItemURL(listTitle, id);
    const httpOptions = {
      headers: new HttpHeaders(localOptions)
    };

    return this.http.post(url, null, httpOptions);
  }


  async deleteDocument(documentURL: string) {
    const localOptions = this.getHeaders(true, false);
    localOptions['X-HTTP-Method'] = 'DELETE';
    localOptions['If-Match'] = '*';
    const url = this.baseUrl + "/_api/web/GetFileByServerRelativeUrl('" + documentURL + "')";
    const httpOptions = {
      headers: new HttpHeaders(localOptions)
    };

    const result: any = await this.http.post(url, null, httpOptions).toPromise();
    console.log('deleteDocument result:', result);
    return result;
  }

  async getChoiceFieldItems(listTitle: string, query?: any) {
    const url = this.getChoiceFieldUrl(listTitle, query);
    let res = await this.http.get(url, this.getHeaders(true, true)).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
    return res.d.results;
  }

  getChoiceFieldUrl(listTitle: string, query?: any) {
    const choiceUrl = this.baseUrl + '/_api/web/lists/GetByTitle(\'{listTitle}\')/fields';
    let url = choiceUrl.replace('{listTitle}', listTitle);
    url = this.queryBuilder(url, query);
    return url;
  }

  //Create/upload folders and files
  async createFolder(listTitle: string, folderName: string) {
    const completeURL = this.baseUrl + "/_api/web/folders";
    const data = JSON.stringify({
      '__metadata': { 'type': 'SP.Folder' },
      'ServerRelativeUrl': listTitle + '/' + folderName
    });
    return await this.http.post(completeURL, data, this.getHeaders(true, true)).toPromise();
  }

  async createSubFolder(listTitle: string, parentFolder: string, folders: any) {
    const completeURL = this.baseUrl + "/_api/web/folders";

    let promises = [];
    folders.forEach((e) => {
      const data = JSON.stringify({
        '__metadata': { 'type': 'SP.Folder' },
        'ServerRelativeUrl': listTitle + "/" + parentFolder + "/" + e.folder
      });

      promises.push(this.http.post(completeURL, data, this.getHeaders(true, true)).toPromise())
    });

    return await Promise.all(promises);
  }

  async updateFolder(libraryTitle: string, oldFolderObject: any, jsonBody: any) {
    const localOptions = this.getHeaders(true, false);
    localOptions['X-HTTP-Method'] = 'MERGE';
    localOptions['If-Match'] = '*';
    const type = oldFolderObject.__metadata.type;

    if (!jsonBody.__metadata) {
      jsonBody.__metadata = {
        'type': type
      };
    }

    const data = JSON.stringify(jsonBody);
    const url = this.baseUrl + "/_api/web/GetFolderByServerRelativeUrl('" + libraryTitle + "/" + oldFolderObject.FileLeafRef + "')/ListItemAllFields";
    const httpOptions = {
      headers: new HttpHeaders(localOptions)
    };

    await this.http.post(url, data, httpOptions).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
  }


  async updateFolder2(libraryTitle: string, FileLeafRef: string, jsonBody: any) {
    const localOptions = this.getHeaders(true, false);
    localOptions['X-HTTP-Method'] = 'MERGE';
    localOptions['If-Match'] = '*';

    const type = this.setDocumentItemType(libraryTitle);//oldFolderObject.__metadata.type;

    if (!jsonBody.__metadata) {
      jsonBody.__metadata = {
        'type': type
      };
    }

    const data = JSON.stringify(jsonBody);
    const url = this.baseUrl + "/_api/web/GetFolderByServerRelativeUrl('" + libraryTitle + "/" + FileLeafRef + "')/ListItemAllFields";
    const httpOptions = {
      headers: new HttpHeaders(localOptions)
    };

    await this.http.post(url, data, httpOptions).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
  }


  async uploadDepartmentFiles(libraryTitle: string, event: string, files: any) {
    let promises = [];
    files.forEach((f) => {
      for (let i = 0; i < f.files.length; i++) {
        const file = f.files[i];
        const completeURL = this.baseUrl + "/_api/web/getfolderbyserverrelativeurl('" + libraryTitle + "/" + event + "/"
          + f.Department + "')/Files/add(overwrite=true, url='" + file.name + "')";
        this.getFileArrayBuffer(file).then((arrayBuffer: any) => {
          const headers = {
            accept: "application/json;odata=verbose",
            "X-RequestDigest": this.context.FormDigestValue,
            "content-length": arrayBuffer.byteLength
          }
          promises.push(this.http.post(completeURL, arrayBuffer, this.getHeaders(true, headers)).toPromise());
        }).catch((err) => {
          console.log(err);
        });
      }
    });
    return await Promise.all(promises);
  }

  async getFileArrayBuffer(aFile: File) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsArrayBuffer(aFile);
      reader.onloadend = (function (e) {
        var buffer = e.target.result;
        if (buffer)
          resolve(buffer);
        else
          reject();
      });
    });
  }

  async getDocumentsFromDocumentLibrary(libraryTitle: string, folder: string) {
    let url: any = this.baseUrl + "/_api/web/GetFolderByServerRelativeUrl('" + libraryTitle + "/" + folder + "')?$expand=Folders";
    let promises = [];
    await this.http.get(url, this.getHeaders(true, true)).toPromise().then((filesAndFolders: any) => {
      if (filesAndFolders && filesAndFolders.d.Folders.results.length) {
        const folders = filesAndFolders.d.Folders.results;
        for (var i = 0; i < folders.length; i++) {
          url = this.baseUrl + "/_api/web/GetFolderByServerRelativeUrl('" + libraryTitle + "/" + folder + "/" + folders[i].Name + "')/Files?$select=*,ModifiedBy/Title&$expand=ModifiedBy";
          promises.push(this.http.get(url, this.getHeaders(true, true)).toPromise());
        }
      }
    });
    return await Promise.all(promises);
  }

  async getDocumentsFromDocumentLibraryBPA(libraryTitle: string, folder: string) {
    let promises = [];
    var url = this.baseUrl + "/_api/web/GetFolderByServerRelativeUrl('" + libraryTitle + "/" + folder + "')/Files?$select=*,ModifiedBy/Title&$expand=ModifiedBy&orderBy=ID asc";
    promises.push(this.http.get(url, this.getHeaders(true, true)).toPromise());
    return await Promise.all(promises);
  }

  async copyFiles(libraryTitle: string, folder: string, folder2: string) {
    //let BaseUrl = "http://bmrnews/finance/deal-tracker";
    let BaseUrl = "https://alrafayconsulting.sharepoint.com/sites/DMSDemo2/deal-tracker"
    //let url = BaseUrl + "/_api/web/GetFileByServerRelativeUrl('/finance/deal-tracker/DealImages/Deal_88/Picture1.png')/CopyTo(strnewurl='/sites/DMSDemo2/deal-tracker/DealImages/Deal_102/Picture1.png',boverwrite=true)";
    let url = BaseUrl + "/_api/web/GetFileByServerRelativeUrl('/sites/DMSDemo2/deal-tracker/DealImages/Deal_88/Picture1.png')/CopyTo(strnewurl='/sites/DMSDemo2/deal-tracker/DealImages/Deal_102/Picture1.png',boverwrite=true)";
    this.http.post(url, { "Accept": "application/json; odata=verbose" });
  }

  async getEventFolderName(libraryTitle: string, eventId: number) {
    const query = {
      select: 'ID,FileLeafRef,EventID',
      expand: '',
      filter: "EventID eq " + eventId,
      top: 1
    };

    const result: any = await this.readItems(libraryTitle, query);
    let folderName = "";
    if (result.d.results.length > 0) {
      folderName = result.d.results[0].FileLeafRef;
    }

    return folderName;
  }

  // Sameer: 14-08-2020
  async getEventFolderInfo(libraryTitle: string, eventId: number) {
    const query = {
      select: '*',
      expand: '',
      filter: "EventID eq " + eventId,
      top: 1
    };

    const result: any = await this.readItems(libraryTitle, query);
    console.log(result)
    return result;
  }

  async readListId(listTitle: string, query?: any) {
    let url = this.baseUrl + "/_api/web/lists/GetByTitle('" + listTitle + "')/Id"
    url = this.queryBuilder(url, query);
    return await this.http.get(url, this.getHeaders(true, true)).toPromise();
  }
  // End Sameer: 14-08-2020

  //SharePointConfig

  async readConfigList() {
    const query = {
      select: 'ID,Title,ListName,ListGUID,ListUrl,ContentTypeID0,WorkflowID,RootFolder,RecSRC',
      expand: '',
      filter: '',
    };

    const result = await this.readItems("SharePointConfig", query)
    SpConfig.ConfigList = result['d'].results;
    //console.log(result);
  }

  //Get Current user information
  async getUTCTimeZoneInfo() {
    var requestUri = this.baseUrl + "/_api/Web/RegionalSettings/TimeZone";
    await this.http.get(requestUri, this.getHeaders(true, true)).toPromise().then(res => {
      SpConfig.UTCBias = res["d"].Information.Bias;
      SpConfig.UTCDaylightBias = res["d"].Information.DaylightBias;
      // console.log(res);
    })
  }

  // count_attachment:number = 0;
  // attachFile(fileToAttach, itemID, listTitle, count) {
  //   this.count_attachment = count;
  //   var aFile = fileToAttach;
  //   {
  //     if (aFile) {
  //       var reader = new FileReader();
  //       reader.readAsArrayBuffer(aFile);
  //       reader.onload = (function () {
  //         return function (e) {
  //           var buffer = e.target.result;
  //           var contents = this._arrayBufferToBase64(buffer);

  //           var attach = new SP.RequestExecutor("/");
  //           attach.executeAsync({
  //             url: this.getReadURL(listTitle, null) + "(" + itemID + ")/AttachmentFiles/add(FileName='" + aFile.name + "')",
  //             method: "POST",
  //             binaryStringRequestBody: true,
  //             body: contents,
  //             headers: {
  //               'accept': 'application/json;odata=verbose',
  //               "X-RequestDigest": this.context.FormDigestValue
  //             },
  //             success: this.fsuccess,
  //             error: this.ferror,
  //             state: "Update"
  //           });

  //         };
  //       })();
  //     }
  //     else {
  //      // window.location.href = indexPageUrl;
  //     }
  //   }
  // }

  // _arrayBufferToBase64(buffer) {
  //   var binary = '';
  //   var bytes = new Uint8Array(buffer);
  //   var len = bytes.byteLength;
  //   for (var i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return binary;
  // }

  // fsuccess(data) {
  //   // var msg = JSON.parse(data.body).d.FileName + ' successfully attached. Verify by View Item ' + list.url + '/DispForm.aspx?ID=' + itemID;
  //   // msg += ' or view/download attachment by visiting URL: ' + list.url + '/Attachments/' + itemID + '/' + JSON.parse(data.body).d.FileName;
  //   // console.log(msg);

  //   if (this.count_attachment > 0) {
  //     this.attachFile(filesToAttach[--this.count_attachment]);
  //   }
  //   else {
  //     //window.location.href = indexPageUrl;
  //   }
  // }

  // ferror(data) {
  //   console.log('error:\n\n' + JSON.parse(data.body).error.message.value.trim());
  //   if (count_attachment > 0) {
  //     this.attachFile(this.filesToAttach[--this.count_attachment]);
  //   }
  //   else {
  //     //window.location.href = indexPageUrl;
  //   }
  // }
}

