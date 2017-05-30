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
        let _self = this;
        _self.isDownload = true;
        _self.route.params
            .switchMap((params: Params) => _self.newsService.getNews(params['id']))
            .subscribe(news => {
                _self.isDownload = false;
                _self.news = news;
                if(_self.authService.currentUser && (news.author._id == _self.authService.currentUser._id ||
                    _self.authService.currentUser.userType == "admin" )&& !news.archived)
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
        if(err.status == "500")
            this.errorStr = 'На сервере возникли проблемы';
        this.displayError = true;
    }
}