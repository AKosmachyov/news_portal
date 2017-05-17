import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { News } from '../models/news';

@Injectable()
export class NewsService {
    private newsUrl = 'api/news';

    constructor( private http: Http ) { }

    getNewsArr(): Promise<News[]> {
        return this.http.get(this.newsUrl)
            .toPromise()
            .then(response => response.json().data as News[])
            .catch(this.handleError);
    }
    getNews(id: number): Promise<News> {
        const url = `${this.newsUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as News)
            .catch(this.handleError);
    }
    addNews(news: News): Promise<News> {
        return this.http
            .post(this.newsUrl, JSON.stringify(news))
            .toPromise()
            .then(res => res.json().data as News)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}