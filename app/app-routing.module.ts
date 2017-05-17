import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard.component';
import { NewsComponent } from './components/news.component';
import { EditorNewsComponent } from './components/editor-news.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard',  component: DashboardComponent },
    { path: 'news/:id',  component: NewsComponent },
    { path: 'editor', component: EditorNewsComponent },
    { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}