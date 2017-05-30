import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { News } from '../models/news';

import { AuthService } from '../services/auth.service';
import { NewsService } from '../services/news-service';

@Component({
    selector: 'editor-news',
    template: `
         <form class="col-md-8 col-md-offset-2" #userForm="ngForm" *ngIf="!!news">
            <label for="title">Заголовок</label>
            <input name="title" class="form-control" [(ngModel)]="news.title" required
                   minlength="1" maxlength="100" autocomplete="off"/>
                   
            <label for="titleImg">Ссылка на титульное изображение</label>
            <input name="titleImg" class="form-control" [(ngModel)]="news.titleImg"/>
                   
            <label for="tag">Тэг</label>
            <input name="tag" class="form-control" [(ngModel)]="news.tag" required
                   minlength="1" maxlength="100" autocomplete="off"/>
            
            <label for="titleContent">Краткое описание</label>
            <textarea name="titleContent" cols="30" rows="4" class="form-control" [(ngModel)]="news.titleContent"
                      required minlength="1" maxlength="200" autocomplete="off"></textarea>
                      
            <label for="content">Текст</label>
            <content-editor name="content"></content-editor>
            
            <button class="btn btn-info center-block" (click)="submit()" [disabled]="!userForm.valid">{{buttonText}}</button>
         </form>
         <div *ngIf="displayError">
                <h1 class="err-block">{{errorStr}}</h1>
                <button class="btn btn-info center-block" [routerLink]="['/dashboard']">Возвращаемся</button>
         </div>     
    `,
    styles: [`
        div {
            display: flex;
            flex-direction: column;
        }
        textarea {
            resize: none;
            padding: 15px 15px 0;
        }
        input {
            padding: 0 15px;
        }
        label {
            margin: 11px 0;
        }
        content-editor + button {
            width: 70%;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .ng-touched.ng-invalid {
           border-color: #a94442;
        }
        .ng-touched.ng-valid {
            border-color: #3c763d;
        }
        button[disabled] {
            cursor: pointer;
        }
        .err-block {
            color: #5bc0de;
            text-align: center;
            margin-bottom: 20px;
        }
        .err-block + button {
            font-size: 16px;
        }
    `]
})

export class EditorNewsComponent {
    news: News;
    isChange: boolean = false;
    buttonText: string = 'Добавить';
    displayError: boolean = false;
    errorStr: string;
    constructor (
        private newsService : NewsService,
        private authService: AuthService,
        private activateRoute: ActivatedRoute,
        private location : Location
    ) {
        let id = activateRoute.snapshot.params['id'];
        if (id) {
            const _self = this;
            _self.isChange = true;
            _self.newsService.getNews(id).then((news) => {
                if(news.author._id != _self.authService.currentUser._id &&
                   _self.authService.currentUser.userType != "admin")
                    return Promise.reject({text: 'Different id', status: 403});
                if(news.archived)
                    return Promise.reject({text: 'News was archived', status: 403});
                _self.news = news;
            }).catch(this.handleError.bind(_self));
        } else {
            this.news = new News();
        }
    };

    add(): Promise<any> {
        return this.newsService.addNews(this.news)
            .then(() => this.location.back());
    }

    update(): Promise<any>  {
        return this.newsService.update(this.news)
            .then(() => this.location.back());
    }

    submit() {
        if(!this.isValidFields())
            return;
        let func = this.isChange ? this.update : this.add;
        func = func.bind(this);
        func().catch(this.handleError.bind(this));
    }

    isValidFields() {
        this.news.titleImg = this.news.titleImg ? this.news.titleImg.trim(): '';
        this.news.title = this.news.title ? this.news.title.trim() : '';
        this.news.titleContent = this.news.titleContent ? this.news.titleContent.trim() : '';
        this.news.content = this.news.content ? this.news.content.trim() : '';
        this.news.tag = this.news.tag ? this.news.tag.trim() : '';
        return this.news.title && this.news.titleContent && this.news.content && this.news.tag;
    }

    handleError(err) {
        if(!err.status)
            this.errorStr = 'Отсутствует подключение к сети Интернет';
        if(err.status == "404")
            this.errorStr = 'Запрашиваемая статья отсутствует';
        if(err.status == "403")
            this.errorStr = 'Данная статья недоступна для редактирования';
        if(err.status == "500")
            this.errorStr = 'На сервере возникли проблемы';
        this.displayError = true;
    }
}