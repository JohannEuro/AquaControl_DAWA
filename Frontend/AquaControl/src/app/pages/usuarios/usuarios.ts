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
import { EditarUsuarioDialog } from '../../dialogs/editar-usuario-dialog/editar-usuario-dialog';
import { DataService, UsuarioElement} from '../../services/data';


@Component({
  selector: 'app-usuarios',
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
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit{

  private dialog = inject(MatDialog);
  private dataService = inject(DataService); // Inyectar servicio

  datosUsuarios: UsuarioElement[] = [];
  dataSource = new MatTableDataSource<UsuarioElement>([]);

  displayedColumns: string[] = ['id', 'nombreCompleto', 'usuario', 'email', 'rol', 'estado', 'acciones'];

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.datosUsuarios = this.dataService.getUsuarios();
    this.dataSource.data = this.datosUsuarios;
  }

  aplicarFiltro(event: Event) {
    const valorFiltro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valorFiltro.trim().toLowerCase();
  }

  // --- CREAR NUEVO (Botón) ---
  crearUsuario() {
    // ID 0 indica que es nuevo
    const nuevoUsuario: UsuarioElement = {
      id: 0,
      nombreCompleto: '',
      usuario: '',
      email: '',
      rol: 'Productor', // Valor por defecto
      estado: 'Activo'
    };

    const dialogRef = this.dialog.open(EditarUsuarioDialog, {
      width: '400px',
      data: nuevoUsuario
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.actualizarUsuario(resultado);
      }
    });
  }

  // --- EDITAR ---
  editarUsuario(usuario: UsuarioElement) {
    const dialogRef = this.dialog.open(EditarUsuarioDialog, {
      width: '400px',
      data: { ...usuario }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.actualizarUsuario(resultado);
      }
    });
  }

  // --- GUARDAR (Crear o Editar) ---
  private actualizarUsuario(usuarioEditado: UsuarioElement) {
    const index = this.datosUsuarios.findIndex(u => u.id === usuarioEditado.id);

    if (index !== -1) {
      // EDITAR: Reemplazamos
      this.datosUsuarios[index] = usuarioEditado;
    } else {
      // CREAR: Nuevo ID y push
      const nuevoId = this.datosUsuarios.length > 0 ? Math.max(...this.datosUsuarios.map(u => u.id)) + 1 : 1;
      usuarioEditado.id = nuevoId;
      this.datosUsuarios.push(usuarioEditado);
    }

    // Guardar en servicio y refrescar tabla
    this.dataService.saveUsuarios(this.datosUsuarios);
    this.dataSource.data = this.datosUsuarios;
  }

  // --- ELIMINAR ---
  eliminarUsuario(id: number) {
    if (confirm('¿Eliminar este usuario?')) {
      this.datosUsuarios = this.datosUsuarios.filter(u => u.id !== id);
      this.dataService.saveUsuarios(this.datosUsuarios);
      this.dataSource.data = this.datosUsuarios;
    }
  }
}
