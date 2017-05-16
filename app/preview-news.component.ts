import { Component, Input } from '@angular/core';
import { News } from './models/news';

@Component({
    selector: 'preview-news',
    template: `
        <div class="preview-news" *ngIf="!!news">
            <span>{{news.publicationDate}}</span>
            <h1 class="title" (click)="isCollapsedContent = !isCollapsedContent">
                <a>{{news.title}}</a>
            </h1>
            <span>{{news.tag}}</span><span>{{news.author}}</span>
            <div>
                <span *ngIf="!isCollapsedContent">{{news.content.slice(0,news.content.indexOf('.')+1)}}</span>                
                <a (click)="isCollapsedContent = !isCollapsedContent">подробнее...</a>
                <div [collapse]="isCollapsedContent">
                    <div class="well well-lg">
                        {{news.content}}                
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .title {
            margin-top: 0;
            margin-bottom: 0;
        }
        .preview-news {
            margin-bottom: 30px;
        }
        a {
            cursor: pointer; 
        }
    `]
})

export class PreviewNewsComponent {
    @Input() news: News;
    isCollapsedContent:boolean = false;
}