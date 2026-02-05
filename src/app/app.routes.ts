import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { BoardsComponent } from './components/boards/boards';

export const routes: Routes = [ 
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'boards', component: BoardsComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
