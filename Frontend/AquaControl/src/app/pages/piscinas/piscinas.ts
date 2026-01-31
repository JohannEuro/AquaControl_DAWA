import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

// Imports de Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditarPiscinaDialog } from '../../dialogs/editar-piscina-dialog/editar-piscina-dialog';
import { DataService, PiscinaElemento } from '../../services/data'; // Asegúrate que esta ruta sea correcta

@Component({
  selector: 'app-piscinas',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './piscinas.html',
  styleUrl: './piscinas.css',
})
export class Piscinas implements OnInit {

  private dialog = inject(MatDialog);
  private dataService = inject(DataService);

  datosPiscinas: PiscinaElemento[] = [];
  dataSource = new MatTableDataSource<PiscinaElemento>([]);

  displayedColumns: string[] = ['id', 'nombre', 'ubicacion', 'capacidad', 'estado', 'acciones'];

  ngOnInit() {
    this.cargarDatos();
  }

  // --- CAMBIO 1: CARGAR DATOS ---
  // Ahora usamos .subscribe() porque los datos vienen de Internet (Docker)
  cargarDatos() {
    this.dataService.getPiscinas().subscribe({
      next: (data) => {
        this.datosPiscinas = data;
        this.dataSource.data = this.datosPiscinas;
      },
      error: (e) => console.error('Error cargando piscinas:', e)
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  // --- CAMBIO 2: ELIMINAR ---
  eliminarPiscina(id: number) {
    if (confirm('¿Estás seguro de eliminar esta piscina?')) {
      // Llamamos a la API para borrar
      this.dataService.deletePiscina(id).subscribe({
        next: () => {
          // Si salió bien, recargamos la tabla para ver el cambio
          this.cargarDatos();
        },
        error: (e) => alert('No se pudo eliminar. Verifique que no tenga cultivos asociados.')
      });
    }
  }

  editarPiscina(piscina: PiscinaElemento) {
    const dialogRef = this.dialog.open(EditarPiscinaDialog, { width: '400px', data: { ...piscina } });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  crearPiscina() {
    const nuevaPiscina: PiscinaElemento = { id: 0, nombre: '', ubicacion: '', capacidad: 0, estado: 'Activa' };

    const dialogRef = this.dialog.open(EditarPiscinaDialog, {
      width: '400px',
      data: nuevaPiscina
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.procesarGuardado(resultado);
      }
    });
  }

  // --- CAMBIO 3: GUARDAR (CREAR O EDITAR) ---
  // Esta función decide si es POST (Nuevo) o PUT (Editar)
  private procesarGuardado(piscina: PiscinaElemento) {
    if (piscina.id === 0) {
      // ES NUEVA (CREATE)
      this.dataService.createPiscina(piscina).subscribe({
        next: () => this.cargarDatos(), // Recargar tabla al terminar
        error: (e) => console.error(e)
      });
    } else {
      // ES EDICIÓN (UPDATE)
      this.dataService.updatePiscina(piscina).subscribe({
        next: () => this.cargarDatos(), // Recargar tabla al terminar
        error: (e) => console.error(e)
      });
    }
  }

}
