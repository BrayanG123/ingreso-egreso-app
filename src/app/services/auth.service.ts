import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore  
  ) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
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
