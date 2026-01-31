import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Necesario para fechas
import { AlimentacionElement, CultivoElement } from '../../services/data';

@Component({
  selector: 'app-editar-alimentacion-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './editar-alimentacion-dialog.html',
  styleUrl: './editar-alimentacion-dialog.css',
})
export class EditarAlimentacionDialog implements OnInit {

  // Variables locales para usar en el HTML
  listaCultivos: CultivoElement[] = [];
  alimentacion: AlimentacionElement;

  constructor(
    public dialogRef: MatDialogRef<EditarAlimentacionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
    // data trae: { alimentacion: {...}, listaCultivos: [...] }
  ) {
    // 1. Desempaquetamos el objeto a editar
    this.alimentacion = data.alimentacion;

    // 2. Desempaquetamos la lista de cultivos
    this.listaCultivos = data.listaCultivos || [];
  }

  ngOnInit() {
    // Ya no hace falta llamar a la API aquí
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    // Devolvemos el objeto editado al padre
    this.dialogRef.close(this.alimentacion);
  }
}
