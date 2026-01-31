import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditarCultivoDialog } from '../../dialogs/editar-cultivo-dialog/editar-cultivo-dialog';
// Importamos las interfaces correctas del nuevo servicio
import { DataService, CultivoElement, PiscinaElemento } from '../../services/data';

@Component({
  selector: 'app-cultivos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './cultivos.html',
  styleUrl: './cultivos.css',
})
export class Cultivos implements OnInit {

  private dialog = inject(MatDialog);
  private dataService = inject(DataService);

  datosCultivos: CultivoElement[] = [];
  listaPiscinas: PiscinaElemento[] = []; // Necesaria para el dropdown del diálogo y mostrar nombres

  dataSource = new MatTableDataSource<CultivoElement>([]);

  displayedColumns: string[] = ['id', 'piscinaId', 'fechaSiembra', 'especie', 'cantidadInicial', 'observaciones', 'acciones'];

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargamos las Piscinas (para tener los nombres disponibles)
    this.dataService.getPiscinas().subscribe({
      next: (piscinas) => {
        this.listaPiscinas = piscinas;
      },
      error: (e) => console.error('Error cargando piscinas:', e)
    });

    // 2. Cargamos los Cultivos
    this.dataService.getCultivos().subscribe({
      next: (cultivos) => {
        this.datosCultivos = cultivos;
        this.dataSource.data = this.datosCultivos;
      },
      error: (e) => console.error('Error cargando cultivos:', e)
    });
  }

  // Método auxiliar para obtener el NOMBRE de la piscina en lugar del ID
  getNombrePiscina(id: number): string {
    // Intentamos buscar en la lista cargada
    const piscina = this.listaPiscinas.find(p => p.id === id);
    return piscina ? piscina.nombre : 'Cargando...';
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  eliminarCultivo(id: number) {
    if (confirm('¿Eliminar este cultivo?')) {
      this.dataService.deleteCultivo(id).subscribe({
        next: () => {
          // Recargamos la tabla tras eliminar
          this.cargarDatos();
        },
        error: (e) => alert('No se pudo eliminar. Verifique dependencias (parámetros/alimentación).')
      });
    }
  }

  editarCultivo(cultivo: CultivoElement) {
    const dialogRef = this.dialog.open(EditarCultivoDialog, {
      width: '400px',
      // Pasamos el cultivo y TAMBIÉN la lista de piscinas para que el Select funcione en el Dialog
      data: {
        cultivo: { ...cultivo },
        listaPiscinas: this.listaPiscinas
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  crearCultivo() {
    const nuevoCultivo: CultivoElement = {
      id: 0,
      piscinaId: 0,
      fechaSiembra: new Date().toISOString(),
      especie: '',
      cantidadInicial: 0,
      observaciones: ''
    };

    const dialogRef = this.dialog.open(EditarCultivoDialog, {
      width: '400px',
      data: {
        cultivo: nuevoCultivo,
        listaPiscinas: this.listaPiscinas
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  // Función unificada para Guardar (Crear o Editar)
  private procesarGuardado(cultivo: CultivoElement) {
    if (cultivo.id === 0) {
      // CREAR (POST)
      this.dataService.createCultivo(cultivo).subscribe({
        next: () => this.cargarDatos(),
        error: (e) => console.error('Error creando:', e)
      });
    } else {
      // EDITAR (PUT)
      this.dataService.updateCultivo(cultivo).subscribe({
        next: () => this.cargarDatos(),
        error: (e) => console.error('Error actualizando:', e)
      });
    }
  }
}
