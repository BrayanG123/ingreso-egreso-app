import { Component, OnInit, OnDestroy } from '@angular/core';

import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor( private store: Store<AppState>,
               private ingresoEgresoService :IngresoEgresoService  
  ) { }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select('ingresoEgreso')
        .subscribe( ({ items }) => this.ingresosEgresos = items );
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  borrar( uid:string ){
    console.log(uid);
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
        .then( () => Swal.fire('Borrado', 'Item borrado', 'success'))
        .catch( err => Swal.fire('Error', err.message, 'error'))
  }
}
