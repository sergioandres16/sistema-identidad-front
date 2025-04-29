import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    LoadingSpinnerComponent
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  userTypes = ['general', 'student', 'member'];
  selectedUserType = 'general';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      // Fields for student
      studentCode: [''],
      faculty: [''],
      // Fields for club member
      membershipType: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onUserTypeChange(type: string): void {
    this.selectedUserType = type;

    // Reset specific fields based on user type
    if (type !== 'student') {
      this.registerForm.get('studentCode')?.reset();
      this.registerForm.get('faculty')?.reset();
    }

    if (type !== 'member') {
      this.registerForm.get('membershipType')?.reset();
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const formValue = this.registerForm.value;

    const registerData: RegisterRequest = {
      username: formValue.username,
      password: formValue.password,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber || undefined
    };

    // Add specific fields based on user type
    if (this.selectedUserType === 'student') {
      registerData.studentCode = formValue.studentCode;
      registerData.faculty = formValue.faculty;
    } else if (this.selectedUserType === 'member') {
      registerData.membershipType = formValue.membershipType;
    }

    this.authService.register(registerData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          // Redirect to login with a success message
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.error = err.message || 'Error al registrarse';
          this.isLoading = false;
        }
      });
  }
}
