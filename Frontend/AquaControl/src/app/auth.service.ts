import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { UsuarioElement } from './services/data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:5000/api/Usuarios/login';
  private http = inject(HttpClient);

  // Llave para guardar en el navegador
  private readonly KEY_SESION = 'aqua_session_user';
  private readonly KEY_ROL = 'aqua_role';

  // Variable de estado
  public logeado = new BehaviorSubject<string | null>(null);
  public rolActual = new BehaviorSubject<string | null>(null);

  constructor() {
    const usuarioGuardado = localStorage.getItem(this.KEY_SESION);
    const rol = localStorage.getItem(this.KEY_ROL);
    if (usuarioGuardado) {
      this.logeado.next(usuarioGuardado);
    }
    if (rol){
      this.rolActual.next(rol);
    }
  }

  // INICIO DE SESION
  public login(correo: string, clave: string): Observable<boolean> {
    const body = { correo: correo, clave: clave };

    return this.http.post<UsuarioElement>(this.apiUrl, body).pipe(
      tap(usuarioRespuesta => {
        if (usuarioRespuesta) {
          // Guardamos en RAM (para que la barra cambie ya)
          const nombreUser = usuarioRespuesta.nombre;
          const rol = usuarioRespuesta.rol || 'Productor';

          this.logeado.next(nombreUser);
          this.rolActual.next(rol);

          // GUARDAR EN DISCO LA SESION
          localStorage.setItem(this.KEY_SESION, nombreUser);
          localStorage.setItem(this.KEY_ROL, rol);

          console.log('Login exitoso y guardado');
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Error de login', error);
        this.logeado.next(null);
        return of(false);
      })
    );
  }

  // CIERRE DE SESION
  public logout(): void {
    // Borramos de RAM
    this.logeado.next(null);
    this.rolActual.next(null);
    // Borramos de DISCO
    localStorage.removeItem(this.KEY_SESION);
    localStorage.removeItem(this.KEY_ROL);
  }

  // Método para saber si está logueado sin suscribirse
  public estaLogueado(): boolean {
    return localStorage.getItem(this.KEY_SESION) !== null;
  }

  public esAdmin(): boolean {
    // Retorna true si el rol guardado es 'Admin'
    return localStorage.getItem(this.KEY_ROL) === 'Admin';
  }
}
