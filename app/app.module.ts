import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app.component';
import { PreviewNewsComponent } from './components/preview-news.component';
import { NewsComponent } from './components/news.component';
import { DashboardComponent } from './components/dashboard.component';
import { EditorNewsComponent } from './components/editor-news.component';
import { LoginComponent } from './components/login.component';
import { CheckinComponent } from './components/checkin.component';
import { ContentEditorComponent } from './components/content-editor.component';

import { NewsService } from './services/news-service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';

import { NewsFilterPipe } from './pipes/news-filter.pipe';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        PreviewNewsComponent,
        NewsComponent,
        DashboardComponent,
        EditorNewsComponent,
        LoginComponent,
        CheckinComponent,
        ContentEditorComponent,
        NewsFilterPipe
    ],
    bootstrap: [ AppComponent ],
    providers: [
        NewsService,
        AuthService,
        AuthGuard
    ]
})

export class AppModule { }