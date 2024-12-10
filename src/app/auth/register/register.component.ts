import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6)],
        this.specialCharacterValidator,
      ],
      confirmPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getMe();
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  getInvalidControls(): string[] {
    const invalidControls: string[] = [];
    const controls = this.registerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(name);
      }
    }
    return invalidControls;
  }

  async specialCharacterValidator(
    control: AbstractControl,
  ): Promise<ValidationErrors | null> {
    const value = control.value;
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return !hasSpecialCharacter ? { specialCharacter: true } : null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      if (!this.checkPasswords()) {
        Swal.fire({
          title: 'Invalid Form',
          text: `Password Doesn't match`,
          icon: 'error',
          confirmButtonText: 'Okay',
        });
        return;
      }
      this.sendUserToBackend(this.registerForm);
    } else {
      const invalidControls = this.getInvalidControls();
      Swal.fire({
        title: 'Invalid Form',
        text: `The following fields are invalid: ${invalidControls.join(', ')}`,
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  }

  checkPasswords(): boolean {
    //console.log(this.registerForm.get('password')?.value,'/n',this.registerForm.get('confirmPassword')?.value);

    if (
      this.registerForm.get('password')?.value ===
      this.registerForm.get('confirmPassword')?.value
    ) {
      return true;
    } else {
      return false;
    }
  }

  sendUserToBackend(data: FormGroup) {
    this.authService.register(this.registerForm.value).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['dashboard']);
      },
      (error) => {
        Swal.fire({
          title: 'Alert',
          text: `Error Registering: ${error?.message}`,
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      },
    );
  }

  getMe() {
    this.authService.getUserProfile().subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['dashboard']);
      },
      (error) => {
        Swal.fire({
          title: 'Alert',
          text: `Error Registering: ${error?.message}`,
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      },
    );
  }
}
