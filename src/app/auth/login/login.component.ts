import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { request } from 'express';
import { AuthService } from '../../services/auth/auth.service';
//import { RegisterComponent } from '../register/register.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginData: {
    email: string;
    password: string;
  } = {
    email: '',
    password: '',
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.getMe();
  }

  login() {
    this.authService.login(this.loginData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        const token = response.token;
        console.log(token);

        this.cookieService.set('token', token);
        this.router.navigate(['dashboard']);
      },
      (error) => {
        Swal.fire({
          title: 'Alert',
          text: `Error: ${error?.data.message}`,
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
        console.log(error);
      },
    );
  }
}
