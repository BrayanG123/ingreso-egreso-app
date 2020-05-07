import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from '../shared/ui.actions';



@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';

  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor( private fb: FormBuilder,
               private ingresoEgresoService: IngresoEgresoService,
               private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    //tienen q llamarse igual q el modelo
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.loadingSubs = this.store.select('ui')
                              .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(){
    this.loadingSubs.unsubscribe(); //para evitar la fuga de memoria por las subscripciones duplicadas
  }

  guardar(){
    if ( this.ingresoForm.invalid )  return;
    
    this.store.dispatch( isLoading() );

    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );
    
    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
          .then( () => {
            this.store.dispatch( stopLoading() )
            this.ingresoForm.reset(); //para limpiar el formulario
            Swal.fire('Registro creado!', descripcion, 'success');
          })
          .catch( err => {
            this.store.dispatch( stopLoading() )
            Swal.fire('Error', err.message, 'error')
          } )
  }

}
