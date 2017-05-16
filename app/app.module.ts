import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {PreviewNewsComponent } from './preview-news.component';
import { Collapse } from './directives/collapse.component';

@NgModule({
    imports: [ BrowserModule, FormsModule ],
    declarations: [
        AppComponent,
        PreviewNewsComponent,
        Collapse
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }