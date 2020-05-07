import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';//para hacer referencia a la coleccion de firebase
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private firestore: AngularFirestore, //para hacer referencia a la coleccion de firebase
               private authService: AuthService  
  ) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ){
    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid;//clase 108, min7:00 redux-angular

    return this.firestore.doc(`${ uid }/ingresos-egresos`) //pero esto es una coleccion no un documento
                  .collection('items')
                  .add({... ingresoEgreso})
                  // .then( (ref) => {console.log('insertado!!', ref);} )
                  // .catch( err => console.log(err))

                  //para añadir en el add tiene q ser un objeto no una instancia de mi clase (mismo problema q al insertar un usuario). Lo transformamos a su objeto con la desestructuracion (Solo mando las propiedades del mismo)
                  //'collection' con eso sera una coleccion de elementos
                  //'items' el nombre q le quiero dar a la coleccion
  }
  
  //para estar pendiente de cualquier cambio que suceda
  initIngresosEgresosListener( uid:string ){//el uid lo necesitamos para poder suscribirnos
    return this.firestore.collection(`${ uid }/ingresos-egresos/items`) //.valueChanges()
        .snapshotChanges()
        .pipe(
          map( snapshot => {
            return snapshot.map( doc => {
              return {
                uid: doc.payload.doc.id,
                ...doc.payload.doc.data() as any
              }
            })
          })
        )
        // .subscribe( algo => { // el subscribe era solo para fines de pruebas
        //   console.log(algo);
        // })
  }

  borrarIngresoEgreso( uidItem ){

    const uid = this.authService.user.uid;
    return this.firestore.doc(`${ uid }/ingresos-egresos/items/${ uidItem }`).delete();
    
  }

}
