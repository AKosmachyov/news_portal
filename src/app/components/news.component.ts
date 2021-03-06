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
            <a *ngIf="displayEditButton" (click)="toArchive()">
                В архив
            </a>
            <h1 class="title">
                {{news.title}}
            </h1>
            <div>
                <i class="glyphicon glyphicon-tags"></i><span>{{news.tag}}</span>
                <i class="glyphicon glyphicon-user"></i><span>{{news.author.name}}</span>
            </div>
            <img *ngIf="!!news.titleImg" [src]="news.titleImg"/>
            <div>
                <div class="content" [innerHTML]="news.content"></div>
            </div>
        </div>
         <div *ngIf="displayError">
                <h1 class="err-block">{{errorStr}}</h1>
                <button class="btn btn-info center-block" [routerLink]="['/dashboard']">Возвращаемся</button>
         </div>      
         <img id="spinner" src="public/images/spinner.gif" class="img-responsive center-block" *ngIf="isDownload"/>
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
            margin: 25px 15% 25px;
            text-indent: 1.5em
        }
        a {
            text-decoration: none;
            cursor: pointer;
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
        .news-container img {
            max-width: 80%;
            width: 100%;
        }
        .news-container {
            text-align: center;
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
        let _self = this;
        _self.isDownload = true;
        _self.route.params
            .switchMap((params: Params) => _self.newsService.getNews(params['id']))
            .subscribe(news => {
                _self.isDownload = false;
                _self.news = news;
                const user = _self.authService.currentUser;
                if(user && (news.author._id == user._id || user.userType == "admin" )&& !news.archived)
                    _self.displayEditButton = true;
            }, (err) => {
                _self.isDownload = false;
                _self.handleError.call(_self, err)
            });
    }
    toArchive() {
        let _self = this;
        _self.newsService.archiveNews(_self.news._id)
            .then(()=> {
                _self.news.archived = true;
                _self.displayEditButton = false;
            })
            .catch((err) => _self.handleError.call(_self, err))
    }
    handleError(err) {
        if(!err.status)
            this.errorStr = 'Отсутствует подключение к сети Интернет';
        if(err.status == "404")
            this.errorStr = 'Запрашиваемая статья отсутствует';
        if(err.status == "403")
            this.errorStr = 'Данная статья недоступна для редактирования';
        if(err.status == "401") {
            this.errorStr = 'Авторизуйтесь пожалуйста заново';
            this.authService.deleteCredential();
        }
        if(err.status == "500")
            this.errorStr = 'На сервере возникли проблемы';
        this.displayError = true;
    }
}