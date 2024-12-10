import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
