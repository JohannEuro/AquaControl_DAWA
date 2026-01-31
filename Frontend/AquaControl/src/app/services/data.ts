import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// ==========================================
// 1. DEFINICIÓN DE INTERFACES
// ==========================================

export interface PiscinaElemento {
  id: number;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  estado: string;
}

export interface CultivoElement {
  id: number;
  piscinaId: number;
  nombrePiscina?: string; // Opcional, viene del backend para mostrar nombre
  fechaSiembra: string;
  especie: string;
  cantidadInicial: number;
  observaciones: string;
}

export interface ParametroElement {
  id: number;
  cultivoId: number;
  especie?: string; // Opcional, para mostrar en tabla
  fecha: string;
  ph: number;
  temperatura: number;
  oxigeno: number;
  salinidad: number;
}

export interface AlimentacionElement {
  id: number;
  cultivoId: number;
  especie?: string; // Opcional, para mostrar en tabla
  fecha: string;
  tipoAlimento: string;
  cantidad: number;
  observaciones: string;
}

export interface UsuarioElement {
  id: number;
  nombre: string;
  correo: string;
  clave: string;
  rol?: string;       // Opcional (Front)
  estado?: string;    // Opcional (Front)
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // URL DEL BACKEND (DOCKER)
  private readonly apiUrl = 'http://localhost:5000/api';

  // INYECCIÓN DE HTTP CLIENT
  private http = inject(HttpClient);

  constructor() { }

  // ==========================================
  // 1. GESTIÓN DE PISCINAS (CONECTADO A API)
  // ==========================================

  getPiscinas(): Observable<PiscinaElemento[]> {
    return this.http.get<PiscinaElemento[]>(`${this.apiUrl}/Piscinas`);
  }

  createPiscina(piscina: PiscinaElemento): Observable<any> {
    return this.http.post(`${this.apiUrl}/Piscinas`, piscina);
  }

  updatePiscina(piscina: PiscinaElemento): Observable<any> {
    return this.http.put(`${this.apiUrl}/Piscinas/${piscina.id}`, piscina);
  }

  deletePiscina(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Piscinas/${id}`);
  }

  // ==========================================
  // 2. GESTIÓN DE CULTIVOS (CONECTADO A API)
  // ==========================================

  getCultivos(): Observable<CultivoElement[]> {
    return this.http.get<CultivoElement[]>(`${this.apiUrl}/Cultivos`);
  }

  createCultivo(cultivo: CultivoElement): Observable<any> {
    return this.http.post(`${this.apiUrl}/Cultivos`, cultivo);
  }

  updateCultivo(cultivo: CultivoElement): Observable<any> {
    return this.http.put(`${this.apiUrl}/Cultivos/${cultivo.id}`, cultivo);
  }

  deleteCultivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Cultivos/${id}`);
  }

  // ==========================================
  // 3. GESTIÓN DE PARÁMETROS (CONECTADO A API)
  // ==========================================

  getParametros(): Observable<ParametroElement[]> {
    return this.http.get<ParametroElement[]>(`${this.apiUrl}/Parametros`);
  }

  createParametro(parametro: ParametroElement): Observable<any> {
    return this.http.post(`${this.apiUrl}/Parametros`, parametro);
  }

  updateParametro(parametro: ParametroElement): Observable<any> {
    return this.http.put(`${this.apiUrl}/Parametros/${parametro.id}`, parametro);
  }

  deleteParametro(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Parametros/${id}`);
  }

  // ==========================================
  // 4. GESTIÓN DE ALIMENTACIÓN (CONECTADO A API)
  // ==========================================

  getAlimentacion(): Observable<AlimentacionElement[]> {
    return this.http.get<AlimentacionElement[]>(`${this.apiUrl}/Alimentacion`);
  }

  createAlimentacion(alimentacion: AlimentacionElement): Observable<any> {
    return this.http.post(`${this.apiUrl}/Alimentacion`, alimentacion);
  }

  updateAlimentacion(alimentacion: AlimentacionElement): Observable<any> {
    return this.http.put(`${this.apiUrl}/Alimentacion/${alimentacion.id}`, alimentacion);
  }

  deleteAlimentacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Alimentacion/${id}`);
  }

  // ==========================================
  // 5. GESTIÓN DE USUARIOS (CONECTADO A API)
  // ==========================================

  getUsuarios(): Observable<UsuarioElement[]> {
    return this.http.get<UsuarioElement[]>(`${this.apiUrl}/Usuarios`);
  }

  saveUsuario(usuario: UsuarioElement): Observable<any> {
    return this.http.post(`${this.apiUrl}/Usuarios`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Usuarios/${id}`);
  }
}
