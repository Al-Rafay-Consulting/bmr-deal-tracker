import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastService, MDBModalService, MDBModalRef } from 'ng-uikit-pro-standard';
import { MessageDialogeService } from 'src/app/message-dialoge/message-dialoge.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/Base/Common.service';
import { SpBLBase } from 'src/app/Base/SpBLBase/SpBLBase.component';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SharePointConfigService } from 'src/app/Base/SharePoint/share-point-config.service';
import { Autocomplete } from 'src/app/Base/Autocomplete';
import { LoginUser } from 'src/app/Base/User/login-user';
import { DealCommentsQuestions } from './dealcommentsquestions.model';
import { DealCommentsReplies } from '../dealcommentsreplies/dealcommentsreplies.model';
@Component({
  selector: 'app-dealcommentsquestions',
  templateUrl: './dealcommentsquestions.component.html',
  styleUrls: ['./dealcommentsquestions.component.scss']
})
export class DealcommentsquestionsComponent extends SpBLBase<DealCommentsQuestions> implements OnInit{

  showList:boolean = false;

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
  dealCommentsReplies:DealCommentsReplies =  new DealCommentsReplies();

  onValueChange(value: string) {

  }

  actionType: string = "";
  DEALID: number = 0;
  DealCommentsQuestionsList: DealCommentsQuestions[] = [];    

  objDealCommentsQuestions: DealCommentsQuestions = new DealCommentsQuestions();
  action: Subject<DealCommentsQuestions> = new Subject<DealCommentsQuestions>();
  searchReceipent: any = null;
  constructor(
    public http: HttpClient,
    public service: SPOperationsService,
    public router: Router,
    public route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public toast: ToastService,
    public dialog: ConfirmDialogeService,
    public modalRef: MDBModalRef,
    public messageDialog: MessageDialogeService,
    public common: CommonService,    
    public spConfigService:SharePointConfigService

  ) {
    super(service, router, route, spinner, toast, dialog, messageDialog);
    this.formTitle = "";
    this.addListTitle("Deal Comments Discussion Questions", "Deal Comments Discussion Questions");
    this.isGetByPrimaryKey = false;
    this.primaryKey = 0;
  }

  setSectionName() {
    this.sectionName = "Deal Comments Discussion Questions";
  }

  public Initializeobject() {
    this.formData = new DealCommentsQuestions();
  }

  AfterOnInit() {
    this.formTitle = "";
    this.SavebuttonText = 'Submit';   
    this.getReceipent();
  }

  ngOnInit(): void {
    super.ngOnInit();             
  }

  async getReceipent() {
    await this.spConfigService.getRecordByTitleAsync("ReceipentGroup").then(res => {
      var userGroupList = res[0].ListName;
      this.service.getUsersByGroupName(userGroupList).then(res => {
        console.log(res);
        this.AutoCompReceipent.data = null;
        this.AutoCompReceipent.data = res['d']['results'] as any[];
        this.AutoCompReceipent.resultObserve();
      })
    });
  }

 

  recipientErrorMessage: string = "Required Receipent";
  showRecipientError:boolean = false;
  onSubmit(form: NgForm) {
    
    if (this.selectedReceipentsID == null || this.selectedReceipentsID == undefined || this.selectedReceipentsID.length == 0) {
      this.showRecipientError = true;
      return;
    }
    else {
      this.showRecipientError = false;
    }
   
    var objDealCommentsQuestions = new DealCommentsQuestions();
    this.primaryKey = this.formData.ID;
    objDealCommentsQuestions.ID = this.formData.ID;
    objDealCommentsQuestions.Title = this.formData.Title;    
    
    // if(this.selectedReceipentsID.filter(a=> a == LoginUser.loggedinUser.UserID).length == 0)
    //     this.selectedReceipentsID.push(LoginUser.loggedinUser.UserID);

    var objReceipentsId = {
      results: this.selectedReceipentsID
    }
    
    objDealCommentsQuestions.ReceipentsId = objReceipentsId;
    objDealCommentsQuestions.DealId = this.DEALID;
    this.insertRecord(objDealCommentsQuestions);

  }

  AfterInsert() {

    this.dealCommentsReplies.DealId = this.DEALID;
    this.dealCommentsReplies.intDealID = this.DEALID;
    this.dealCommentsReplies.QuestionId = this.primaryKey;
    this.dealCommentsReplies.intQuestionID = this.primaryKey;
    this.dealCommentsReplies.ReplyNo = 1;
    this.dealCommentsReplies.Title = "Question";
    
    // if(this.selectedReceipentsID.filter(a=> a == LoginUser.loggedinUser.UserID).length == 0)
    //     this.selectedReceipentsID.push(LoginUser.loggedinUser.UserID);

    var objReceipentsId = {
      results: this.selectedReceipentsID
    }

    this.dealCommentsReplies.ReceipentsId = objReceipentsId;

    this.service.createSPItem("Deal Comments Discussion Replies", "Deal Comments Discussion Replies", this.dealCommentsReplies).subscribe(res=>{
      this.action.next();
      this.modalRef.hide();
    })
        
  }

  AfterUpdate() {
    this.action.next();
    this.modalRef.hide();
  }
  
  getSubmitText(): string {
    if (this.DEALID > 0) {
      if (this.formData.ID > 0)
        return "Update"
      else
        return this.SavebuttonText
    } else
      return 'Save'
  }

}
