import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //Variable de estado
  public logeado = new BehaviorSubject<string | null>(null);

  //USUARIOS Y CLAVES
  private usuariosTest =[
    { usuario: 'admin', clave: '12345'},
    { usuario: 'Carlos', clave: '12345' }
  ]

  constructor() { }

  //INICIO DE SESION (ESTADO)
  public login(usuario: string, clave: string): boolean {

    const usuarioEncontrado = this.usuariosTest.find (u => u.usuario === usuario && u.clave === clave);

    if(usuarioEncontrado){
      this.logeado.next(usuarioEncontrado.usuario);
      console.log('Servicio: Usuario ha iniciado sesion');
      return true;
    } else {
      this.logeado.next(null)
      console.log('Credenciales Invalidas');
      return false;
    }
  }

  //CIERRE DE SESION (ESTADO)
  public logout(): void {
    this.logeado.next(null);
    console.log('Servicio: Usuario ha cerrado sesion');
  }
}
