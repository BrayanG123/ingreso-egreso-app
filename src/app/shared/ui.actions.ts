import { createAction } from '@ngrx/store';


export const isLoading   = createAction('[UI Component] Is Loading');
export const stopLoading = createAction('[UI Component] Stop Loading');

// export const crear = createAction(
//      '[TODO] Crear Todo',
//      props<{ texto:String }>()
// );