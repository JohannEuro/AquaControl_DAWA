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
import { EditarAlimentacionDialog } from '../../dialogs/editar-alimentacion-dialog/editar-alimentacion-dialog';
import { DataService, AlimentacionElement, CultivoElement } from '../../services/data';

@Component({
  selector: 'app-alimentacion',
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
  templateUrl: './alimentacion.html',
  styleUrl: './alimentacion.css',
})
export class Alimentacion implements OnInit {

  private dialog = inject(MatDialog);
  private dataService = inject(DataService);

  datosAlimentacion: AlimentacionElement[] = [];
  listaCultivos: CultivoElement[] = []; // Para el dropdown del diálogo

  dataSource = new MatTableDataSource<AlimentacionElement>([]);

  displayedColumns: string[] = ['id', 'cultivoId', 'fecha', 'tipoAlimento', 'cantidad', 'observaciones', 'acciones'];

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargamos la lista de Cultivos (para saber a quién alimentamos)
    this.dataService.getCultivos().subscribe({
      next: (cultivos) => {
        this.listaCultivos = cultivos;
      },
      error: (e) => console.error('Error cargando cultivos:', e)
    });

    // 2. Cargamos los registros de Alimentación
    this.dataService.getAlimentacion().subscribe({
      next: (data) => {
        this.datosAlimentacion = data;
        this.dataSource.data = this.datosAlimentacion;
      },
      error: (e) => console.error('Error cargando alimentación:', e)
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  eliminarAlimentacion(id: number) {
    if (confirm('¿Borrar este registro de alimentación?')) {
      this.dataService.deleteAlimentacion(id).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (e) => alert('Error al eliminar. Intente nuevamente.')
      });
    }
  }

  editarAlimentacion(item: AlimentacionElement) {
    const dialogRef = this.dialog.open(EditarAlimentacionDialog, {
      width: '400px',

      data: {
        alimentacion: { ...item },
        listaCultivos: this.listaCultivos
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  crearAlimentacion() {
    const nuevaAlimentacion: AlimentacionElement = {
      id: 0,
      cultivoId: 0,
      fecha: new Date().toISOString(),
      tipoAlimento: '',
      cantidad: 0,
      observaciones: ''
    };

    const dialogRef = this.dialog.open(EditarAlimentacionDialog, {
      width: '400px',

      data: {
        alimentacion: nuevaAlimentacion,
        listaCultivos: this.listaCultivos
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  private procesarGuardado(item: AlimentacionElement) {
    if (item.id === 0) {
      // CREAR (POST)
      this.dataService.createAlimentacion(item).subscribe({
        next: () => this.cargarDatos(),
        error: (e) => console.error(e)
      });
    } else {
      // EDITAR (PUT)
      this.dataService.updateAlimentacion(item).subscribe({
        next: () => this.cargarDatos(),
        error: (e) => console.error(e)
      });
    }
  }
}
