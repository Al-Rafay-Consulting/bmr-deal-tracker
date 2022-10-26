import { SPOperationsService } from '../../services/spoperations.service';

export class User {
   public UserID: number;
   public UserName: string;
   public Email: string;

   // constructor(private spServices: SPOperationsService) {
   //    this.setUserDetails();
   // }

   // async setUserDetails() {
   //    //spv =new SPOperationsService();
   //    let spUser: any = await this.spServices.getLoggedInUser();
   //    spUser = spUser.d;

   //    this.UserID = spUser.id;
   //    this.UserName = spUser.Title;
   //    this.Email = spUser.Email;
   // }
}
