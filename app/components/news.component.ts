import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { NewsService } from '../services/news-service';
import { AuthService } from '../services/auth.service';

import { News } from '../models/news';

@Component({
    selector: 'news',
    template: `
        <div *ngIf="!!news">
            <span *ngIf="!news.modifiedDate">{{news.publicationDate | date:"dd.MM.yy"}}</span>
            <span *ngIf="!!news.modifiedDate">
                <i class="glyphicon glyphicon-refresh"></i>{{news.modifiedDate | date:"dd.MM.yy"}}
            </span>
            <a *ngIf="displayEditButton" [routerLink]="['/editor', news._id]">
                Изменить
                <i class="glyphicon glyphicon-pencil"></i>
            </a>
            <h1 class="title">
                {{news.title}}
            </h1>
                <i class="glyphicon glyphicon-tags"></i><span>{{news.tag}}</span>
                <i class="glyphicon glyphicon-user"></i><span>{{news.author.name}}</span>
            <div>
                <span class="content" [innerHTML]="news.content"></span>
            </div>
        </div>
         <div *ngIf="displayError">
                <h1 class="err-block">{{errorStr}}</h1>
                <button class="btn btn-info center-block" [routerLink]="['/dashboard']">Возвращаемся</button>
         </div>      
         <div>
         <img id="spinner" src="app/spinner.gif" class="img-responsive center-block" *ngIf="isDownload"/>
    `,
    styles: [`
        .title {
            margin-top: 0;
            margin-bottom: 0;
        }
        i {
            margin-right: 8px;
        }
        .content {
            font-size: 16px;
            line-height: 160%;    
        }
        a {
            text-decoration: none;
        }
        .err-block {
            color: #5bc0de;
            text-align: center;
        }
         #spinner {
            height: 62px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
    `]
})

export class NewsComponent implements OnInit {
    isDownload: boolean = false;
    news: News;
    displayEditButton: boolean = false;
    displayError: boolean = false;
    errorStr: string;
    constructor(
        private newsService: NewsService,
        private authService: AuthService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.isDownload = true;
        this.route.params
            .switchMap((params: Params) => this.newsService.getNews(params['id']))
            .subscribe(news => {
                this.isDownload = false;
                this.news = news;
                if(this.authService.currentUser && news.author._id == this.authService.currentUser._id)
                    this.displayEditButton = true;
            }, (err) => {
                this.isDownload = false;
                if(!err.status) {
                    this.errorStr = 'Отсутствует подключение к сети Интернет';
                } else {
                    this.errorStr = '404 Данная страница не найдена';
                }
                this.displayError = true;
            });
    }
}