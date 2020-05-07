import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubsciption: Subscription;
  private _user: Usuario; //para tener acceso rapido a todas las propiedades del usuario SOLO PARA FINES DE LECTURA!!

  get user(){ 
    //return {... this._user }; //para prevenir mutaciones o cualquier otra cosa
    return this._user; //pero no hay relaciones directas con este usuario asi q asi lo dejamos (queda a discrecion de nosotros)
  }

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore,
               private store: Store<AppState>,  
  ) { }

  initAuthListener(){

    this.auth.authState.subscribe( fuser => {
      // console.log(fuser?.uid);
      if ( fuser ) { //si existe el usuario

        this.userSubsciption = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
                    
            const user = Usuario.formFirebase( firestoreUser );    
            this._user = user //'this.user' se va actualizar cuando ya tengo el usuario  
            this.store.dispatch( authActions.setUser({ user })); 
            
          } )

      }else{ //si no existe el usuario
        this._user = null;//tambien hay q limpiarlo cuando hacemos unsuscribe
        this.userSubsciption.unsubscribe();
        this.store.dispatch( authActions.unSetUser()); 
        this.store.dispatch( ingresoEgresoActions.unSetItems() );
        //todo esto es para purgar
      }          
    } )

  }

  crearUsuario( nombre:string, email: string, password: string ){
    // console.log( { nombre, email, password } );

    return this.auth.createUserWithEmailAndPassword( email, password )
                .then( fbUser => {
                  //newUser = instancia de la clase Usuario
                  const newUser = new Usuario( fbUser.user.uid, nombre, email ); //o fbUser.user.email
                  return this.firestore.doc(`${ fbUser.user.uid }/usuario`).set({...newUser});//firebase no acpeta instancia de clases, tienen q ser objetos. Por eso la desestructuracion
                  //con dicha desestructuracion estoy extrayendo las propiedades del newUser y se las envío, transformandolas en un objeto
                } )

  }

  login( email:string, password:string ){
    return this.auth.signInWithEmailAndPassword( email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){ //para saber si esta autenticado o no (lo usaremos en el auth.guard)
    return this.auth.authState.pipe(
      map( fUser => fUser != null )//si es diferente, retornara null. Caso contrario false 
    );
  }

}
