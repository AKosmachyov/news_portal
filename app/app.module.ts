import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './services/in-memory-data.service';

import { AppComponent } from './components/app.component';
import { PreviewNewsComponent } from './components/preview-news.component';
import { NewsComponent } from './components/news.component';
import { DashboardComponent } from './components/dashboard.component';
import { EditorNewsComponent } from './components/editor-news.component';
import { LoginComponent } from './components/login.component';

import { NewsService } from './services/news-service';
import { AuthService } from './services/auth.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        PreviewNewsComponent,
        NewsComponent,
        DashboardComponent,
        EditorNewsComponent,
        LoginComponent
    ],
    bootstrap: [ AppComponent ],
    providers: [
        NewsService,
        AuthService
    ]
})

export class AppModule { }