import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  template: `
    <h2>Detalle de usuario</h2>
    <p>Este componente se mostrará pronto…</p>
  `
})
export class UserDetailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // aquí iría la carga de datos (por id) cuando implementes el servicio
  }
}
