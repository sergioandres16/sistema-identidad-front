import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'SAETA Digital ID';

  constructor() {}

  ngOnInit(): void {
    // Inicializar la aplicación
  }
}
