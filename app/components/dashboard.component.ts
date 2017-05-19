import { Component, OnInit, HostListener } from '@angular/core';
import { News } from '../models/news';

import { NewsService } from '../services/news-service';

@Component({
    selector: 'dashboard',
    template: `
        <div class="col-md-8 col-xs-8">
            <preview-news *ngFor="let item of news | newsFilter: authorSearch: dateSearch" [news]="item"></preview-news>
            <img id="spinner" src="/spinner.gif" class="img-responsive center-block" *ngIf="isDownload"/>
            <button class="btn btn-info col-xs-6 col-xs-offset-3" (click)="getMore()" *ngIf="!needMore && !isDownload">Загрузить ещё</button>
            <h3 class="alert alert-info col-xs-6 col-xs-offset-3" role="alert" *ngIf="isEndData">На этом новости закончились :(</h3>
        </div>
        <div class="col-md-4 col-xs-4">
            <div class="form-horizontal">
                <h3 class="form-group">Фильтрация</h3>
                <div class="form-group">
                    <input class="form-control" placeholder="Автор" [(ngModel)]="authorSearch"/>
                </div>
                <div class="form-group">
                    <input type="date" class="form-control" placeholder="Дата" [(ngModel)]="dateSearch"/>
                </div>
                <div class="form-group">
                    <button class="btn btn-info center-block" (click)="clearSearch()">Сбросить фильтры</button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        #spinner {
            height: 62px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .form-horizontal > h3 {
            text-align: center;
        }
    `]
})
export class DashboardComponent implements OnInit {
    news: News[] = [];
    from: number = 0;
    isDownload: boolean = false;
    needMore: boolean = false;
    isEndData: boolean = false;

    authorSearch: string;
    dateSearch: Date;
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
            if(arr.length == 0) {
                this.isEndData = true;
                this.isDownload = false;
                return;
            }
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
        if(elHeight - userSee < document.documentElement.clientHeight && !this.isDownload && this.needMore && !this.isEndData)
        {
            this.next();
        }
    }
    clearSearch () {
        this.authorSearch = this.dateSearch = null;
    }
}