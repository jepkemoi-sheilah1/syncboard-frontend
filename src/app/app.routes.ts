import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { BoardsComponent } from './components/boards/boards';
import { EmailConfirmComponent } from './components/auth/email-confirm/email-confirm';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password';
import { DeleteAccountComponent } from './components/auth/delete-account/delete-account.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [ 
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'confirm-account', component: EmailConfirmComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password/:token', component: ResetPasswordComponent},
    {path: 'delete-account', component: DeleteAccountComponent, canActivate: [authGuard]},
    {path: 'boards', component: BoardsComponent, canActivate: [authGuard]},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
