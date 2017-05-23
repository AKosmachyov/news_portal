import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { News } from '../models/news';

import { AuthService } from '../services/auth.service';
import { NewsService } from '../services/news-service';

@Component({
    selector: 'editor-news',
    template: `
         <div class="col-md-8 col-md-offset-2">
            <label for="title">Заголовок</label>
            <input name="title" class="form-control" [(ngModel)]="news.title"/>
            <label for="tag">Тэг</label>
            <input name="tag" class="form-control" [(ngModel)]="news.tag"/>
            <label for="titleContent">Краткое описание</label>
            <textarea name="titleContent" cols="30" rows="4" class="form-control" [(ngModel)]="news.titleContent"></textarea>
            <label for="content">Текст</label>
            <textarea name="content" cols="30" rows="15" class="form-control" [(ngModel)]="news.content"></textarea>
            <button class="btn btn-info" (click)="add()" *ngIf="isChange">Добавить</button>
            <button class="btn btn-info" (click)="update()" *ngIf="!isChange">Изменить</button>
         </div>
    `,
    styles: [`
        div {
            display: flex;
            flex-direction: column;
        }
        textarea {
            resize: none;
            padding: 15px 15px 0px;
        }
        input {
            padding: 0 8px;
        }
        label {
            margin: 11px 0;
        }
        textarea[name="content"] {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
        button {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
    `]
})

export class EditorNewsComponent {
    news: News = new News();
    isChange: boolean = false;
    constructor (
        private newsService : NewsService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private location : Location
    ) {
        this.route.params
            .switchMap((params: Params) => {
                let id = params['id'];
                if (id) {
                    return this.newsService.getNews(id);
                } else {
                    this.isChange = true;
                    return Promise.resolve(new News());
                }
            })
            .subscribe(news => this.news = news);
    };
    add (): void {
        this.news.title = this.news.title.trim();
        this.news.tag = this.news.tag.trim();
        this.news.author = this.authService.currentUser;
        this.newsService.addNews(this.news)
            .then(() => this.location.back());
    }
    update ():void {
        this.newsService.update(this.news)
            .then(() => this.location.back());
    }
}