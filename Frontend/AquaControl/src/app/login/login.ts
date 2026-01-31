import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {

  public usuario = '';
  public clave:string = '';

  //Inyeccion de servicio
  private authService = inject(AuthService);
  private router=inject(Router);

  public alHacerLogin(): void{
    alert('Se procederá a validar las credenciales de acceso');

    const esValido = this.authService.login(this.usuario, this.clave);

    if(esValido){

      alert('Inicio de sesión exitoso')
      this.router.navigate(['/panel']);

    } else {
      alert('Usuario o clave incorrectos')
      this.clave = '';
    }


  }
}
