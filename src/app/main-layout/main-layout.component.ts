import { SidebarComponent } from './../layout/sidebar/sidebar.component';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { HeaderComponent } from './../layout/header/header.component';
import { MaterialModule } from './../material/material.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    SidebarComponent,
    MatSidenavContent,
    HeaderComponent,
    MaterialModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'crm';
  options: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.options = this._formBuilder.group({
      bottom: 0,
      fixed: false,
      top: 0,
    });
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logged out', response);
        this.router.navigate(['login']);
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
}
