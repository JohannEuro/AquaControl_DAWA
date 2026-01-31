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
import { PiscinaElemento, CultivoElement } from '../../services/data';

@Component({
  selector: 'app-editar-cultivo-dialog',
  standalone: true,
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
  templateUrl: './editar-cultivo-dialog.html',
  styleUrl: './editar-cultivo-dialog.css'
})
export class EditarCultivoDialog implements OnInit {

  listaPiscinas: PiscinaElemento[] = [];
  cultivo: CultivoElement;

  constructor(
    public dialogRef: MatDialogRef<EditarCultivoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
    // Data trae: { cultivo: {...}, listaPiscinas: [...] }
  ) {
    this.cultivo = data.cultivo;

    this.listaPiscinas = data.listaPiscinas || [];
  }

  ngOnInit() {

  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {

    this.dialogRef.close(this.cultivo);
  }
}
