
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
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [ 
    {path: '', component: LandingComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'confirm-account', component: EmailConfirmComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password/:token', component: ResetPasswordComponent},
    {path: 'delete-account', component: DeleteAccountComponent, canActivate: [authGuard]},
    {path: 'boards', component: BoardsComponent, canActivate: [authGuard]},
    {path: 'board/:id', component: BoardDetailComponent, canActivate: [authGuard]},
    {path: '**', redirectTo: ''}
];

