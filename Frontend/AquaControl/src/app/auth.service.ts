import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // IMPORTANTE
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { UsuarioElement } from './services/data'; // Importa la interfaz

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // URL del Backend
  private readonly apiUrl = 'http://localhost:5000/api/Usuarios/login';

  private http = inject(HttpClient);

  // Variable de estado
  public logeado = new BehaviorSubject<string | null>(null);

  constructor() { }

  // INICIO DE SESION
  public login(correo: string, clave: string): Observable<boolean> {

    const body = { correo: correo, clave: clave };

    // Hacemos POST a la API
    return this.http.post<UsuarioElement>(this.apiUrl, body).pipe(
      tap(usuarioRespuesta => {
        // SI ES EXITOSO (La API devuelve el usuario)
        if (usuarioRespuesta) {
          this.logeado.next(usuarioRespuesta.nombre); // Guardamos el nombre
          console.log('Servicio: Login exitoso en SQL');
        }
      }),
       map(() => true),

      catchError(error => {
        // SI FALLA (401 Unauthorized)
        console.error('Error de login', error);
        this.logeado.next(null);
        return of(false);
      })
    );
  }

  public logout(): void {
    this.logeado.next(null);
  }
}
