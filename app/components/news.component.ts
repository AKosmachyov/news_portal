import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { NewsService } from '../services/news-service';
import { AuthService } from '../services/auth.service';

import { News } from '../models/news';

@Component({
    selector: 'news',
    template: `
        <div *ngIf="!!news">
            <span>{{news.publicationDate | date:"dd.MM.yy"}}</span>
            <span>{{news.modifiedDate | date:"dd.MM.yy"}}</span>
            <a *ngIf="displayEditButton" [routerLink]="['/editor', news.id]">
                <i class="glyphicon glyphicon-pencil"></i>
                Изменить
            </a>
            <h1 class="title">
                {{news.title}}
            </h1>
                <i class="glyphicon glyphicon-tags"></i><span>{{news.tag}}</span>
                <i class="glyphicon glyphicon-user"></i><span>{{news.author}}</span>
            <div>
                <span class="content" [innerHTML]="news.content"></span>
            </div>
        </div>
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
    `]
})

export class NewsComponent implements OnInit {
    news: News;
    displayEditButton: boolean = false;
    constructor(
        private newsService: NewsService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.newsService.getNews(+params['id']))
            .subscribe(news => {
                this.news = news;
                if(this.authService.currentUser && this.news.author == this.authService.currentUser.name)
                    this.displayEditButton = true;
            });
    }
}