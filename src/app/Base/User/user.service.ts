import { Injectable } from '@angular/core';
import { SPOperationsService } from '../../services/spoperations.service';
import { LoginUser } from './login-user';
import { GeneralService } from 'src/app/services/general.service';
//import { VWRBACGetUserPermissions } from 'src/app/rbac/vw-rbac-get-user-permissions';
import { UserModuleAccess } from '../models/user-module-access';
import { HttpResponse } from '@angular/common/http';
import * as customConfig from 'src/app/customConfig.json';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  public static getModulesAccess: UserModuleAccess[] = [];

  constructor(private spServices: SPOperationsService, public genService: GeneralService) {
  }

  load() {
    return new Promise((resolve, reject) => {

      Promise.all([this.setUserDetails()]).then(res => {
        if (LoginUser.userRole == "") {
          document.getElementById("authError").innerHTML = "Access Restricted !! You don't have permission to view this page.";

          document.getElementById("Apploader").style.display = "none";
        }else{
          LoginUser.IsAdmin = true;
          document.getElementById("authError").style.display = "none";
          resolve(true);
        }


      })

    })
  }

  public async setUserDetails() {

    if (window.parent["_spPageContextInfo"] == undefined) {
      let spUser: any = await this.spServices.getLoggedInUser();
      spUser = spUser.d;

      LoginUser.loggedinUser.UserID = spUser.Id;
      LoginUser.loggedinUser.UserName = spUser.Title;
      LoginUser.loggedinUser.Email = spUser.Email;
    }
    else {

      LoginUser.loggedinUser.UserID = window.parent["_spPageContextInfo"]["userId"];
      LoginUser.loggedinUser.UserName = window.parent["_spPageContextInfo"]["userDisplayName"];
      LoginUser.loggedinUser.Email = window.parent["_spPageContextInfo"]["userEmail"];
    }
    let userGroup = await this.getGroupDetails(LoginUser.loggedinUser.UserID)

  }
  async getGroupDetails(userId: number) {

    var query = {

      filter: "Id eq " + userId

    }
    let adminGroup: any = await this.spServices.getUsersByGroupName("DT Admin", query);
    let contributorGroup: any = await this.spServices.getUsersByGroupName("DT Contributors", query)
    let visitorGroup: any = await this.spServices.getUsersByGroupName("DT Visitors", query)
    if (adminGroup) {
      if (adminGroup['d']['results'].length > 0) {
        LoginUser.IsAdmin = true;
        LoginUser.userRole = "admin";
      }
      else
        LoginUser.IsAdmin = false;
    }



    if (LoginUser.IsAdmin == false) {
      if (contributorGroup) {
        if (contributorGroup['d']['results'].length > 0)
          LoginUser.userRole = "contributor";
        else if (visitorGroup) {
          if (visitorGroup['d']['results'].length > 0)
            LoginUser.userRole = "visitor";
          else
            LoginUser.userRole = "visitor";
        }
      } else if (visitorGroup) {
        if (visitorGroup['d']['results'].length > 0)
          LoginUser.userRole = "visitor";
      }

    }



  }




}
