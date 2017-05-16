import { Component } from '@angular/core';
import { News } from '../models/news';

@Component({
    selector: 'news',
    template: `
        <div *ngIf="!!news">
            <span>{{news.publicationDate | date:"dd.MM.yy"}}</span>
            <span>{{news.modifiedDate | date:"dd.MM.yy"}}</span>
            <h1 class="title">
                <a>{{news.title}}</a>
            </h1>
                <i class="glyphicon glyphicon-tags"></i><span>{{news.tag}}</span>
                <i class="glyphicon glyphicon-user"></i><span>{{news.author}}</span>
            <div>
                <span>{{news.content}}</span>
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
    `]
})

export class NewsComponent {
    news: News;
}