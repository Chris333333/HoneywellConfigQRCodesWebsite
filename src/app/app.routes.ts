import { Routes } from '@angular/router';
import { PlaceholderComponent } from './layout/placeholder/placeholder.component';

export const routes: Routes = [
    {path: 'torun', component: PlaceholderComponent},
    { path: '**', redirectTo: 'torun' },
    {path: '', redirectTo: 'torun', pathMatch: 'full'}
    
];
