import { Routes } from '@angular/router';
import { WelcomeComponent } from './layout/welcome/welcome.component';
import { QrCodesComponent } from './layout/qr-codes/qr-codes.component';

export const routes: Routes = [
    { path: 'location/:localID', component: QrCodesComponent },
    {path: '', component: WelcomeComponent},
    
];
