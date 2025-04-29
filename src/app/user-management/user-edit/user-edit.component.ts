import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  standalone: true,
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  userId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    // aquí cargarás los datos del usuario cuando tengas el servicio
  }

  save(): void {
    // placeholder para guardar
    alert('Guardar todavía no implementado');
  }

}
