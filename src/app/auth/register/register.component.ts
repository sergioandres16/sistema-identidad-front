import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/auth.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoadingSpinnerComponent,
  ],
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  /** Tipado literal para que Angular infiera correctamente en la vista */
  userTypes: ('general' | 'student' | 'member')[] = [
    'general',
    'student',
    'member',
  ];
  selectedUserType: 'general' | 'student' | 'member' = 'general';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        studentCode: [''],
        faculty: [''],
        membershipType: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  /** Comprueba que password y confirmPassword coincidan */
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  /** Se dispara al cambiar el tipo de usuario */
  onUserTypeChange(type: 'general' | 'student' | 'member'): void {
    this.selectedUserType = type;

    if (type === 'student') {
      this.registerForm.get('studentCode')?.setValidators([Validators.required]);
      this.registerForm.get('faculty')?.setValidators([Validators.required]);

      this.registerForm.get('membershipType')?.clearValidators();
      this.registerForm.get('membershipType')?.reset();
    } else if (type === 'member') {
      this.registerForm
        .get('membershipType')
        ?.setValidators([Validators.required]);

      this.registerForm.get('studentCode')?.clearValidators();
      this.registerForm.get('faculty')?.clearValidators();
      this.registerForm.get('studentCode')?.reset();
      this.registerForm.get('faculty')?.reset();
    } else {
      this.registerForm.get('studentCode')?.clearValidators();
      this.registerForm.get('faculty')?.clearValidators();
      this.registerForm.get('membershipType')?.clearValidators();

      this.registerForm.get('studentCode')?.reset();
      this.registerForm.get('faculty')?.reset();
      this.registerForm.get('membershipType')?.reset();
    }

    this.registerForm.get('studentCode')?.updateValueAndValidity();
    this.registerForm.get('faculty')?.updateValueAndValidity();
    this.registerForm.get('membershipType')?.updateValueAndValidity();
  }

  /** Envío del formulario */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) =>
        this.registerForm.get(key)?.markAsTouched()
      );
      return;
    }

    // Verificar que las contraseñas coincidan
    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    const v = this.registerForm.value;

    // Asegurar campos definidos y sin undefined
    const registerData: RegisterRequest = {
      username: v.username,
      password: v.password,
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phoneNumber: v.phoneNumber || '', // cadena vacía si no hay teléfono
    };

    // Campos condicionales
    if (this.selectedUserType === 'student' && v.studentCode) {
      registerData.studentCode = v.studentCode;
      registerData.faculty = v.faculty || '';
    } else if (this.selectedUserType === 'member' && v.membershipType) {
      registerData.membershipType = v.membershipType;
    }

    // Depuración
    console.log('Enviando datos de registro:', JSON.stringify(registerData));

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.isLoading = false;
        this.successMessage =
          'Registro exitoso. Redirigiendo al inicio de sesión...';
        this.error = null;

        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        console.error('Error de registro:', err);
        this.error =
          err.message || 'Error al registrarse. Por favor, intente nuevamente.';
        this.isLoading = false;
        this.successMessage = null;
      },
    });
  }
}
