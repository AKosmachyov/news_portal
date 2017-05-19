import { Component, Input } from '@angular/core';
import { News } from '../models/news';

@Component({
    selector: 'preview-news',
    template: `
        <div class="preview-news well" *ngIf="!!news">
            <span *ngIf="!news.modifiedDate">{{news.publicationDate | date:"dd.MM.yy"}}</span>
            <span *ngIf="!!news.modifiedDate"><i class="glyphicon glyphicon-refresh"></i>{{news.modifiedDate | date:"dd.MM.yy"}}</span>
            <button type="button" (click)="news = null" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
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
        .well {
            background-color: white;
        }
        .title {
            margin-top: 0;
            margin-bottom: 0;
        }
        .preview-news {
            margin: 9px 0;
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