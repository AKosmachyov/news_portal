import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './services/in-memory-data.service';

import { AppComponent } from './components/app.component';
import { PreviewNewsComponent } from './components/preview-news.component';
import { NewsComponent } from './components/news.component';
import { DashboardComponent } from './components/dashboard.component';

import { NewsService } from './services/news-service';

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard',  component: DashboardComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        PreviewNewsComponent,
        NewsComponent,
        DashboardComponent
    ],
    bootstrap: [ AppComponent ],
    providers: [ NewsService ]
})

export class AppModule { }