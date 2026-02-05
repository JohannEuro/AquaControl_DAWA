import { Component, inject } from '@angular/core';
import {CommonModule, NgIf, AsyncPipe} from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';


import { AuthService } from '../auth.service';
import { Observable, observable } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDivider } from '@angular/material/divider';




@Component({
  selector: 'app-menu-horizontal',
  imports: [
    CommonModule,
    NgIf,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    MatMenuModule,
    MatDivider,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './menu-horizontal.html',
  styleUrl: './menu-horizontal.css',
})

export class MenuHorizontal {
  //Autenticacion Servicio (INYECCION)
  public auth = inject(AuthService);
  private router=inject(Router);

  //Variable Estado para html
  //public estaLogueado$: Observable<boolean>;
  public nombreUsuario$: Observable<string | null>;

  constructor(){
    this.nombreUsuario$ = this.auth.logeado;


  }

  // 8. Método para que el botón "Salir" llame al servicio
  public alCerrarSesion(): void {


    this.auth.logout();
    this.router.navigate(['/']);
  }

}
