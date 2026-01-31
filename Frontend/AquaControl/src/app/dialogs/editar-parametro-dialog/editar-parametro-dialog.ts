import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ParametroElement, CultivoElement } from '../../services/data';

@Component({
  selector: 'app-editar-parametro-dialog',
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
  templateUrl: './editar-parametro-dialog.html',
  styleUrl: './editar-parametro-dialog.css',
})
export class EditarParametroDialog implements OnInit {

  // Variables para el HTML
  listaCultivos: CultivoElement[] = [];
  parametro: ParametroElement;

  constructor(
    public dialogRef: MatDialogRef<EditarParametroDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // 1. Extraemos el objeto parámetro
    this.parametro = data.parametro;

    // 2. Extraemos la lista de cultivos que nos pasó el padre
    this.listaCultivos = data.listaCultivos || [];
  }

  ngOnInit() {
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    this.dialogRef.close(this.parametro);
  }
}
