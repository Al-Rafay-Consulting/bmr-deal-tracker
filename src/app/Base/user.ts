import { User } from './models/user.model'
import { SPOperationsService } from '../services/spoperations.service';

export class user {
  public static LoginUser: User;
  //private static spServices: SPOperationsService
  constructor() { }

  public static getUserDetails(): User {
    //this.LoginUser = new User(this.spServices);
    this.LoginUser = new User();
    if (window.parent["_spPageContextInfo"] == undefined) {
      this.LoginUser.UserID = -1;
      this.LoginUser.UserName = "Dev";
    }
    else {
      this.LoginUser.UserID = window.parent["_spPageContextInfo"]["userId"];
      this.LoginUser.UserName = window.parent["_spPageContextInfo"]["userDisplayName"];
    }

    return this.LoginUser;
  }
}