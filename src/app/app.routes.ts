import { Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { PlaceholderComponent } from './layout/placeholder/placeholder.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'torun', component: PlaceholderComponent},
    { path: '**', redirectTo: 'torun' },
    {path: '', redirectTo: 'torun', pathMatch: 'full'}
    
];
