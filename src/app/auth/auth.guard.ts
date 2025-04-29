import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isLoggedIn) {
      // Check if route requires admin role
      if (route.data['roles'] && route.data['roles'].includes('ROLE_ADMIN') && !this.authService.isAdmin()) {
        return this.router.createUrlTree(['/dashboard']);
      }

      // Check if route requires scanner role
      if (route.data['roles'] && route.data['roles'].includes('ROLE_SCANNER') && !this.authService.isScanner()) {
        return this.router.createUrlTree(['/dashboard']);
      }

      return true;
    }

    return this.router.createUrlTree(['/auth/login']);
  }
}
