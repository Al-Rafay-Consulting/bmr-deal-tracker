import { Injectable } from '@angular/core';
import { SPOperationsService } from 'src/app/services/spoperations.service';

@Injectable({
  providedIn: 'root'
})
export class SharePointConfigService {

  public ConfigList: any[] = [];

  public UTCBias: number = null;
  public UTCDaylightBias: number = null;

  constructor(
    public sp:SPOperationsService
  ) { }


  private getRecordByTitle(Title: string): any {
      return this.ConfigList.filter(function (x) {
          return x['Title'] == Title;
      })
  }

 async getRecordByTitleAsync(Title: string) {
  const query = {
    select: 'ID,Title,ListName,ListGUID,ListUrl,ContentTypeID0,WorkflowID,RootFolder,RecSRC',
    expand: '',
    filter: "Title eq '" + Title + "'",     
  };

    const result = await this.sp.readItems("SharePointConfig", query)
    return result['d'].results;

  }

  async getRecordByGroupAsync(group: string) {
    const query = {
      select: 'ID,Title,ListName,ListGUID,ListUrl,ContentTypeID0,WorkflowID,RootFolder,RecSRC',
      expand: '',
      filter: "Group eq '" + group + "'",     
    };
  
      const result = await this.sp.readItems("SharePointConfig", query)
      return result['d'].results;
  
    }

  
}
