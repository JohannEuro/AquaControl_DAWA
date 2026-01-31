import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copyright',
  imports: [CommonModule],
  templateUrl: './copyright.html',
  styleUrl: './copyright.css',
})
export class Copyright {

  public anioActual = new Date().getFullYear();
}
