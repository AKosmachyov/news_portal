import { Component, Input } from '@angular/core';
import { News } from '../models/news';

@Component({
    selector: 'preview-news',
    template: `
        <div class="preview-news" *ngIf="!!news">
            <button type="button" (click)="news = null" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            <div class="well" *ngIf="!!news">
                <img src ="https://www.w3schools.com/css/img_mountains.jpg"/>
                <h1 class="title">
                    <a [routerLink]="['/news', news._id]">{{news.title}}</a>
                    <span>
                        <i class="glyphicon glyphicon-tags"></i>
                        {{news.tag}}
                    </span>
                </h1>
                <div class="content">
                    <span>{{news.titleContent}}</span>
                    <a [routerLink]="['/news', news._id]">подробнее...</a>
                </div>
                <div class="news-bottom">
                     <span *ngIf="!news.modifiedDate">{{news.publicationDate | date:"dd.MM.yy"}}</span>
                     <span *ngIf="!!news.modifiedDate">
                        <i class="glyphicon glyphicon-refresh"></i>{{news.modifiedDate | date:"dd.MM.yy"}}
                    </span>
                    <i *ngIf="news.archived" class="glyphicon glyphicon-piggy-bank"></i>
                    <div class="author">
                        <i class="glyphicon glyphicon-user"></i>
                        <span>{{news.author.name}}</span>
                    </div>
                </div>      
            </div>
        </div>
    `,
    styles: [`
        .well {
            background-color: white;
        }
        .preview-news:hover {
            box-shadow: 0 1px 3px 0 #bcbdbd, 0 0 0 1px #d4d4d5;
            border-radius: 4px;
        }
        .preview-news {
            margin: 9px 0;
        }
        img {
            padding: 0;
            max-height: 400px;
            border-radius: 4px;
            width: 100%;
        }
        .news-bottom {
            border-top: 1px solid rgba(34,36,38,.1);
            margin-top: 7px;
            padding-top: 15px;
        }
        .author {
            float: right;
        }        
        .close {
            visibility: collapse;
            padding-right: 8px;
            padding-top: 5px;
        }
        .preview-news:hover .close {
            visibility: visible;
        }
        .title {
            margin-top: 7px;
            margin-bottom: 0;
            text-align: justify;
        }        
        a {
            cursor: pointer;
            text-decoration: none;
        }
        i {
            margin-right: 8px;
        }
        .content {
            font-size: 16px;
            word-wrap: break-word;
            text-align: justify;
        }
        h1 {
            font-size: 29px;
            word-wrap: break-word;
        }
        h1 > span {
            font-size: 14px;
            word-wrap: break-word;
            white-space: nowrap;
        }
    `]
})

export class PreviewNewsComponent {
    @Input() news: News;
}