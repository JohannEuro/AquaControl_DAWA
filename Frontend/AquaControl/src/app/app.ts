import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHorizontal } from "./menu-horizontal/menu-horizontal";
import { Copyright } from "./copyright/copyright";
import { Login } from "./login/login";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuHorizontal, Copyright, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AquaControl');
}
