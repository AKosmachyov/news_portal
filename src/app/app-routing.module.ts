import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard.component';
import { NewsComponent } from './components/news.component';
import { EditorNewsComponent } from './components/editor-news.component';
import { LoginComponent } from './components/login.component';
import { CheckinComponent } from './components/checkin.component';

import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard',  component: DashboardComponent },
    { path: 'news/:id',  component: NewsComponent },
    { path: 'editor', component: EditorNewsComponent, canActivate: [ AuthGuard ] },
    { path: 'editor/:id', component: EditorNewsComponent, canActivate: [ AuthGuard ] },
    { path: "login", pathMatch: 'full', component: LoginComponent},
    { path: "checkin", pathMatch: 'full', component: CheckinComponent},
    { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}