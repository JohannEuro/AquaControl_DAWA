import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Acerca } from './pages/acerca/acerca';
import { Login } from './login/login';
import { PanelPrincipal } from './pages/panel-principal/panel-principal';

//SS
import { Usuarios } from './pages/usuarios/usuarios';
import { Piscinas } from './pages/piscinas/piscinas';
import { Cultivos } from './pages/cultivos/cultivos';
import { Parametros } from './pages/parametros/parametros';
import { Alimentacion } from './pages/alimentacion/alimentacion';



export const routes: Routes = [
  { path:'', component: Home },
  { path:'iniciar-sesion', component: Login },
  { path:'acerca-de', component: Acerca },
  { path:'panel', component: PanelPrincipal },

  { path:'usuarios',component: Usuarios},
  { path:'piscinas',component: Piscinas},
  { path:'cultivos',component: Cultivos},
  { path:'parametros',component: Parametros},
  { path:'alimentacion',component: Alimentacion},




  // Si el usuario escribe cualquier otra cosa, redirige a la página principal
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
