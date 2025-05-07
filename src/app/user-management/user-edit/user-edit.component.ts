// src/app/user-management/user-edit/user-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgClass, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent
  ],
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userId!: number;
  userForm: FormGroup;
  user: User | null = null;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  successMessage: string | null = null;
  roles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SCANNER'];
  statuses = [
    { id: 1, name: 'ACTIVE' },
    { id: 2, name: 'INACTIVE' },
    { id: 3, name: 'SUSPENDED' },
    { id: 4, name: 'PENDING' },
    { id: 5, name: 'EXPIRED' },
    { id: 6, name: 'DEBT' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      studentCode: [''],
      faculty: [''],
      membershipType: [''],
      membershipExpiry: [''],
      hasDebt: [false],
      statusId: [''],
      roles: [[]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.loadUser();
    } else {
      this.error = 'ID de usuario no encontrado';
    }
  }
  updateRoleSelection(role: string, event: Event): void {
    // Hacemos un casting seguro del evento
    const isChecked = (event.target as HTMLInputElement).checked;

    const currentRoles = this.userForm.get('roles')?.value || [];

    if (isChecked) {
      if (!currentRoles.includes(role)) {
        this.userForm.get('roles')?.setValue([...currentRoles, role]);
      }
    } else {
      this.userForm.get('roles')?.setValue(currentRoles.filter((r: string) => r !== role));
    }
  }

  isRoleSelected(role: string): boolean {
    const currentRoles = this.userForm.get('roles')?.value || [];
    return currentRoles.includes(role);
  }

  loadUser(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId)
      .subscribe({
        next: (user) => {
          this.user = user;
          this.populateForm(user);
          this.isLoading = false;
          this.error = null;
        },
        error: (err) => {
          this.error = 'Error al cargar el usuario: ' + err.message;
          this.isLoading = false;
        }
      });
  }

  populateForm(user: User): void {
    // Convertir la fecha de membresía de string a objeto Date si existe
    let membershipExpiryDate = null;
    if (user.membershipExpiry) {
      membershipExpiryDate = typeof user.membershipExpiry === 'string'
        ? new Date(user.membershipExpiry).toISOString().split('T')[0]
        : new Date(user.membershipExpiry.toString()).toISOString().split('T')[0];
    }

    this.userForm.patchValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      studentCode: user.studentCode || '',
      faculty: user.faculty || '',
      membershipType: user.membershipType || '',
      membershipExpiry: membershipExpiryDate,
      hasDebt: user.hasDebt || false,
      statusId: this.getStatusIdByName(user.statusName),
      roles: user.roles || []
    });
  }

  getStatusIdByName(statusName: string | undefined): number {
    if (!statusName) return 1; // Default to ACTIVE

    const status = this.statuses.find(s => s.name === statusName);
    return status ? status.id : 1;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.successMessage = null;

    // Preparar datos del formulario para enviar
    const formData = this.userForm.value;

    // Convertir el ID de estado a un objeto de estado completo para el backend
    const statusId = formData.statusId;
    delete formData.statusId; // Eliminar para no enviarlo directamente

    const updatedUser: User = {
      ...this.user,
      ...formData
    };

    // Llamar al servicio para cambiar el estado primero
    this.userService.changeUserStatus(this.userId, statusId)
      .subscribe({
        next: () => {
          // Luego actualizar el resto de la información del usuario
          this.userService.updateUser(this.userId, updatedUser)
            .subscribe({
              next: (updatedUserResponse) => {
                this.user = updatedUserResponse;
                this.successMessage = 'Usuario actualizado con éxito';
                this.isSaving = false;
                // Refrescar el formulario con los datos actualizados
                this.populateForm(updatedUserResponse);
              },
              error: (err) => {
                this.error = 'Error al actualizar el usuario: ' + err.message;
                this.isSaving = false;
              }
            });
        },
        error: (err) => {
          this.error = 'Error al actualizar el estado del usuario: ' + err.message;
          this.isSaving = false;
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/user-management', this.userId]);
  }

  // Función para marcar todos los campos como touched para mostrar validaciones
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
