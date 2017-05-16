import { Component, OnInit } from '@angular/core';
import { News } from '../models/news';

import { NewsService } from '../services/news-service';

@Component({
    selector: 'dashboard',
    template: `
        <div class="col-md-8 col-xs-8">
            <preview-news *ngFor="let item of news" [news]="item" [routerLink]="['/news', item.id]"></preview-news>
        </div>
        <div class="col-md-4 col-xs-4">
            search element
        </div>
    `
})
export class DashboardComponent implements OnInit {
    news: News[];
    constructor( private newsService : NewsService ) { };
    ngOnInit(): void {
        this.newsService.getNewsArr().then((arr) => this.news = arr);
    }
}