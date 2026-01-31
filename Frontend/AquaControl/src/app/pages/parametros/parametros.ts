import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditarParametroDialog } from '../../dialogs/editar-parametro-dialog/editar-parametro-dialog';
import { DataService, ParametroElement, CultivoElement } from '../../services/data';

@Component({
  selector: 'app-parametros',
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
  templateUrl: './parametros.html',
  styleUrl: './parametros.css',
})
export class Parametros implements OnInit {

  private dialog = inject(MatDialog);
  private dataService = inject(DataService);

  datosParametros: ParametroElement[] = [];
  listaCultivos: CultivoElement[] = []; // Lista necesaria para saber a qué cultivo pertenece la medición

  dataSource = new MatTableDataSource<ParametroElement>([]);

  displayedColumns: string[] = ['id', 'cultivoId', 'fecha', 'ph', 'temperatura', 'oxigeno', 'salinidad', 'acciones'];

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargamos los Cultivos (para el Select del diálogo)
    this.dataService.getCultivos().subscribe({
      next: (cultivos) => {
        this.listaCultivos = cultivos;
      },
      error: (e) => console.error('Error cargando cultivos:', e)
    });

    // 2. Cargamos los Parámetros
    this.dataService.getParametros().subscribe({
      next: (data) => {
        this.datosParametros = data;
        this.dataSource.data = this.datosParametros;
      },
      error: (e) => console.error('Error cargando parámetros:', e)
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  eliminarParametro(id: number) {
    if (confirm('¿Borrar esta medición?')) {
      this.dataService.deleteParametro(id).subscribe({
        next: () => {
          this.cargarDatos(); // Recargar tabla
        },
        error: (e) => alert('Error al eliminar el parámetro.')
      });
    }
  }

  editarParametro(parametro: ParametroElement) {
    const dialogRef = this.dialog.open(EditarParametroDialog, {
      width: '400px',
      data: {
        parametro: { ...parametro },
        listaCultivos: this.listaCultivos
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  crearParametros() {
    const nuevoParametro: ParametroElement = {
      id: 0,
      cultivoId: 0,
      fecha: new Date().toISOString(),
      ph: 0,
      temperatura: 0,
      oxigeno: 0,
      salinidad: 0
    };

    const dialogRef = this.dialog.open(EditarParametroDialog, {
      width: '400px',
      data: {
        parametro: nuevoParametro,
        listaCultivos: this.listaCultivos
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  private procesarGuardado(item: ParametroElement) {
    if (item.id === 0) {
      // CREAR (POST)
      this.dataService.createParametro(item).subscribe({
        next: () => this.cargarDatos(),
        error: (e) => console.error(e)
      });
    } else {
      // EDITAR (PUT)
      this.dataService.updateParametro(item).subscribe({
        next: () => this.cargarDatos(),
        error: (e) => console.error(e)
      });
    }
  }
}
