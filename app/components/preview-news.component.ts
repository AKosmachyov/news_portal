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
                <a [routerLink]="['/news', news._id]">{{news.title}}</a>
            </h1>
                <i class="glyphicon glyphicon-tags"></i><span>{{news.tag}}</span>
                <i class="glyphicon glyphicon-user"></i><span>{{news.author.name}}</span>
            <div>
                <span class="content">{{news.titleContent}}</span>                
                <a [routerLink]="['/news', news._id]">подробнее...</a>
            </div>
        </div>
    `,
    styles: [`
        .well {
            background-color: white;
        }
        .close {
            visibility: collapse;
        }
        .well:hover .close {
            visibility: visible;
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
            text-decoration: none;
        }
        i {
            margin-right: 8px;
        }
        .content {
            word-wrap: break-word;
        }
        h1 {
            font-size: 29px;
        }
    `]
})

export class PreviewNewsComponent {
    @Input() news: News;
}