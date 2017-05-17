import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { News } from '../models/news';

import { NewsService } from '../services/news-service';

@Component({
    selector: 'editor-news',
    template: `
         <div>
            <label for="title">Заголовок</label>
            <input name="title" [(ngModel)]="news.title"/>
            <label for="tag">Тэг</label>
            <input name="tag" [(ngModel)]="news.tag"/>
            <label for="content">Текст</label>
            <textarea name="content" cols="30" rows="15" [(ngModel)]="news.content"></textarea>
            <button class="btn btn-primary" (click)="add()" *ngIf="isChange">Добавить</button>
            <button class="btn btn-primary" (click)="update()" *ngIf="!isChange">Изменить</button>
         </div>
    `,
    styles: [`
        div {
            display: flex;
            flex-direction: column;
        }
        textarea {
            resize: none;
            width: 100%;
            padding: 20px 20px 0px;
        }
        input {
            padding: 0 8px;
        }
    `]
})

export class EditorNewsComponent {
    news: News = new News();
    isChange: boolean = false;
    constructor (
        private newsService : NewsService,
        private route: ActivatedRoute,
        private location : Location
    ) {
        this.route.params
            .switchMap((params: Params) => {
                let id = +params['id'];
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
        this.news.publicationDate = new Date();
        this.news.author = 'Я';
        this.newsService.addNews(this.news).then(() => this.location.back());
    }
    update ():void {
        this.news.modifiedDate = new Date();
        this.newsService.update(this.news).then(() => this.location.back());
    }
}