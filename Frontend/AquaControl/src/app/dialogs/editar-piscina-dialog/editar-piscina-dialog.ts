import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para [(ngModel)]

// Imports de Material para el diálogo
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-editar-piscina-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './editar-piscina-dialog.html',
  styleUrl: './editar-piscina-dialog.css',
})
export class EditarPiscinaDialog {
  constructor(
    //Esta referencia nos permite cerrar el diálogo
    public dialogRef: MatDialogRef<EditarPiscinaDialog>,

    //Aquí recibimos la data que nos pasó el componente padre (Piscinas)
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    this.dialogRef.close(this.data);
  }
}
