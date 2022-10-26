import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MDBModalRef, MDBModalService, ToastService } from 'ng-uikit-pro-standard'
import { CommonService } from 'src/app/Base/Common.service';
import { Table } from 'src/app/Base/Table';
import { SPOperationsService } from 'src/app/services/spoperations.service';
import { BMRNotesQuestions } from '../bmrnotesquestions/bmrnotesquestions.model';
import { BmrnotesquestionsComponent } from '../bmrnotesquestions/bmrnotesquestions.component';
import { BMRNotesReplies } from '../bmrnotesreplies/bmrnotesreplies.model';
import { BmrReplyBottomSheetComponent } from '../bmrnotesreplies/bmr-reply-bottom-sheet/bmr-reply-bottom-sheet.component';


@Component({
  selector: 'app-bmrnotesquestions-list',
  templateUrl: './bmrnotesquestions-list.component.html',
  styleUrls: ['./bmrnotesquestions-list.component.scss']
})
export class BmrnotesquestionsListComponent extends Table implements OnInit, OnChanges {
     
  @Input()  DEALID: number = 0;  
  @Output() QuestionEvent = new EventEmitter<BMRNotesQuestions>();
  DealCommentsQuestionsList: BMRNotesQuestions [] = [];    
  public searchInput = false;
  // displayedColumns: string[] = [ 'Title','NoOfReplies', 'Editor.Title', 'Created', 'ReplyBy', 'ReplyOn', 'action'];
  displayedColumns: string[] = [ 'Title'];
  
  public modalRef: MDBModalRef;
  TempListData: any[] = []

  @Input() section:string = "";
  @Input() questionId:number = null;
  @Input() isReply:boolean=false;

  constructor(
    public service: SPOperationsService, 
    public router: Router, 
    public common:CommonService,
    public modalService: MDBModalService,
    private _bottomSheet: MatBottomSheet,) {
    super(router);    
  }

  ngOnInit(): void {
    this.getQuestions();
  }

  ngOnChanges(changes: any): void {
    this.getQuestions().then(res => {
      if (this.section == "replies") {
        if (this.questionId != null) {
          var obj = this.TempListData.filter(res => { return res.ID == Number(this.questionId) });
          if (obj.length > 0) {
            this.openReplies(obj[0]);
          }
        }
      }
      else
        this.isReply = false;
    });

  }

  ngAfterViewInit() {
    //this.fillList();
  }


  async getQuestions() {

    const query = {
      select: 'ID, Title, DealId, Modified, Created, Editor/Title, EditorId, ReceipentsId, AuthorId',
      filter: 'DealId eq ' + this.DEALID ,
      expand: 'Editor',
      orderby:" Modified desc"
    };

    await this.service.readItems("BMR Notes Discussion Questions", query).then(res => {            
      //var data = res['d'].results;     
      this.TempListData = res['d'].results;
      // this.listData = new MatTableDataSource(data);
      // this.listData.sort = this.sort;
      // this.listData.paginator = this.paginator; 

      this.getRepliesCount(this.TempListData);     
    });

  }

  getRepliesCount(data:any[]){
    var query = {
      select:"ID, Title,QuestionId, Created,DealId,Reply,Editor/Title, Modified,Question/Title, AuthorId,QuestionId, ReplyNo, Editor/Title, ReceipentsId, Receipents/Title ",
      expand: 'Editor, Question, Receipents',
      filter: 'DealId eq ' + this.DEALID,     
      orderby:"Created desc",
      top:"5000"
    }

    this.service.readItems("BMR Notes Discussion Replies", query).then(res => {
      var data = res['d'].results;   
      var dataList = [];
      for(var k=0;k<data.length;k++){
       if(data[k].Title == 'Question')
         dataList.push(data[k]);
      }  
      data = dataList;
      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator; 
     var replies = res['d'].results;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        var countObj = replies.filter(res => { return res.QuestionId == element.QuestionId });
        if (countObj.length > 0) {
          if (countObj.length > 1) {
            element['ReplyBy'] = countObj[countObj.length - 1].Editor.Title;
            element['ReplyOn'] = countObj[countObj.length - 1].Modified;
          }

          element['replyCount'] = countObj.length - 1;
        }
        else
          element['replyCount'] = 0;
      }

      this.listData = new MatTableDataSource(data);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

    })
  }

  replies:BMRNotesReplies[] = [];
  currentQuestion:any;
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

  openBottomReplySheet(row): void {
    this.common.ShowSpinner();
    this.getReplies(row.ID).then(res => {
      this.common.HideSpinner()
      
      this._bottomSheet.open(BmrReplyBottomSheetComponent,
        {
          disableClose: false,
          panelClass: 'bottomSheetHeight',
          data: { data: row, replies: this.replies }
        }
      );

      this._bottomSheet._openedBottomSheetRef.afterDismissed().subscribe(res=>{
        this.getQuestions();
      })

    })
  }

  
  openReplies(row){
    this.common.ShowSpinner();    
    var passParam = 0;
    if(row.QuestionId == undefined)
      passParam = row.ID;
    else
      passParam = row.QuestionId;
    this.getReplies(row.QuestionId).then(res=>{
      this.currentQuestion = row;
      this.common.HideSpinner()
      this.isReply = true;
    })
  }

  backToQuestions(){
    this.isReply = false;
    this.getQuestions();
  }

  onBottomSheetClose(data){
    this.openReplies(data);
  }

  openDialog(): void {

    this.modalRef = this.modalService.show(BmrnotesquestionsComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-fluid modal-content modal-dialog cascading-modal modal-top mt',
      containerClass: '',
      animated: true,
      styles: "overflow-y: auto",     
      data: {
        DEALID: this.DEALID,
      } 
    });
  
    this.modalRef.content.action.subscribe((result: any) => {
      this.getQuestions();
        // this.getNotesData().then(res=>{
        //   this.fillList();
        // });
        
    })
   
  }


}

