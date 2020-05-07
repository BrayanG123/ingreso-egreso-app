
import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';


export const unSetItems = createAction('[IngresoEgreso] Unset Itmes');

export const setItmes   = createAction(
    '[IngresoEgreso] setItmes',
    props<{ items: IngresoEgreso[] }>() //recibira un arreglo de items   
);

