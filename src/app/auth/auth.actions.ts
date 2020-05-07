import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';


export const setUser = createAction(
    '[Auth] setUser',
    props<{ user: Usuario }>()
);

//para quitar el usuario activo
export const unSetUser = createAction('[Auth] unSetUser');
