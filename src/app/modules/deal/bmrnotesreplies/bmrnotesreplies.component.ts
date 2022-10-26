import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/Base/Common.service';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { SharePointConfigService } from 'src/app/Base/SharePoint/share-point-config.service';
import { LoginUser } from 'src/app/Base/User/login-user';
import { BMRNotesReplies } from './bmrnotesreplies.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BmrReplyBottomSheetComponent } from './bmr-reply-bottom-sheet/bmr-reply-bottom-sheet.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConfirmDialogeService } from 'src/app/confirm-dialoge/confirm-dialoge.service';

@Component({
  selector: 'app-bmrnotesreplies',
  templateUrl: './bmrnotesreplies.component.html',
  styleUrls: ['./bmrnotesreplies.component.scss']
})
export class BmrnotesrepliesComponent implements OnInit, OnChanges {
    
  @Input() data:any;
  @Input() replies:any = null;

  repliesCopy: any =[];
  @Output() onBack =  new EventEmitter<any>();
  @Output() onBottomSheetClose =  new EventEmitter<any>();
  imageURL: string = "";
  searchKey: string = "";
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

  isReplyMode:boolean = false;

  discussionReplies:BMRNotesReplies =  new BMRNotesReplies();
  currentUserName:string = null;

  constructor(
    public service: SPOperationsService,     
    public common:CommonService,    
    private _bottomSheet: MatBottomSheet,
    public spConfigService:SharePointConfigService,
    public dialog: ConfirmDialogeService
    ) {
 
  }

  ngOnInit(): void {
    this.currentUserName = LoginUser.loggedinUser.UserName;
    this.getPersonImage();
    this.repliesCopy = this.replies;
  }
  onEdit(row: any) {

    this.openBottomReplySheet(row,true,'Edit');
  }
  getPersonImage() {
    this.spConfigService.getRecordByTitleAsync("PersonImage").then(res=>{
      this.imageURL += res[0].ListUrl;
    });            
  }

  ngOnChanges(changes: any): void {
    //this.fillList();
  }

  ngAfterViewInit() {
    //this.fillList();
  }
  DeleteNote(r, index) {

    //var ID =  this.eventNotesList[index].ID
    if (r.ID != null) {
      this.dialog.openConfirmDialog("Are you sure you want to delete this record?").afterClosed().subscribe(res => {
        if (res) {
          this.common.ShowSpinner();
          if (r.ID > 0) {
            this.service.deleteItem("BMR Notes Discussion Replies", r.ID).then(res => {
              this.getReplies(r.QuestionId).then(res=>{
                this.common.HideSpinner()
              })
            });
          }
          else 
          {
            // this.input_vendorNotesList.splice(index, 1);
            // this.fillList();
            this.common.HideSpinner();
          }

        }
      })
    }
  }

  applyFilterSearch(filterValue){

    let val = filterValue.toLowerCase();
    let searchColumns = ['Reply'];
    if (val.length > 0) {
    this.replies = this.repliesCopy.filter(function (d) {
             let matchFound = false;
             for (let data of searchColumns) {
               let value = "" + d[data];
               if (value.toLowerCase().indexOf(val) !== -1 || !val) {
                 matchFound = true;
                 break;
               }
             }
             return matchFound;
           });
    } else {
           this.replies = this.repliesCopy;
      }
       }
  openBottomReplySheet(row, isReplyAll:boolean,Mode:string): void {          
      this._bottomSheet.open(BmrReplyBottomSheetComponent,
        {
          disableClose: false,
          panelClass: 'bottomSheetHeight',
          autoFocus:true,
          data: { data: row, isReplyAll:isReplyAll,Mode:Mode}
        }
      );

      this._bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res=>{
        this.afterBottomSheetCloses();
      })    
  }
  async getReplies(questionId:number){
    var query = {
      select:"ID, Title, Reply, DealId, Question/Title, QuestionId, ReplyNo, Modified, Created, Editor/Title, ReceipentsId, Receipents/Title ",
      filter: 'QuestionId eq ' + questionId,
      expand: 'Editor, Question, Receipents',
      orderby:" Modified desc"
    }

    await this.service.readItems("BMR Notes Discussion Replies", query).then(res=>{      
      this.replies = res['d'].results;
    });
  }
  afterBottomSheetCloses(){
    this.onBottomSheetClose.emit(this.data);
  }

  
  onReply(){
    this.isReplyMode = true;
    
  }

  onReplyCancel(){
    this.isReplyMode=false;
    this.discussionReplies= new BMRNotesReplies();
  }

  onBackClick(){
    this.onBack.emit();
  }



 

}

