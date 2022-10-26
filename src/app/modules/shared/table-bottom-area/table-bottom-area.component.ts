import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-bottom-area',
  templateUrl: './table-bottom-area.component.html',
  styleUrls: ['./table-bottom-area.component.scss']
})
export class TableBottomAreaComponent implements OnInit {

  @Input() listData: MatTableDataSource<any>;
  @Input() search:string;

  constructor() { }

  ngOnInit(): void {

  }

}
