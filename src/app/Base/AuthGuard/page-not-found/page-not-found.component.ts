import { Component, OnInit } from '@angular/core';
import { ParentBase } from '../../parent-base';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent extends ParentBase implements OnInit {

  constructor(public router?: Router ) {
    super(router);
   }

  ngOnInit(): void {
  }

}
