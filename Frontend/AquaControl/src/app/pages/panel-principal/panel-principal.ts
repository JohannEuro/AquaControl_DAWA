import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-panel-principal',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './panel-principal.html',
  styleUrl: './panel-principal.css',
})
export class PanelPrincipal implements OnInit {
  private dataService = inject(DataService);

  // Variables para los contadores
  totalPiscinas: number = 0;
  totalCultivos: number = 0;
  totalUsuarios: number = 0;
  totalAlertas: number = 0;

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {

    this.dataService.getPiscinas().subscribe({
      next: (data) => {
        this.totalPiscinas = data.length;
      },
      error: (e) => console.error('Error piscinas:', e)
    });


    this.dataService.getCultivos().subscribe({
      next: (data) => {
        this.totalCultivos = data.length;
      },
      error: (e) => console.error('Error cultivos:', e)
    });


    this.dataService.getParametros().subscribe({
      next: (data) => {
        // Filtramos sobre la data que acaba de llegar
        const alertas = data.filter(p => p.ph < 7 || p.ph > 8.5);
        this.totalAlertas = alertas.length;
      },
      error: (e) => console.error('Error parametros:', e)
    });

    this.dataService.getUsuarios().subscribe({
      next: (data) => {
        this.totalUsuarios = data.length;
      },
      error: (e) => console.error('Error usuarios:', e)
    });
  }
}
