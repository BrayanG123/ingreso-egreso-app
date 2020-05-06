import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators'; //el tap es para disparar un efecto secundario

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _authService: AuthService,
               private router: Router  
  ) {}

  canActivate(): Observable<boolean> {
    return this._authService.isAuth()
              .pipe( //el tap es para disparar un efecto secundario
                tap( estado => { //recibimos un valor booleano
                  if ( !estado ) this.router.navigate(['/login']);
                }) 
              )
  }
  
}
