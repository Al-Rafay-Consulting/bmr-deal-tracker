import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
//import { EventDetails } from '../../event-details.model';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { LoginUser } from 'src/app/Base/User/login-user';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastType } from 'src/app/Enum/ToastType';
import { SharePointConfigService } from 'src/app/Base/SharePoint/share-point-config.service';
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { BMRNotesReplies } from '../bmrnotesreplies.model';

@Component({
  selector: 'app-bmr-reply-bottom-sheet',
  templateUrl: './bmr-reply-bottom-sheet.component.html',
  styleUrls: ['./bmr-reply-bottom-sheet.component.scss']
})
export class BmrReplyBottomSheetComponent implements OnInit  {
 
  imageURL: string = "";
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    //defaultFontName: 'Arial',
    defaultFontName: 'Century Gothic',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };


  AutoCompReceipent: Autocomplete<any> = new Autocomplete<any>("Title", "Id");
  public selectedReceipentsID: number[] = [];  

  discussionReplies:BMRNotesReplies =  new BMRNotesReplies();
  currentUserName:string = null;
  constructor( 
    private _bottomSheetRef: MatBottomSheetRef<BmrReplyBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data:{data :any, isReplyAll:boolean,Mode:string},
    public common:CommonService,
    public service:SPOperationsService,    
    public spConfigService:SharePointConfigService
    ) {
      
    }

  closeBottomSheet(): void {
    this._bottomSheetRef.dismiss();
    //event.preventDefault();
  }

  getPersonImage() {
    this.spConfigService.getRecordByTitleAsync("PersonImage").then(res=>{
      this.imageURL += res[0].ListUrl;
    });            
  }


  ngOnInit(): void {
  this.currentUserName = LoginUser.loggedinUser.UserName;
  this.common.ShowSpinner();
  this.getReceipent();
  this.getPersonImage();
  }

  
  recipientErrorMessage: string = "Required Recipient";
  showRecipientError:boolean = false;
  saveReply(){

    if (this.selectedReceipentsID == null || this.selectedReceipentsID == undefined || this.selectedReceipentsID.length == 0) {
      this.showRecipientError = true;
      return;
    }
    else {
      this.showRecipientError = false;
    }

    this.common.ShowSpinner();
    this.discussionReplies.DealId = this.data.data.DealId;
    this.discussionReplies.intDealID = this.data.data.DealId;
    this.discussionReplies.QuestionId = this.data.data.QuestionId;
    this.discussionReplies.intQuestionID = this.data.data.QuestionId;
    this.discussionReplies.Title = "Reply";
    if(this.data.Mode == 'Edit')
      this.discussionReplies.ID = this.data.data.ID;

    var objReceipentsId = {
      results: this.selectedReceipentsID
    }
        
    this.discussionReplies.ReceipentsId = objReceipentsId;
    if (this.discussionReplies.ID == 0) {
      this.discussionReplies.QuestionId = this.data.data.QuestionId;
      this.discussionReplies.intQuestionID = this.data.data.QuestionId;
      this.service.createSPItem("BMR Notes Discussion Replies", "BMR Notes Discussion Replies", this.discussionReplies).subscribe(res=>{
        this.common.HideSpinner();
        this._bottomSheetRef.dismiss();
        event.preventDefault();
        this.common.ShowToast("Successfully Send", ToastType.Success);
      })
    }else if (this.discussionReplies.ID > 0){
      delete this.discussionReplies['Modified'];
      delete this.discussionReplies['ReplyNo'];
   this.service.updateItem("BMR Notes Discussion Replies", "BMR Notes Discussion Replies",this.discussionReplies.ID,this.discussionReplies).then(res => {
    this.common.HideSpinner();
    this._bottomSheetRef.dismiss();
    event.preventDefault();
    this.common.ShowToast("Successfully Send", ToastType.Success);
  }, error => {
    console.log(error);
  });
    }
    

  }

  onReplyCancel(){
    this.discussionReplies= new BMRNotesReplies();
    this._bottomSheetRef.dismiss();
    
  }

  async getReceipent() {
    await this.spConfigService.getRecordByTitleAsync("ReceipentGroup").then(async  res => {
      var userGroupList = res[0].ListName;
      await this.service.getUsersByGroupName(userGroupList).then(res => {
        console.log(res);
        this.AutoCompReceipent.data = null;
        this.AutoCompReceipent.data = res['d']['results'] as any[];
        this.AutoCompReceipent.resultObserve();
        if (this.data.isReplyAll == true) {
          this.selectedReceipentsID = this.data.data.ReceipentsId.results;
          //if (this.selectedReceipentsID.filter(a => { return a == Number(this.data.data.AuthorId) }).length == 0)
            //this.selectedReceipentsID.push(Number(this.data.data.AuthorId));
        }
        else {
          var arr: number[] = [this.data.data.AuthorId]
          this.selectedReceipentsID = arr;
        }
        if(this.data.Mode != 'Add')
        this.discussionReplies.Reply = this.data.data.Reply; 
        this.common.HideSpinner();
      })
    });
  }
  

  

   

}


