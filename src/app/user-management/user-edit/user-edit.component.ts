import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userId!: number;
  userForm: FormGroup;
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUserById(this.userId)
      .subscribe({
        next: (user) => {
          this.user = user;
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
        },
        error: (err) => {
          console.error('Error loading user:', err);
        }
      });
  }

  save(): void {
    if (this.userForm.invalid) return;

    const updatedUser = {
      ...this.user,
      ...this.userForm.value
    };

    this.userService.updateUser(this.userId, updatedUser as User)
      .subscribe({
        next: () => {
          alert('Usuario actualizado con éxito');
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Error al actualizar usuario');
        }
      });
  }
}
