import { Directive, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
//import { LoginUser } from './User/login-user';
//import { UserSecure } from './User/UserSecure';

@Directive({
  selector: '[appRBACModuleAccess]'
  //providers:[UserSecure]
})
export class RBACModuleAccessDirective implements OnInit {
 

  @Input() ModuleName: string;

  constructor(public el: ElementRef) {
  }

  ngOnInit() {

  }

}
