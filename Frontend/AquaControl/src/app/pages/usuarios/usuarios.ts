import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// Asegúrate de importar la interfaz y servicio correctos
import { DataService, UsuarioElement } from '../../services/data';
import { EditarUsuarioDialog } from '../../dialogs/editar-usuario-dialog/editar-usuario-dialog';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  private dialog = inject(MatDialog);
  private dataService = inject(DataService);

  // Columnas actualizadas a los nombres de la API
  displayedColumns: string[] = ['id', 'nombre', 'correo', 'clave', 'acciones'];

  dataSource = new MatTableDataSource<UsuarioElement>([]);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // AHORA: Petición HTTP GET
    this.dataService.getUsuarios().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  crearUsuario() {
    const nuevoUsuario: UsuarioElement = {
      id: 0,
      nombre: '',
      correo: '',
      clave: '',
      rol: 'Admin', // Valor
      estado: 'Activo' // Valor
    };

    const dialogRef = this.dialog.open(EditarUsuarioDialog, {
      width: '400px',
      data: nuevoUsuario
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.guardarEnServidor(resultado);
      }
    });
  }

  editarUsuario(usuario: UsuarioElement) {
    const dialogRef = this.dialog.open(EditarUsuarioDialog, {
      width: '400px',
      data: { ...usuario }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.guardarEnServidor(resultado);
      }
    });
  }

  // GUARDAR
  private guardarEnServidor(usuario: UsuarioElement) {
    this.dataService.saveUsuario(usuario).subscribe({
      next: () => {
        alert('Usuario guardado correctamente');
        this.cargarDatos(); // Recargamos la tabla
      },
      error: (e) => alert('Error al guardar: ' + e.message)
    });
  }
  // ELIMINAR
  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar este usuario?')) {
      this.dataService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarDatos(); // Recargar tabla
        },
        error: (e) => alert('Error al eliminar')
      });
    }
  }
}
