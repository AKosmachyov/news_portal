import { Component, OnInit } from '@angular/core';
import { News } from './models/news';

import { NewsService } from './services/news-service';

@Component({
    selector: 'app',
    template: `
        <header>
            <div class="container normalize-height">
                <div class="row normalize-height">
                    <div class="col-md-4 col-xs-4">
                        logo
                    </div>
                    <div class="col-md-4  col-md-offset-4 col-xs-6 normalize-height">
                        <button class="btn btn-primary">Вход</button>                
                        <button class="btn btn-primary">Регистрация</button>
                    </div>
                </div>
            </div>
        </header>
        <div class="container">
            <div class="col-md-8 col-xs-8">
                <preview-news *ngFor="let item of news" [news]="item"></preview-news>
            </div>
            <div class="col-md-4 col-xs-4">
                search element
            </div>
        </div>                
    `,
    styles: [`
        header {
            height: 68px;
            border-bottom: 1px solid #d5dddf;
            background: #fff;
        }
        .normalize-height {
            height: inherit;
        }
    `]
})

export class AppComponent implements OnInit {
    news: News[];
    constructor(private newsService : NewsService) { };
    ngOnInit(): void {
        this.news = this.newsService.getData();
    }
}
