import { Component } from '@angular/core';

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
            <button class="btn btn-primary" (click)="add()">Добавить</button>
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
    constructor ( private newsService : NewsService ) {};
    add (): void {
        this.news.title = this.news.title.trim();
        this.news.tag = this.news.tag.trim();
        this.news.publicationDate = new Date();
        this.news.author = 'Я';
        this.newsService.addNews(this.news).then();
    }
}