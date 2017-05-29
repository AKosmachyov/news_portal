import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { NewsService } from '../services/news-service';
import { AuthService } from '../services/auth.service';

import { News } from '../models/news';

@Component({
    selector: 'news',
    template: `
        <div class="news-container" *ngIf="!!news">
            <span *ngIf="!news.modifiedDate">{{news.publicationDate | date:"dd.MM.yy"}}</span>
            <span *ngIf="!!news.modifiedDate">
                <i class="glyphicon glyphicon-refresh"></i>{{news.modifiedDate | date:"dd.MM.yy"}}
                <i *ngIf="news.archived" class="glyphicon glyphicon-piggy-bank"></i>
            </span>
            <a *ngIf="displayEditButton" [routerLink]="['/editor', news._id]">
                Изменить
                <i class="glyphicon glyphicon-pencil"></i>
            </a>
            <h1 class="title">
                {{news.title}}
            </h1>
            <div>
                <i class="glyphicon glyphicon-tags"></i><span>{{news.tag}}</span>
                <i class="glyphicon glyphicon-user"></i><span>{{news.author.name}}</span>
            </div>
                <img src ="https://images3.alphacoders.com/823/82317.jpg"/>
            <div>
                <p class="content" [innerHTML]="news.content"></p>
            </div>
        </div>
         <div *ngIf="displayError">
                <h1 class="err-block">{{errorStr}}</h1>
                <button class="btn btn-info center-block" [routerLink]="['/dashboard']">Возвращаемся</button>
         </div>      
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
            word-wrap: break-word;
            text-align: justify;
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
        h1 {
            word-wrap: break-word;
        }
        img {
            max-width: 80%;
        }
        .news-container {
            text-align: center;
        }
        p {
            margin: 25px 15% 25px;
            text-indent: 1.5em
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
                if(this.authService.currentUser && news.author._id == this.authService.currentUser._id && !news.archived)
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