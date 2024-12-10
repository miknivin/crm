import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { MaterialModule } from './material/material.module';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  title = 'crm';
  options: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.options = this._formBuilder.group({
      bottom: 0,
      fixed: false,
      top: 0,
    });
  }
}
