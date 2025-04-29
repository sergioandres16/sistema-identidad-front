import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SAETA Digital ID';

  constructor() {}

  ngOnInit(): void {
    // Inicializar la aplicación
  }
}
