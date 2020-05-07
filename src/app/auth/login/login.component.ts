import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;

  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private _authService: AuthService,
               private store: Store<AppState>,
               private router: Router
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
                              .subscribe( ui => {
                                // console.log('cargando subs');
                                this.cargando = ui.isLoading });

  }

  ngOnDestroy(): void{ 
    this.uiSubscription.unsubscribe(); //para evitar la fuga de memoria por las subscripciones duplicadas
  }

  login(){

    if (this.loginForm.invalid)  return;

    this.store.dispatch( ui.isLoading() );
    
    // Swal.fire({
    //   title: 'Espere',
    //   onBeforeOpen: () => Swal.showLoading()     
    // });
  
    const { email, password } = this.loginForm.value; //Desestructuracion
    this._authService.login( email, password )
            .then( credenciales => {
              console.log(credenciales);
              // Swal.close();
              this.store.dispatch( ui.stopLoading() );
              this.router.navigate(['/']);
            } )
            .catch( err => 
              this.store.dispatch( ui.stopLoading() )
              // Swal.fire({
              //   icon: 'error',
              //   title: 'Oops...',
              //   text: err.message,
              // })
            );

  }

}
