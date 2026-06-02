import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardDetailComponent } from './components/board-detail/board-detail.component';
import { EmailConfirmComponent } from './components/auth/email-confirm/email-confirm.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { DeleteAccountComponent } from './components/auth/delete-account/delete-account.component';
import { WorkspacesComponent } from './components/workspaces/workspaces.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { SupportAdminComponent } from './components/support-admin/support-admin.component';

export const routes: Routes = [
  // ── Public ─────────────────────────────────────────────────────────────
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-account', component: EmailConfirmComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  
  // (they log in / register first, then the accept endpoint links them)
  { path: 'accept-invite/:token', component: EmailConfirmComponent },

  // ── Protected ───────────────────────────────────────────────────────────
  { path: 'delete-account', component: DeleteAccountComponent, canActivate: [authGuard] },

  // 1. Workspaces list (entry point after login)
  { path: 'workspaces', component: WorkspacesComponent, canActivate: [authGuard] },

  // 2. Boards inside a workspace — members arrive here after accepting an invite
  { path: 'workspaces/:workspaceId/boards', component: BoardsComponent, canActivate: [authGuard] },

  // 3. Board detail (collaborative Kanban view)
  { path: 'board/:id', component: BoardDetailComponent, canActivate: [authGuard] },

  // 4. Support Admin (role protected)
  { path: 'support-admin', component: SupportAdminComponent, canActivate: [authGuard, adminGuard] },

  // ── Fallbacks ───────────────────────────────────────────────────────────
  { path: 'boards', redirectTo: 'workspaces' },
  { path: '**', redirectTo: '' }
];