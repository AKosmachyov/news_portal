import { Component, Input } from '@angular/core';
import { News } from '../models/news';

@Component({
    selector: 'preview-news',
    template: `
        <div class="preview-news" *ngIf="!!news">
            <span>{{news.publicationDate | date:"dd.MM.yy"}}</span>
            <span>{{news.modifiedDate | date:"dd.MM.yy"}}</span>
            <h1 class="title">
                <a [routerLink]="['/news', news.id]">{{news.title}}</a>
            </h1>
                <i class="glyphicon glyphicon-tags"></i><span>{{news.tag}}</span>
                <i class="glyphicon glyphicon-user"></i><span>{{news.author}}</span>
            <div>
                <span class="content">{{news.titleContent}}</span>                
                <a [routerLink]="['/news', news.id]">подробнее...</a>
            </div>
        </div>
    `,
    styles: [`
        .title {
            margin-top: 0;
            margin-bottom: 0;
        }
        .preview-news {
            margin-top: 16px;
        }
        a {
            cursor: pointer; 
        }
        i {
            margin-right: 8px;
        }
        .content {
            word-wrap: break-word;
        }
    `]
})

export class PreviewNewsComponent {
    @Input() news: News;
}