import { Component, OnInit } from '@angular/core';
import { News } from './models/news';

import { NewsService } from './services/news-service';

@Component({
    selector: 'app',
    template: `
        <header>header</header>
        <div class="container">
            <div class="col-md-9">
                <preview-news *ngFor="let item of news" [news]="item"></preview-news>
            </div>
            <div class="col-md-3">
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
    `]
})

export class AppComponent implements OnInit {
    news: News[];
    constructor(private newsService : NewsService) { };
    ngOnInit(): void {
        this.news = this.newsService.getData();
    }
}
