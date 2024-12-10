import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { ContactsComponent } from './contacts/contacts.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './auth/register/register.component';
import { PipelineComponent } from './pipeline/pipeline.component';
import { PipelineViewComponent } from './pipeline/pipeline-view/pipeline-view.component';
import { VideocallComponent } from './meetings/videocall/videocall.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard/contacts', component: ContactsComponent },
      { path: 'dashboard/pipeline', component: PipelineComponent },
      { path: 'dashboard/pipeline-view/:id', component: PipelineViewComponent },
      { path: 'dashboard/user-details', component: UserSettingsComponent },
      { path: 'dashboard/meetings', component: VideocallComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' },
];
