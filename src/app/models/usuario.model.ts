
export class Usuario {

    //esto esta hecho para solucionar el problema de almacenar en el store un usuario de Firebase
    //las propiedades deben tener el mismo nombre q los campos del nodo en la database de firebase
    static formFirebase( { email, nombre, uid } ) {// con esta propiedad estatica retornaremos un new Usuario
        return new Usuario( uid, nombre, email );
    }
    
    constructor( 
        public uid    :string,     
        public nombre :string,     
        public email  :string,     
    ){}

}