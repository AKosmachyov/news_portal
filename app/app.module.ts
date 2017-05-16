import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {PreviewNewsComponent } from './preview-news.component';
import { Collapse } from './directives/collapse.component';

import { NewsService } from './services/news-service';
@NgModule({
    imports: [ BrowserModule, FormsModule ],
    declarations: [
        AppComponent,
        PreviewNewsComponent,
        Collapse
    ],
    bootstrap: [ AppComponent ],
    providers: [ NewsService ]
})

export class AppModule { }