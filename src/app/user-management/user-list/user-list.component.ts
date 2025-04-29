import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  styleUrls: ['./user-list.component.scss']        // déjalo aunque el SCSS esté vacío
})
export class UserListComponent implements OnInit {

  // aquí irá la lista de usuarios cuando la implementes
  users: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // llamada al servicio de usuarios cuando lo tengas
  }

}
