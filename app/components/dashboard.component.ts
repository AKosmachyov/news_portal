import { Component, OnInit, HostListener } from '@angular/core';
import { News } from '../models/news';

import { NewsService } from '../services/news-service';

@Component({
    selector: 'dashboard',
    template: `
        <div class="col-md-8 col-xs-8">
            <preview-news *ngFor="let item of news" [news]="item"></preview-news>
            <button class="btn btn-info" (click)="getMore()" *ngIf="!needMore">Загрузить ещё</button>
        </div>
        <div class="col-md-4 col-xs-4">
            search element
        </div>
    `
})
export class DashboardComponent implements OnInit {
    news: News[] = [];
    from: number = 0;
    isDownload: boolean = false;
    needMore: boolean = false;
    constructor( private newsService : NewsService ) { };
    ngOnInit(): void {
        this.next();
    }
    getMore(): void {
        this.needMore = true;
        this.next();
    }
    next(): void {
        this.isDownload = true;
        this.newsService.getNewsRange(this.from, this.from+5).then((arr) => {
            this.news = this.news.concat(arr);
            this.from += 6;
            this.isDownload = false;
        });
    }
    @HostListener('window:scroll', ['$event'])
    onScroll(event): void {
        let elHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        let userSee = window.pageYOffset + document.documentElement.clientHeight;
        if(elHeight - userSee < document.documentElement.clientHeight && !this.isDownload && this.needMore)
        {
            console.log('download');
            this.next();
        }
    }
}