import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2'

import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private _authService: AuthService,  
               private store: Store<AppState>,
               private router: Router
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      correo:   ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui')
                              .subscribe( ui => {
                                // console.log('cargando subs');
                                this.cargando = ui.isLoading });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){

    if ( this.registroForm.invalid )  return;
    this.store.dispatch( ui.isLoading() );
    // Swal.fire({
    //   title: 'Espere',
    //   onBeforeOpen: () => Swal.showLoading()     
    // });

    const { nombre, correo, password } = this.registroForm.value; //desestructuracion
    this._authService.crearUsuario( nombre, correo, password )
                     .then( credenciales => {
                        console.log(credenciales);
                        this.store.dispatch( ui.stopLoading() );
                        // Swal.close();
                        this.router.navigate(['/']);
                     } )
                     .catch( err => {
                        this.store.dispatch( ui.stopLoading() );
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: err.message,
                        })}
                      );
  }

}
