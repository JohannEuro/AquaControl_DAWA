import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DataService, UsuarioElement } from '../../services/data';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  private dataService = inject(DataService);

  // Columnas de la tabla
  displayedColumns: string[] = ['id', 'nombre', 'correo', 'clave', 'acciones'];
  dataSource = new MatTableDataSource<UsuarioElement>([]);

  // Variables para el Formulario en pantalla
  usuarioActual: UsuarioElement = {
    id: 0,
    nombre: '',
    correo: '',
    clave: ''
  };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.dataService.getUsuarios().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  // --- LÓGICA DEL FORMULARIO EN PANTALLA ---

  guardar() {
    // Validación
    if (!this.usuarioActual.correo || !this.usuarioActual.clave) {
      alert("Por favor completa correo y clave");
      return;
    }

    this.dataService.saveUsuario(this.usuarioActual).subscribe({
      next: () => {
        alert(this.usuarioActual.id === 0 ? 'Usuario creado' : 'Usuario actualizado');
        this.limpiarFormulario();
        this.cargarDatos(); // Recargar tabla
      },
      error: (e) => alert('Error al guardar: ' + e.message)
    });
  }

  editar(usuario: UsuarioElement) {
    // Copiamos los datos al formulario de arriba
    this.usuarioActual = { ...usuario };
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.dataService.deleteUsuario(id).subscribe(() => {
        this.cargarDatos();
      });
    }
  }

  limpiarFormulario() {
    this.usuarioActual = { id: 0, nombre: '', correo: '', clave: '' };
  }
}
