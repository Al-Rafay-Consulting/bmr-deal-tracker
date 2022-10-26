import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../Common.service';
import { LoginUser } from '../User/login-user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(public common: CommonService, public router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.common.CheckIfUserhasAccess_Section(route.data.sectionName) == false)
      return true;
    else
      this.router.navigate(["/AccessDenied"], { queryParams: { location: window.location.href } });

    return false;
  }

}
