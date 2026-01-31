import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-editar-usuario-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './editar-usuario-dialog.html',
  styleUrl: './editar-usuario-dialog.css',
})
export class EditarUsuarioDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditarUsuarioDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // Si data llega vacía (por seguridad), inicializamos
    if (!this.data) {
      this.data = { id: 0, nombreCompleto: '', usuario: '', email: '', rol: '', estado: '' };
    }
  }

  cancelar(): void { this.dialogRef.close(); }
  guardar(): void { this.dialogRef.close(this.data); }
}
