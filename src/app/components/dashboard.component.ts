import { Component, OnInit, HostListener } from '@angular/core';
import { News } from '../models/news';

import { NewsService } from '../services/news-service';

@Component({
    selector: 'dashboard',
    template: `
        <div class="col-md-8 col-xs-8">
            <preview-news *ngFor="let item of news | newsFilter: authorSearch: dateSearch" [news]="item"></preview-news>
            <img id="spinner" src="public/images/spinner.gif" class="img-responsive center-block" *ngIf="isDownload"/>
            <h3 class="alert alert-info col-xs-6 col-xs-offset-3" role="alert" *ngIf="isEndData">
                На этом новости закончились :(
            </h3>
            <h3 class="alert alert-info col-xs-6 col-xs-offset-3" role="alert" *ngIf="displayError">{{errorStr}}(</h3>
            <button class="btn btn-info col-xs-6 col-xs-offset-3 get-more-button" (click)="getMore()"
                    *ngIf="!needMore && !isDownload">Загрузить ещё</button>
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
                <h3 class="form-group">Загружать новости по:</h3>
                <div class="form-group">
                    <select class="form-control" (change)="onChangeSelectEl($event.target.value)">
                        <option>3</option>
                        <option>4</option>
                        <option selected="selected">5</option>
                    </select>
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
        .get-more-button {
            margin-top: 15px;
            margin-bottom: 15px;
        }
    `]
})
export class DashboardComponent implements OnInit {
    news: News[] = [];
    isDownload: boolean = false;
    needMore: boolean = false;
    isEndData: boolean = false;

    downloadCount: number = 5;
    lastId: string;
    authorSearch: string;
    dateSearch: string;

    displayError: boolean = false;
    errorStr: string;
    constructor( private newsService : NewsService ) { };
    ngOnInit(): void {
        this.next();
    }
    getMore(): void {
        this.needMore = true;
        this.next();
    }
    next(): void {
        const _self = this;
        _self.isDownload = true;
        let obj = {
            count: _self.downloadCount,
            id: _self.lastId
        };

        _self.newsService.getNewsRange(obj).then((arr) => {
            if (arr.length < _self.downloadCount) {
                _self.isEndData = true;
                _self.isDownload = false;
            }
            if(arr.length == 0 )
                return;
            _self.lastId = arr[arr.length-1]._id;
            _self.news = this.news.concat(arr);
            _self.isDownload = false;
        }, (err) => {
            if(!err.status) {
                this.errorStr = 'Отсутствует подключение к сети Интернет';
            } else {
                this.errorStr = 'На сервере произошел сбой';
            }
            _self.needMore = false;
            _self.isDownload = false;
            _self.displayError = true;
        });
    }
    @HostListener('click', ['$event.target'])
    @HostListener('window:scroll', ['$event'])
    onScroll(event): void {
        if(!(event.tagName == "SPAN" && event.innerText == "×" || event.type == "scroll"))
            return;
        let elHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        let userSee = window.pageYOffset + document.documentElement.clientHeight;
        if(elHeight == userSee && !this.isDownload && this.needMore && !this.isEndData)
        {
            this.next();
        }
    }
    clearSearch () {
        this.authorSearch = this.dateSearch = null;
    }
    onChangeSelectEl( value ) {
        this.downloadCount = value;
    }
}