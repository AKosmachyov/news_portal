import { Component, Input } from '@angular/core';
import { News } from './models/news'

@Component({
    selector: 'preview-news',
    template: `
        <div class="preview-news" *ngIf="!!news">
            <span>{{news.publicationDate}}</span>
            <h1 class="title">
                <a>{{news.title}}</a>
            </h1>
            <span>{{news.tag}}</span><span>{{news.author}}</span>
            <div> 
                {{news.content.slice(0,10)}}
                <a>подробнее...</a>
            </div>
        </div>
    `,
    styles: [`
        .title {
            margin-top: 0px;
            margin-bottom: 0px;
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
}

